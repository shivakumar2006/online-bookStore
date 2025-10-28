package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/gorilla/mux"
	"github.com/rs/cors"
	"github.com/shivakumar2006/online-bookstore/cart/controllers"
	"github.com/shivakumar2006/online-bookstore/cart/routes"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func main() {
	// connect mongodb
	client, err := mongo.NewClient(options.Client().ApplyURI("http://localhost:27017"))
	if err != nil {
		log.Fatal(err)
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	err = client.Connect(ctx)
	if err != nil {
		log.Fatal(err)
	}

	// initialize controllers
	controllers.InitCartCollection(client)

	r := mux.NewRouter()
	routes.CartRoutes(r)

	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:5173"}, // your frontend origin
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE"},
		AllowedHeaders:   []string{"Authorization", "Content-Type"},
		AllowCredentials: true,
	})

	// Apply CORS middleware
	handler := c.Handler(r)

	fmt.Println("Cart microservice are running on port 8082")
	http.ListenAndServe(":8082", handler)
}
