"use client";
import { useAuthFetch } from "@/hooks/privateFetch";
import { ICompany } from "@/models/companyModel";
import { Company } from "@/types";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

type Props = {
  companies: Company[];
};

const RootCompanies = ({ companies }: Props) => {
  const authFetch = useAuthFetch();
  console.log("companies from all companies", companies);
  const router = useRouter();

  return (
    <div className="grid grid-cols-3 gap-4">
      {companies?.map((company) => (
        <div
          onClick={() => router.push(`/dashboard/${company._id}`)}
          key={company._id}
        >
          <h2 className=" cursor-pointer"> {company.name}</h2>
        </div>
      ))}
    </div>
  );
};

export default RootCompanies;
