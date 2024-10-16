"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import SalesEditor from "@/components/emailEditor";
import Loader from "@/components/loader"; // Import the loader
import { useCompany } from "@/hooks/companyContext";

const Console = () => {
  const { companyId } = useParams(); // Fetch the company ID from the URL parameters
  const { setGlobalCompanyId } = useCompany();
  useEffect(() => {
    setGlobalCompanyId(companyId as string);
  }, [companyId]);
  const [companyData, setCompanyData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddContact, setShowAddContact] = useState(false); // New state for showing the form
  const [newContact, setNewContact] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    linkedin: "",
  }); // State for holding the new contact details

  useEffect(() => {
    // Fetch company data from the API
    const fetchCompanyData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/console/${companyId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch company data");
        }
        const data = await response.json();
        setCompanyData(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyData();
  }, [companyId]);

  const handleAddContact = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle adding the new contact
    // You can submit the newContact data to your API here

    // Reset the form and close the add contact form
    setNewContact({
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
      linkedin: "",
    });
    setShowAddContact(false);
  };

  if (loading) {
    return <Loader />; // Show the loader when data is being fetched
  }

  if (error) {
    return <p className="text-red-500 text-xl">{error}</p>;
  }

  if (!companyData) {
    return <p className="text-gray-500 text-xl">No company data found</p>;
  }

  return (
    <div className="h-[100%] p-8 overflow-scroll">
      <div className="shadow-xl rounded-3xl p-8 mb-8">
        <h1 className="text-4xl font-bold text-gray-300 mb-4">
          {companyData.name}
        </h1>
        <div>
          <SalesEditor companyId={companyId as string} />{" "}
          {/* Add the email editor */}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-semibold text-indigo-700 mb-2">
              Summary
            </h2>
            <p className="text-gray-300 mb-4">
              {companyData.summary || "No summary available."}
            </p>
            <h2 className="text-2xl font-semibold text-indigo-700 mb-2">
              Revenue
            </h2>
            <p className="text-gray-300 mb-4">
              {companyData.revenue || "Revenue data unavailable."}
            </p>
            <h2 className="text-2xl font-semibold text-indigo-700 mb-2">
              Key People
            </h2>
            <p className="text-gray-300 mb-4">
              {companyData.keyPeople || "No key people information available."}
            </p>
          </div>
        </div>
      </div>

      {/* Updated Contacts Section */}
      <div className="bg-alt border border-gray-700 shadow-xl rounded-3xl p-8 mb-8 relative">
        <h2 className="text-3xl font-bold text-gray-300 mb-4">Contacts</h2>

        {/* Plus button to add contact */}
        <button
          className="absolute top-8 right-8 bg-indigo-500 text-white rounded-full p-2 hover:bg-indigo-600"
          onClick={() => setShowAddContact(!showAddContact)}
        >
          +
        </button>

        {showAddContact && (
          <div className="bg-alt border border-gray-300 p-6 rounded-lg shadow-lg mt-6">
            <h3 className="text-xl font-semibold text-gray-300 mb-4">
              Add Contact
            </h3>
            <form onSubmit={handleAddContact} className="space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="First Name"
                  value={newContact.firstName}
                  onChange={(e) =>
                    setNewContact({ ...newContact, firstName: e.target.value })
                  }
                  className="w-full p-2 bg-alt border border-gray-700 text-gray-100 rounded-lg focus:outline-none"
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Last Name"
                  value={newContact.lastName}
                  onChange={(e) =>
                    setNewContact({ ...newContact, lastName: e.target.value })
                  }
                  className="w-full p-2 bg-alt border border-gray-700 text-gray-100 rounded-lg focus:outline-none"
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Phone Number"
                  value={newContact.phone}
                  onChange={(e) =>
                    setNewContact({ ...newContact, phone: e.target.value })
                  }
                  className="w-full p-2 bg-alt border border-gray-700 text-gray-100 rounded-lg focus:outline-none"
                />
              </div>
              <div>
                <input
                  type="email"
                  placeholder="Email"
                  value={newContact.email}
                  onChange={(e) =>
                    setNewContact({ ...newContact, email: e.target.value })
                  }
                  className="w-full p-2 bg-alt border border-gray-700 text-gray-100 rounded-lg focus:outline-none"
                />
              </div>
              <div>
                <input
                  type="url"
                  placeholder="LinkedIn Profile Link"
                  value={newContact.linkedin}
                  onChange={(e) =>
                    setNewContact({ ...newContact, linkedin: e.target.value })
                  }
                  className="w-full p-2 bg-alt border border-gray-700 text-gray-100 rounded-lg focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="bg-alt border border-gray-700 hover:border-blue-500 text-white py-2 px-4 rounded-full shadow"
              >
                Add Contact
              </button>
            </form>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
          {companyData.contacts ? (
            companyData.contacts.map((contact: any, index: number) => (
              <div
                key={index}
                className="bg-gray-800 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                <h3 className="text-xl font-semibold text-gray-100">
                  {contact.name}
                </h3>
                <p className="text-gray-400">Email: {contact.email}</p>
                <p className="text-gray-400">Phone: {contact.phone}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-400">No contacts available.</p>
          )}
        </div>
      </div>

      {/* Updated Notes Section */}
      <div className="bg-alt border border-gray-700 shadow-xl rounded-3xl p-8">
        <h2 className="text-3xl font-bold text-gray-300 mb-4">Notes</h2>
        <textarea
          placeholder="Add notes about the company..."
          className="w-full p-4 bg-alt border border-gray-700 text-gray-100 rounded-lg shadow-inner focus:outline-none focus:border-indigo-500"
        />
        <button className="mt-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 px-8 rounded-full shadow-lg hover:shadow-2xl transform hover:scale-105 transition-transform duration-300 ease-in-out">
          Save Notes
        </button>
      </div>
    </div>
  );
};

export default Console;
