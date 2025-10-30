import React from "react";

const LoginPopup = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl p-6 shadow-2xl w-[350px] text-center">
        <h2 className="text-xl font-semibold text-gray-800 mb-3">
          Login Required
        </h2>
        <p className="text-gray-600 mb-5">
          You need to login first to access your profile, cart and wishlist.
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-gray-300 hover:bg-gray-400 transition"
          >
            Close
          </button>
          <a
            href="/login"
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white transition"
          >
            Login
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoginPopup;
