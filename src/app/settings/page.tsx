"use client";

import LogoutButton from "@/components/LogoutButton";
import { useAuthTwo } from "@/hooks/authContext";
import { useAuthFetch } from "@/hooks/privateFetch";
import React, { useState } from "react";
import PricingPage from "../pricing/page";

const SettingsPage = () => {
  const { user } = useAuthTwo();
  const authFetch = useAuthFetch();
  const [showPlans, setShowPlans] = useState(false);
  if (!user) return null;

  const handleCancelPlan = async () => {
    try {
      const res = await authFetch("stripe/cancel", {
        method: "POST",
      });
      console.log("cancel subscription", res);
    } catch (error) {
      console.error(error);
    }
  };

  if (showPlans) {
    return <PricingPage upgrade={true} currentPlanProp={user.plan} />;
  }

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
                onClick={() => setShowPlans(true)}
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
          {/* Logout */}

          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              Logout
            </h2>
            <LogoutButton />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
