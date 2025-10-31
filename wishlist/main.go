package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
	"github.com/rs/cors"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"

	"github.com/shivakumar2006/online-bookstore/wishlist/controllers"
	"github.com/shivakumar2006/online-bookstore/wishlist/routes"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env")
	}

	clientOptions := options.Client().ApplyURI("mongodb://localhost:27017")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	client, err := mongo.Connect(ctx, clientOptions)
	if err != nil {
		log.Fatal(err)
	}

	wishlistCollection := client.Database("bookstore").Collection("wishlist")

	wc := &controllers.WishlistController{
		WishlistCollection: wishlistCollection,
		JwtKey:             []byte(os.Getenv("JWT_SECRET")),
		BookServiceURL:     "http://localhost:8080",
	}

	router := mux.NewRouter()
	routes.WishlistRoutes(router, wc)

	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:5173"},
		AllowedMethods:   []string{"GET", "POST", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Authorization", "Content-Type"},
		AllowCredentials: true,
	})

	handler := c.Handler(router)

	log.Println("🚀 Wishlist service running on : 8083")
	http.ListenAndServe(":8083", handler)
}
