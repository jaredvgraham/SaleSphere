"use client";
import { useAuthFetch } from "@/hooks/privateFetch";
import { Company } from "@/types";
import { useParams, usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

type Props = {
  companyIdProp: string;
};

const CompanyPage = ({ companyIdProp }: Props) => {
  const params = useParams();
  console.log("params", params);
  const companyId = companyIdProp || params.companyId;

  const authFetch = useAuthFetch();
  const [company, setCompany] = useState<Company>();
  const [relatedCompanies, setRelatedCompanies] = useState<Company[]>();
  const [nearbyCompanies, setNearbyCompanies] = useState<Company[]>();
  const router = useRouter();
  const pathname = usePathname();
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
            <div
              onClick={() => router.push(`${pathname}/related/${company._id}`)}
              key={company._id}
            >
              {company.name}
            </div>
          ))}
        </div>
        <h2 className="">Nearby Companies</h2>
        <div className="grid grid-cols-3 gap-4">
          {nearbyCompanies?.map((company) => (
            <div
              onClick={() => router.push(`${pathname}/nearby/${company._id}`)}
              key={company._id}
            >
              {company.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CompanyPage;
