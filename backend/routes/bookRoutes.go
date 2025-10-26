package routes

import (
	"net/http"

	"github.com/gorilla/mux"
	"github.com/shivakumar2006/online-bookstore/backend/controllers"
)

func BookRoutes(router *mux.Router) {
	router.HandleFunc("/books", controllers.GetBooks).Methods("GET")
	router.HandleFunc("/books/{id}", controllers.GetBooksByID).Methods("GET")
	router.PathPrefix("/books/images/").Handler(
		http.StripPrefix("/books/images/", http.FileServer(http.Dir("/Users/shivakumar/projects/online-bootStore/data/books/"))),
	)

	// future:
	// router.HandleFunc("/books", controllers.CreateBook).Methods("POST")
	// router.HandleFunc("/books/{id}", controllers.UpdateBook).Methods("PUT")
	// router.HandleFunc("/books/{id}", controllers.DeleteBook).Methods("DELETE")
}
