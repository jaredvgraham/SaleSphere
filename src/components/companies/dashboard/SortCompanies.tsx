"use client";
import { Company } from "@/types";
import { useState } from "react";

type SortCompaniesProps = {
  companies: Company[];
  setCompanies: React.Dispatch<React.SetStateAction<Company[]>>;
};

const SortCompanies = ({ companies, setCompanies }: SortCompaniesProps) => {
  const [sortOption, setSortOption] = useState("Oldest");

  const handleSort = (option: string) => {
    let sortedArray = [...companies];
    if (option === "recent") {
      sortedArray.sort(
        (a, b) =>
          new Date(b.createdAt as Date).getTime() -
          new Date(a.createdAt as Date).getTime()
      );
    } else if (option === "alphabetical") {
      sortedArray.sort((a, b) => a.name.localeCompare(b.name));
    } else if (option === "oldest") {
      sortedArray.sort(
        (a, b) =>
          new Date(a.createdAt as Date).getTime() -
          new Date(b.createdAt as Date).getTime()
      );
    }

    setCompanies(sortedArray);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOption = e.target.value;
    setSortOption(selectedOption);
    handleSort(selectedOption);
  };

  return (
    <div className="absolute top-5 left-7">
      <label className="mr-2 font-semibold text-gray-500">Sort by:</label>
      <select
        value={sortOption}
        onChange={handleSortChange}
        className="border rounded p-2 bg-transparent text-gray-300"
      >
        <option value="oldest">Oldest</option>
        <option value="recent">Most Recent</option>
        <option value="alphabetical">Alphabetical</option>
      </select>
    </div>
  );
};

export default SortCompanies;
