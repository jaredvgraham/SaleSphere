"use client";
import { useAuthFetch } from "@/hooks/privateFetch";
import { Company } from "@/types";
import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Loader from "../loader";
import { set } from "mongoose";
import RelatedCard from "./RelatedCard";
import AddFav from "./AddFav";

type Props = {
  companyId: string;
  layerDeep: boolean;
};

const CompanyPage = ({ companyId, layerDeep }: Props) => {
  const [company, setCompany] = useState<Company | null>(null);
  const [relatedCompanies, setRelatedCompanies] = useState<Company[]>([]);
  const [nearbyCompanies, setNearbyCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [userPlan, setUserPlan] = useState(false);

  const authFetch = useAuthFetch();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        console.log("Fetching company with companyId:", companyId);

        const res = await authFetch(`companies/${companyId}`, {
          method: "GET",
        });

        setCompany(res.company);

        setRelatedCompanies(res.related);

        setNearbyCompanies(res.nearby);
        console.log("res.userPlan", res.userPlan);

        if (!res.company.rootCompanyId) {
          setUserPlan(true);
        } else {
          setUserPlan(res.userPlan);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching company:", error);
      }
    };

    fetchCompany();
  }, [companyId]); // Dependency array updated

  const handleGetMoreRelatedCompanies = async () => {
    setLoading(true);
    try {
      const res = await authFetch(`companies/${companyId}/related`, {
        method: "GET",
      });
      setRelatedCompanies(res.related);
      setNearbyCompanies(res.nearby);
      console.log("related", res.related);
      console.log("nearby", res.nearby);

      setLoading(false);
    } catch (error) {
      console.error("Error fetching more related companies:", error);
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="h-screen overflow-scroll bg-gray-50 p-8">
      {/* Company Information Section */}
      <div className="bg-modern-gradient shadow-md rounded-lg p-8 mb-10 flex justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            {company?.name}
          </h1>
          <p className="text-lg text-gray-600 mb-4">
            <span className="font-semibold">Website:</span>{" "}
            <a
              href={company?.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              {company?.website}
            </a>
          </p>

          <h2 className="text-lg font-semibold text-gray-600 mb-4">
            Revenue: {company?.revenue || "Not available"}
          </h2>
          <h2 className="text-lg font-semibold text-gray-600 mb-4">
            Employee Count: {company?.employeeCount || "Not available"}
          </h2>
        </div>
        <div>
          <div className="flex justify-end  p-4">
            <AddFav relatedCompany={company as Company} size={60} />
          </div>
        </div>
      </div>

      {/* Related Companies Section */}
      <div className="mb-10">
        <div className="flex justify-between mb-2">
          <h2 className="text-2xl font-semibold text-gray-800  ">
            Related Companies
          </h2>
          <button
            className="p-2 bg-black text-white rounded-xl"
            onClick={handleGetMoreRelatedCompanies}
          >
            Get more related companies
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {relatedCompanies.map((relatedCompany) => (
            <RelatedCard
              key={relatedCompany._id}
              relatedCompany={relatedCompany}
              pathname={pathname}
              userPlan={userPlan}
            />
          ))}
        </div>
      </div>

      {/* Nearby Companies Section */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Nearby Companies
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {nearbyCompanies.map((nearbyCompany) => (
            <div
              key={nearbyCompany._id}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl cursor-pointer transition-shadow duration-300"
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {nearbyCompany.name}
              </h3>
              <div className="flex flex-col items-start  mb-2">
                <Link
                  className="text-blue-600 font-semibold hover:underline"
                  href={`/company-details/${nearbyCompany._id}`}
                >
                  More Details →
                </Link>
                {!layerDeep && (
                  <button
                    className="text-blue-600 font-semibold hover:underline"
                    onClick={() =>
                      router.push(`${pathname}/nearby/${nearbyCompany._id}`)
                    }
                  >
                    More related to{" "}
                    <strong className="text-gray-700">
                      {nearbyCompany.name}
                    </strong>{" "}
                    →
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CompanyPage;
