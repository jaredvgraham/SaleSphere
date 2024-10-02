"use client";
import { useAuthFetch } from "@/hooks/privateFetch";
import { Company } from "@/types";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const CompanyPage = () => {
  const { companyId } = useParams();
  const authFetch = useAuthFetch();
  const [company, setCompany] = useState<Company>();
  const [relatedCompanies, setRelatedCompanies] = useState<Company[]>();
  const [nearbyCompanies, setNearbyCompanies] = useState<Company[]>();
  useEffect(() => {
    try {
      const fetchCompany = async () => {
        const res = await authFetch(`companies/${companyId}`, {
          method: "GET",
        });
        console.log("company", res);
        setCompany(res.company);
        setRelatedCompanies(res.related);
        setNearbyCompanies(res.nearby);
      };
      fetchCompany();
    } catch (error) {
      console.error(error);
    }
  }, [companyId]);
  return (
    <div className="h-screen  overflow-scroll">
      <div className="">
        <h1 className="">{company?.name}</h1>
        <h2 className="">Related Companies</h2>
        <div className="grid grid-cols-3 gap-4">
          {relatedCompanies?.map((company) => (
            <div key={company._id}>{company.name}</div>
          ))}
        </div>
        <h2 className="">Nearby Companies</h2>
        <div className="grid grid-cols-3 gap-4">
          {nearbyCompanies?.map((company) => (
            <div key={company._id}>{company.name}</div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CompanyPage;
