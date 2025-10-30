package controllers

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"strings"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/shivakumar2006/online-bookstore/cart/models"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type CartController struct {
	CartCollection *mongo.Collection
	JwtKey         []byte
	BookServiceURL string
}

func (cc *CartController) VerifyToken(r *http.Request) (string, error) {
	authHeader := r.Header.Get("Authorization")
	if authHeader == "" {
		return "", fmt.Errorf("missing authorization header")
	}

	tokenString := strings.TrimPrefix(authHeader, "Bearer ")
	claims := jwt.MapClaims{}
	token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
		return cc.JwtKey, nil
	})
	if err != nil || !token.Valid {
		return "", fmt.Errorf("invalid token: %v", err)
	}

	userID, ok := claims["userId"].(string)
	if !ok {
		return "", fmt.Errorf("userId missing or invalid type")
	}

	return userID, nil
}

func (cc *CartController) AddToCart(w http.ResponseWriter, r *http.Request) {
	userId, err := cc.VerifyToken(r)
	if err != nil {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	var payload struct {
		BookID   string `json:"bookId"`
		Quantity int    `json:"quantity"`
	}

	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	if payload.Quantity <= 0 {
		payload.Quantity = 1
	}

	bookObjID, err := primitive.ObjectIDFromHex(payload.BookID)
	if err != nil {
		http.Error(w, "Invalid book ID", http.StatusBadRequest)
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	filter := bson.M{"userId": userId, "bookId": bookObjID}
	update := bson.M{"$inc": bson.M{"quantity": payload.Quantity}}
	opts := options.Update().SetUpsert(true)

	_, err = cc.CartCollection.UpdateOne(ctx, filter, update, opts)
	if err != nil {
		http.Error(w, "Failed to add to cart", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"message": "Book added to cart successfully"})
}

func (cc *CartController) GetUserCart(w http.ResponseWriter, r *http.Request) {
	userId, err := cc.VerifyToken(r)
	if err != nil {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	cursor, err := cc.CartCollection.Find(ctx, bson.M{"userId": userId})
	if err != nil {
		http.Error(w, "Error fetching cart", http.StatusInternalServerError)
		return
	}
	defer cursor.Close(ctx)

	var cartItems []models.CartItem
	if err := cursor.All(ctx, &cartItems); err != nil {
		http.Error(w, "Error decoding cart", http.StatusInternalServerError)
		return
	}

	type Book struct {
		ID         string  `json:"id"`
		Title      string  `json:"title"`
		Author     string  `json:"author"`
		Price      float64 `json:"price"`
		CoverImage string  `json:"coverImage"`
	}

	type DetailedCartItem struct {
		models.CartItem
		Book Book `json:"book"`
	}

	var detailedCart []DetailedCartItem

	for _, item := range cartItems {
		resp, err := http.Get(fmt.Sprintf("%s/books/%s", cc.BookServiceURL, item.BookID))
		if err != nil {
			continue
		}
		defer resp.Body.Close()

		var book Book

		if err := json.NewDecoder(resp.Body).Decode(&book); err != nil {
			continue
		}

		detailedCart = append(detailedCart, DetailedCartItem{
			CartItem: item,
			Book:     book,
		})
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"items": detailedCart,
	})
}

func (cc *CartController) RemoveFromCart(w http.ResponseWriter, r *http.Request) {
	userId, err := cc.VerifyToken(r)
	if err != nil {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	bookId := r.URL.Query().Get("bookId")
	if bookId == "" {
		http.Error(w, "Missing bookId", http.StatusBadRequest)
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	bookObjID, err := primitive.ObjectIDFromHex(bookId)
	if err != nil {
		http.Error(w, "Invalid book ID", http.StatusBadRequest)
		return
	}

	_, err = cc.CartCollection.DeleteOne(ctx, bson.M{"userId": userId, "bookId": bookObjID})
	if err != nil {
		http.Error(w, "Failed to remove from cart", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"message": "Book removed from cart"})
}
