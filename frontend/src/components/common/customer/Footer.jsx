import { FaFacebook, FaInstagram, FaLinkedin, FaShoePrints, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import { FaXTwitter } from "react-icons/fa6";
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-16 relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full opacity-5 blur-3xl"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full opacity-5 blur-3xl"></div>
            </div>
            
            <div className="container mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Brand Section */}
                    <div className="lg:col-span-1">
                        <div className="flex items-center space-x-3 mb-6">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                                <span className="text-white font-bold text-xl">C</span>
                            </div>
                            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                                Case
                            </h2>
                        </div>
                        <p className="text-gray-300 leading-relaxed mb-6">
                            Protect your device with style at Case - your premier destination for premium phone cases. 
                            Discover the perfect protection for every device, from sleek minimalism to bold designs.
                        </p>
                        <div className="flex space-x-4">
                            <a href="https://www.facebook.com/case" className="text-gray-400 hover:text-blue-500 transition-all duration-300 transform hover:scale-110" target="_blank" rel="noopener noreferrer">
                                <FaFacebook className="text-2xl" />
                            </a>
                            <a href="https://www.linkedin.com/company/case" className="text-gray-400 hover:text-blue-600 transition-all duration-300 transform hover:scale-110" target="_blank" rel="noopener noreferrer">
                                <FaLinkedin className="text-2xl" />
                            </a>
                            <a href="https://x.com/case" className="text-gray-400 hover:text-gray-300 transition-all duration-300 transform hover:scale-110" target="_blank" rel="noopener noreferrer">
                                <FaXTwitter className="text-2xl" />
                            </a>
                            <a href="https://www.instagram.com/case" className="text-gray-400 hover:text-pink-500 transition-all duration-300 transform hover:scale-110" target="_blank" rel="noopener noreferrer">
                                <FaInstagram className="text-2xl" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-xl font-semibold mb-6 text-white flex items-center gap-2">
                            <span className="w-8 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500"></span>
                            Quick Links
                        </h3>
                        <ul className="space-y-3">
                            <li>
                                <Link to="/about-us" className="text-gray-300 hover:text-blue-400 transition-all duration-300 flex items-center gap-2 group">
                                    <span className="w-1 h-1 bg-blue-500 rounded-full group-hover:bg-blue-400 transition-colors"></span>
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link to="/contact-us" className="text-gray-300 hover:text-purple-400 transition-all duration-300 flex items-center gap-2 group">
                                    <span className="w-1 h-1 bg-purple-500 rounded-full group-hover:bg-purple-400 transition-colors"></span>
                                    Contact Us
                                </Link>
                            </li>
                            <li>
                                <Link to="/delivery-charges" className="text-gray-300 hover:text-green-400 transition-all duration-300 flex items-center gap-2 group">
                                    <span className="w-1 h-1 bg-green-500 rounded-full group-hover:bg-green-400 transition-colors"></span>
                                    Shipping Info
                                </Link>
                            </li>
                            <li>
                                <Link to="/menu" className="text-gray-300 hover:text-pink-400 transition-all duration-300 flex items-center gap-2 group">
                                    <span className="w-1 h-1 bg-pink-500 rounded-full group-hover:bg-pink-400 transition-colors"></span>
                                    Shop Now
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Customer Service */}
                    <div>
                        <h3 className="text-xl font-semibold mb-6 text-white flex items-center gap-2">
                            <span className="w-8 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500"></span>
                            Customer Service
                        </h3>
                        <ul className="space-y-3">
                            <li>
                                <Link to="/privacy-and-policy" className="text-gray-300 hover:text-blue-400 transition-all duration-300 flex items-center gap-2 group">
                                    <span className="w-1 h-1 bg-blue-500 rounded-full group-hover:bg-blue-400 transition-colors"></span>
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link to="/terms-and-conditions" className="text-gray-300 hover:text-purple-400 transition-all duration-300 flex items-center gap-2 group">
                                    <span className="w-1 h-1 bg-purple-500 rounded-full group-hover:bg-purple-400 transition-colors"></span>
                                    Terms & Conditions
                                </Link>
                            </li>
                            <li>
                                <Link to="/refund-policy" className="text-gray-300 hover:text-green-400 transition-all duration-300 flex items-center gap-2 group">
                                    <span className="w-1 h-1 bg-green-500 rounded-full group-hover:bg-green-400 transition-colors"></span>
                                    Return Policy
                                </Link>
                            </li>
                            <li>
                                <Link to="/cancellation-policy" className="text-gray-300 hover:text-red-400 transition-all duration-300 flex items-center gap-2 group">
                                    <span className="w-1 h-1 bg-red-500 rounded-full group-hover:bg-red-400 transition-colors"></span>
                                    Cancellation Policy
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Information */}
                    <div>
                        <h3 className="text-xl font-semibold mb-6 text-white flex items-center gap-2">
                            <span className="w-8 h-0.5 bg-gradient-to-r from-green-500 to-blue-500"></span>
                            Contact Us
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3 group">
                                <FaEnvelope className="text-blue-500 mt-1 flex-shrink-0 group-hover:text-blue-400 transition-colors" />
                                <div>
                                    <p className="text-gray-300 font-medium">Email</p>
                                    <a href="mailto:support@case.com" className="text-gray-400 hover:text-blue-400 transition-all duration-300">
                                        support@case.com
                                    </a>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 group">
                                <FaPhone className="text-purple-500 mt-1 flex-shrink-0 group-hover:text-purple-400 transition-colors" />
                                <div>
                                    <p className="text-gray-300 font-medium">Phone</p>
                                    <p className="text-gray-400">+1 (555) 123-4567</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 group">
                                <FaMapMarkerAlt className="text-green-500 mt-1 flex-shrink-0 group-hover:text-green-400 transition-colors" />
                                <div>
                                    <p className="text-gray-300 font-medium">Address</p>
                                    <p className="text-gray-400">123 Tech Street<br />New York, NY 10001</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Newsletter Section */}
                <div className="mt-12 pt-8 border-t border-gray-700">
                    <div className="text-center">
                        <h3 className="text-2xl font-semibold text-white mb-4">Stay Updated</h3>
                        <p className="text-gray-300 mb-6">Subscribe to our newsletter for the latest cases and exclusive offers</p>
                        <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                            <input 
                                type="email" 
                                placeholder="Enter your email address"
                                className="flex-1 px-4 py-3 rounded-lg bg-gray-800 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                            />
                            <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl">
                                Subscribe
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="border-t border-gray-700 mt-12 pt-8 text-center">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-gray-400 text-sm">
                            Copyright © 2024 Case | All Rights Reserved
                        </p>
                        <div className="flex items-center gap-6 text-sm">
                            <span className="text-gray-400">Made with</span>
                            <span className="text-red-500 animate-pulse">❤</span>
                            <span className="text-gray-400">for tech lovers</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
