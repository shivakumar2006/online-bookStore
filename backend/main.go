package main

import (
	"context"
	"log"
	"net/http"
	"time"

	"github.com/gorilla/mux"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"

	"github.com/shivakumar2006/online-bookstore/backend/controllers"
	"github.com/shivakumar2006/online-bookstore/backend/routes"
)

func main() {
	clientOptions := options.Client().ApplyURI("mongodb://localhost:27017")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	client, err := mongo.Connect(ctx, clientOptions)
	if err != nil {
		log.Fatal(err)
	}

	controllers.BookCollection = client.Database("bookstore").Collection("books")

	// router
	router := mux.NewRouter()
	routes.BookRoutes(router)

	log.Println("🚀 Server running on port :8080")
	http.ListenAndServe(":8080", router)
}
