package main

import (
	"log"
	"net/http"
	"os"

	"github.com/gorilla/mux"
	"github.com/rs/cors"
	"github.com/shivakumar2006/online-bookstore/payment/controllers"
	"github.com/shivakumar2006/online-bookstore/payment/routes"
)

func main() {
	// err := godotenv.Load()
	// if err != nil {
	// 	log.Println("⚠️ No .env file found")
	// }

	r := mux.NewRouter()

	// ✅ Initialize PaymentController with JWT secret
	pc := &controllers.PaymentController{
		JwtKey: []byte(os.Getenv("JWT_SECRET")),
	}

	routes.PaymentRoutes(r, pc)

	// ✅ Add CORS
	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:5173"},
		AllowedMethods:   []string{"GET", "POST", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Authorization", "Content-Type"},
		AllowCredentials: true,
	})

	handler := c.Handler(r)

	log.Println("🚀 Payment service running on port 8085")
	log.Fatal(http.ListenAndServe(":8085", handler))
}
