"use client";

import React, { useState } from "react";
import { FaTrashAlt } from "react-icons/fa"; // Trashcan icon from react-icons

interface ContactCardProps {
  contact: {
    _id: string;
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    linkedIn: string;
  };
  companyId: string;
}

const ContactCard: React.FC<ContactCardProps> = ({ contact, companyId }) => {
  const [isDeleted, setIsDeleted] = useState(false); // Track if the contact is deleted
  const [error, setError] = useState<string | null>(null); // Error state

  const handleDelete = async () => {
    try {
      // Verify if companyId and contact._id are being passed correctly
      console.log(
        "Deleting contact with ID:",
        contact._id,
        "for company:",
        companyId
      );

      const response = await fetch(`/api/contact`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyId, contactId: contact._id }), // Correctly passing companyId and contactId
      });

      if (response.ok) {
        setIsDeleted(true); // Mark contact as deleted
      } else {
        const errMessage = await response.json();
        setError(`Failed to delete contact: ${errMessage.error}`);
      }
    } catch (error) {
      console.error("Error deleting contact:", error);
      setError("An error occurred while deleting the contact.");
    }
  };

  // Don't render the card if it's deleted
  if (isDeleted) return null;

  return (
    <div className="relative bg-alt border border-gray-600 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
      {/* Trashcan Icon */}
      <button
        onClick={handleDelete}
        className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition-colors"
        aria-label="Delete Contact"
      >
        <FaTrashAlt size={20} />
      </button>

      {/* Contact Details */}
      <h3 className="text-xl font-semibold text-gray-100">
        {contact.firstName} {contact.lastName}
      </h3>
      <p className="text-gray-400">Phone: {contact.phone}</p>
      <p className="text-gray-400">Email: {contact.email}</p>

      {/* LinkedIn Link */}
      {contact.linkedIn && (
        <a
          href={contact.linkedIn}
          target="_blank"
          rel="noopener noreferrer"
          className="text-emerald-400 hover:text-emerald-600 transition-colors"
        >
          LinkedIn: {contact.linkedIn}
        </a>
      )}

      {/* Error Message */}
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
};

export default ContactCard;
