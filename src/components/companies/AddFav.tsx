import { useAuthFetch } from "@/hooks/privateFetch";
import { Company } from "@/types";
import React, { useState } from "react";
import { FiStar } from "react-icons/fi";

type Props = {
  relatedCompany: Company;
  size?: number;
};

const AddFav = ({ relatedCompany, size }: Props) => {
  const authFetch = useAuthFetch();
  const [isFavoriting, setIsFavoriting] = useState(false);
  console.log("relatedCompany wit id", relatedCompany);
  console.log("isfav", relatedCompany.favorite);

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
    <FiStar
      className={` cursor-pointer  ${
        relatedCompany.favorite ? "text-yellow-500" : "text-gray-400"
      } transition-transform duration-300 ${
        isFavoriting ? "animate-ping" : ""
      }`}
      size={size}
      onClick={() => handleFavClick(relatedCompany._id)}
    />
  );
};

export default AddFav;
