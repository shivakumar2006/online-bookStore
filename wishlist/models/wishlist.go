package models

type WishlistItem struct {
	UserID string `bson:"userId" json:"userId"`
	BookID string `bson:"bookId" json:"bookId"`
}

type Book struct {
	ID         string  `json:"id"`
	Author     string  `json:"author"`
	Title      string  `json:"title"`
	Price      float64 `json:"price"`
	CoverImage string  `json:"coverImage"`
}
