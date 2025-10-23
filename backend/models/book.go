package models

import "go.mongodb.org/mongo-driver/bson/primitive"

type Book struct {
	ID          primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	Title       string             `bson:"title" json:"title"`
	Author      string             `bson:"author" json:"author"`
	Price       float64            `bson:"price" json:"price"`
	Stock       int                `bson:"stock" json:"stock"`
	Category    string             `bson:"category" json:"category"`
	Language    string             `bson:"language" json:"language"`
	Description string             `bson:"description" json:"description"`
	CoverImage  string             `bson:"coverImage" json:"coverImage"`
}
