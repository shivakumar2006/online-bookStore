package routes

import (
	"github.com/gorilla/mux"
	"github.com/shivakumar2006/online-bookstore/backend/controllers"
)

func BookRoutes(router *mux.Router) {
	router.HandleFunc("/books", controllers.GetBooks).Methods("GET")
	// future:
	// router.HandleFunc("/books", controllers.CreateBook).Methods("POST")
	// router.HandleFunc("/books/{id}", controllers.UpdateBook).Methods("PUT")
	// router.HandleFunc("/books/{id}", controllers.DeleteBook).Methods("DELETE")
}
