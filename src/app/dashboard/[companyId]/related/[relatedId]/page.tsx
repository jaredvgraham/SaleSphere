"use client";
import { useParams } from "next/navigation";
import React from "react";
import CompanyPage from "@/components/companies/Company";

const RelatedCompanyPage = () => {
  const { relatedId } = useParams();
  return <CompanyPage companyId={relatedId as string} />;
};

export default RelatedCompanyPage;
