import { motion } from "framer-motion";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  // Check if user is logged in (robust check)
  const isLoggedIn = !!localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  // Remove navItems and navigation links section

  return (
    <div className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
        <div className="flex items-center justify-between h-12 lg:h-14">
          {/* Left Section - Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => navigate('/search')}
          >
            {/* <img
              src="src/assets/images/logo.png"
              alt="SwiftRide Logo"
              className="w-8 h-8 lg:w-10 lg:h-10"
            /> */}
            <div className="hidden sm:block">
              <h1 className="text-lg lg:text-xl font-bold text-[#E04848]">SwiftRide</h1>
              <p className="text-xs lg:text-xs text-gray-500">Trusted Ticketing Platform</p>
            </div>
          </motion.div>

          {/* Right Section - Navigation Links */}
          <div className="flex items-center space-x-6">
            {/* User Actions */}
            {/* REMOVED: My Account button and dropdown */}

            {/* Show Sign In and Sign Up when not logged in (desktop) */}
            {!isLoggedIn && (
              <>
                <Link
                  to="/login"
                  className="px-4 py-1 text-green-700 font-semibold border-2 border-green-600 rounded-lg bg-white hover:bg-green-50 hover:text-green-900 shadow-sm transition-all duration-200 text-base mr-2"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-1 bg-gradient-to-r from-green-500 to-blue-500 text-white font-semibold rounded-lg shadow-md hover:from-green-600 hover:to-blue-600 transition-all duration-200 text-base border-2 border-green-600"
                >
                  Sign Up
                </Link>
              </>
            )}

            {/* Sign Out Button */}
            {isLoggedIn && (
              <button
                onClick={handleLogout}
                className="px-4 py-1 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg hover:from-green-600 hover:to-blue-600 transition duration-300"
              >
                Sign Out
              </button>
            )}
          </div>
        </div>

        {/* Mobile User Actions */}
        <div className="md:hidden pt-4 border-t border-gray-200">
          {isLoggedIn ? (
            <div className="space-y-2">
              {/* REMOVED: Profile, My Bookings, and Sign Out links */}
            </div>
          ) : (
            <div className="space-y-3">
              <Link
                to="/login"
                className="block w-full px-4 py-3 text-center text-[#E04848] font-semibold border-2 border-[#E04848] rounded-2xl bg-white hover:bg-red-50 hover:text-red-700 shadow-sm transition-all duration-200 text-base"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="block w-full px-4 py-3 text-center bg-gradient-to-r from-[#E04848] to-red-600 text-white font-semibold rounded-2xl shadow-md hover:shadow-xl transition-all duration-200 text-base border-2 border-[#E04848] hover:from-red-700 hover:to-red-800"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
