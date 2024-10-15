"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import SalesEditor from "@/components/emailEditor";
import Loader from "@/components/loader"; // Import the loader

const Console = () => {
  const { companyId } = useParams(); // Fetch the company ID from the URL parameters
  const [companyData, setCompanyData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch company data from the API
    const fetchCompanyData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/console/${companyId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch company data");
        }
        const data = await response.json();
        setCompanyData(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyData();
  }, [companyId]);

  if (loading) {
    return <Loader />; // Show the loader when data is being fetched
  }

  if (error) {
    return <p className="text-red-500 text-xl">{error}</p>;
  }

  if (!companyData) {
    return <p className="text-gray-500 text-xl">No company data found</p>;
  }

  return (
    <div className="h-[100%] bg-gradient-to-br from-slate-50 to-slate-100 p-8 overflow-scroll">
      <div className="bg-white shadow-xl rounded-3xl p-8 mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {companyData.name}
        </h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-semibold text-indigo-700 mb-2">
              Summary
            </h2>
            <p className="text-gray-700 mb-4">
              {companyData.summary || "No summary available."}
            </p>
            <h2 className="text-2xl font-semibold text-indigo-700 mb-2">
              Revenue
            </h2>
            <p className="text-gray-700 mb-4">
              {companyData.revenue || "Revenue data unavailable."}
            </p>
            <h2 className="text-2xl font-semibold text-indigo-700 mb-2">
              Key People
            </h2>
            <p className="text-gray-700 mb-4">
              {companyData.keyPeople || "No key people information available."}
            </p>
          </div>
          <div>
            <SalesEditor companyId={companyId as string} />{" "}
            {/* Add the email editor */}
          </div>
        </div>
      </div>

      <div className="bg-white shadow-xl rounded-3xl p-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Contacts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Assuming you have an array of contacts */}
          {companyData.contacts ? (
            companyData.contacts.map((contact: any, index: number) => (
              <div
                key={index}
                className="bg-gray-50 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <h3 className="text-xl font-semibold text-gray-800">
                  {contact.name}
                </h3>
                <p className="text-gray-600">Email: {contact.email}</p>
                <p className="text-gray-600">Phone: {contact.phone}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-600">No contacts available.</p>
          )}
        </div>
      </div>

      <div className="bg-white shadow-xl rounded-3xl p-8 mt-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Notes</h2>
        {/* Add a section for notes, styled similarly */}
        <textarea
          placeholder="Add notes about the company..."
          className="w-full p-4 bg-gray-50 rounded-lg shadow-inner border border-gray-300 focus:outline-none focus:border-indigo-500"
        />
        <button className="mt-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 px-8 rounded-full shadow-lg hover:shadow-2xl transform hover:scale-105 transition-transform duration-300 ease-in-out">
          Save Notes
        </button>
      </div>
    </div>
  );
};

export default Console;
