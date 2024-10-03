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
  const [company, setCompany] = useState<Company | null>(null);
  const [relatedCompanies, setRelatedCompanies] = useState<Company[]>([]);
  const [nearbyCompanies, setNearbyCompanies] = useState<Company[]>([]);

  const authFetch = useAuthFetch();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const companyId = companyIdProp ? companyIdProp : params.companyId;
    console.log("companyId selected:", companyId);

    if (!companyId) return; // Ensure companyId is available

    const fetchCompany = async () => {
      try {
        console.log("Fetching company with companyId:", companyId);

        const res = await authFetch(`companies/${companyId}`, {
          method: "GET",
        });
        console.log("Fetched company data:", res);
        setCompany(res.company);
        setRelatedCompanies(res.related);
        setNearbyCompanies(res.nearby);
      } catch (error) {
        console.error("Error fetching company:", error);
      }
    };

    fetchCompany();
  }, [companyIdProp, params.companyId]); // Dependency array updated

  return (
    <div className="h-screen overflow-scroll">
      <div>
        <h1>{company?.name}</h1>
        <h2>Related Companies</h2>
        <div className="grid grid-cols-3 gap-4">
          {relatedCompanies.map((company) => (
            <div
              onClick={() => router.push(`${pathname}/related/${company._id}`)}
              key={company._id}
            >
              {company.name}
            </div>
          ))}
        </div>
        <h2>Nearby Companies</h2>
        <div className="grid grid-cols-3 gap-4">
          {nearbyCompanies.map((company) => (
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
