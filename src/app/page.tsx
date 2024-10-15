"use client";
import Image from "next/image";
import Dashboard from "./dashboard/page";
import { useAuthTwo } from "@/hooks/authContext";
import PricingPage from "./pricing/page";

export default function Home() {
  const { user } = useAuthTwo();
  return (
    <>
      {user?.plan === "none" ? (
        <PricingPage upgrade={null} currentPlanProp={null} />
      ) : (
        <Dashboard />
      )}
    </>
  );
}
