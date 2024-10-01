"use client";
import LogoutButton from "@/components/logoutButton";
import { useAuth, useUser } from "@clerk/nextjs";
import React from "react";

const Dashboard = () => {
  const { userId } = useAuth();
  const { user } = useUser();
  console.log("userId", userId);
  console.log("user", user);
  return (
    <div>
      Dashboard
      <br />
      user id: {userId}
      <LogoutButton />
    </div>
  );
};
//
export default Dashboard;
