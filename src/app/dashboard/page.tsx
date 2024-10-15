"use client";
import React, { useEffect, useState } from "react";
import RootCompanies from "@/components/companies/RootCompanies";

import { useAuthFetch } from "@/hooks/privateFetch";
import { Company } from "@/types";
import { useAuth } from "@clerk/nextjs";
import IndustryChart from "@/components/companies/dashboard/IndustryChart";
import TotalCompaniesChart from "@/components/companies/dashboard/TotalCompaniesChart";
import Loader from "@/components/loader";
import { formatError } from "@/utils/formatErr";
import { useAuthTwo } from "@/hooks/authContext";
import { FiSend } from "react-icons/fi";
// Import your chart component

const Dashboard = () => {
  const { userId } = useAuth();
  const [company, setCompany] = useState("");
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedIndustryCompanies, setSelectedIndustryCompanies] = useState<
    Company[] | null
  >([]);
  const [selectedIndustry, setSelectedIndustry] = useState("");
  const [totalCompanies, setTotalCompanies] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const authFetch = useAuthFetch();
  // const { authLoading } = useAuthTwo();

  // if (authLoading) {
  //   return <Loader />;
  // }

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await authFetch("companies", {
          method: "GET",
        });

        console.log("companies", res);
        setCompanies(res.companies);
        setTotalCompanies(res.totalCompanies);
        setSelectedIndustryCompanies(null);
      } catch (error) {
        console.error(error);
      }
    };
    fetchCompanies();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await authFetch("companies", {
        method: "POST",
        body: JSON.stringify({ company }),
      });
      setCompanies((prevCompanies) => [...prevCompanies, res.mainCompany]);
      setCompany("");
    } catch (error) {
      console.error(error);
      setError(formatError(error));
    } finally {
      setIsLoading(false);
    }
  };

  const showBusinesses = (industryName: string) => {
    setSelectedIndustry(industryName);
    const filteredCompanies = companies.filter(
      (comp) => comp.industry === industryName
    );
    setSelectedIndustryCompanies(filteredCompanies);
  };

  const industryData = companies.reduce((acc: any, curr: Company) => {
    if ((curr.favorite === true && !curr.onDashboard) || !curr.industry) {
      return acc;
    }
    const industry = curr.industry || "Unknown Industry";
    const industryIndex = acc.findIndex((ind: any) => ind.name === industry);

    if (industryIndex === -1) {
      acc.push({ name: industry, businessCount: 1 });
    } else {
      acc[industryIndex].businessCount++;
    }
    return acc;
  }, []);

  return (
    <div className="h-screen  overflow-scroll relative">
      {isLoading && <Loader />} {/* Show the loader when loading */}
      <form
        onSubmit={handleSubmit}
        className="w-full md:w-2/3 mx-auto p-6 bg-modern-gradient rounded-2xl shadow-lg"
      >
        <h2 className="text-center text-3xl font-bold text-gray-500 mb-8">
          Add New Company
        </h2>

        <div className="relative flex items-center bg-gray-900 rounded-full border border-gray-200 shadow-lg focus-within:ring-4 focus-within:ring-blue-500 transition duration-300">
          <input
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className="w-full p-4 pr-12 text-gray-300 bg-transparent rounded-lg focus:outline-none placeholder:-gray-400"
            placeholder="Enter company name"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-gray-900 to-blue-400 text-white p-2 rounded-full shadow-md hover:from-gray-700 hover:to-blue-400 transition-transform  hover:scale-110 duration-300"
          >
            <FiSend className="w-5 h-5" />
          </button>
        </div>

        {error && <p className="text-red-500 text-center mt-4">{error}</p>}
      </form>
      <div className="grid sm:grid-cols-1 lg:grid-cols-2 gap-4 p-6 w-full">
        <div className="bg-modern-gradient rounded-xl p-2 shadow-lg">
          <h2 className="text-xl font-medium ml-4  p-2">Industries</h2>
          <IndustryChart
            industryData={industryData}
            showBusinesses={showBusinesses}
          />
        </div>
        <div className="bg-modern-gradient rounded-xl p-2 shadow-lg">
          <h2 className="text-xl font-medium ml-4  p-2">
            Total Companies:<strong> {totalCompanies}</strong>
          </h2>

          <TotalCompaniesChart totalCompanies={totalCompanies} />
        </div>
      </div>
      {!selectedIndustryCompanies && (
        <>
          <div className="p-6 w-full  ">
            <h2 className="text-2xl font-medium p-2 text-center">
              Root Companies
            </h2>
            <RootCompanies
              companies={companies.filter((company) => !company.rootCompanyId)}
            />
          </div>
          <div className="p-6 w-full mt-2">
            <h2 className="text-2xl font-medium p-2 text-center">Favorites</h2>
            <RootCompanies
              companies={companies.filter((company) => company.favorite)}
            />
          </div>
        </>
      )}
      {selectedIndustryCompanies && (
        <div className="p-6 w-full">
          <div className="flex  items-center p-2">
            <h2 className="text-xl">{selectedIndustry} Companies</h2>

            <button
              onClick={() => setSelectedIndustryCompanies(null)}
              className="ml-4 bg-gradient-to-r from-gray-600 to-black text-white font-semibold px-8 py-3 rounded-full shadow-lg hover:shadow-2xl transform hover:scale-105 transition-transform duration-300 ease-in-out hover:bg-gray-800"
            >
              Show all companies
            </button>
          </div>
          <RootCompanies companies={selectedIndustryCompanies} />
        </div>
      )}
    </div>
  );
};

export default Dashboard;
