"use client";
import LogoutButton from "@/components/logoutButton";
import { useAuth } from "@clerk/nextjs";
import React from "react";

const Dashboard = () => {
  const { userId } = useAuth();
  console.log("userId", userId);
  return (
    <div>
      Dashboard
      <br />
      user id: {userId}
      <LogoutButton />
    </div>
  );
};

export default Dashboard;
