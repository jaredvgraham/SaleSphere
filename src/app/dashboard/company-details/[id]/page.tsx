"use client";
import { useParams } from "next/navigation";
import React from "react";

const CompanyDetails = () => {
  const { id } = useParams();
  console.log(id);

  return <div>CompanyDetails</div>;
};

export default CompanyDetails;
