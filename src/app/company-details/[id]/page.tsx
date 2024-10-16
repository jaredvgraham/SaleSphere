"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAuthFetch } from "@/hooks/privateFetch";
import Loader from "@/components/loader";
import { Company } from "@/types";
import AddFav from "@/components/companies/AddFav";
import { useCompany } from "@/hooks/companyContext";
import Link from "next/link";

const CompanyDetails = () => {
  const { id } = useParams(); // Fetch the company ID from the URL parameters
  const { setGlobalCompanyId } = useCompany();
  useEffect(() => {
    setGlobalCompanyId(id as string);
    console.log("setGlobalCompanyId", id);
  }, [id]);
  const [companyData, setCompanyData] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const authFetch = useAuthFetch();

  useEffect(() => {
    // Fetch company data from the API
    const fetchCompanyData = async () => {
      console.log("fetching company data");

      try {
        const data = await authFetch(`details/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        console.log("Company data1:", data);
        console.log("Company data1:", data);

        setCompanyData(data.companyData); // Store the company data
        console.log("employeeCount", data.companyData.employeeCount);
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
    <div className="h-[100%]  p-6 overflow-scroll">
      {/* Hero Section */}
      <div className="relative bg-modern-gradient text-gray-300 py-12 mb-8 rounded-lg shadow-lg">
        <h1 className="text-5xl font-bold text-center">{companyData.name}</h1>
        <p className="text-center mt-4 text-lg">
          Explore detailed insights about{" "}
          <span className="font-semibold">{companyData.name}</span>.
        </p>
        <div className="absolute top-0 right-0 p-4">
          <div className="flex flex-col justify-between">
            <div className="flex justify-end  p-4">
              <AddFav relatedCompany={companyData as Company} size={60} />
            </div>
            {companyData?.rootCompanyId && (
              <div className="flex ">
                <Link
                  href={`/company/${companyData.rootCompanyId}`}
                  className="text-blue-400 hover:underline"
                >
                  Back to Root →
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Company Details Section */}
      {/* website */}

      <div className="max-w-5xl mx-auto">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 mb-3">
          {/* Revenue Card */}
          <div className="bg-alt border border-gray-600 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
            <h2 className="text-2xl font-semibold text-gray-300 mb-4">
              Revenue
            </h2>
            <p className="text-green-400">
              {companyData.revenue || "Revenue data unavailable."}
            </p>
          </div>

          {/* Employee Count Card */}
          <div className="bg-alt border border-gray-600 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
            <h2 className="text-2xl font-semibold text-gray-300 mb-4">
              Employee Count
            </h2>
            <p className="text-gray-300 font-bold">
              {companyData.employeeCount || "N/A"}
            </p>
          </div>

          {/* Key People Card */}
          <div className="bg-alt border border-gray-600 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
            <h2 className="text-2xl font-semibold text-gray-300 mb-4">
              Key People
            </h2>
            <p className="text-violet-300">{companyData.keyPeople || "N/A"}</p>
          </div>
          <div className="bg-alt border border-gray-600 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
            <h2 className="text-2xl font-semibold text-gray-300 mb-4">
              Locations
            </h2>
            <p className="text-yellow-400">
              {companyData.numOfLocations || "N/A"}
            </p>
          </div>
        </div>
        <div className="bg-alt border border-gray-600 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300 mb-5">
          <h2 className="text-2xl font-semibold text-gray-300 mb-4">Website</h2>
          <a
            href={companyData.website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:underline"
          >
            {companyData.website || "No website available."}
          </a>
          <h2 className="text-2xl font-semibold text-gray-300 mt-4 mb-4">
            LinkedIn
          </h2>
          <a
            className="text-blue-400 hover:underline"
            href={`https://www.linkedin.com/company/${companyData.name
              .split(" ")
              .join("")}`}
          >
            {`https://www.linkedin.com/company/${companyData.name
              .split(" ")
              .join("")}`}
          </a>
        </div>
        <div className="bg-alt border border-gray-600 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300 mb-5">
          <h2 className="text-2xl font-semibold text-gray-300 mb-4">
            Relation to Root Company
          </h2>

          {companyData.rootRelation && (
            <>
              <ul className="p-2">
                {companyData.rootRelation
                  .split(". **")
                  .map((relation, index) => (
                    <li key={index} className="text-gray-300 mt-4 list-disc">
                      {relation.split(relation[relation.length - 1])[0]}
                    </li>
                  ))}
              </ul>
            </>
          )}
        </div>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Summary Card */}
        <div className="bg-alt border border-gray-600 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
          <h2 className="text-2xl font-semibold text-gray-300 mb-4">Summary</h2>
          <ul className="text-gray-300 pl-2">
            {companyData.summary &&
              companyData.summary.split(". ").map((item, index) => (
                <li key={index} className="list-disc mt-4">
                  {item}
                </li>
              ))}
          </ul>
        </div>

        {/* numOfLocations*/}

        {/* Products/Services Card */}
        <div className="bg-alt border border-gray-600  rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
          <h2 className="text-2xl font-semibold text-gray-300 mb-4">
            Products/Services
          </h2>
          <p className="text-gray-300">
            {companyData.products || "No products or services available."}
          </p>
        </div>

        {/* Competitors Card */}
        <div className="bg-alt border border-gray-600 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
          <h2 className="text-2xl font-semibold text-gray-300 mb-4">
            Competitors
          </h2>
          <p className="text-gray-300">
            {companyData.competitors || "No competitors listed."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CompanyDetails;
