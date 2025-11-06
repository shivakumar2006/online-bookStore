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

	"github.com/shivakumar2006/online-bookstore/orders/controllers"
	"github.com/shivakumar2006/online-bookstore/orders/routes"
)

func main() {
	// err := godotenv.Load()
	// if err != nil {
	// 	log.Fatal("Error loading .env")
	// }

	clientOptions := options.Client().ApplyURI("mongodb://username:password@mongodb-service:27017")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	client, err := mongo.Connect(ctx, clientOptions)
	if err != nil {
		log.Fatal(err)
	}

	orderCollection := client.Database("bookstore").Collection("orders")

	oc := &controllers.OrderController{
		OrderCollection: orderCollection,
		JwtKey:          []byte("JWT_SECRET"),
		BookServiceURL:  "http://localhost:8080",
	}

	router := mux.NewRouter()
	routes.OrderRoutes(router, oc)

	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://bookstore.local"},
		AllowedMethods:   []string{"GET", "POST", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Authorization", "Content-Type"},
		AllowCredentials: true,
	})

	handler := c.Handler(router)

	log.Println("🚀 order service running on : 8084")
	http.ListenAndServe(":8084", handler)
}
