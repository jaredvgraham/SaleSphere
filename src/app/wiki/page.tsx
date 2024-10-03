"use client";

import React, { useState } from "react";

const Page = () => {
  const [companyName, setCompanyName] = useState("");
  const [summary, setSummary] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSummary("");
    setError("");

    try {
      const response = await fetch("/api/wiki", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ companyName }),
      });

      const data = await response.json();

      if (response.ok) {
        setSummary(data.summary);
      } else {
        setError(data.error || "Something went wrong");
      }
    } catch (error) {
      setError("Failed to fetch company summary");
    }
  };

  return (
    <div>
      <h1>Company Summary Scraper</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          placeholder="Enter company name"
          required
        />
        <button type="submit">Get Summary</button>
      </form>

      {summary && (
        <div>
          <h2>Company Summary:</h2>
          <p>{summary}</p>
        </div>
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default Page;
