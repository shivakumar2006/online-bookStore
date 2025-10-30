package routes

import (
	"net/http"

	"github.com/gorilla/mux"
	"github.com/shivakumar2006/online-bookstore/wishlist/controllers"
)

func WishlistRoutes(r *mux.Router) {
	r.HandleFunc("/wishlist/add", controllers.AddToWishlist).Methods(http.MethodPost)
	r.HandleFunc("/wishlist", controllers.GetWishlist).Methods(http.MethodGet)
	r.HandleFunc("/wishlist/remove", controllers.RemoveFromWishlist).Methods(http.MethodDelete)
}
