import React from "react";
import { useNavigate } from "react-router-dom";

export default function UserWelcomePanel({ currentUser }) {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-50 to-indigo-50 p-6">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
        <h1 className="text-3xl font-bold mb-3">
          Hello, {currentUser?.name || "User"}!
        </h1>
        <p className="text-gray-700 mb-6">
          Welcome to your dashboard. Here you can:
        </p>
        <ul className="list-disc text-left ml-8 mb-6 text-gray-600">
          <li>Update your profile and avatar</li>
          <li>View notifications and settings</li>
        </ul>
        <button
          onClick={() => navigate("/my-profile")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
        >
          Go to My Profile
        </button>
      </div>
    </div>
  );
}
