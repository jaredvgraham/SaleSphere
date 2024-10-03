"use client";
import { useParams } from "next/navigation";
import React from "react";
import CompanyPage from "../../page";

const RelatedCompanyPage = () => {
  const { companyId } = useParams();
  return <CompanyPage companyIdProp={companyId as string} />;
};

export default RelatedCompanyPage;
