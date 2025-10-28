package routes

import (
	"github.com/gorilla/mux"
	"github.com/shivakumar2006/online-bookstore/cart/controllers"
)

func CartRoutes(r *mux.Router) {
	cart := r.PathPrefix("/cart").Subrouter()

	cart.HandleFunc("/{userId}", controllers.GetCart).Methods("GET")                           // Get user's full cart
	cart.HandleFunc("/{userId}/add", controllers.AddToCart).Methods("POST")                    // Add item to cart
	cart.HandleFunc("/{userId}/update", controllers.UpdateCartItem).Methods("PUT")             // Update quantity
	cart.HandleFunc("/{userId}/remove/{bookId}", controllers.RemoveFromCart).Methods("DELETE") // Remove by BookID
}
