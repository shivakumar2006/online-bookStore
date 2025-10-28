package routes

import (
	"github.com/gorilla/mux"
	"github.com/shivakumar2006/online-bookstore/controllers"
)

func CartRoutes(r *mux.Router) {
	r.HandleFunc("/cart", controllers.GetCart).Methods("GET")
	r.HandleFunc("/cart/add", controllers.AddToCart).Methods("POST")
	r.HandleFunc("/cart/remove", controllers.RemoveFromCart).Methods("DELETE")
	r.HandleFunc("/cart/updatte", controllers.UpdateCartItem).Methods("PUT")
}
