import Link from "next/link";
import React from "react";
import { FiHome, FiMail } from "react-icons/fi"; // Using react-icons for icons

const Sidebar = () => {
  return (
    <aside className="w-64 h-full bg-black shadow-lg">
      {/* Logo Section */}
      <div className="flex items-center justify-center h-20 bg-black">
        <h1 className="text-3xl font-semibold text-white">Logo</h1>
      </div>

      {/* Navigation Section */}
      <nav className="mt-10">
        <ul className="space-y-4">
          {/* Dashboard Link */}
          <li className="p-2">
            <Link href="/">
              <div className="flex items-center text-gray-300 hover:bg-gray-700 hover:text-white rounded-md p-3 cursor-pointer transition-colors duration-300">
                <FiHome className="w-5 h-5 mr-3" />
                <span className="text-lg">Dashboard</span>
              </div>
            </Link>
          </li>

          {/* Email Editor Link */}
          <li className="p-2">
            <Link href="/email-editor">
              <div className="flex items-center text-gray-300 hover:bg-gray-700 hover:text-white rounded-md p-3 cursor-pointer transition-colors duration-300">
                <FiMail className="w-5 h-5 mr-3" />
                <span className="text-lg">Email Editor</span>
              </div>
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
