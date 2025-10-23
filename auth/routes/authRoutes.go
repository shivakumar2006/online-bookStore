package routes

import (
	"github.com/gorilla/mux"
	"github.com/shivakumar2006/online-bookstore/auth/controllers"
)

func AuthRoutes(router *mux.Router) {
	router.HandleFunc("/signup", controllers.Signup).Methods("POST")
	router.HandleFunc("/login", controllers.Login).Methods("POST")
}
