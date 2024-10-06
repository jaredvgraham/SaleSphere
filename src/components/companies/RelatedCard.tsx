import { useAuthFetch } from "@/hooks/privateFetch";
import { Company } from "@/types";
import Link from "next/link";
import React, { useState } from "react";
import { FiStar } from "react-icons/fi";

type Props = {
  relatedCompany: Company;
  pathname: string;
};

const RelatedCard = ({ relatedCompany, pathname }: Props) => {
  const authFetch = useAuthFetch();
  const [isFavoriting, setIsFavoriting] = useState(false);
  console.log("relatedCompany", relatedCompany);

  const handleFavClick = async (companyId: string) => {
    console.log("fav clicked");
    console.log("companyId", companyId);
    console.log("relatedCompany", relatedCompany);

    setIsFavoriting(true);
    if (relatedCompany.favorite === true) {
      await authFetch(`add-favorite`, {
        method: "PUT",
        body: JSON.stringify({ companyId }),
      });
      relatedCompany.favorite = false;
    } else {
      await authFetch(`add-favorite`, {
        method: "POST",
        body: JSON.stringify({ companyId }),
      });
      relatedCompany.favorite = true;
    }
    setIsFavoriting(false);
  };

  return (
    <div
      key={relatedCompany._id}
      className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl cursor-pointer transition-shadow duration-300"
    >
      <div className="flex justify-between mb-2">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          {relatedCompany.name}
        </h3>
        <FiStar
          className={`${
            relatedCompany.favorite ? "text-yellow-500" : "text-gray-400"
          } transition-transform duration-300 ${
            isFavoriting ? "animate-ping" : ""
          }`}
          onClick={() => handleFavClick(relatedCompany._id)}
        />
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
