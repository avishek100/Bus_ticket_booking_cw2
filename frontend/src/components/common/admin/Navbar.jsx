import { useState } from "react";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { FaChevronDown } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { LogOut, Settings } from "lucide-react";

const Navbar = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const [showDropdown, setShowDropdown] = useState(false);

    // Function to handle closing the dropdown
    const handleDropdownClick = () => {
        setShowDropdown(false);
    };
    
    const handleLogout = () => {
        confirmAlert({
            title: "Confirm Logout",
            message: "Are you sure you want to sign out of your ShoeHub admin account?",
            buttons: [
                {
                    label: "Yes, Sign Out",
                    onClick: () => {
                        logout(); // Use the AuthContext logout function
                        navigate("/login"); // Navigate to login page
                    },
                    className: "bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition-colors duration-300",
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
                        <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
                            <div className="flex items-center gap-3 mb-4">
                                <LogOut className="text-orange-600" size={24} />
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

    return (
        <nav className="fixed top-0 left-0 w-full flex justify-between items-center bg-white px-6 py-4 z-50 shadow-lg">
            {/* ShoeHub Logo & Text */}
            <div className="flex items-center gap-2">
                <Link to="/admin/dashboard" className="flex items-center gap-2">
                    <div className="text-2xl font-bold text-orange-600">
                        ShoeHub Admin
                    </div>
                </Link>
            </div>

            <div className="flex items-center gap-6">
                {/* Profile Dropdown */}
                <div className="relative">
                    <button
                        onClick={() => setShowDropdown(!showDropdown)}
                        className="flex items-center gap-2 hover:text-orange-600 transition-colors duration-300"
                    >
                        <span className="text-gray-700">Hello</span>

                        <img
                            src="/src/assets/images/restaurant.jpg"
                            alt="Profile"
                            className="w-8 h-8 rounded-full border border-gray-200"
                        />
                        <FaChevronDown className="text-gray-500 text-sm" />
                    </button>

                    {/* Dropdown */}
                    {showDropdown && (
                        <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg border border-gray-100">
                            <ul className="text-gray-700">
                                <li className="px-4 py-3 hover:bg-orange-50 cursor-pointer transition-colors duration-300">
                                    <Link to="/admin/setting" onClick={handleDropdownClick} className="flex items-center gap-2">
                                        <Settings size={16} className="text-orange-600" />
                                        Settings
                                    </Link>
                                </li>
                                <li className="px-4 py-3 hover:bg-orange-50 cursor-pointer transition-colors duration-300 flex items-center gap-2" onClick={handleLogout}>
                                    <LogOut size={16} className="text-orange-600" />
                                    Sign Out
                                </li>
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
