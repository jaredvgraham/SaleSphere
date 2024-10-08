import { useAuthFetch } from "@/hooks/privateFetch";
import { Company } from "@/types";
import Link from "next/link";
import React, { useState } from "react";
import { FiStar } from "react-icons/fi";
import AddFav from "./AddFav";

type Props = {
  relatedCompany: Company;
  pathname: string;
};

const RelatedCard = ({ relatedCompany, pathname }: Props) => {
  const authFetch = useAuthFetch();

  console.log("relatedCompany", relatedCompany);

  return (
    <div
      key={relatedCompany._id}
      className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl cursor-pointer transition-shadow duration-300"
    >
      <div className="flex justify-between mb-2">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          {relatedCompany.name}
        </h3>
        <AddFav relatedCompany={relatedCompany} size={20} />
      </div>
      <div className="flex flex-col items-start mb-2">
        <p className="text-gray-700">
          Revenue: <strong>{relatedCompany.revenue}</strong>
        </p>
        <p className="text-gray-700">
          Employees: <strong>{relatedCompany.employeeCount}</strong>
        </p>
      </div>
      <div className="flex flex-col items-start mb-2">
        <Link
          className="text-blue-600 font-semibold hover:underline"
          href={`/company-details/${relatedCompany._id}`}
        >
          More Details →
        </Link>
        <Link
          className="text-blue-600 font-semibold hover:underline"
          href={`${pathname.split("related")[0]}/related/${relatedCompany._id}`}
        >
          More related to{" "}
          <strong className="text-gray-700">{relatedCompany.name}</strong> →
        </Link>
      </div>
    </div>
  );
};

export default RelatedCard;
