import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import {
  useGetOrdersQuery,
  useCancelOrderMutation,
} from "../redux/api/ordersApi";
import { Loader2, XCircle, CheckCircle, Clock } from "lucide-react";
import { useAuthReady } from "../hooks/AuthReady"; // ✅ waits for redux-persist restore

const Orders = () => {
  const isAuthReady = useAuthReady(); // ✅ wait until auth restored
  const token = useSelector((state) => state.auth.token);
  const [cancelOrder] = useCancelOrderMutation();

  // ✅ call query (but skip until auth ready)
  const {
    data: orders,
    isLoading,
    isError,
    refetch,
  } = useGetOrdersQuery(undefined, {
    skip: !isAuthReady || !token,
  });

  // ✅ Re-fetch when token or auth becomes ready
  useEffect(() => {
    if (isAuthReady && token) {
      refetch();
    }
  }, [isAuthReady, token, refetch]);

  // ------------------ UI CONDITIONS ------------------

  if (!isAuthReady)
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-500">
        Restoring your session...
      </div>
    );

  if (isLoading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin w-8 h-8 text-gray-500" />
        <p className="ml-2 text-gray-500">Loading your orders...</p>
      </div>
    );

  if (isError)
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500">
        Failed to fetch your orders 😢
      </div>
    );

  if (!orders || orders.length === 0)
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-500">
        You haven’t placed any orders yet 📚
      </div>
    );

  // ------------------ CANCEL HANDLER ------------------
  const handleCancel = async (orderId) => {
    if (window.confirm("Are you sure you want to cancel this order?")) {
      await cancelOrder(orderId);
      refetch(); // ✅ instantly refresh after cancel
    }
  };

  // ------------------ MAIN RENDER ------------------
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 md:px-16">
      <h1 className="text-3xl font-semibold mb-8 text-gray-800 text-center">
        My Orders 📦
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {orders.map((order) => (
          <div
            key={order._id}
            className="bg-white shadow-md rounded-2xl p-5 border border-gray-100 hover:shadow-lg transition-all"
          >
            <div className="flex items-center space-x-4">
              <img
                src={order.bookCover || "https://via.placeholder.com/80"}
                alt={order.bookTitle}
                className="w-20 h-28 object-cover rounded-md"
              />
              <div>
                <h3 className="font-semibold text-lg text-gray-800">
                  {order.bookTitle || "Unknown Book"}
                </h3>
                <p className="text-gray-500 text-sm mt-1">
                  Author: {order.bookAuthor || "N/A"}
                </p>
                <p className="text-gray-600 font-medium mt-1">
                  ₹{order.amount?.toFixed(2) || "0.00"}
                </p>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {order.status === "success" ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : order.status === "pending" ? (
                  <Clock className="w-5 h-5 text-yellow-500" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-500" />
                )}
                <span
                  className={`capitalize font-medium ${
                    order.status === "success"
                      ? "text-green-600"
                      : order.status === "pending"
                      ? "text-yellow-600"
                      : "text-red-600"
                  }`}
                >
                  {order.status}
                </span>
              </div>

              {order.status === "pending" && (
                <button
                  onClick={() => handleCancel(order._id)}
                  className="px-4 py-1 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  Cancel
                </button>
              )}
            </div>

            <p className="text-xs text-gray-400 mt-3">
              Ordered on {new Date(order.createdAt).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
