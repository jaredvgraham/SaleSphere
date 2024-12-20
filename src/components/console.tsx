"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import SalesEditor from "@/components/emailEditor";
import Loader from "@/components/loader"; // Import the loader
import { useCompany } from "@/hooks/companyContext";
import ContactCard from "./contactCard";

type Contact = {
  _id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  linkedIn: string;
};

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
  const [contacts, setContacts] = useState<Contact[] | null>(null);
  const [newContact, setNewContact] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    linkedIn: "",
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
        setContacts(data.contacts);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyData();
  }, [companyId]);

  const handleAddContact = async (e: React.FormEvent) => {
    e.preventDefault();
    // Handle adding the new contact
    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ newContact, companyId }),
    });

    const data = await response.json();
    const newContactt = {
      ...newContact,
      _id: data.id,
    };
    console.log("Id response", data);
    console.log("New contact: ", newContactt);
    setContacts((prev) => [...(prev as any), newContactt]);

    // Reset the form and close the add contact form
    setNewContact({
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
      linkedIn: "",
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
      {/* Hero Section */}
      <div className="relative bg-modern-gradient text-gray-300 py-12 mb-8 rounded-lg shadow-lg">
        <h1 className="text-5xl font-bold text-center">{companyData.name}</h1>
        <p className="py-4 text-gray-300 text-center text-xl">
          Build your lead with {companyData.name}
        </p>
      </div>

      {/* Summary Section (separated for more space) */}
      <div className="max-w-5xl mx-auto bg-alt border border-gray-700 shadow-xl rounded-3xl p-8 mb-8">
        <h2 className="text-3xl font-bold text-gray-300 mb-4">Summary</h2>
        <p className="text-gray-300 mb-4">
          {companyData.summary || "No summary available."}
        </p>
      </div>

      {/* Revenue and Key People Section */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-alt border border-gray-700 shadow-xl rounded-3xl p-8">
          <h2 className="text-2xl font-semibold text-gray-300 mb-2">Revenue</h2>
          <p className="text-green-400 mb-4">
            {companyData.revenue || "Revenue data unavailable."}
          </p>
        </div>
        <div className="bg-alt border border-gray-700 shadow-xl rounded-3xl p-8">
          <h2 className="text-2xl font-semibold text-gray-300 mb-2">
            Key People
          </h2>
          <p className="text-violet-300 mb-4">
            {companyData.keyPeople || "No key people information available."}
          </p>
        </div>
      </div>

      {/* Email Editor Section */}
      <div>{companyId && <SalesEditor companyId={companyId as string} />}</div>

      {/* Contacts Section */}
      <div className="bg-alt border border-gray-700 shadow-xl rounded-3xl p-8 mb-8 relative">
        <h2 className="text-3xl font-bold text-gray-300 mb-4">Contacts</h2>

        {/* Plus button to add contact */}
        <button
          className="absolute top-8 right-8 bg-alt border border-gray-300 hover:border-emerald-600 text-white rounded-full p-2 "
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
                  className="w-full p-2 bg-alt border border-gray-600 text-gray-100 rounded-lg focus:outline-none focus:border-emerald-600"
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
                  className="w-full p-2 bg-alt border border-gray-600 text-gray-100 rounded-lg focus:outline-none focus:border-emerald-600"
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
                  className="w-full p-2 bg-alt border border-gray-600 text-gray-100 rounded-lg focus:outline-none focus:border-emerald-600"
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
                  className="w-full p-2 bg-alt border border-gray-600 text-gray-100 rounded-lg focus:outline-none focus:border-emerald-600"
                />
              </div>
              <div>
                <input
                  type="url"
                  placeholder="LinkedIn Profile Link"
                  value={newContact.linkedIn}
                  onChange={(e) =>
                    setNewContact({ ...newContact, linkedIn: e.target.value })
                  }
                  className="w-full p-2 bg-alt border border-gray-600 text-gray-100 rounded-lg focus:outline-none focus:border-emerald-600"
                />
              </div>
              <button
                type="submit"
                className="bg-alt border border-gray-300 hover:border-emerald-600 text-white py-2 px-4 rounded-full shadow hover:bg-emerald-600"
              >
                Add Contact
              </button>
            </form>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
          {companyData.contacts ? (
            contacts?.map((contact: any, index: number) => (
              <ContactCard
                key={index}
                contact={contact}
                companyId={companyId as string}
              />
            ))
          ) : (
            <p className="text-gray-400">No contacts available.</p>
          )}
        </div>
      </div>

      {/* Notes Section */}
      <div className="bg-alt border border-gray-700 shadow-xl rounded-3xl p-8">
        <h2 className="text-3xl font-bold text-gray-300 mb-4">Notes</h2>
        <textarea
          placeholder="Add notes about the company..."
          className="w-full p-4 bg-alt border border-gray-600 text-gray-100 rounded-lg shadow-inner focus:outline-none focus:border-emerald-600"
        />
        <button className="mt-4 bg-alt border border-gray-300 text-white py-3 px-8 rounded-full shadow-lg hover:border-emerald-600">
          Save Notes
        </button>
      </div>
    </div>
  );
};

export default Console;
