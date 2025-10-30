package routes

import (
	"net/http"

	"github.com/gorilla/mux"
	"github.com/shivakumar2006/online-bookstore/auth/controllers"
)

func AuthRoutes(router *mux.Router) {
	router.HandleFunc("/signup", controllers.Signup).Methods("POST")
	router.HandleFunc("/login", controllers.Login).Methods("POST")
	router.HandleFunc("/forgot-password", controllers.ForgotPassword).Methods("POST")
	router.HandleFunc("/reset-password", controllers.ResetPassword).Methods("POST")
	router.PathPrefix("/uploads/").Handler(http.StripPrefix("/uploads/", http.FileServer(http.Dir("./uploads"))))
}
