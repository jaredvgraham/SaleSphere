"use client";
import React, { useEffect, useState } from "react";
import RootCompanies from "@/components/companies/allCompanies";
import LogoutButton from "@/components/logoutButton";
import { useAuthFetch } from "@/hooks/privateFetch";
import { Company } from "@/types";
import { useAuth } from "@clerk/nextjs";
import IndustryChart from "@/components/companies/dashboard/IndustryChart";
import TotalCompaniesChart from "@/components/companies/dashboard/TotalCompaniesChart";
// Import your chart component

const Dashboard = () => {
  const { userId } = useAuth();
  const [company, setCompany] = useState("");
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedIndustryCompanies, setSelectedIndustryCompanies] = useState<
    Company[] | null
  >([]);
  const [totalCompanies, setTotalCompanies] = useState(0);

  const authFetch = useAuthFetch();

  // Fetch companies from the API
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

  // Handle form submission to add a new company
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await authFetch("companies", {
        method: "POST",
        body: JSON.stringify({ company }),
      });
      setCompanies((prevCompanies) => [...prevCompanies, res.mainCompany]);
    } catch (error) {
      console.error(error);
    }
  };

  // Function to show businesses based on selected industry
  const showBusinesses = (industryName: string) => {
    const filteredCompanies = companies.filter(
      (comp) => comp.industry === industryName
    );
    setSelectedIndustryCompanies(filteredCompanies); // This will show businesses from the selected industry
  };

  // Prepare industry data for the IndustryChart component
  const industryData = companies.reduce((acc: any, curr: Company) => {
    const industry = curr.industry || "Unknown Industry";
    const industryIndex = acc.findIndex((ind: any) => ind.name === industry);

    if (industryIndex === -1) {
      // If the industry does not exist in the accumulator, add it
      acc.push({ name: industry, businessCount: 1 });
    } else {
      // Otherwise, increase the count for that industry
      acc[industryIndex].businessCount++;
    }
    return acc;
  }, []);

  return (
    <div className="h-screen bg-slate-50 overflow-scroll">
      <form
        onSubmit={handleSubmit}
        className="w-2/3 mx-auto p-6 rounded-3xl mt-10 shadow-xl bg-white"
      >
        <h2 className="text-center text-4xl text-gray-900 font-semibold mb-6 italic">
          <label htmlFor="company">Add new Company</label>
        </h2>
        <div className="flex items-center bg-gradient-to-r from-teal-200 via-blue-200 to-black rounded-full p-1">
          <input
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className="flex-grow bg-white text-gray-800 px-6 py-3 rounded-full focus:outline-none border-none shadow-sm"
            placeholder="Enter company name"
          />
          <button
            type="submit"
            className="ml-4 bg-gradient-to-r from-gray-600 to-black text-white font-semibold px-8 py-3 rounded-full shadow-lg hover:shadow-2xl transform hover:scale-105 transition-transform duration-300 ease-in-out hover:bg-gray-800"
          >
            Submit
          </button>
        </div>
      </form>

      <div className="grid grid-cols-2 gap-4 p-6 w-full">
        <div className="bg-white rounded-xl p-2">
          <h2 className="text-xl ml-4 italic p-2">Industries</h2>
          <IndustryChart
            industryData={industryData}
            showBusinesses={showBusinesses}
          />
        </div>
        <div className="bg-white rounded-xl p-2">
          <h2 className="text-xl ml-4 italic p-2">Total Companies</h2>

          <TotalCompaniesChart totalCompanies={totalCompanies} />
        </div>
      </div>

      <div className="p-6 w-full">
        <h2 className="text-xl">All Companies</h2>
        <RootCompanies companies={companies} />
      </div>

      {selectedIndustryCompanies && (
        <div className="p-6 w-full">
          <h2 className="text-xl">Selected Industry Companies</h2>
          <RootCompanies companies={selectedIndustryCompanies} />
        </div>
      )}
    </div>
  );
};

export default Dashboard;
