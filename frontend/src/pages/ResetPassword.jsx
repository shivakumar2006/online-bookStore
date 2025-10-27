// src/pages/ResetPassword.jsx
import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { useResetPasswordMutation } from "../redux/api/jwtAuthSlice";
import { Link } from "react-router-dom";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const location = useLocation();
  const token = new URLSearchParams(location.search).get("token");

  const [resetPassword] = useResetPasswordMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await resetPassword({ token, new_password: newPassword }).unwrap();
      setMessage(res.message);
    } catch (err) {
      setMessage("Token invalid or expired");
    }
  };

  return (
    <div className="w-full bg-gray-100 min-h-screen flex flex-col justify-center items-center">
      <h2 className="text-3xl font-bold">Reset Password</h2>
      <form onSubmit={handleSubmit} className="flex flex-col items-center gap-5">
        <input
          type="password"
          placeholder="Enter new password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-80 h-10 mt-5 border bg-white border-gray-500 rounded-xl pl-4"
        />
        <button type="submit" className="w-80 h-10 bg-black rounded-2xl text-white text-xl cursor-pointer">Reset</button>
      </form>
      {message && <p>{message}</p>}
      <div className="flex flex-row justify-center items-center gap-1 mt-5">
                <p className="text-sm text-gray-500">Remember your password?</p>
                <Link to="/login" className="text-sm text-indigo-600 hover:underline">
                  Back to login
                </Link>
              </div>
    </div>
  );
};

export default ResetPassword;
