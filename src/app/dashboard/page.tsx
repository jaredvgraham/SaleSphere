"use client";
import LogoutButton from "@/components/logoutButton";
import { useAuth, useSession, useUser } from "@clerk/nextjs";
import React, { useState } from "react";

const Dashboard = () => {
  const { userId } = useAuth();
  const { user } = useUser();
  const [company, setCompany] = useState("");
  const { session } = useSession();
  const token = session?.getToken();
  console.log("token", token);

  return (
    <div>
      Dashboard
      <br />
      user id: {userId}
      <LogoutButton />
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          console.log("company", company);
        }}
      >
        <input
          type="text"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};
//
export default Dashboard;
