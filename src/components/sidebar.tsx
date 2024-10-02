import React from "react";
//tailwind sidebarr

const Sidebar = () => {
  return (
    <aside className="w-64 bg-gray-800 h-full">
      <div className="flex items-center justify-center h-16 bg-gray-900 text-white">
        <h1 className="text-2xl">Sidebar</h1>
      </div>
      <nav>
        <ul>
          <li>
            <a
              href="#"
              className="block text-white hover:bg-gray-700 px-6 py-3"
            >
              Home
            </a>
          </li>
          <li>
            <a
              href="#"
              className="block text-white hover:bg-gray-700 px-6 py-3"
            >
              About
            </a>
          </li>
          <li>
            <a
              href="#"
              className="block text-white hover:bg-gray-700 px-6 py-3"
            >
              Services
            </a>
          </li>
          <li>
            <a
              href="#"
              className="block text-white hover:bg-gray-700 px-6 py-3"
            >
              Contact
            </a>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
