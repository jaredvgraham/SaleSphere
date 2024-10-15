"use client";
import { useAuthFetch } from "@/hooks/privateFetch";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const Page = () => {
  const authFetch = useAuthFetch();
  const router = useRouter();
  useEffect(() => {
    const getPortal = async () => {
      try {
        const res = await authFetch("stripe/portal", {
          method: "GET",
        });
        console.log("portal", res.url);
        router.push(res.url);
      } catch (error) {
        console.error(error);
      }
    };
  }, []);

  const cancelSubscription = async () => {
    try {
      const res = await authFetch("stripe/cancel", {
        method: "POST",
      });
      console.log("cancel subscription", res);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div>
      <button onClick={cancelSubscription}>Cancel Subscription</button>
    </div>
  );
};

export default Page;
