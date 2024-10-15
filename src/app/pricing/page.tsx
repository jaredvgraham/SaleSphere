"use client";
import React, { useEffect, useState } from "react";
import { FaCheck, FaTimes } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useAuthFetch } from "@/hooks/privateFetch";
import { useAuthTwo } from "@/hooks/authContext";

const allFeatures = [
  { text: "Website" },
  { text: "Relation to Root Company" },
  { text: "Summary" },
  { text: "Number of Locations" },
  { text: "Products/Services" },
  { text: "Unlimited Revenue" },
  { text: "Unlimited Employee Count" },
  { text: "Key People" },
  { text: "Competitors" },
];

const packages = [
  {
    title: "Basic",
    price: "$10 / month",
    features: [
      "Website",
      "Relation to Root Company",
      "Summary",
      "Number of Locations",
      "Products/Services",
    ],
  },
  {
    title: "Standard",
    price: "$50 / month",
    features: [
      "Website",
      "Relation to Root Company",
      "Summary",
      "Number of Locations",
      "Products/Services",
      "Unlimited Revenue",
      "Unlimited Employee Count",
    ],
  },
  {
    title: "Premium",
    price: "$100 / month",
    features: [
      "Website",
      "Relation to Root Company",
      "Summary",
      "Number of Locations",
      "Products/Services",
      "Unlimited Revenue",
      "Unlimited Employee Count",
      "Key People",
      "Competitors",
    ],
  },
];

type PricingPageProps = {
  upgrade?: boolean;
  currentPlanProp?: string | null;
};

const PricingPage = ({
  upgrade = false,
  currentPlanProp = null,
}: PricingPageProps) => {
  const Router = useRouter();
  const authFetch = useAuthFetch();
  const [currentPlan, setCurrentPlan] = useState<string | null>(
    currentPlanProp
  );
  const { user } = useAuthTwo();
  const [succsess, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (user?.plan !== "none" && !upgrade) {
      Router.push("/");
    }
  }, [user]);

  const handlePlan = async (title: string) => {
    if (currentPlan === title.toLowerCase()) {
      return;
    }
    if (upgrade) {
      handleUpgradePlan(title.toLowerCase());
      return;
    }
    try {
      const res = await authFetch("stripe", {
        method: "POST",
        body: JSON.stringify({ plan: title.toLowerCase() }),
      });
      console.log("selected plan", res);

      Router.push(res.url);
    } catch (error) {
      console.error("Error selecting plan:", error);
      setError("Error selecting plan");
    }
  };

  const handleUpgradePlan = async (newPlan: string) => {
    try {
      const res = await authFetch("stripe", {
        method: "PUT",
        body: JSON.stringify({ newPlan }),
      });
      console.log("upgrade plan", res);
      setSuccess("Plan changed successfully");
      setCurrentPlan(newPlan.toLowerCase());
    } catch (error) {
      console.error("Error upgrading plan:", error);
      setError("Error upgrading plan");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 p-2 md:p-10">
      <div className="bg-white p-8 rounded-t-lg">
        <h1 className="text-4xl md:text-6xl font-extrabold text-center m-5 text-gray-600">
          Pricing Plans
        </h1>
        {error && (
          <p className="text-red-500 text-center font-semibold">{error}</p>
        )}
        {succsess && (
          <p className="text-green-500 text-center font-semibold">{succsess}</p>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {packages.map((pkg) => (
            <div
              onClick={() => handlePlan(pkg.title)}
              key={pkg.title}
              className={`relative p-7 cursor-pointer rounded-lg shadow-2xl transform transition-transform bg-white hover:bg-teal-200 hover:bg-opacity-10 ${
                pkg.title === "Standard Plan"
                  ? "border-4 gradient-border scale-105 "
                  : ""
              } ${
                pkg.title.toLowerCase() === currentPlan &&
                "bg-gray-200 cursor-not-allowed opacity-50 line-through"
              }`}
            >
              {pkg.title === "Standard Plan" && (
                <div className="absolute top-0 right-0 gradient-bg text-white text-xs font-bold px-2 py-1 rounded-bl-lg bg-black">
                  Most Popular
                </div>
              )}
              <div className="bg-gradient-to-r from-gray-400 to-black p-4 rounded-t-lg">
                <h2 className="text-4xl font-bold mb-4 text-white text-center">
                  {pkg.title}
                </h2>
                <p className="text-3xl font-semibold mb-6 text-white text-center">
                  {pkg.price}
                </p>
              </div>
              <ul className="list-none pl-1 space-y-3 p-4 text-gray-700">
                {allFeatures.map((feature) => (
                  <li key={feature.text} className="flex items-center">
                    {feature.text}
                    <span className="ml-auto flex items-center">
                      {pkg.features.includes(feature.text) ? (
                        <FaCheck className="text-green-500" />
                      ) : (
                        <FaTimes className="text-red-500" />
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
