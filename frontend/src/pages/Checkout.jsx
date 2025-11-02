import React, { useState } from "react";
import { usePlaceOrderMutation } from "../redux/api/ordersApi";
import { useNavigate } from "react-router-dom";
import { FaCreditCard, FaMoneyBillWave } from "react-icons/fa";
import { useGetCartQuery } from "../redux/api/cartApi";
import { useCreatePaymentMutation } from "../redux/api/paymentApi";

const Checkout = ({ userId }) => {
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [placeOrder, { isLoading }] = usePlaceOrderMutation();
  const { data: cartData, isLoading: cartLoading } = useGetCartQuery(userId);
  const navigate = useNavigate();
  const [createPayment] = useCreatePaymentMutation();

  // ✅ Get items safely
  const cartItems = cartData?.items || [];
  const total = cartData?.cartTotal || 0;

  const handlePlaceOrder = async () => {
    if (!cartItems || cartItems.length === 0) {
      alert("Your cart is empty!");
      return;
    }
  
    try {
      const orderItems = cartItems.map((item) => ({
        bookId: item.bookId,
        quantity: item.quantity || item.itemQuantity,
      }));
    
      if (paymentMethod === "razorpay") {
        // 💳 Stripe Dummy payment
        const paymentRes = await createPayment({
          items: orderItems,
          total,
          userId,
        }).unwrap();
      
        if (paymentRes.url) {
          // Redirect to Stripe checkout
          window.location.href = paymentRes.url;
        } else {
          alert("Failed to start Stripe payment!");
        }
        return;
      }
    
      // 🏦 COD order placement
      await placeOrder({
        items: orderItems,
        paymentMethod,
      }).unwrap();
    
      alert("Order placed successfully!");
      navigate("/orders");
    } catch (error) {
      console.error(error);
      alert(error?.data?.message || "Failed to place order");
    }
  };

  if (cartLoading) {
    return <p className="text-center py-10 text-gray-600">Loading cart...</p>;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
        Checkout
      </h1>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Left - Cart Summary */}
        <div className="bg-white shadow-xl rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Order Summary
          </h2>

          {cartItems.length > 0 ? (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between border-b pb-3"
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={`http://localhost:8080/books/images/${item.book.coverImage}`}
                      alt={item.book.title}
                      className="w-16 h-20 object-cover rounded-lg shadow-md"
                    />
                    <div>
                      <h3 className="text-lg font-medium">{item.book.title}</h3>
                      <p className="text-sm text-gray-500">
                        {item.book.author}
                      </p>
                      <p className="text-sm font-semibold text-gray-700">
                        ₹{item.book.price} × {item.quantity}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-800 font-semibold">
                    ₹{item.book.price * item.quantity}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No items in cart.</p>
          )}

          <div className="mt-6 border-t pt-4">
            <div className="flex justify-between text-lg font-semibold">
              <span>Total:</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Right - Payment and Place Order */}
        <div className="bg-white shadow-xl rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Payment Method
          </h2>

          <div className="space-y-3">
            <button
              onClick={() => setPaymentMethod("cod")}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 transition ${
                paymentMethod === "cod"
                  ? "border-green-500 bg-green-50"
                  : "border-gray-200 hover:border-green-400"
              }`}
            >
              <div className="flex items-center space-x-3">
                <FaMoneyBillWave
                  className={`${
                    paymentMethod === "cod"
                      ? "text-green-600"
                      : "text-gray-400"
                  } text-xl`}
                />
                <span className="font-medium text-gray-700">
                  Cash on Delivery
                </span>
              </div>
              {paymentMethod === "cod" && (
                <span className="text-green-600 font-semibold">Selected</span>
              )}
            </button>

            <button
              onClick={() => setPaymentMethod("razorpay")}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 transition ${
                paymentMethod === "razorpay"
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-blue-400"
              }`}
            >
              <div className="flex items-center space-x-3">
                <FaCreditCard
                  className={`${
                    paymentMethod === "razorpay"
                      ? "text-blue-600"
                      : "text-gray-400"
                  } text-xl`}
                />
                <span className="font-medium text-gray-700">
                  Stripe (Dummy)
                </span>
              </div>
              {paymentMethod === "razorpay" && (
                <span className="text-blue-600 font-semibold">Selected</span>
              )}
            </button>
          </div>

          <button
            onClick={handlePlaceOrder}
            disabled={isLoading}
            className="mt-8 w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl text-lg font-semibold hover:opacity-90 transition"
          >
            {isLoading ? "Placing Order..." : "Place Order"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
