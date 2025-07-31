// src/layout/Sidebar.jsx
import React from "react";
import { Home, Users, BarChart2 } from "lucide-react";
import { NavLink } from "react-router-dom";

export default function Sidebar({ isOpen, setIsOpen }) {
  return (
    <aside
      className={`
        fixed top-0 left-0 z-40 h-full w-64 bg-[#0e1629] text-white shadow-md 
        transform transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0 md:static md:block
      `}
    >
      <div className="text-2xl font-bold p-6 flex justify-between items-center">
        <span>
          Admin<span className="text-blue-500">Pro</span>
        </span>
        {/* Close btn for mobile */}
        <button
          onClick={() => setIsOpen(false)}
          className="md:hidden text-white text-xl"
        >
          ✕
        </button>
      </div>
      <nav className="px-4">
        <ul className="space-y-2">
          <li className="flex items-center gap-3 p-2 hover:bg-blue-600 rounded">
            <span>🏠</span> <NavLink to="/" className="...">Dashboard</NavLink>
          </li>
          <li className="flex items-center gap-3 p-2 hover:bg-blue-600 rounded">
            <span>👥</span> <NavLink to="/users" className="...">Users</NavLink>
          </li>
          <li className="flex items-center gap-3 p-2 hover:bg-blue-600 rounded">
            <span>📊</span> <NavLink to="/reports" className="...">Reports</NavLink>
          </li>
          <li className="flex items-center gap-3 p-2 hover:bg-blue-600 rounded">
            <span>🛍️</span> <NavLink to="/products" className="...">Products</NavLink>
          </li>
          <li className="flex items-center gap-3 p-2 hover:bg-blue-600 rounded">
            <span>🔧</span> <NavLink to="/settings" className="...">Settings</NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
