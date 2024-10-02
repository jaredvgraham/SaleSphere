"use client";
import { useAuthFetch } from "@/hooks/privateFetch";
import { Company } from "@/types";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const CompanyPage = () => {
  const { companyId } = useParams();
  const authFetch = useAuthFetch();
  const [company, setCompany] = useState<Company>();
  useEffect(() => {
    try {
      const fetchCompany = async () => {
        const res = await authFetch(`companies/${companyId}`, {
          method: "GET",
        });
        console.log("company", res.company);
        setCompany(res.company);
      };
      fetchCompany();
    } catch (error) {
      console.error(error);
    }
  }, [companyId]);
  return (
    <div className="h-screen bg-white  overflow-scroll">
      <div className="bg-black">
        <h1 className="text-white">{company?.name}</h1>
      </div>
    </div>
  );
};

export default CompanyPage;
