import Loader from "@/components/loader";
import { useAuthFetch } from "@/hooks/privateFetch";
import { Company, User } from "@/types";
import { formatError } from "@/utils/formatErr";
import React, { useState } from "react";
import { FiSend } from "react-icons/fi";

type AddCompanyProps = {
  user: User;
  setCompanies: React.Dispatch<React.SetStateAction<Company[]>>;

  totalCompanies: number;
};

const AddCompany = ({
  user,
  setCompanies,

  totalCompanies,
}: AddCompanyProps) => {
  const authFetch = useAuthFetch();
  const [company, setCompany] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!company || !user?.maxCompanies) {
      setError("Company name cannot be empty");
      setSubmitting(false);
      return;
    }
    if (user?.maxCompanies <= totalCompanies) {
      setError("You have reached the maximum number of companies on your plan");
      setSubmitting(false);
      return;
    }
    setSubmitting(true);

    try {
      const res = await authFetch("companies", {
        method: "POST",
        body: JSON.stringify({ company }),
      });
      console.log("res", res);

      setCompanies((prevCompanies) => [...prevCompanies, res.mainCompany]);
      setCompany("");
      setSuccess(`${res.mainCompany.name} added successfully`);
    } catch (error) {
      console.error(error);
      setError(formatError(error));
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <form
      onSubmit={handleSubmit}
      className="w-full md:w-2/3 mx-auto p-6 bg-modern-gradient rounded-2xl shadow-lg  border-2 border-gray-300"
    >
      <h2 className="text-center text-3xl font-thin text-gray-300 mb-8">
        Add New Company
      </h2>

      <div className="relative flex items-center bg-transparent rounded-full border border-gray-200 shadow-lg focus-within:ring-4 focus-within:ring-blue-500 transition duration-300 ">
        <input
          type="text"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          className="p-4 pr-12 text-gray-300 bg-transparent rounded-lg focus:outline-none placeholder:-gray-300"
          placeholder="Enter company name"
          disabled={submitting}
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-black via-gray-950 to-blue-400 text-white p-2 rounded-full shadow-md hover:from-gray-700 hover:to-blue-400 transition-transform  hover:scale-110 duration-300"
        >
          <FiSend className="w-5 h-5" />
        </button>
      </div>

      {error && <p className="text-red-500 text-center mt-4">{error}</p>}
      {success && <p className="text-green-500 text-center mt-4">{success}</p>}
      {submitting && <Loader height="200px" />}
    </form>
  );
};

export default AddCompany;
