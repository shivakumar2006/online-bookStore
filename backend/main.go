package main

import (
	"context"
	"log"
	"net/http"
	"time"

	"github.com/gorilla/mux"
	"github.com/rs/cors"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"

	"github.com/shivakumar2006/online-bookstore/backend/controllers"
	"github.com/shivakumar2006/online-bookstore/backend/routes"
)

func main() {
	// // 🧩 Load Mongo credentials from environment variables
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
		log.Fatal("❌ MongoDB connection error:", err)
	}

	controllers.BookCollection = client.Database("bookstore").Collection("books")

	// 📚 Setup Router
	router := mux.NewRouter()
	routes.BookRoutes(router)

	// 🌐 Setup CORS for frontend
	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:5173"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE"},
		AllowedHeaders:   []string{"Authorization", "Content-Type"},
		AllowCredentials: true,
	})

	handler := c.Handler(router)

	log.Println("🚀 Backend server running on port :8080")
	if err := http.ListenAndServe(":8080", handler); err != nil {
		log.Fatal(err)
	}
}
