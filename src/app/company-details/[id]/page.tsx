"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAuthFetch } from "@/hooks/privateFetch";
import Loader from "@/components/loader";

const CompanyDetails = () => {
  const { id } = useParams(); // Fetch the company ID from the URL parameters
  const [companyData, setCompanyData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const authFetch = useAuthFetch();

  useEffect(() => {
    // Fetch company data from the API
    const fetchCompanyData = async () => {
      try {
        const data = await authFetch(`details/${id}`);
        console.log("Company data:", data);

        setCompanyData(data.companyData); // Store the company data
        console.log("name", data.companyData.name);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyData();
  }, [id]);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <p className="text-red-500 text-center mt-10">{error}</p>;
  }

  if (!companyData) {
    return (
      <p className="text-center text-gray-500 mt-10">No company data found</p>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-500 via-teal-500 to-purple-600 text-white py-12 mb-8 rounded-lg shadow-lg">
        <h1 className="text-5xl font-bold text-center">{companyData.name}</h1>
        <p className="text-center mt-4 text-lg">
          Explore detailed insights about{" "}
          <span className="font-semibold">{companyData.name}</span>.
        </p>
      </div>

      {/* Company Details Section */}
      {/* website */}

      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300 mb-5">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Website</h2>
          <a
            href={companyData.website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            {companyData.website || "No website available."}
          </a>
        </div>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Summary Card */}
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Summary</h2>
          <p className="text-gray-700">
            {companyData.summary || "No summary available."}
          </p>
        </div>

        {/* Products/Services Card */}
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Products/Services
          </h2>
          <p className="text-gray-700">
            {companyData.products || "No products or services available."}
          </p>
        </div>

        {/* Revenue Card */}
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Revenue</h2>
          <p className="text-gray-700">
            {companyData.revenue || "Revenue data unavailable."}
          </p>
        </div>

        {/* Key People Card */}
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Key People
          </h2>
          <p className="text-gray-700">
            {companyData.keyPeople || "No key people information available."}
          </p>
        </div>

        {/* Competitors Card */}
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Competitors
          </h2>
          <p className="text-gray-700">
            {companyData.competitors || "No competitors listed."}
          </p>
        </div>

        {/* Relation to Root Company Card */}
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Relation to Root Company
          </h2>
          <p className="text-gray-700">
            {companyData.rootRelation ||
              "No relation to root company available."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CompanyDetails;