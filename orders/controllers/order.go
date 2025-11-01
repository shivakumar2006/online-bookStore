package controllers

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"strings"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/shivakumar2006/online-bookstore/orders/models"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type OrderController struct {
	OrderCollection *mongo.Collection
	JwtKey          []byte
	BookServiceURL  string
}

func (oc *OrderController) VerifyToken(r *http.Request) (string, error) {
	authHeader := r.Header.Get("Authorization")
	if authHeader == "" {
		return "", fmt.Errorf("missing authorization error")
	}

	tokenString := strings.TrimPrefix(authHeader, "Bearer ")
	claims := jwt.MapClaims{}
	token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
		return oc.JwtKey, nil
	})
	if err != nil || !token.Valid {
		return "", fmt.Errorf("Invalid token %v", err)
	}

	userID, ok := claims["userId"].(string)
	if !ok {
		return "", fmt.Errorf("userid is missing or invalid type")
	}

	return userID, nil
}

func (oc *OrderController) PlaceOrder(w http.ResponseWriter, r *http.Request) {
	userID, err := oc.VerifyToken(r)
	if err != nil {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	var req struct {
		Items []struct {
			BookID   string `json:"bookId"`
			Quantity int    `json:"quantity"`
		} `json:"items"`
		PaymentMethod string `json:"paymentMethod,omitempty"`
	}

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	if len(req.Items) == 0 {
		http.Error(w, "no items provided", http.StatusBadRequest)
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var orderItems []models.OrderItem
	var total float64

	for _, it := range req.Items {
		// fetch book
		bookResp, err := http.Get(fmt.Sprintf("%s/books/%s", oc.BookServiceURL, it.BookID))
		if err != nil {
			http.Error(w, "failed to fetched books details", http.StatusBadGateway)
			return
		}
		if bookResp.StatusCode != http.StatusOK {
			bookResp.Body.Close()
			http.Error(w, "book not found in book service", http.StatusBadRequest)
			return
		}

		var book struct {
			ID         string  `json:"id"`
			Title      string  `json:"title"`
			Author     string  `json:"author"`
			Price      float64 `json:"price"`
			CoverImage string  `json:"coverImage"`
		}
		if err := json.NewDecoder(bookResp.Body).Decode(&book); err != nil {
			bookResp.Body.Close()
			http.Error(w, "invalid book payload from bookservice", http.StatusBadGateway)
			return
		}
		bookResp.Body.Close()

		qty := it.Quantity
		if qty <= 0 {
			qty = 1
		}
		itemTotal := book.Price * float64(qty)
		total += itemTotal

		orderItems = append(orderItems, models.OrderItem{
			BookID:     it.BookID,
			Title:      book.Title,
			Author:     book.Author,
			Price:      book.Price,
			CoverImage: book.CoverImage,
			Quantity:   qty,
			ItemTotal:  itemTotal,
		})
	}

	order := models.Order{
		UserID:        userID,
		Items:         orderItems,
		Total:         total,
		Status:        "Pending",
		PaymentMethod: req.PaymentMethod,
		CreatedAt:     time.Now(),
	}

	res, err := oc.OrderCollection.InsertOne(ctx, order)
	if err != nil {
		http.Error(w, "Failed to create orders", http.StatusInternalServerError)
		return
	}

	oid := res.InsertedID.(primitive.ObjectID)
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"message": "order placed successfully",
		"orderId": oid.Hex(),
	})
}

func (oc *OrderController) GetOrders(w http.ResponseWriter, r *http.Request) {
	userID, err := oc.VerifyToken(r)
	if err != nil {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	cursor, err := oc.OrderCollection.Find(ctx, bson.M{"userId": userID})
	if err != nil {
		http.Error(w, "Failed to fetch orders", http.StatusInternalServerError)
		return
	}
	defer cursor.Close(ctx)

	var orders []models.Order
	if err := cursor.All(ctx, &orders); err != nil {
		http.Error(w, "failed to decode orders", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(orders)
}

func (oc *OrderController) CancelOrder(w http.ResponseWriter, r *http.Request) {
	userID, err := oc.VerifyToken(r)
	if err != nil {
		http.Error(w, err.Error(), http.StatusUnauthorized)
		return
	}

	var body struct {
		OrderID string `json:"orderId"`
	}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	objID, err := primitive.ObjectIDFromHex(body.OrderID)
	if err != nil {
		http.Error(w, "invalid order id", http.StatusBadRequest)
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	filter := bson.M{"_id": objID, "userId": userID}
	update := bson.M{"$set": bson.M{"status": "cancelled"}}
	res, err := oc.OrderCollection.UpdateOne(ctx, filter, update)
	if err != nil {
		http.Error(w, "failed to cancel order", http.StatusInternalServerError)
		return
	}

	if res.MatchedCount == 0 {
		http.Error(w, "order not found or not owned by user", http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"message": "order cancelled"})
}
