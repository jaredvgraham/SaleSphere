"use client";
import Link from "next/link";
import React from "react";
import Logout from "./Logout";
import { usePathname } from "next/navigation";
import { useAuth } from "@clerk/nextjs";

const Navbar = () => {
  const pathname = usePathname();
  const { userId } = useAuth();
  if (!userId || pathname === "/") {
    return null;
  }
  return (
    <nav className="border-b  border-gray-200 ">
      <div className=" flex items-center justify-evenly h-16">
        <Link
          href="/"
          className=" text-gray-100 hover:bg-gray-500 px-3 py-2 rounded-md
          text-sm font-medium"
        >
          Dashboard
        </Link>
        <Link
          href={"/user-company"}
          className=" text-gray-100 hover:bg-gray-500 px-3 py-2 rounded-md
          text-sm font-medium"
        >
          User Company
        </Link>
        <Logout />
      </div>
    </nav>
  );
};

export default Navbar;
