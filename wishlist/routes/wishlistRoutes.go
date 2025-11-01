package routes

import (
	"net/http"

	"github.com/gorilla/mux"
	"github.com/shivakumar2006/online-bookstore/wishlist/controllers"
)

func WishlistRoutes(r *mux.Router, wc *controllers.WishlistController) {
	r.HandleFunc("/wishlist/add", wc.AddToWishlist).Methods(http.MethodPost)
	r.HandleFunc("/wishlist", wc.GetWishList).Methods(http.MethodGet)
	r.HandleFunc("/wishlist/remove", wc.RemoveFromWishlist).Methods(http.MethodDelete)
}
