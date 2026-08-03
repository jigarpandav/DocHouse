import { Outlet } from "react-router-dom";
import { useState } from "react";

import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

import { FiMenu } from "react-icons/fi";

import "./DashboardLayout.css";

const DashboardLayout = () => {

  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (

    <div className="dashboard-layout">

      {/* Navbar */}

      <Navbar />

      {/* Mobile Overlay */}

      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Content */}

      <div className="dashboard-wrapper">

        {/* Sidebar */}

        <div
          className={`dashboard-sidebar ${
            sidebarOpen ? "show-sidebar" : ""
          }`}
        >
          <Sidebar />
        </div>

        {/* Main */}

        <main className="dashboard-content">

          <button
            className="mobile-menu-btn"
            onClick={() => setSidebarOpen(true)}
          >
            <FiMenu />
          </button>

          <Outlet />

        </main>

      </div>

    </div>

  );

};

export default DashboardLayout;