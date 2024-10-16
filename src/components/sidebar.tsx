"use client";
import { AuthProvider, useAuthTwo } from "@/hooks/authContext";
import { useCompany } from "@/hooks/companyContext";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import React, { useState } from "react";
import { FiHome, FiMail } from "react-icons/fi"; // Using react-icons for icons

type SidebarProps = {
  companyId?: string;
  path?: string;
};

const Sidebar = ({ path }: SidebarProps) => {
  const [pathName, setPathName] = useState(path || "/dashboard");
  const { user } = useAuthTwo();
  console.log("user", user);
  const { globalCompanyId } = useCompany();

  const pathname = usePathname();

  const isDashboard = pathname === "/" || pathname === "/dashboard";

  const dashboardLinks = [
    {
      name: "Your Company",
      icon: <FiHome className="w-5 h-5 mr-3" />,
      link: "/user-company",
    },
  ];

  const companyLinks = [
    {
      name: "Company",
      icon: <FiHome className="w-5 h-5 mr-3" />,
      link: `/company/${globalCompanyId}`,
    },
    {
      name: "Company Details",
      icon: <FiMail className="w-5 h-5 mr-3" />,
      link: `/company-details/${globalCompanyId}`,
    },
    {
      name: "Console",
      icon: <FiMail className="w-5 h-5 mr-3" />,
      link: `/console/${globalCompanyId}`,
    },
  ];

  return (
    <aside className="w-64 h-[94vh] shadow-lg hidden lg:block relative border-r-2">
      {/* Logo Section */}
      <div className="flex items-center justify-center h-20 border-b-2 ">
        <h1 className="text-3xl font-semibold text-black">Logo</h1>
      </div>

      {/* Navigation Section */}
      <nav className="mt-10">
        <ul className="space-y-4">
          <li className="p-2">
            <Link href="/">
              <div
                className={`flex items-center  hover:bg-gray-950 hover:text-white rounded-md p-3 cursor-pointer transition-colors duration-300 ${
                  isDashboard ? "bg-black text-white" : "text-gray-200"
                }`}
              >
                <FiHome className="w-5 h-5 mr-3" />
                <span className="text-lg">Dashboard</span>
              </div>
            </Link>
          </li>
          {/* Dynamically map through dashboardLinks */}
          {pathname === "/" ||
          pathname === "/dashboard" ||
          pathname === "/user-company"
            ? dashboardLinks.map((link, index) => (
                <li key={index} className="p-2">
                  <Link href={link.link}>
                    <div
                      className={`flex items-center  hover:bg-gray-950 hover:text-white rounded-md p-3 cursor-pointer transition-colors duration-300 ${
                        pathname.includes(link.link)
                          ? "bg-black text-white"
                          : "text-gray-200"
                      }`}
                    >
                      {link.icon}
                      <span className="text-lg">{link.name}</span>
                    </div>
                  </Link>
                </li>
              ))
            : companyLinks.map((link, index) => (
                <li key={index} className="p-2">
                  <Link href={link.link}>
                    <div
                      className={`flex items-center  hover:bg-gray-950 hover:text-white rounded-md p-3 cursor-pointer transition-colors duration-300  ${
                        pathname.includes(link.link)
                          ? "bg-black text-white"
                          : "text-gray-200"
                      }`}
                    >
                      {link.icon}
                      <span className="text-lg">{link.name}</span>
                    </div>
                  </Link>
                </li>
              ))}

          {/* Dynamically map through companyLinks if companyId is provided */}
        </ul>
        {/* Settings Link */}
        <div className="absolute bottom-6 w-full  ">
          <Link href="/settings">
            <div className="flex justify-center  hover:bg-gray-700 hover:text-white rounded-md p-3 cursor-pointer transition-colors duration-300 ">
              <span className="text-lg text-gray-100">Settings</span>
            </div>
          </Link>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
