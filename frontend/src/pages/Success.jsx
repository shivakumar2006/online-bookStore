import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const Success = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [sessionData, setSessionData] = useState(null);

  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    if (!sessionId) return;

    const verifyPayment = async () => {
      try {
        const res = await fetch(
          `http://localhost:8085/payment/verify-session?session_id=${sessionId}`
        );
        const data = await res.json();
        console.log("✅ Payment session data:", data);
        setSessionData(data);
      } catch (err) {
        console.error("❌ Failed to verify session", err);
      }
    };

    verifyPayment();
  }, [sessionId]);

  return (
    <div className="w-full h-screen flex flex-col justify-center items-center">
      <h1 className="text-3xl font-bold text-green-700">
        Payment Successful 🎉
      </h1>
      <p className="mt-2 text-lg text-gray-700">Thank you for your purchase!</p>

      {sessionData && (
        <p className="mt-4 text-sm text-gray-500">
          Transaction ID: {sessionData.id}
        </p>
      )}

      <div className="flex flex-col mt-10 items-center justify-center gap-2">
        <p>Check out your order from here</p>
        <button
          onClick={() => navigate("/orders")}
          className="px-6 py-2 bg-indigo-500 text-white rounded-xl hover:bg-indigo-600 transition-colors"
        >
          Orders
        </button>
      </div>
    </div>
  );
};

export default Success;
