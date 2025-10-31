package controllers

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"strings"
	"time"

	"github.com/golang-jwt/jwt/v4"
	"github.com/shivakumar2006/online-bookstore/wishlist/models"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

type WishlistController struct {
	WishlistCollection *mongo.Collection
	JwtKey             []byte
	BookServiceURL     string
}

func (wc *WishlistController) VerifyToken(r *http.Request) (string, error) {
	authHeader := r.Header.Get("Authorization")
	if authHeader == "" {
		return "", fmt.Errorf("missing authorization error")
	}

	tokenString := strings.TrimPrefix(authHeader, "Bearer ")
	claims := jwt.MapClaims{}
	token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
		return wc.JwtKey, nil
	})
	if err != nil || !token.Valid {
		return "", fmt.Errorf("invalid token %v", err)
	}

	userID, ok := claims["userId"].(string)
	if !ok {
		return "", fmt.Errorf("userId missing or invalid type")
	}

	return userID, nil
}

func (wc *WishlistController) AddToWishlist(w http.ResponseWriter, r *http.Request) {
	userID, err := wc.VerifyToken(r)
	if err != nil {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	var item models.WishlistItem
	if err := json.NewDecoder(r.Body).Decode(&item); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	item.UserID = userID

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	filter := bson.M{"userId": userID, "bookId": item.BookID}
	count, err := wc.WishlistCollection.CountDocuments(ctx, filter)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	if count > 0 {
		http.Error(w, "book already in wishlist", http.StatusConflict)
		return
	}

	_, err = wc.WishlistCollection.InsertOne(ctx, item)
	if err != nil {
		http.Error(w, "Failed to add to wishlist", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(map[string]string{"message": "book added to wishlist"})
}

func (wc *WishlistController) RemoveFromCart(w http.ResponseWriter, r *http.Request) {
	userID, err := wc.VerifyToken(r)
	if err != nil {
		http.Error(w, err.Error(), http.StatusUnauthorized)
		return
	}

	var item models.WishlistItem
	if err := json.NewDecoder(r.Body).Decode(&item); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	filter := bson.M{"userId": userID, "bookId": item.BookID}
	_, err = wc.WishlistCollection.DeleteOne(ctx, filter)
	if err != nil {
		http.Error(w, "Failed to remove form wishlist", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(map[string]string{"message": "book removed from wishlist"})
}

func (wc *WishlistController) GetWishList(w http.ResponseWriter, r *http.Request) {
	userID, err := wc.VerifyToken(r)
	if err != nil {
		http.Error(w, err.Error(), http.StatusUnauthorized)
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	cursor, err := wc.WishlistCollection.Find(ctx, bson.M{"userId": userID})
	if err != nil {
		http.Error(w, "failed to fetch wishlist", http.StatusInternalServerError)
		return
	}
	defer cursor.Close(ctx)

	var wishlist []models.WishlistItem
	if err := cursor.All(ctx, &wishlist); err != nil {
		http.Error(w, "Error reading wishlist data", http.StatusInternalServerError)
		return
	}

	var books []models.Book
	for _, item := range wishlist {
		bookResp, err := http.Get(fmt.Sprintf("%s/books/%s", wc.BookServiceURL, item.BookID))
		if err != nil || bookResp.StatusCode != http.StatusOK {
			continue
		}
		var book models.Book
		if err := json.NewDecoder(bookResp.Body).Decode(&book); err == nil {
			books = append(books, book)
		}
		bookResp.Body.Close()

	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(books)
}
