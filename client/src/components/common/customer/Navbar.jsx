import { motion } from "framer-motion";
import { useState } from "react";
import { FaUserCircle } from "react-icons/fa";
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
            {/* Profile and Sign Out for logged in users */}
            {isLoggedIn ? (
              <>
                <Link
                  to="/profile"
                  className="flex items-center justify-center ml-4 w-10 h-10 rounded-full bg-[#E04848]/10 border border-[#E04848]/30 shadow-sm hover:bg-[#E04848]/20 transition relative"
                  title="Profile"
                  style={{ minWidth: '40px', minHeight: '40px' }}
                >
                  <FaUserCircle className="text-2xl text-[#E04848]" />
                  <span className="hidden md:inline ml-2 font-semibold text-[#E04848]">Profile</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="ml-2 px-4 py-1 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg hover:from-green-600 hover:to-blue-600 transition duration-300 font-semibold"
                >
                  Sign Out
                </button>
              </>
            ) : (
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
          </div>
        </div>

        {/* Mobile User Actions */}
        <div className="md:hidden pt-4 border-t border-gray-200">
          {isLoggedIn ? (
            <div className="space-y-3 flex flex-col items-stretch">
              <Link
                to="/profile"
                className="flex items-center justify-center w-full px-4 py-3 rounded-2xl bg-[#E04848]/10 border border-[#E04848]/30 shadow-sm hover:bg-[#E04848]/20 transition text-[#E04848] font-semibold"
                title="Profile"
              >
                <FaUserCircle className="text-2xl mr-2" />
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="w-full px-4 py-3 rounded-2xl bg-gradient-to-r from-green-500 to-blue-500 text-white font-semibold shadow-md hover:from-green-600 hover:to-blue-600 transition"
              >
                Sign Out
              </button>
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
