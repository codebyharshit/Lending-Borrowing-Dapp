import React from "react";
import { NavLink } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = () => {
  return (
    <div
      className="md:w-64 sm:w-full py-4 px-3 m-5 rounded-xl border"
    >
      <ul className="space-y-2 sidebar-nav-links">
        <li>
          <NavLink
            to="/"
            className="flex items-center ml-3 p-2 text-base font-normal  rounded-lg text-white hover:bg-gray-700"
          >
            {" "}
            Home
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/Vote"
            className="flex items-center ml-3 p-2 text-base font-normal  rounded-lg text-white hover:bg-gray-700"
          >
            {" "}
            Vote
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
