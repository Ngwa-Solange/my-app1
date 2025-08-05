import React from "react";
import { BarChart, LineChart, Droplet, ShieldAlert } from "lucide-react";

const Sidebar = ({ isOpen }) => {
  return (
    <aside
      className={`
        fixed top-0 left-0 z-40 h-full w-64 bg-white shadow-md transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0
      `}
    >
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 select-none">🩸 Blood Bank</h2>
      </div>
      <nav className="flex flex-col mt-6 px-4 space-y-3 text-gray-700">
        <a
          href="/"
          className="flex items-center gap-3 py-3 px-4 rounded-md hover:bg-blue-100 hover:text-blue-700 font-semibold"
        >
          <BarChart className="w-5 h-5" />
          Dashboard
        </a>
        <a
          href="/stock"
          className="flex items-center gap-3 py-3 px-4 rounded-md hover:bg-blue-100 hover:text-blue-700 font-semibold"
        >
          <LineChart className="w-5 h-5" />
          Stock Over Time
        </a>
        <a
          href="/frequency"
          className="flex items-center gap-3 py-3 px-4 rounded-md hover:bg-blue-100 hover:text-blue-700 font-semibold"
        >
          <Droplet className="w-5 h-5" />
          Donation Frequency
        </a>
        <a
          href="/expiry"
          className="flex items-center gap-3 py-3 px-4 rounded-md hover:bg-blue-100 hover:text-blue-700 font-semibold"
        >
          <ShieldAlert className="w-5 h-5" />
          Expiry Predictor
        </a>
      </nav>
    </aside>
  );
};

export default Sidebar;
