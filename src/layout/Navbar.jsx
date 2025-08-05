import React from "react";
import { Menu } from "lucide-react";

const Navbar = ({ toggleSidebar }) => {
  return (
    <header className="flex items-center justify-between bg-white px-4 py-3 shadow-md sticky top-0 z-30">
      {/* Hamburger button for mobile */}
      <button
        onClick={toggleSidebar}
        className="md:hidden p-2 rounded hover:bg-gray-200 focus:outline-none"
        aria-label="Toggle sidebar"
      >
        <Menu className="w-6 h-6 text-gray-700" />
      </button>

      <h1 className="text-xl font-semibold text-gray-900">Blood Bank Dashboard</h1>

      {/* User avatar placeholder */}
      <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-bold select-none">
        U
      </div>
    </header>
  );
};

export default Navbar;
