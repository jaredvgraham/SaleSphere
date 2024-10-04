"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Loader from "@/components/loader";

const CompanyDetails = () => {
  const { id } = useParams(); // Fetch the company ID from the URL parameters
  const [companyData, setCompanyData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch company data from the API
    const fetchCompanyData = async () => {
      try {
        const response = await fetch(`/api/details/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch company data");
        }
        const data = await response.json();
        setCompanyData(data.companyData); // Store the company data
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
    return <p>Error: {error}</p>;
  }

  if (!companyData) {
    return <p>No company data found</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">{companyData.name} Details</h1>
      <div className="mb-4">
        <h2 className="text-xl font-semibold">Summary</h2>
        <p>{companyData.summary || "No summary available."}</p>
      </div>
      <div className="mb-4">
        <h2 className="text-xl font-semibold">Products/Services</h2>
        <p>{companyData.products || "No products or services available."}</p>
      </div>
      <div className="mb-4">
        <h2 className="text-xl font-semibold">Revenue</h2>
        <p>{companyData.revenue || "Revenue data unavailable."}</p>
      </div>
      <div className="mb-4">
        <h2 className="text-xl font-semibold">Key People</h2>
        <p>{companyData.keyPeople || "No key people information available."}</p>
      </div>
      <div className="mb-4">
        <h2 className="text-xl font-semibold">Competitors</h2>
        <p>{companyData.competitors || "No competitors listed."}</p>
      </div>
      <div className="mb-4">
        <h2 className="text-xl font-semibold">Relation to Root Company</h2>
        <p>{companyData.rootRelation || "No relation data available."}</p>
      </div>
    </div>
  );
};

export default CompanyDetails;
