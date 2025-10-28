package controllers

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"github.com/shivakumar2006/online-bookstore/cart/models"
	"github.com/shivakumar2006/online-bookstore/cart/utils"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type CartController struct {
	CartCollection *mongo.Collection
	BookServiceURL string
}

type Book struct {
	ID          string  `json:"id"`
	Title       string  `json:"title"`
	Author      string  `json:"author"`
	Price       float64 `json:"price"`
	CoverImage  string  `json:"coverImage"`
	Description string  `json:"description"`
}

func (cc *CartController) AddToCart(w http.ResponseWriter, r *http.Request) {
	userId, err := utils.ExtractUserIDFromJWT(r)
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

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	// check if book is already in cart
	filter := bson.M{"user_id": userId, "book_id": payload.BookID}
	update := bson.M{"$inc": bson.M{"quantity": payload.Quantity}}
	opts := options.Update().SetUpsert(true)

	_, err = cc.CartCollection.UpdateOne(ctx, filter, update, opts)
	if err != nil {
		http.Error(w, "Failed to add to cart", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"message": "book added to cart"})
}

func (cc *CartController) GetUserCart(w http.ResponseWriter, r *http.Request) {
	userId, err := utils.ExtractUserIDFromJWT(r)
	if err != nil {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	cursor, err := cc.CartCollection.Find(ctx, bson.M{"user_id": userId})
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	var cartItems []models.CartItem
	if err = cursor.All(ctx, &cartItems); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// type Book struct {
	// 	ID          string  `json:"id"`
	// 	Title       string  `json:"title"`
	// 	Author      string  `json:"author"`
	// 	Price       float64 `json:"price"`
	// 	CoverImage  string  `json:"coverImage"`
	// 	Description string  `json:"description"`
	// }

	type FullCartItem struct {
		ID       primitive.ObjectID `json:"id"`
		BookID   string             `jssn:"bookId"`
		Quantity int                `json:"quantity"`
		Book     Book               `json:"book"`
	}

	var fullCart []FullCartItem

	for _, item := range cartItems {
		book, err := fetchBookFromService(cc.BookServiceURL, item.BookID)
		if err != nil {
			fmt.Println("Error fetching books", err)
			continue
		}
		fullCart = append(fullCart, FullCartItem{
			ID:       item.ID,
			BookID:   item.BookID,
			Quantity: item.Quantity,
			Book:     book,
		})
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(fullCart)
}

func (cc *CartController) RemoveFromCart(w http.ResponseWriter, r *http.Request) {
	userId, err := utils.ExtractUserIDFromJWT(r)
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

	_, err = cc.CartCollection.DeleteOne(ctx, bson.M{"user_id": userId, "book_id": bookId})
	if err != nil {
		http.Error(w, "Failed to remove book", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"message": "book removed from cart"})
}

func fetchBookFromService(baseURL, bookID string) (Book, error) {
	resp, err := http.Get(fmt.Sprintf("%s/books/%s", baseURL, bookID))
	if err != nil {
		return Book{}, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return Book{}, fmt.Errorf("book service returned %d", resp.StatusCode)
	}

	var book Book
	if err := json.NewDecoder(resp.Body).Decode(&book); err != nil {
		return Book{}, err
	}

	return book, nil
}
