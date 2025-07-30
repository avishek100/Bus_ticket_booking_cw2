import React, { useState } from "react";
import Navbar from "@/components/common/admin/Navbar";
import Sidebar from "@/components/common/admin/Sidebar";
import { Outlet } from "react-router-dom";

const Layout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false); // State to manage sidebar collapse

  return (
    <div className="flex h-screen">
      {/* Navbar */}
      <div className="fixed top-0 left-0 right-0 w-full z-10">
        <Navbar />
      </div>

      {/* Sidebar */}
      <div
        className={`fixed top-16 left-0 z-0 bg-gray-800 transition-all duration-300 ${
          isCollapsed ? "w-20" : "w-64"
        } h-[calc(100vh-4rem)]`}
      >
        <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      </div>

      {/* Main Content */}
      <div
        className={`transition-all duration-300 pt-16 ${
          isCollapsed ? "ml-20" : "ml-64"
        } w-full`}
      >
        <main className="p-4 overflow-y-auto h-[calc(100vh-4rem)] bg-gray-100">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
