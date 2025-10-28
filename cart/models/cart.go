package models

import "go.mongodb.org/mongo-driver/bson/primitive"

type CartItems struct {
	BookID   primitive.ObjectID `bson:"book_id" json:"book_id"`
	Quantity int                `bson:"quantity" json:"quantity"`
}

type Cart struct {
	ID     primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	UserID primitive.ObjectID `bson:"user_id" json:"user_id"`
	Items  []CartItems        `bson:"items" json:"items"`
}
