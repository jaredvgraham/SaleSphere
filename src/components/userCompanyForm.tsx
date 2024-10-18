"use client";
import React, { useState, useEffect } from "react";
import Loader from "@/components/loader";
import { set } from "mongoose";

interface FormData {
  name: string;
  industry: string;
  productOrService: string;
  website: string;
  ceo: string;
}

const AddCompany: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    industry: "",
    productOrService: "",
    website: "",
    ceo: "",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchCompanyData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/user-company", {
          method: "GET",
        });

        if (response.ok) {
          const { userCompany } = await response.json();
          console.log("Fetched company data:", userCompany);

          // Populate form fields with data from userCompany
          setFormData({
            name: userCompany.name || "",
            industry: userCompany.industry || "",
            productOrService: userCompany.productOrService || "",
            website: userCompany.website || "",
            ceo: userCompany.ceo || "",
          });
          setSuccess("Your Company.");
        } else {
          console.error(
            "Failed to fetch company data.",
            response.status,
            response.statusText
          );
        }
      } catch (error: any) {
        console.error(
          "Error fetching company data:",
          error.message,
          error.stack
        );
        setError("Error fetching company data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompanyData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch("/api/user-company", {
        method: "POST",
        body: JSON.stringify(formData),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        console.log(response);
      }
      console.log("response: ", response);
      setSuccess("Company saved successfully.");
    } catch (error) {
      console.error("Error saving company:", error);
      setError("Error saving company.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen overflow-scroll flex justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className="w-2/3 mx-auto p-6 rounded-3xl shadow-xl bg-alt border border-gray-300"
      >
        {isLoading && <Loader height="100px " />}
        <h2 className="text-center text-4xl text-gray-300 font-semibold mb-2 italic">
          Tell Us About Your Company
        </h2>
        {error && <div className="text-red-500 p-1 text-center">{error}</div>}
        {success && (
          <div className="text-green-500 p-1 text-center">{success}</div>
        )}
        <div className="flex flex-col space-y-4">
          {[
            { field: "name", label: "company-name" },
            { field: "industry", label: "industry" },
            { field: "productOrService", label: "product/service" },
            { field: "website", label: "website" },
            { field: "ceo", label: "ceo" },
          ].map(({ field, label }) => (
            <input
              key={field}
              type="text"
              name={field}
              value={formData[field as keyof FormData]} // Bind value directly to state
              onChange={handleChange}
              className="flex-grow bg-alt border border-gray-300 focus:border-emerald-600 text-gray-300 px-6 py-3 rounded-full focus:outline-none shadow-sm"
              placeholder={`Enter ${label}`}
            />
          ))}
          <button
            type="submit"
            className="mt-4 bg-gradient-to-r from-gray-600 to-black text-white font-semibold px-8 py-3 rounded-full shadow-lg hover:shadow-2xl transform hover:scale-105 transition-transform duration-300 ease-in-out"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCompany;
