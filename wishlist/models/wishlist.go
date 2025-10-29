package models

import "go.mongodb.org/mongo-driver/bson/primitive"

type WishlistItem struct {
	ID        primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	UserID    primitive.ObjectID `bson:"userId" json:"userId"`
	BookID    primitive.ObjectID `bson:"bookId" json:"bookId"`
	Title     string             `bson:"title" json:"title"`
	Author    string             `bson:"author" json:"author"`
	Image     string             `bson:"image" json:"image"`
	Price     float64            `bson:"price" json:"price"`
	CreatedAt int64              `bson:"createdAt" json:"createdAt"`
}
