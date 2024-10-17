"use client";
import React, { useEffect, useState } from "react";
import { FaCheck, FaTimes } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useAuthFetch } from "@/hooks/privateFetch";
import { useAuthTwo } from "@/hooks/authContext";

const allFeatures = [
  { text: "Company Website" },
  { text: "Relation to Root Company" },
  { text: "Summary" },
  { text: "Number of Locations" },
  { text: "Products/Services" },
  { text: "Unlimited Revenue" },
  { text: "Unlimited Employee Count" },
  { text: "Key People" },
];

const packages = [
  {
    title: "Basic",
    price: "$10 / month",
    features: [
      "Company Website",
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
      "Company Website",
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
      "Company Website",
      "Relation to Root Company",
      "Summary",
      "Number of Locations",
      "Products/Services",
      "Unlimited Revenue",
      "Unlimited Employee Count",
      "Key People",
    ],
  },
];

type PricingPageProps = {
  upgrade?: boolean | null | undefined;
  currentPlanProp?: string | null;
  scroll?: boolean;
};

const PricingPage = ({
  upgrade,
  currentPlanProp,
  scroll = true,
}: PricingPageProps) => {
  const Router = useRouter();
  const authFetch = useAuthFetch();
  const [currentPlan, setCurrentPlan] = useState(currentPlanProp);
  const { user } = useAuthTwo();
  const [succsess, setSuccess] = useState("");
  const [error, setError] = useState("");
  //
  useEffect(() => {
    if (!user) {
      return;
    } else if (user?.plan !== "none" && !upgrade) {
      Router.push("/");
    }
  }, [user]);

  const handlePlan = async (title: string) => {
    if (!user) {
      setError("You need to be logged in to select a plan");
      return;
    }
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
    <div className={`h-[100%] p-6 md:p-10 ${scroll && "overflow-y-scroll"}`}>
      <div className=" p-8 rounded-t-lg shadow-lg">
        <h1 className="text-4xl md:text-6xl font-extrabold text-center m-5 text-gray-300">
          Pricing Plans
        </h1>
        {error && (
          <p className="text-red-600 p-2 text-center text-lg font-semibold">
            {error}
          </p>
        )}
        {succsess && (
          <p className="text-green-500 text-center font-semibold">{succsess}</p>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-12">
          {packages.map((pkg) => (
            <div
              onClick={() => handlePlan(pkg.title)}
              key={pkg.title}
              className={`relative p-7 cursor-pointer border border-gray-600 rounded-lg shadow-2xl transform transition-transform bg-alt  hover:border-teal-400 hover:bg-opacity-10 ${
                pkg.title === "Standard Plan"
                  ? "border-4 gradient-border scale-105 "
                  : ""
              } ${
                pkg.title.toLowerCase() === currentPlan &&
                "bg-gray-200 cursor-not-allowed opacity-50 line-through"
              }`}
            >
              {pkg.title === "Standard" && (
                <div className="absolute top-0 right-0 bg-card text-teal-500 text-xs font-bold p-1 rounded-bl-lg bg-black ">
                  Most Popular
                </div>
              )}
              <div className="bg-gradient-to-r from-gray-800 to-black p-4 rounded-t-lg">
                <h2 className="text-4xl font-bold mb-4 text-white text-center">
                  {pkg.title}
                </h2>
                <p className="text-3xl font-semibold mb-6 text-white text-center">
                  {pkg.price}
                </p>
              </div>
              <ul className="list-none pl-1 space-y-3 p-4 text-gray-300">
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
