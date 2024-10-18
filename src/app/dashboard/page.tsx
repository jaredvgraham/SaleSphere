"use client";
import React, { useEffect, useState } from "react";
import RootCompanies from "@/components/companies/RootCompanies";

import { useAuthFetch } from "@/hooks/privateFetch";
import { Company, User } from "@/types";
import { useAuth } from "@clerk/nextjs";
import IndustryChart from "@/components/companies/dashboard/IndustryChart";
import TotalCompaniesChart from "@/components/companies/dashboard/TotalCompaniesChart";
import Loader from "@/components/loader";
import { formatError } from "@/utils/formatErr";
import { useAuthTwo } from "@/hooks/authContext";
import { FiSend } from "react-icons/fi";
import MonthCompaniesChart from "@/components/companies/dashboard/MonthCompaniesChart";
import AddCompany from "@/components/companies/dashboard/AddCompany";
import SortCompanies from "@/components/companies/dashboard/SortCompanies";
// Import your chart component

const Dashboard = () => {
  const { userId } = useAuth();
  const { user } = useAuthTwo();
  const [company, setCompany] = useState("");
  const [companies, setCompanies] = useState<Company[]>([]);
  const [monthlyCompanies, setMonthlyCompanies] = useState<Company[]>([]);
  const [selectedIndustryCompanies, setSelectedIndustryCompanies] = useState<
    Company[] | null
  >([]);
  const [selectedIndustry, setSelectedIndustry] = useState("");
  const [totalCompanies, setTotalCompanies] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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
        setMonthlyCompanies(res.monthCompanies);
        setSelectedIndustryCompanies(null);
      } catch (error) {
        console.error(error);
      }
    };
    fetchCompanies();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!company || !user?.maxCompanies) {
      setError("Company name cannot be empty");
      setIsLoading(false);
      return;
    }
    if (user?.maxCompanies <= totalCompanies) {
      setError("You have reached the maximum number of companies on your plan");
      setIsLoading(false);
      return;
    }
    setIsLoading(true);

    try {
      const res = await authFetch("companies", {
        method: "POST",
        body: JSON.stringify({ company }),
      });
      console.log("res", res);

      setCompanies((prevCompanies) => [...prevCompanies, res.mainCompany]);
      setCompany("");
      setSuccess(`${res.mainCompany.name} added successfully`);
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
    <div className="h-[100%] w-[100%] overflow-y-scroll  p-3">
      {isLoading && <Loader />} {/* Show the loader when loading */}
      <div className=" p-6 w-full rounded-2xl ">
        <AddCompany
          setCompanies={setCompanies}
          totalCompanies={totalCompanies}
          user={user as User}
        />
        <div className="grid sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mt-6 w-full  rounded-3xl">
          <div className="bg-modern-gradient border-2 border-blue-400 rounded-xl p-2 shadow-lg w-full">
            <h2 className="text-xl  font-light text-gray-300  p-2">
              Industries
            </h2>
            <IndustryChart
              industryData={industryData}
              showBusinesses={showBusinesses}
            />
          </div>
          <div className="bg-modern-gradient border-2 border-green-400 rounded-xl p-2 shadow-lg w-full">
            <h2 className="text-xl text-gray-300 font-light  p-2">
              Total Companies:
              <strong className="text-gray-400"> {totalCompanies}</strong>
            </h2>

            <TotalCompaniesChart totalCompanies={totalCompanies} />
          </div>
          <div className="bg-modern-gradient border-2 border-teal-500 rounded-xl p-2 shadow-lg w-full">
            <h2 className="text-xl text-gray-300 font-light   p-2">
              Monthly Companies:
              <strong
                className={`${
                  monthlyCompanies.length >= (user as any)?.maxCompanies
                    ? "text-red-700"
                    : "text-gray-400"
                }`}
              >
                {" "}
                {monthlyCompanies.length}
              </strong>{" "}
              /<strong className="text-red-700"> {user?.maxCompanies}</strong>
            </h2>

            <MonthCompaniesChart totalCompanies={monthlyCompanies} />
          </div>
        </div>
      </div>
      {!selectedIndustryCompanies && (
        <>
          <div className="p-6 relative   ">
            <SortCompanies companies={companies} setCompanies={setCompanies} />
            <h2 className="text-2xl text-gray-300 font-medium p-2 text-center">
              Root Companies
            </h2>
            <RootCompanies
              companies={companies.filter((company) => !company.rootCompanyId)}
            />
          </div>
          <div className="p-6  mt-2">
            <h2 className="text-2xl font-medium text-gray-300 p-2 text-center">
              Favorites
            </h2>
            <RootCompanies
              companies={companies.filter((company) => company.favorite)}
            />
          </div>
        </>
      )}
      {selectedIndustryCompanies && (
        <div className="p-6 ">
          <div className="flex  items-center p-2">
            <h2 className="text-2xl font-medium text-gray-300 p-2 text-center">
              {selectedIndustry} Companies
            </h2>

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
