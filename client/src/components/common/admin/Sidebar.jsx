import React, { useState } from "react";
import {
  FaTachometerAlt,
  FaBus,
  FaRoute,
  FaUser,
  FaLifeRing,
  FaChevronLeft,
  FaChevronRight,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";
import { MdViewList } from "react-icons/md";

const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isBusOpen, setIsBusOpen] = useState(false);
  const [isRoutesOpen, setIsRoutesOpen] = useState(false);

  return (
    <div
      className={`h-full ${isCollapsed ? "w-20" : "w-64"
        } bg-[#E04848] text-white flex flex-col justify-between transition-all duration-300`}
    >
      {/* Top Section */}
      <div>
        {/* Header with Collapse Button */}
        <div className="flex items-center justify-between mb-6 p-4">
          {!isCollapsed && <h1 className="text-2xl font-bold">Admin Panel</h1>}
          <button
            className="text-white hover:text-gray-300 focus:outline-none"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {isCollapsed ? <FaChevronRight /> : <FaChevronLeft />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col space-y-4">
          {/* Dashboard */}
          <div className="flex items-center space-x-3 cursor-pointer hover:text-gray-300 p-2">
            <FaTachometerAlt className="text-lg" />
            {!isCollapsed && <span>Dashboard</span>}
          </div>

          {/* Booking Menu */}
          <div>
            <div
              className="flex items-center space-x-3 cursor-pointer hover:text-gray-300 p-2"
              onClick={() => setIsBookingOpen(!isBookingOpen)}
            >
              <MdViewList className="text-lg" />
              {!isCollapsed && <span>Booking</span>}
            </div>
            {isBookingOpen && !isCollapsed && (
              <div className="ml-6 mt-2 space-y-2">
                <a
                  href="/admin/ViewBookings"
                  className="cursor-pointer hover:text-gray-300 block"
                >
                  View Booking
                </a>
                <a
                  href="/admin/Confirm"
                  className="cursor-pointer hover:text-gray-300 block"
                >
                  Confirm Booking
                </a>
              </div>
            )}
          </div>

          {/* Routes Menu */}
          <div>
            <div
              className="flex items-center space-x-3 cursor-pointer hover:text-gray-300 p-2"
              onClick={() => setIsRoutesOpen(!isRoutesOpen)}
            >
              <FaRoute className="text-lg" />
              {!isCollapsed && <span>Routes</span>}
            </div>
            {isRoutesOpen && !isCollapsed && (
              <div className="ml-6 mt-2 space-y-2">
                <a
                  href="/admin/AddRoute"
                  className="cursor-pointer hover:text-gray-300 block"
                >
                  Add New Route
                </a>
                <a
                  href="/admin/ViewRoutes"
                  className="cursor-pointer hover:text-gray-300 block"
                >
                  View Routes
                </a>
              </div>
            )}
          </div>

          {/* Bus Menu */}
          <div>
            <div
              className="flex items-center space-x-3 cursor-pointer hover:text-gray-300 p-2"
              onClick={() => setIsBusOpen(!isBusOpen)}
            >
              <FaBus className="text-lg" />
              {!isCollapsed && <span>Bus</span>}
            </div>
            {isBusOpen && !isCollapsed && (
              <div className="ml-6 mt-2 space-y-2">
                <a
                  href="/admin/AddBuses"
                  className="cursor-pointer hover:text-gray-300 block"
                >
                  Add New Bus
                </a>
                <a
                  href="/admin/viewbuses"
                  className="cursor-pointer hover:text-gray-300 block"
                >
                  View Buses
                </a>
              </div>
            )}
          </div>

          {/* Users */}
          <div className="flex items-center space-x-3 cursor-pointer hover:text-gray-300 p-2">
            <FaUser className="text-lg" />
            {!isCollapsed && (
              <a href="/admin/users" className="hover:text-gray-300">
                <span>Users</span>
              </a>
            )}
          </div>

          {/* Support */}
          <div className="flex items-center space-x-3 cursor-pointer hover:text-gray-300 p-2">
            <FaLifeRing className="text-lg" />
            {!isCollapsed && (
              <a href="/admin/support" className="hover:text-gray-300">
                <span>Support</span>
              </a>
            )}
          </div>
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="flex flex-col space-y-4 p-4">
        {/* Settings */}
        <div className="flex items-center space-x-3 cursor-pointer hover:text-gray-300 p-2">
          <FaCog className="text-lg" />
          {!isCollapsed && (
            <a href="/admin/Setting" className="hover:text-gray-300">
              <span>Settings</span>
            </a>
          )}
        </div>


        <div
  className="flex items-center space-x-3 cursor-pointer hover:text-gray-300 p-2"
  onClick={() => {
    localStorage.removeItem("role");
    localStorage.removeItem("token");
    window.location.href = "/login";
  }}
>
  <FaSignOutAlt className="text-lg" />
  {!isCollapsed && <span>Logout</span>}
</div>
      </div>
    </div>
  );
};

export default Sidebar;
