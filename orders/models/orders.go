package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type OrderItem struct {
	BookID     string  `bson:"bookId" json:"bookId"`
	Title      string  `bson:"title" json:"title"`
	Author     string  `bson:"author" json:"author"`
	Price      float64 `bson:"price" jsn:"price"`
	CoverImage string  `bson:"coverImage" json:"coverImage"`
	Quantity   int     `bson:"quantity" json:"quantity"`
	ItemTotal  float64 `bson:"itemTotal" json:"itemTotal"`
}

type Order struct {
	ID            primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	UserID        string             `bson:"userId" json:"userId"`
	Items         []OrderItem        `bson:"items" json:"items"`
	Total         float64            `bson:"total" json:"total"`
	Status        string             `bson:"status" json:"status"`
	PaymentMethod string             `bson:"paymentMethod,omitempty" json:"paymentMethod,omitempty"`
	CreatedAt     time.Time          `bson:"createdAt" json:"createdAt"`
}
