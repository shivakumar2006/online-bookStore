package routes

import (
	"net/http"

	"github.com/gorilla/mux"
	"github.com/shivakumar2006/online-bookstore/orders/controllers"
)

func OrderRoutes(r *mux.Router, oc *controllers.OrderController) {
	r.HandleFunc("/orders/create", oc.PlaceOrder).Methods(http.MethodPost)
	r.HandleFunc("/orders", oc.GetOrders).Methods(http.MethodGet)
	r.HandleFunc("/orders/cancel", oc.CancelOrder).Methods(http.MethodPatch)
}
