import React from "react";

const Navbar = () => {
  return (
    <nav className="border-b  border-gray-200 ">
      <div className=" flex items-center justify-evenly h-16">
        <a
          href="#"
          className=" text-gray-100 hover:bg-gray-500 px-3 py-2 rounded-md text-sm font-medium"
        >
          Dashboard
        </a>
        <a
          href="#"
          className="text-gray-100 hover:bg-gray-500 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
        >
          Team
        </a>
        <a
          href="#"
          className="text-gray-100 hover:bg-gray-500 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
        >
          Projects
        </a>
        <a
          href="#"
          className="text-gray-100 hover:bg-gray-500 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
        >
          Calendar
        </a>
      </div>
    </nav>
  );
};

export default Navbar;
