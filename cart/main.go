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

	"github.com/shivakumar2006/online-bookstore/cart/controllers"
	"github.com/shivakumar2006/online-bookstore/cart/routes"
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

	cartCollection := client.Database("bookstore").Collection("cart")

	cc := &controllers.CartController{
		CartCollection: cartCollection,
		JwtKey:         []byte(os.Getenv("JWT_SECRET")),
		BookServiceURL: "http://localhost:8080",
	}

	router := mux.NewRouter()
	routes.CartRoutes(router, cc)

	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:5173"},
		AllowedMethods:   []string{"GET", "POST", "DELETE"},
		AllowedHeaders:   []string{"Authorization", "Content-Type"},
		AllowCredentials: true,
	})

	handler := c.Handler(router)

	log.Println("🚀 Cart service running on : 8082")
	http.ListenAndServe(":8082", handler)
}
