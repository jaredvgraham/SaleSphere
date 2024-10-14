"use client";
import { useAuthFetch } from "@/hooks/privateFetch";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const page = () => {
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
    getPortal();
  }, []);
  return <div>page</div>;
};

export default page;
