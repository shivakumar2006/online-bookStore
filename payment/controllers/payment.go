package controllers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"strings"

	"github.com/golang-jwt/jwt/v5"
	"github.com/stripe/stripe-go/v78"
	"github.com/stripe/stripe-go/v78/checkout/session"
)

type PaymentController struct {
	JwtKey []byte
}

type Item struct {
	BookID   string  `json:"bookId"`
	Title    string  `json:"title"`
	Price    float64 `json:"price"`
	Quantity int64   `json:"quantity"`
}

type CheckoutRequest struct {
	Items         []Item `json:"items"`
	PaymentMethod string `json:"paymentMethod"`
	Token         string `json:"token"`
}

// ✅ Verify JWT Token (Copied from WishlistController logic)
func (pc *PaymentController) VerifyToken(r *http.Request) (string, error) {
	authHeader := r.Header.Get("Authorization")
	if authHeader == "" {
		return "", fmt.Errorf("missing authorization error")
	}

	tokenString := strings.TrimPrefix(authHeader, "Bearer ")
	claims := jwt.MapClaims{}
	token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
		return pc.JwtKey, nil
	})
	if err != nil || !token.Valid {
		return "", fmt.Errorf("Invalid token %v", err)
	}

	userID, ok := claims["userId"].(string)
	if !ok {
		return "", fmt.Errorf("userid is missing or invalid type")
	}

	return userID, nil
}

func (pc *PaymentController) VerifySession(w http.ResponseWriter, r *http.Request) {
	sessionID := r.URL.Query().Get("session_id")
	if sessionID == "" {
		http.Error(w, "Missing session_id", http.StatusBadRequest)
		return
	}

	stripe.Key = os.Getenv("SECRET_KEY")

	s, err := session.Get(sessionID, nil)
	if err != nil {
		http.Error(w, "Failed to retrieve session", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(s)
}

// ✅ Create Stripe Checkout Session
func (pc *PaymentController) CreateCheckoutSession(w http.ResponseWriter, r *http.Request) {
	// Verify user token
	userID, err := pc.VerifyToken(r)
	if err != nil {
		http.Error(w, err.Error(), http.StatusUnauthorized)
		return
	}

	var req CheckoutRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	if len(req.Items) == 0 {
		http.Error(w, "No items provided", http.StatusBadRequest)
		return
	}

	// ✅ Stripe Setup
	stripe.Key = os.Getenv("SECRET_KEY")

	var lineItems []*stripe.CheckoutSessionLineItemParams
	for _, item := range req.Items {
		lineItems = append(lineItems, &stripe.CheckoutSessionLineItemParams{
			PriceData: &stripe.CheckoutSessionLineItemPriceDataParams{
				Currency: stripe.String("inr"),
				ProductData: &stripe.CheckoutSessionLineItemPriceDataProductDataParams{
					Name: stripe.String(item.Title),
				},
				UnitAmount: stripe.Int64(int64(item.Price * 100)), // Convert ₹ to paise
			},
			Quantity: stripe.Int64(item.Quantity),
		})
	}

	params := &stripe.CheckoutSessionParams{
		PaymentMethodTypes: stripe.StringSlice([]string{"card"}),
		LineItems:          lineItems,
		Mode:               stripe.String("payment"),
		SuccessURL:         stripe.String("http://localhost:5173/success?session_id={CHECKOUT_SESSION_ID}"),
		CancelURL:          stripe.String("http://localhost:5173/cancel"),
		Metadata: map[string]string{
			"userId": userID,
		},
	}

	// ✅ Create session
	s, err := session.New(params)
	if err != nil {
		http.Error(w, fmt.Sprintf("Failed to create Stripe session: %v", err), http.StatusInternalServerError)
		return
	}

	resp := map[string]string{"url": s.URL}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(resp)
}
