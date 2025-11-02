package routes

import (
	"net/http"

	"github.com/gorilla/mux"
	"github.com/shivakumar2006/online-bookstore/payment/controllers"
)

func PaymentRoutes(r *mux.Router, pc *controllers.PaymentController) {
	r.HandleFunc("/payment/create-checkout-session", pc.CreateCheckoutSession).Methods(http.MethodPost)
}
