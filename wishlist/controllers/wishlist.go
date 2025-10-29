package controllers

import (
	"context"
	"encoding/json"
	"net/http"
	"time"

	"github.com/shivakumar2006/online-bookstore/wishlist/models"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

var WishlistCollection *mongo.Collection

func AddToWishlist(w http.ResponseWriter, r *http.Request) {
	var item models.WishlistItem
	if err := json.NewDecoder(r.Body).Decode(&item); err != nil {
		http.Error(w, "Invalid input", http.StatusBadRequest)
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// check if the item is already exist for the user
	count, _ := WishlistCollection.CountDocuments(ctx, bson.M{
		"userId": item.UserID,
		"bookId": item.BookID,
	})

	if count > 0 {
		http.Error(w, "Book already in wishlist", http.StatusBadRequest)
		return
	}

	item.CreatedAt = time.Now().Unix()
	res, err := WishlistCollection.InsertOne(ctx, item)
	if err != nil {
		http.Error(w, "Failed to add to wishlist", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(map[string]interface{}{
		"message": "book added to wishlist",
		"id":      res.InsertedID,
	})
}

func GetWishlist(w http.ResponseWriter, r *http.Request) {
	userIDStr := r.URL.Query().Get("userid")
	if userIDStr == "" {
		http.Error(w, "userid required", http.StatusBadRequest)
		return
	}

	userID, err := primitive.ObjectIDFromHex(userIDStr)
	if err != nil {
		http.Error(w, "invalid userId", http.StatusBadRequest)
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	cursor, err := WishlistCollection.Find(ctx, bson.M{"userId": userID})
	if err != nil {
		http.Error(w, "database error", http.StatusInternalServerError)
		return
	}
	defer cursor.Close(ctx)

	var wishlist []models.WishlistItem
	if err := cursor.All(ctx, &wishlist); err != nil {
		http.Error(w, "Failed to read wishlist", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(wishlist)
}

func RemoveFromWishlist(w http.ResponseWriter, r *http.Request) {
	var req struct {
		UserID string `json:"userId"`
		BookID string `json:"bookId"`
	}

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid input", http.StatusBadRequest)
		return
	}

	userID, err := primitive.ObjectIDFromHex(req.UserID)
	bookID, err2 := primitive.ObjectIDFromHex(req.BookID)
	if err != nil || err2 != nil {
		http.Error(w, "Invalid id's", http.StatusBadRequest)
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	_, err = WishlistCollection.DeleteOne(ctx, bson.M{"userId": userID, "bookId": bookID})
	if err != nil {
		http.Error(w, "Failed to remove form wishlist", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(map[string]string{"message": "book removed from wishlist"})
}
