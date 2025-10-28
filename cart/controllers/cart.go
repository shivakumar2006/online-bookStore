package controllers

import (
	"context"
	"encoding/json"
	"net/http"
	"time"

	"github.com/shivakumar2006/online-bookstore/cart/models"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

var CartCollection *mongo.Collection

func InitCartCollection(c *mongo.Client) {
	CartCollection = c.Database("bookstore").Collection("carts")
}

func GetCart(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	userID := r.URL.Query().Get("user_id") // can also come from jwt also
	if userID == "" {
		http.Error(w, "user id required", http.StatusBadRequest)
		return
	}

	objID, err := primitive.ObjectIDFromHex(userID)
	if err != nil {
		http.Error(w, "invalid user ID", http.StatusBadRequest)
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var cart models.Cart
	err = CartCollection.FindOne(ctx, bson.M{"user_id": objID}).Decode(&cart)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			json.NewEncoder(w).Encode(models.Cart{UserID: objID, Items: []models.CartItems{}})
			return
		}
		http.Error(w, "Error fetching cart", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(cart)
}

func AddToCart(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	var req struct {
		UserID   string `json:"user_id"`
		BookID   string `json:"book_id"`
		Quantity int    `json:"quantity"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid input", http.StatusBadRequest)
		return
	}

	userObjID, _ := primitive.ObjectIDFromHex(req.UserID)
	bookObjID, _ := primitive.ObjectIDFromHex(req.BookID)

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var cart models.Cart
	err := CartCollection.FindOne(ctx, bson.M{"user_id": userObjID}).Decode(&cart)

	if err == mongo.ErrNoDocuments {
		newCart := models.Cart{
			ID:     primitive.NewObjectID(),
			UserID: userObjID,
			Items:  []models.CartItems{{BookID: bookObjID, Quantity: req.Quantity}},
		}
		_, err := CartCollection.InsertOne(ctx, newCart)
		if err != nil {
			http.Error(w, "failed to create cart", http.StatusInternalServerError)
			return
		}
		json.NewEncoder(w).Encode(newCart)
		return
	}

	// if exists, update
	updated := false
	for i, item := range cart.Items {
		if item.BookID == bookObjID {
			cart.Items[i].Quantity += req.Quantity
			updated = true
			break
		}
	}
	if !updated {
		cart.Items = append(cart.Items, models.CartItems{BookID: bookObjID, Quantity: req.Quantity})
	}

	_, err = CartCollection.UpdateOne(ctx, bson.M{"user_id": userObjID}, bson.M{"$set": bson.M{"items": cart.Items}})
	if err != nil {
		http.Error(w, "failed to update cart", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(cart)
}

func RemoveFromCart(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	var req struct {
		UserID string `json:"user_id"`
		BookID string `json:"book_id"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid input", http.StatusBadRequest)
		return
	}

	userObjID, _ := primitive.ObjectIDFromHex(req.UserID)
	bookObjID, _ := primitive.ObjectIDFromHex(req.BookID)

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var cart models.Cart
	err := CartCollection.FindOne(ctx, bson.M{"user_id": userObjID}).Decode(&cart)
	if err != nil {
		http.Error(w, "cart not foound", http.StatusNotFound)
		return
	}

	newItems := []models.CartItems{}
	for _, item := range cart.Items {
		if item.BookID != bookObjID {
			newItems = append(newItems, item)
		}
	}

	cart.Items = newItems
	_, err = CartCollection.UpdateOne(ctx, bson.M{"user_id": userObjID}, bson.M{"$set": bson.M{"items": cart.Items}})
	if err != nil {
		http.Error(w, "Failed to remove ites", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(cart)
}

func UpdateCartItem(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	var req struct {
		UserID   string `json:"user_id"`
		BookID   string `json:"book_id"`
		Quantity int    `json:"quantity"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid input", http.StatusBadRequest)
		return
	}

	userObjID, _ := primitive.ObjectIDFromHex(req.UserID)
	bookObjID, _ := primitive.ObjectIDFromHex(req.BookID)

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var cart models.Cart
	err := CartCollection.FindOne(ctx, bson.M{"user_id": userObjID}).Decode(&cart)
	if err != nil {
		http.Error(w, "Cart not found", http.StatusInternalServerError)
		return
	}

	for i, item := range cart.Items {
		if item.BookID == bookObjID {
			cart.Items[i].Quantity = req.Quantity
			break
		}
	}

	_, err = CartCollection.UpdateOne(ctx, bson.M{"user_id": userObjID}, bson.M{"$set": bson.M{"items": cart.Items}})
	if err != nil {
		http.Error(w, "Failed to update item", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(cart)
}
