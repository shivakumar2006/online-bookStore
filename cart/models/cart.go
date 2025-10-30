package models

import "go.mongodb.org/mongo-driver/bson/primitive"

type CartItem struct {
	ID       primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	UserID   string             `bson:"userId" json:"userId"`
	BookID   string             `bson:"bookId" json:"bookId"`
	Quantity int                `bson:"quantity" json:"quantity"`
}
