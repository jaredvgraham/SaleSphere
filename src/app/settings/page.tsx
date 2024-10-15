"use client";
import { useAuthTwo } from "@/hooks/authContext";
import React from "react";

const SettingsPage = () => {
  const { user } = useAuthTwo();
  if (!user) return null;

  const handleCancelPlan = () => {
    // Logic to cancel the user's plan
    console.log("Plan cancelled");
  };

  const handleUpgradePlan = () => {
    // Logic to upgrade the user's plan
    console.log("Upgrade plan");
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-100 to-gray-200 py-12 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800">Settings</h1>
          <p className="text-gray-600 mt-4">
            Manage your account and subscription settings
          </p>
        </div>

        {/* Profile and Plan Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Profile Info */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              Profile Information
            </h2>
            <ul className="text-gray-600">
              <li className="mb-2">
                <strong>Email:</strong> {user.email}
              </li>
            </ul>
          </div>

          {/* Subscription Info */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              Subscription Plan
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              {user.plan === "none"
                ? "You are currently on the free plan."
                : `You are subscribed to the ${
                    user.plan.charAt(0).toUpperCase() + user.plan.slice(1)
                  } plan.`}
            </p>
            {user.plan !== "premium" && (
              <button
                onClick={handleUpgradePlan}
                className="  w-full text-center bg-blue-600 text-white py-3 rounded-lg shadow-lg hover:bg-blue-700 transition duration-300"
              >
                Upgrade Plan
              </button>
            )}
            {user.plan !== "none" && (
              <div className="space-y-4">
                <button
                  onClick={handleCancelPlan}
                  className="mt-3 w-full text-center bg-red-500 text-white py-3 rounded-lg shadow-lg hover:bg-red-600 transition duration-300"
                >
                  Cancel Plan
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
