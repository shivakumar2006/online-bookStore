package routes

import (
	"net/http"

	"github.com/gorilla/mux"
	"github.com/shivakumar2006/online-bookstore/cart/controllers"
)

func CartRoutes(r *mux.Router, cc *controllers.CartController) {
	r.HandleFunc("/cart/add", cc.AddToCart).Methods(http.MethodPost)
	r.HandleFunc("/cart", cc.GetUserCart).Methods(http.MethodGet)
	r.HandleFunc("/cart/remove", cc.RemoveFromCart).Methods(http.MethodDelete)
}
