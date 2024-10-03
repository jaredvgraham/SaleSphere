import React from "react";
import CompanyPage from "@/components/companies/Company";
import { useParams } from "next/navigation";

const NearbyCompanyPage = () => {
  const { companyId } = useParams();
  return <CompanyPage companyId={companyId as string} layerDeep={true} />;
};

export default NearbyCompanyPage;
