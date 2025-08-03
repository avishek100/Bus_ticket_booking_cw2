import { Search, ShoppingCart, User, LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { VscHeart } from "react-icons/vsc";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

const Navbar = () => {
    const navigate = useNavigate();
    const { isAuthenticated, logout } = useAuth();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const handleLogout = () => {
        confirmAlert({
            title: "Confirm Logout",
            message: "Are you sure you want to sign out of your Case account?",
            buttons: [
                {
                    label: "Yes, Sign Out",
                    onClick: () => {
                        logout(); // Use the AuthContext logout function
                        navigate("/"); // Navigate to home page
                    },
                    className: "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2 rounded-lg transition-all duration-300",
                },
                {
                    label: "Cancel",
                    className: "bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-lg transition-colors duration-300",
                },
            ],
            closeOnClickOutside: true,
            closeOnEscape: true,
            overlayClassName: "bg-black bg-opacity-50",
            customUI: ({ title, message, onClose, buttons }) => {
                return (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full mx-4 border border-gray-200">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                                    <LogOut className="text-white" size={20} />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
                            </div>
                            <p className="text-gray-600 mb-6">{message}</p>
                            <div className="flex gap-3 justify-end">
                                {buttons.map((button, index) => (
                                    <button
                                        key={index}
                                        onClick={() => {
                                            button.onClick();
                                            onClose();
                                        }}
                                        className={button.className}
                                    >
                                        {button.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                );
            },
        });
    };

    // Remove the useEffect since we're now using AuthContext

    const handleSignInClick = () => navigate("/login");
    const handleSignUpClick = () => navigate("/register");

    const handleSearch = () => {
        if (searchQuery.trim()) {
            navigate(`/searchresult?query=${searchQuery}`);
        }
    };

    const activeLinkStyle = ({ isActive }) =>
        isActive
            ? "text-gray-800 border-b-2 border-blue-500 font-semibold transition-all duration-300"
            : "text-gray-600 text-base hover:text-blue-600 hover:border-b-2 hover:border-blue-500 transition-all duration-300";

    return (
        <div className="bg-white/90 backdrop-blur-md shadow-lg text-black sticky w-full top-0 left-0 z-50 border-b border-gray-200">
            <div className="flex justify-between items-center p-4 max-w-7xl mx-auto">
                {/* Brand Section */}
                <a href="/" className="flex items-center space-x-3 ml-6 group">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                        <span className="text-white font-bold text-lg">C</span>
                    </div>
                    <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Case
                    </div>
                </a>

                {/* Navigation Links */}
                <div className="flex items-center space-x-8">
                    <NavLink to="/" className={activeLinkStyle}>Home</NavLink>
                    <NavLink to="/menu" className={activeLinkStyle}>Shop</NavLink>
                    <NavLink to="/about-us" className={activeLinkStyle}>About</NavLink>

                    {/* Search Bar */}
                    <div className="flex items-center bg-gray-100 p-3 rounded-xl w-80 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200">
                        <input
                            type="text"
                            placeholder="Search cases..."
                            className="ml-2 bg-transparent outline-none w-full text-gray-700 placeholder-gray-500"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button onClick={handleSearch} className="text-gray-500 hover:text-blue-600 transition-colors ml-2">
                            <Search size={20} />
                        </button>
                    </div>
                </div>

                {/* Icons & Buttons */}
                <div className="flex items-center space-x-6 mr-6">
                    <Link to="/wishlist" className="text-2xl text-gray-600 hover:text-red-500 transition-all duration-300 transform hover:scale-110">
                        <VscHeart />
                    </Link>
                    <Link to="/cart" className="text-2xl text-gray-600 hover:text-blue-600 transition-all duration-300 transform hover:scale-110">
                        <ShoppingCart />
                    </Link>

                    {isAuthenticated ? (
                        <>
                            {/* My Account Dropdown */}
                            <div className="relative">
                                <button
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-base px-4 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center space-x-2"
                                >
                                    <User size={16} />
                                    <span>My Account</span>
                                </button>

                                {isDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-xl backdrop-blur-sm">
                                        <Link to="/profile" className="flex items-center px-4 py-3 hover:bg-gray-50 text-gray-700 transition-colors duration-200">
                                            <User className="w-4 h-4 mr-3 text-blue-600" />
                                            My Profile
                                        </Link>
                                        <Link to="/my-orders" className="flex items-center px-4 py-3 hover:bg-gray-50 text-gray-700 transition-colors duration-200">
                                            <ShoppingCart className="w-4 h-4 mr-3 text-purple-600" />
                                            My Orders
                                        </Link>
                                    </div>
                                )}
                            </div>

                            {/* Log Out Button */}
                            <button
                                className="text-gray-600 text-base hover:text-red-600 px-4 py-2 transition-all duration-300 flex items-center gap-2 hover:bg-red-50 rounded-lg"
                                onClick={handleLogout}
                            >
                                <LogOut size={16} />
                                Sign Out
                            </button>
                        </>
                    ) : (
                        <>
                            {/* Sign In & Sign Up Buttons */}
                            <button
                                className="text-gray-700 text-base border-2 border-blue-500 px-6 py-2 rounded-lg hover:bg-blue-500 hover:text-white transition-all duration-300 font-medium"
                                onClick={handleSignInClick}
                            >
                                Sign In
                            </button>
                            <button
                                className="text-white bg-gradient-to-r from-blue-600 to-purple-600 text-base px-6 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl"
                                onClick={handleSignUpClick}
                            >
                                Sign Up
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Navbar;
