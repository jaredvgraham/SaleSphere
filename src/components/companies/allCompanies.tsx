"use client";
import { useAuthFetch } from "@/hooks/privateFetch";
import { ICompany } from "@/models/companyModel";
import { Company } from "@/types";
import React, { useEffect, useState } from "react";

const AllCompanies = () => {
  const authFetch = useAuthFetch();
  const [companies, setCompanies] = useState<Company[]>([]);
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await authFetch("companies", {
          method: "GET",
        });
        console.log("data", res);
        setCompanies(res.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchCompanies();
  }, []);

  return (
    <div className="grid grid-cols-3 gap-4">
      {companies?.map((company) => (
        <div key={company._id}>{company.name}</div>
      ))}
    </div>
  );
};

export default AllCompanies;
