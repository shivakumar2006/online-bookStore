package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"

	"github.com/rs/cors"

	"github.com/shivakumar2006/online-bookstore/auth/controllers"
	"github.com/shivakumar2006/online-bookstore/auth/routes"
)

func main() {
	// load.env
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	// username := os.Getenv("MONGO_INITDB_ROOT_USERNAME")
	// password := os.Getenv("MONGO_INITDB_ROOT_PASSWORD")

	// if username == "" || password == "" {
	// 	log.Fatal("❌ Mongo credentials not found in environment variables")
	// }

	// 🧠 Connect using env-based credentials
	uri := "mongodb://localhost:27017"
	clientOptions := options.Client().ApplyURI(uri)
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	client, err := mongo.Connect(ctx, clientOptions)
	if err != nil {
		log.Fatal(err)
	}

	controllers.UserCollection = client.Database("bookstore").Collection("users")

	// load jwt secret code
	controllers.JwtKey = []byte(os.Getenv("JWT_SECRET"))

	router := mux.NewRouter()
	routes.AuthRoutes(router)

	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://bookstore.local", "http://localhost:5173"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Authorization", "Content-Type"},
		AllowCredentials: true,
	})

	handlers := c.Handler(router)

	log.Println("🚀 auth server running on :8081")
	http.ListenAndServe(":8081", handlers)
}
