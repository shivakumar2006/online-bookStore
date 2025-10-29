package routes

import (
	"net/http"

	"github.com/gorilla/mux"
	"github.com/shivakumar2006/online-bookstore/wishlist/controllers"
	"github.com/shivakumar2006/online-bookstore/wishlist/middlewares"
)

func WishlistRoutes(r *mux.Router) {
	r.HandleFunc("/wishlist/add", middlewares.VerifySupabaseJWT(controllers.AddToWishlist)).Methods(http.MethodPost)
	r.HandleFunc("/wishlist", middlewares.VerifySupabaseJWT(controllers.GetWishlist)).Methods(http.MethodGet)
	r.HandleFunc("/wishlist/remove", middlewares.VerifySupabaseJWT(controllers.RemoveFromWishlist)).Methods(http.MethodDelete)
}
