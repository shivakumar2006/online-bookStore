import React, { useState } from 'react';
import { IoIosBookmark } from "react-icons/io";
import { useForgotPasswordMutation } from '../redux/api/jwtAuthSlice';
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await forgotPassword(email).unwrap();
      setMessage(res.reset_link || "Password reset link sent to your email!");
    } catch (err) {
      setMessage("Email not found or an error occurred");
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-100 flex flex-col justify-center items-center px-4">
      {/* Logo */}
      <div className="flex items-center justify-center space-x-2 text-2xl font-bold text-indigo-600 mb-6">
        <span>BookStore</span>
        <IoIosBookmark className="mt-1 text-xl" />
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-xl p-6 w-full max-w-md flex flex-col items-center"
      >
        <p className="text-2xl font-bold mb-2 text-gray-800">Reset your password</p>
        <p className="text-sm text-indigo-500 text-center mb-6">
          Enter your email and we'll send you instructions to reset your password.
        </p>

        <label className="w-full text-sm font-semibold text-gray-700 mb-1">
          Email
        </label>
        <input
          type="email"
          placeholder="youremail@gmail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full h-10 mb-4 bg-gray-50 border border-indigo-500 rounded-lg pl-3 placeholder:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          required
        />

        <button
          type="submit"
          disabled={isLoading}
          className="w-full h-10 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors cursor-pointer"
        >
          {isLoading ? "Sending..." : "Send reset instructions"}
        </button>

        {message && (
          <p className="text-sm text-center text-gray-600 mt-4">{message}</p>
        )}

        <div className="flex flex-row justify-center items-center gap-1 mt-5">
          <p className="text-sm text-gray-500">Remember your password?</p>
          <Link to="/login" className="text-sm text-indigo-600 hover:underline">
            Back to login
          </Link>
        </div>
      </form>
    </div>
  );
};

export default ForgotPassword;
