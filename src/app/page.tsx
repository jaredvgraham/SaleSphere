"use client";
import Image from "next/image";
import Dashboard from "./dashboard/page";
import { useAuthTwo } from "@/hooks/authContext";
import PricingPage from "./pricing/page";
import { ClerkLoaded, ClerkLoading, SignedIn, SignedOut } from "@clerk/nextjs";
import Loader from "@/components/loader";
import Landing from "./landing/page";

export default function Home() {
  const { user, authLoading } = useAuthTwo();
  console.log("user from home", user);
  if (authLoading) {
    return <div>Loading... Auth</div>;
  }

  return (
    <>
      <SignedIn>
        {user?.plan === "none" || !user?.plan ? <PricingPage /> : <Dashboard />}
      </SignedIn>
      <SignedOut>
        <Landing />
      </SignedOut>
    </>
  );
}
