import { SignOutButton } from "@clerk/nextjs";
import React from "react";
import { FiLogIn } from "react-icons/fi";

const Logout = () => {
  return (
    <div className=" flex items-center text-white">
      {" "}
      <SignOutButton>
        <FiLogIn className="w-5 h-5 mr-3" />
      </SignOutButton>
    </div>
  );
};

export default Logout;
