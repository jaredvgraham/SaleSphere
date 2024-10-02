"use client";
import AllCompanies from "@/components/companies/allCompanies";
import LogoutButton from "@/components/logoutButton";
import { useAuthFetch } from "@/hooks/privateFetch";
import { Company } from "@/types";
import { useAuth, useSession, useUser } from "@clerk/nextjs";
import React, { useEffect, useState } from "react";

const Dashboard = () => {
  const { userId } = useAuth();
  const [company, setCompany] = useState("");
  const [companies, setCompanies] = useState<Company[]>([]);

  const authFetch = useAuthFetch();

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await authFetch("companies", {
          method: "GET",
        });

        console.log("companies", res);

        setCompanies(res.companies);
      } catch (error) {
        console.error(error);
      }
    };
    fetchCompanies();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await authFetch("companies", {
        method: "POST",
        body: JSON.stringify({ company }),
      });
      console.log("data", res);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="max-h-screen  overflow-scroll">
      <h1>Dashboard</h1>
      <br />
      user id: {userId}
      <LogoutButton />
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        />
        <button type="submit">Submit</button>
      </form>
      <AllCompanies companies={companies} />
    </div>
  );
};
//
export default Dashboard;
