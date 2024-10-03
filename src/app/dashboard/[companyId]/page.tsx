"use client";

import CompanyPage from "@/components/companies/Company";
import { useParams } from "next/navigation";
import React from "react";

const Company = () => {
  const { companyId } = useParams();
  return <CompanyPage companyId={companyId as string} layerDeep={false} />;
};

export default Company;
