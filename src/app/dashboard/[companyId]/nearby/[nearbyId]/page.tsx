import React from "react";
import CompanyPage from "../../page";
import { useParams } from "next/navigation";

const NearbyCompanyPage = () => {
  const { companyId } = useParams();
  return <CompanyPage companyIdProp={companyId as string} />;
};

export default NearbyCompanyPage;
