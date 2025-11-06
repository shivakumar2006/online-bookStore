package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/gorilla/mux"
	"github.com/rs/cors"
	"github.com/shivakumar2006/online-bookstore/cart/controllers"
	"github.com/shivakumar2006/online-bookstore/cart/routes"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func main() {
	// err := godotenv.Load()
	// if err != nil {
	// 	log.Fatal("Error loading .env")
	// }s

	username := os.Getenv("MONGO_INITDB_ROOT_USERNAME")
	password := os.Getenv("MONGO_INITDB_ROOT_PASSWORD")

	if username == "" || password == "" {
		log.Fatal("❌ Mongo credentials not found in environment variables")
	}

	// 🧠 Connect using env-based credentials
	uri := fmt.Sprintf("mongodb://%s:%s@mongodb-service:27017", username, password)
	clientOptions := options.Client().ApplyURI(uri)
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
		AllowedOrigins:   []string{"http://bookstore.local"},
		AllowedMethods:   []string{"GET", "POST", "DELETE", "PATCH", "OPTIONS"},
		AllowedHeaders:   []string{"Authorization", "Content-Type"},
		AllowCredentials: true,
	})

	handler := c.Handler(router)

	log.Println("🚀 Cart service running on : 8082")
	http.ListenAndServe(":8082", handler)
}
