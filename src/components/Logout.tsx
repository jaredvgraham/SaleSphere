import { SignOutButton } from "@clerk/nextjs";
import React from "react";

const Logout = () => {
  return (
    <div className="bg-white">
      {" "}
      <SignOutButton />
    </div>
  );
};

export default Logout;
