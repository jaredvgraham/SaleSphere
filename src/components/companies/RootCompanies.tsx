"use client";
import { useAuthFetch } from "@/hooks/privateFetch";
import { Company } from "@/types";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import AddFav from "./AddFav";

type Props = {
  companies: Company[];
};

const RootCompanies = ({ companies }: Props) => {
  const router = useRouter();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {companies?.map((company) => (
        <div
          key={company._id}
          className="bg-modern-gradient p-6 rounded-lg shadow-md hover:shadow-2xl hover:bg-blue-500 cursor-pointer transition-all duration-300 transform hover:-translate-y-1 border border-transparent hover:border-blue-500"
          onClick={() => router.push(`/company/${company._id}`)}
        >
          <div className="flex justify-between mb-2">
            <div className="flex flex-col ">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                {company.name}
              </h2>
              <p className="text-gray-600 mb-4">{company.industry}</p>

              {company.website && (
                <Link
                  href={company.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                  onClick={(e) => e.stopPropagation()}
                >
                  Visit Website
                </Link>
              )}
            </div>
            <div onClick={(e) => e.stopPropagation()}>
              <AddFav relatedCompany={company} size={20} />
            </div>
          </div>

          <div className="mt-4 text-right">
            <span className="text-blue-600 font-semibold hover:underline">
              View Details →
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RootCompanies;
