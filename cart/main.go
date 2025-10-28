package main

import (
	"context"
	"log"
	"net/http"
	"os"

	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
	"github.com/rs/cors"
	"github.com/shivakumar2006/online-bookstore/cart/controllers"
	"github.com/shivakumar2006/online-bookstore/cart/routes"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func main() {
	godotenv.Load()

	client, err := mongo.Connect(context.TODO(), options.Client().ApplyURI("mongodb://localhost:27017"))
	if err != nil {
		log.Fatal(err)
	}

	cartCollection := client.Database("bookstore").Collection("cart")

	BookServiceURL := os.Getenv("BOOK_SERVICE_URL")
	port := os.Getenv("PORT")
	if port == "" {
		port = "8082"
	}

	cc := &controllers.CartController{
		CartCollection: cartCollection,
		BookServiceURL: BookServiceURL,
	}

	r := mux.NewRouter()
	routes.CartRoutes(r, cc)

	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:5173"},
		AllowedMethods:   []string{"GET", "POST", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Authorization", "Content-Type"},
		AllowCredentials: true,
	})

	log.Printf("🚀 Cart Service running on :%s", port)
	http.ListenAndServe(":"+port, c.Handler(r))
}
