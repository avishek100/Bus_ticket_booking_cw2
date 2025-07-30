// import axios from "axios";
// import { AnimatePresence, motion } from "framer-motion";
// import html2canvas from "html2canvas";
// import jsPDF from "jspdf";
// import KhaltiCheckout from "khalti-checkout-web";
// import { QRCodeCanvas } from 'qrcode.react';
// import { useEffect, useRef, useState } from "react";
// import {
//     FaArrowLeft,
//     FaArrowRight,
//     FaBus,
//     FaCalendarAlt,
//     FaCheck,
//     FaCheckCircle,
//     FaCouch,
//     FaCreditCard,
//     FaEnvelope,
//     FaExclamationTriangle,
//     FaMapMarkerAlt,
//     FaMoneyBillWave,
//     FaPhone,
//     FaQrcode,
//     FaRoute,
//     FaShieldAlt,
//     FaSpinner,
//     FaTicketAlt,
//     FaTimes,
//     FaUser
// } from "react-icons/fa";
// import { useLocation, useNavigate } from "react-router-dom";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// import eSewaLogo from "../../assets/images/esewa.jpg";
// import Footer from "../../components/common/customer/Footer";
// import Header from "../../components/common/customer/Header";
// import Navbar from "../../components/common/customer/Navbar";

// const API_BASE_URL = "http://localhost:3000/api/v1";

// const Checkout = () => {
//     const location = useLocation();
//     const navigate = useNavigate();

//     // Extract booking details from state
//     const { boardingPoint, selectedSeats, totalFare, busId, busInfo, from, to, date } = location.state || {};

//     // Fallback if required state is missing
//     if (!busId || !selectedSeats || !totalFare) {
//         return (
//             <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
//                 <h1 className="text-2xl font-bold text-[#E04848] mb-4">Invalid or missing booking details</h1>
//                 <p className="text-gray-600 mb-6">Please start your booking from the search page.</p>
//                 <button
//                     onClick={() => navigate("/")}
//                     className="bg-gradient-to-r from-[#E04848] to-[#a83279] text-white px-6 py-2 rounded-xl font-semibold hover:from-[#c73e3e] hover:to-[#7b2ff2] transition-all"
//                 >
//                     Go to Home
//                 </button>
//             </div>
//         );
//     }

//     // Component state
//     const [busDetails, setBusDetails] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [paymentMethod, setPaymentMethod] = useState("Khalti");
//     const [showPassword, setShowPassword] = useState(false);
//     const [isSubmitting, setIsSubmitting] = useState(false);
//     const [currentStep, setCurrentStep] = useState(1);
//     const [showReceipt, setShowReceipt] = useState(false);
//     const [qrValue, setQrValue] = useState("");

//     // User details state
//     const [userDetails, setUserDetails] = useState({
//         firstName: "",
//         lastName: "",
//         phone: "",
//         email: ""
//     });

//     // Validation state
//     const [errors, setErrors] = useState({});

//     // PayPal handlers
//     const handleeSewaSuccess = async (details) => {
//         toast.success("eSewa Payment Successful!");
//         await submitBooking("eSewa");
//     };
//     const handleeSewaError = (err) => {
//         toast.error("eSewa Payment Failed!");
//     };

//     const receiptRef = useRef();

//     useEffect(() => {
//         if (busId) {
//             axios.get(`${API_BASE_URL}/bus/${busId}`)
//                 .then(response => {
//                     setBusDetails(response.data.data);
//                     setLoading(false);
//                 })
//                 .catch(() => {
//                     // Use mock data if API fails
//                     setBusDetails({
//                         busNumber: busInfo?.busNumber || "BA 1 PA 1282",
//                         driverName: busInfo?.driverName || "Ram Kumar",
//                         busType: busInfo?.busType || "AC Deluxe",
//                         route: {
//                             startPoint: from || "Kathmandu",
//                             endPoint: to || "Pokhara",
//                             routeName: `${from || "Kathmandu"} to ${to || "Pokhara"}`
//                         },
//                         date: date || new Date().toISOString(),
//                         amenities: busInfo?.amenities || ["WiFi", "AC", "Reclining Seats", "Charging Point"]
//                     });
//                     setLoading(false);
//                 });
//         }
//     }, [busId, busInfo, from, to, date]);

//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setUserDetails({ ...userDetails, [name]: value });

//         // Clear error when user starts typing
//         if (errors[name]) {
//             setErrors({ ...errors, [name]: "" });
//         }
//     };

//     const validateForm = () => {
//         const newErrors = {};

//         // Required fields validation
//         if (!userDetails.firstName.trim()) newErrors.firstName = "First name is required";
//         if (!userDetails.lastName.trim()) newErrors.lastName = "Last name is required";
//         if (!userDetails.phone.trim()) newErrors.phone = "Phone number is required";
//         if (!userDetails.email.trim()) newErrors.email = "Email is required";

//         // Email validation
//         if (userDetails.email && !/\S+@\S+\.\S+/.test(userDetails.email)) {
//             newErrors.email = "Please enter a valid email address";
//         }

//         // Phone validation
//         if (userDetails.phone && !/^\d{10}$/.test(userDetails.phone.replace(/\D/g, ''))) {
//             newErrors.phone = "Please enter a valid 10-digit phone number";
//         }

//         setErrors(newErrors);
//         return Object.keys(newErrors).length === 0;
//     };

//     const handlePaymentChange = (method) => {
//         setPaymentMethod(method);
//     };

//     const khaltiConfig = {
//         publicKey: "test_public_key_102ca07b5d6b496984c2ca35b5f0edc5",
//         productIdentity: busId,
//         productName: "Bus Ticket",
//         productUrl: "http://localhost:3000",
//         eventHandler: {
//             async onSuccess(payload) {
//                 console.log("Khalti Payment Successful:", payload);

//                 try {
//                     const verifyResponse = await axios.post(`${API_BASE_URL}/khalti/verify`, {
//                         token: payload.token,
//                         amount: totalFare * 100,
//                     });

//                     if (verifyResponse.data.success) {
//                         toast.success("Payment verified successfully!");
//                         await submitBooking("Khalti");
//                     } else {
//                         toast.error("Payment verification failed!");
//                     }
//                 } catch (error) {
//                     console.error("Payment Verification Error:", error);
//                     toast.error("Error verifying payment. Please try again.");
//                 }
//             },
//             onError(error) {
//                 console.error("Khalti Payment Error:", error);
//                 toast.error("Khalti Payment Failed!");
//             },
//         },
//     };

//     const submitBooking = async (paymentMode) => {
//         if (!validateForm()) {
//             toast.error("Please fill in all required fields correctly.");
//             return;
//         }

//         setIsSubmitting(true);

//         // Format userDetails to match backend expectations
//         const formattedUserDetails = {
//             name: `${userDetails.firstName} ${userDetails.lastName}`,
//             phone: userDetails.phone,
//             email: userDetails.email,
//             address: "Nepal" // Default address since frontend doesn't collect it
//         };

//         const bookingData = {
//             busId,
//             boardingPoint,
//             selectedSeats,
//             totalFare,
//             userDetails: formattedUserDetails,
//             paymentMethod: paymentMode,
//         };

//         try {
//             const response = await axios.post(`${API_BASE_URL}/bookings`, bookingData);

//             if (response.data.success) {
//                 toast.success("Booking Confirmed!");
//                 // Generate random QR value
//                 const randomQr = Math.random().toString(36).substring(2, 12) + Date.now();
//                 setQrValue(randomQr);
//                 setShowReceipt(true);
//                 // Do not navigate to /booking-success
//             } else {
//                 toast.error("Booking failed. Please try again.");
//             }
//         } catch (error) {
//             console.error("Booking Error:", error);
//             toast.error("Failed to confirm booking. Please try again later.");
//         } finally {
//             setIsSubmitting(false);
//         }
//     };

//     const handleConfirmBooking = () => {
//         if (paymentMethod === "Khalti") {
//             const khalti = new KhaltiCheckout(khaltiConfig);
//             khalti.show({ amount: totalFare * 100 });
//         } else {
//             submitBooking("Cash");
//         }
//     };

//     const goBack = () => {
//         navigate(-1);
//     };

//     const serviceFee = 50;
//     const totalAmount = totalFare + serviceFee;

//     const handleDownloadPDF = async () => {
//         const input = receiptRef.current;
//         if (!input) return;
//         const canvas = await html2canvas(input, { scale: 2 });
//         const imgData = canvas.toDataURL("image/png");
//         const pdf = new jsPDF({
//             orientation: "portrait",
//             unit: "pt",
//             format: "a4",
//         });
//         const imgProps = pdf.getImageProperties(imgData);
//         const pdfWidth = pdf.internal.pageSize.getWidth();
//         const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
//         pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
//         pdf.save("bus_ticket.pdf");
//     };

//     return (
//         <div className="min-h-screen bg-gray-50">
//             <Header />
//             <Navbar />

//             <div className="max-w-7xl mx-auto px-4 py-8">
//                 <div className="flex flex-col lg:flex-row gap-8">
//                     {/* Left Section: Booking Form */}
//                     <div className="lg:w-2/3">
//                         <motion.div
//                             initial={{ opacity: 0, y: 20 }}
//                             animate={{ opacity: 1, y: 0 }}
//                             className="bg-white rounded-2xl shadow-lg p-6"
//                         >
//                             {/* Header */}
//                             <div className="flex items-center justify-between mb-6">
//                                 <div>
//                                     <h1 className="text-2xl font-bold text-gray-800">Complete Your Booking</h1>
//                                     <p className="text-gray-600">Step {currentStep} of 2</p>
//                                 </div>
//                                 <button
//                                     onClick={goBack}
//                                     className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
//                                 >
//                                     <FaArrowLeft className="text-gray-600" />
//                                 </button>
//                             </div>

//                             {/* Progress Bar */}
//                             <div className="mb-8">
//                                 <div className="flex items-center">
//                                     <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${currentStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
//                                         }`}>
//                                         1
//                                     </div>
//                                     <div className={`flex-1 h-1 mx-2 ${currentStep >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
//                                     <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${currentStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
//                                         }`}>
//                                         2
//                                     </div>
//                                 </div>
//                                 <div className="flex justify-between mt-2 text-sm text-gray-600">
//                                     <span>Passenger Details</span>
//                                     <span>Payment</span>
//                                 </div>
//                             </div>

//                             {/* Step 1: Passenger Details */}
//                             {currentStep === 1 && (
//                                 <motion.div
//                                     initial={{ opacity: 0, x: 20 }}
//                                     animate={{ opacity: 1, x: 0 }}
//                                     exit={{ opacity: 0, x: -20 }}
//                                 >
//                                     <h2 className="text-xl font-semibold text-gray-800 mb-6">Passenger Information</h2>

//                                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                                         {/* First Name */}
//                                         <div>
//                                             <label className="block text-sm font-semibold text-gray-700 mb-2">
//                                                 First Name *
//                                             </label>
//                                             <div className="relative">
//                                                 <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//                                                 <input
//                                                     type="text"
//                                                     name="firstName"
//                                                     value={userDetails.firstName}
//                                                     onChange={handleInputChange}
//                                                     className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${errors.firstName ? 'border-red-500' : 'border-gray-200 focus:border-blue-500'
//                                                         }`}
//                                                     placeholder="Enter first name"
//                                                 />
//                                             </div>
//                                             {errors.firstName && (
//                                                 <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
//                                             )}
//                                         </div>

//                                         {/* Last Name */}
//                                         <div>
//                                             <label className="block text-sm font-semibold text-gray-700 mb-2">
//                                                 Last Name *
//                                             </label>
//                                             <div className="relative">
//                                                 <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//                                                 <input
//                                                     type="text"
//                                                     name="lastName"
//                                                     value={userDetails.lastName}
//                                                     onChange={handleInputChange}
//                                                     className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${errors.lastName ? 'border-red-500' : 'border-gray-200 focus:border-blue-500'
//                                                         }`}
//                                                     placeholder="Enter last name"
//                                                 />
//                                             </div>
//                                             {errors.lastName && (
//                                                 <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
//                                             )}
//                                         </div>

//                                         {/* Phone */}
//                                         <div>
//                                             <label className="block text-sm font-semibold text-gray-700 mb-2">
//                                                 Phone Number *
//                                             </label>
//                                             <div className="relative">
//                                                 <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//                                                 <input
//                                                     type="tel"
//                                                     name="phone"
//                                                     value={userDetails.phone}
//                                                     onChange={handleInputChange}
//                                                     className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${errors.phone ? 'border-red-500' : 'border-gray-200 focus:border-blue-500'
//                                                         }`}
//                                                     placeholder="Enter phone number"
//                                                 />
//                                             </div>
//                                             {errors.phone && (
//                                                 <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
//                                             )}
//                                         </div>

//                                         {/* Email */}
//                                         <div>
//                                             <label className="block text-sm font-semibold text-gray-700 mb-2">
//                                                 Email Address *
//                                             </label>
//                                             <div className="relative">
//                                                 <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//                                                 <input
//                                                     type="email"
//                                                     name="email"
//                                                     value={userDetails.email}
//                                                     onChange={handleInputChange}
//                                                     className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${errors.email ? 'border-red-500' : 'border-gray-200 focus:border-blue-500'
//                                                         }`}
//                                                     placeholder="Enter email address"
//                                                 />
//                                             </div>
//                                             {errors.email && (
//                                                 <p className="text-red-500 text-sm mt-1">{errors.email}</p>
//                                             )}
//                                         </div>
//                                     </div>

//                                     {/* Next Button */}
//                                     <div className="mt-8 flex justify-end">
//                                         <button
//                                             onClick={() => {
//                                                 if (validateForm()) {
//                                                     setCurrentStep(2);
//                                                 } else {
//                                                     toast.error("Please fill in all required fields correctly.");
//                                                 }
//                                             }}
//                                             className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-8 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 flex items-center"
//                                         >
//                                             Next Step
//                                             <FaArrowRight className="ml-2" />
//                                         </button>
//                                     </div>
//                                 </motion.div>
//                             )}

//                             {/* Step 2: Payment */}
//                             {currentStep === 2 && (
//                                 <motion.div
//                                     initial={{ opacity: 0, x: 20 }}
//                                     animate={{ opacity: 1, x: 0 }}
//                                     exit={{ opacity: 0, x: -20 }}
//                                 >
//                                     <h2 className="text-xl font-semibold text-gray-800 mb-6">Payment Method</h2>
//                                     {/* Payment Options */}
//                                     <div className="space-y-4 mb-8">
//                                         <div
//                                             onClick={() => handlePaymentChange("Khalti")}
//                                             className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${paymentMethod === "Khalti"
//                                                 ? "border-blue-500 bg-blue-50"
//                                                 : "border-gray-200 hover:border-gray-300"
//                                                 }`}
//                                         >
//                                             <div className="flex items-center justify-between">
//                                                 <div className="flex items-center">
//                                                     <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
//                                                         <FaQrcode className="text-purple-600 text-xl" />
//                                                     </div>
//                                                     <div>
//                                                         <h3 className="font-semibold text-gray-800">Khalti Digital Wallet</h3>
//                                                         <p className="text-sm text-gray-600">Pay securely with Khalti</p>
//                                                     </div>
//                                                 </div>
//                                                 <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === "Khalti"
//                                                     ? "border-blue-500 bg-blue-500"
//                                                     : "border-gray-300"
//                                                     }`}>
//                                                     {paymentMethod === "Khalti" && (
//                                                         <FaCheck className="text-white text-xs" />
//                                                     )}
//                                                 </div>
//                                             </div>
//                                         </div>

//                                         <div
//                                             onClick={() => handlePaymentChange("Cash")}
//                                             className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${paymentMethod === "Cash"
//                                                 ? "border-blue-500 bg-blue-50"
//                                                 : "border-gray-200 hover:border-gray-300"
//                                                 }`}
//                                         >
//                                             <div className="flex items-center justify-between">
//                                                 <div className="flex items-center">
//                                                     <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
//                                                         <FaMoneyBillWave className="text-green-600 text-xl" />
//                                                     </div>
//                                                     <div>
//                                                         <h3 className="font-semibold text-gray-800">Cash Payment</h3>
//                                                         <p className="text-sm text-gray-600">Pay at boarding point</p>
//                                                     </div>
//                                                 </div>
//                                                 <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === "Cash"
//                                                     ? "border-blue-500 bg-blue-500"
//                                                     : "border-gray-300"
//                                                     }`}>
//                                                     {paymentMethod === "Cash" && (
//                                                         <FaCheck className="text-white text-xs" />
//                                                     )}
//                                                 </div>
//                                             </div>
//                                         </div>

//                                         {/* PayPal Option */}
//                                         <div
//                                             onClick={() => handlePaymentChange("eSewa")}
//                                             className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${paymentMethod === "eSewa"
//                                                 ? "border-blue-500 bg-blue-50"
//                                                 : "border-gray-200 hover:border-gray-300"
//                                                 }`}
//                                         >
//                                             <div className="flex items-center justify-between">
//                                                 <div className="flex items-center">
//                                                     <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mr-4">
//                                                         <img src={eSewaLogo} alt="eSewa" className="w-8 h-8" />
//                                                     </div>
//                                                     <div>
//                                                         <h3 className="font-semibold text-gray-800">eSewa</h3>
//                                                         <p className="text-sm text-gray-600">Pay securely with eSewa</p>
//                                                     </div>
//                                                 </div>
//                                                 <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === "eSewa"
//                                                     ? "border-blue-500 bg-blue-500"
//                                                     : "border-gray-300"
//                                                     }`}>
//                                                     {paymentMethod === "eSewa" && (
//                                                         <FaCheck className="text-white text-xs" />
//                                                     )}
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     </div>

//                                     {/* PayPal Button */}
//                                     {paymentMethod === "eSewa" && (
//                                         <div className="my-4">
//                                             <eSewaButton
//                                                 amount={totalAmount}
//                                                 onSuccess={handleeSewaSuccess}
//                                                 onError={handleeSewaError}
//                                             />
//                                         </div>
//                                     )}

//                                     {/* Action Buttons */}
//                                     <div className="flex justify-between">
//                                         <button
//                                             onClick={() => setCurrentStep(1)}
//                                             className="bg-gray-200 text-gray-800 py-3 px-6 rounded-xl font-semibold hover:bg-gray-300 transition-colors flex items-center"
//                                         >
//                                             <FaArrowLeft className="mr-2" />
//                                             Back
//                                         </button>

//                                         {paymentMethod !== "eSewa" && (
//                                             <button
//                                                 onClick={handleConfirmBooking}
//                                                 disabled={isSubmitting}
//                                                 className="bg-gradient-to-r from-green-500 to-blue-500 text-white py-3 px-8 rounded-xl font-semibold hover:from-green-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center"
//                                             >
//                                                 {isSubmitting ? (
//                                                     <>
//                                                         <FaSpinner className="animate-spin mr-2" />
//                                                         Processing...
//                                                     </>
//                                                 ) : (
//                                                     <>
//                                                         {paymentMethod === "Khalti" ? "Pay with Khalti" : "Confirm Booking"}
//                                                         <FaArrowRight className="ml-2" />
//                                                     </>
//                                                 )}
//                                             </button>
//                                         )}
//                                     </div>
//                                 </motion.div>
//                             )}
//                         </motion.div>
//                     </div>

//                     {/* Right Section: Booking Summary */}
//                     <div className="lg:w-1/3">
//                         <motion.div
//                             initial={{ opacity: 0, x: -20 }}
//                             animate={{ opacity: 1, x: 0 }}
//                             className="bg-white rounded-2xl shadow-lg p-6 sticky top-24"
//                         >
//                             <h3 className="text-xl font-bold text-gray-800 mb-6">Booking Summary</h3>

//                             {/* Bus Information */}
//                             {loading ? (
//                                 <div className="text-center py-8">
//                                     <FaSpinner className="animate-spin text-3xl text-blue-600 mx-auto mb-4" />
//                                     <p className="text-gray-600">Loading bus details...</p>
//                                 </div>
//                             ) : error ? (
//                                 <div className="text-center py-8">
//                                     <FaExclamationTriangle className="text-3xl text-red-500 mx-auto mb-4" />
//                                     <p className="text-red-600">{error}</p>
//                                 </div>
//                             ) : (
//                                 <>
//                                     {/* Route Info */}
//                                     <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 mb-6">
//                                         <div className="flex items-center justify-between mb-3">
//                                             <h4 className="font-semibold text-gray-800">Journey Details</h4>
//                                             <FaRoute className="text-blue-500" />
//                                         </div>
//                                         <div className="space-y-2">
//                                             <div className="flex items-center justify-between">
//                                                 <span className="text-gray-600">From:</span>
//                                                 <span className="font-semibold">{busDetails?.route?.startPoint}</span>
//                                             </div>
//                                             <div className="flex items-center justify-between">
//                                                 <span className="text-gray-600">To:</span>
//                                                 <span className="font-semibold">{busDetails?.route?.endPoint}</span>
//                                             </div>
//                                             <div className="flex items-center justify-between">
//                                                 <span className="text-gray-600">Date:</span>
//                                                 <span className="font-semibold">
//                                                     {new Date(busDetails?.date).toLocaleDateString()}
//                                                 </span>
//                                             </div>
//                                         </div>
//                                     </div>

//                                     {/* Bus Details */}
//                                     <div className="mb-6">
//                                         <h5 className="font-semibold text-gray-700 mb-3">Bus Information</h5>
//                                         <div className="space-y-2 text-sm">
//                                             <div className="flex justify-between">
//                                                 <span className="text-gray-600">Bus Number:</span>
//                                                 <span>{busDetails?.busNumber}</span>
//                                             </div>
//                                             <div className="flex justify-between">
//                                                 <span className="text-gray-600">Bus Type:</span>
//                                                 <span>{busDetails?.busType}</span>
//                                             </div>
//                                             <div className="flex justify-between">
//                                                 <span className="text-gray-600">Boarding Point:</span>
//                                                 <span>{boardingPoint}</span>
//                                             </div>
//                                         </div>
//                                     </div>

//                                     {/* Selected Seats */}
//                                     <div className="mb-6">
//                                         <h5 className="font-semibold text-gray-700 mb-3">Selected Seats</h5>
//                                         <div className="flex flex-wrap gap-2">
//                                             {selectedSeats?.map((seat) => (
//                                                 <span
//                                                     key={seat}
//                                                     className="px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full text-sm font-semibold"
//                                                 >
//                                                     {seat}
//                                                 </span>
//                                             ))}
//                                         </div>
//                                     </div>

//                                     {/* Fare Breakdown */}
//                                     <div className="mb-6">
//                                         <h5 className="font-semibold text-gray-700 mb-3">Fare Details</h5>
//                                         <div className="space-y-2">
//                                             <div className="flex justify-between">
//                                                 <span className="text-gray-600">Seat Fare:</span>
//                                                 <span>₹{totalFare} × {selectedSeats?.length}</span>
//                                             </div>
//                                             <div className="flex justify-between">
//                                                 <span className="text-gray-600">Service Fee:</span>
//                                                 <span>₹{serviceFee}</span>
//                                             </div>
//                                             <div className="border-t pt-2">
//                                                 <div className="flex justify-between font-bold text-lg">
//                                                     <span>Total Amount:</span>
//                                                     <span className="text-blue-600">₹{totalAmount}</span>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     </div>

//                                     {/* Features */}
//                                     <div className="mb-6">
//                                         <h5 className="font-semibold text-gray-700 mb-3">What's Included</h5>
//                                         <div className="space-y-2">
//                                             <div className="flex items-center text-sm text-gray-600">
//                                                 <FaShieldAlt className="mr-2 text-green-500" />
//                                                 <span>Free Cancellation (24h before)</span>
//                                             </div>
//                                             <div className="flex items-center text-sm text-gray-600">
//                                                 <FaTicketAlt className="mr-2 text-blue-500" />
//                                                 <span>E-Ticket & SMS Confirmation</span>
//                                             </div>
//                                             <div className="flex items-center text-sm text-gray-600">
//                                                 <FaCreditCard className="mr-2 text-purple-500" />
//                                                 <span>Secure Payment Gateway</span>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </>
//                             )}
//                         </motion.div>
//                     </div>
//                 </div>
//             </div>

//             {/* Payment Success Modal/Popup */}
//             <AnimatePresence>
//                 {showReceipt && (
//                     <motion.div
//                         initial={{ opacity: 0 }}
//                         animate={{ opacity: 1 }}
//                         exit={{ opacity: 0 }}
//                         className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60"
//                     >
//                         <div className="relative w-full max-w-lg mx-auto">
//                             {/* Modern Ticket Card */}
//                             <div
//                                 ref={receiptRef}
//                                 className="bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col relative"
//                                 style={{ maxHeight: '95vh' }}
//                             >
//                                 {/* Remove Perforated Notches */}

//                                 {/* Scrollable Content */}
//                                 <div className="flex-1 overflow-y-auto">
//                                     {/* Colored Header with App Name (no logo) */}
//                                     <div className="flex items-center justify-center bg-gradient-to-r from-blue-700 to-blue-400 py-5 px-6">
//                                         <span className="text-white text-3xl font-extrabold tracking-wider drop-shadow">GoBus Ticket</span>
//                                     </div>

//                                     {/* Remove Dashed Divider */}

//                                     {/* Success Icon and Message */}
//                                     <div className="flex flex-col items-center px-6 pt-2">
//                                         <FaCheckCircle className="text-green-500 text-5xl mb-2 animate-bounce" />
//                                         <h2 className="text-2xl font-extrabold mb-1 text-center text-gray-800">Payment Successful!</h2>
//                                         <p className="text-gray-600 mb-2 text-center">Your ticket has been booked successfully.</p>
//                                     </div>

//                                     {/* QR and Barcode */}
//                                     <div className="flex flex-col items-center px-6 mt-2 mb-2">
//                                         {qrValue && (
//                                             <div className="mb-2 border-4 border-blue-200 rounded-xl p-2 bg-blue-50">
//                                                 <QRCodeCanvas value={qrValue} size={120} />
//                                             </div>
//                                         )}
//                                         {qrValue && (
//                                             <div className="mb-2">
//                                                 <div className="bg-gray-900 text-white font-mono text-lg tracking-widest px-4 py-2 rounded">
//                                                     {qrValue}
//                                                 </div>
//                                                 <div className="h-2 bg-gradient-to-r from-gray-900 to-gray-400 rounded mt-1" style={{ width: '80%' }}></div>
//                                             </div>
//                                         )}
//                                     </div>

//                                     {/* Remove Dashed Divider */}

//                                     {/* Ticket Details Grid - visually separated sections */}
//                                     <div className="px-6 pb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
//                                         {/* Passenger Details */}
//                                         <div className="bg-blue-50 rounded-xl p-4 flex flex-col gap-1 shadow-sm">
//                                             <h3 className="font-semibold text-base mb-1 flex items-center"><FaUser className="mr-2 text-blue-600" />Passenger</h3>
//                                             <div className="text-gray-800 text-sm">
//                                                 <div><span className="font-semibold">Name:</span> {userDetails.firstName} {userDetails.lastName}</div>
//                                                 <div><span className="font-semibold">Phone:</span> {userDetails.phone}</div>
//                                                 <div><span className="font-semibold">Email:</span> {userDetails.email}</div>
//                                             </div>
//                                         </div>
//                                         {/* Ticket Details */}
//                                         <div className="bg-green-50 rounded-xl p-4 flex flex-col gap-1 shadow-sm">
//                                             <h3 className="font-semibold text-base mb-1 flex items-center"><FaBus className="mr-2 text-green-600" />Trip</h3>
//                                             <div className="text-gray-800 text-sm">
//                                                 <div><span className="font-semibold">Bus No:</span> {busDetails?.busNumber || "-"}</div>
//                                                 <div><span className="font-semibold">Route:</span> {busDetails?.route?.routeName || from + " to " + to}</div>
//                                                 <div><span className="font-semibold">Date:</span> <FaCalendarAlt className="inline mr-1 text-gray-500" />{busDetails?.date ? new Date(busDetails.date).toLocaleDateString() : date}</div>
//                                                 <div><span className="font-semibold">Boarding:</span> <FaMapMarkerAlt className="inline mr-1 text-red-500" />{boardingPoint}</div>
//                                             </div>
//                                         </div>
//                                         {/* Seat Details */}
//                                         <div className="bg-yellow-50 rounded-xl p-4 flex flex-col gap-1 shadow-sm">
//                                             <h3 className="font-semibold text-base mb-1 flex items-center"><FaCouch className="mr-2 text-yellow-600" />Seats</h3>
//                                             <div className="text-gray-800 text-sm">
//                                                 <div><span className="font-semibold">Selected:</span> {selectedSeats?.join(", ")}</div>
//                                                 <div><span className="font-semibold">Count:</span> {selectedSeats?.length || 0}</div>
//                                                 <div><span className="font-semibold">Type:</span> {busDetails?.busType || "Standard"}</div>
//                                             </div>
//                                         </div>
//                                         {/* Pricing Details */}
//                                         <div className="bg-purple-50 rounded-xl p-4 flex flex-col gap-1 shadow-sm">
//                                             <h3 className="font-semibold text-base mb-1 flex items-center"><FaMoneyBillWave className="mr-2 text-purple-600" />Pricing</h3>
//                                             <div className="text-gray-800 text-sm">
//                                                 <div><span className="font-semibold">Base Fare:</span> Rs. {totalFare}</div>
//                                                 <div><span className="font-semibold">Service Fee:</span> Rs. {serviceFee}</div>
//                                                 <div className="border-t pt-1 mt-1 font-bold text-lg text-purple-700"><span className="font-semibold">Total:</span> Rs. {totalAmount}</div>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>
//                                 {/* Download Button - always visible at bottom */}
//                                 <div className="flex justify-center bg-gradient-to-r from-blue-700 to-blue-400 rounded-b-3xl shadow-2xl py-5 mt-2 sticky bottom-0 z-10">
//                                     <button
//                                         onClick={handleDownloadPDF}
//                                         className="bg-white text-blue-700 px-8 py-3 rounded-xl font-extrabold text-lg shadow-lg hover:bg-blue-50 border-2 border-blue-700 transition"
//                                     >
//                                         <FaQrcode className="inline mr-2 text-blue-700 text-xl" /> Download Ticket as PDF
//                                     </button>
//                                 </div>
//                                 {/* Close Button */}
//                                 <button
//                                     className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 bg-white rounded-full p-1 shadow"
//                                     onClick={() => setShowReceipt(false)}
//                                 >
//                                     <FaTimes size={22} />
//                                 </button>
//                             </div>
//                         </div>
//                     </motion.div>
//                 )}
//             </AnimatePresence>

//             <Footer />
//             <ToastContainer />
//         </div>
//     );
// };

// export default Checkout;

import { CardElement, Elements, useElements, useStripe } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import KhaltiCheckout from "khalti-checkout-web";
import { QRCodeCanvas } from 'qrcode.react';
import { useEffect, useRef, useState } from "react";
import {
    FaArrowLeft,
    FaArrowRight,
    FaBus,
    FaCalendarAlt,
    FaCheck,
    FaCheckCircle,
    FaCouch,
    FaCreditCard,
    FaEnvelope,
    FaExclamationTriangle,
    FaMapMarkerAlt,
    FaMoneyBillWave,
    FaPhone,
    FaQrcode,
    FaRoute,
    FaShieldAlt,
    FaSpinner,
    FaTicketAlt,
    FaTimes,
    FaUser
} from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Footer from "../../components/common/customer/Footer";
import Header from "../../components/common/customer/Header";
import Navbar from "../../components/common/customer/Navbar";

// Initialize Stripe with your public key
const stripePromise = loadStripe("pk_test_51RmtO7PRr6XE8aesc2gwXhsPQPLVawBne7SPBW67zhx4byV3Nyp0O7GRVHYeaY7xeTzpiWhqyOPMzDQZkhyRAkRU00jOKiHYen");

const API_BASE_URL = "http://localhost:3000/api/v1";

// Stripe Payment Form Component
const StripePaymentForm = ({ totalAmount, onSuccess, onError, userDetails }) => {
    const stripe = useStripe();
    const elements = useElements();

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!stripe || !elements) {
            toast.error("Stripe is not initialized. Please try again.");
            return;
        }

        // Log the totalAmount and userDetails for debugging
        console.log("Sending totalAmount to backend:", totalAmount);
        console.log("userDetails:", userDetails);

        // Validate totalAmount
        if (totalAmount < 42) {
            toast.error("Total amount must be at least ₹42 to meet Stripe's minimum requirement.");
            onError("Total amount must be at least ₹42.");
            return;
        }

        // Validate userDetails
        if (!userDetails || !userDetails.firstName || !userDetails.lastName || !userDetails.email) {
            toast.error("User details are incomplete. Please fill in all required fields.");
            onError("Incomplete user details.");
            return;
        }

        try {
            // Log the POST data for debugging
            console.log("Axios POST data:", { amount: Number(totalAmount) });

            // Send amount as whole INR (rupees)
            const response = await axios.post(`${API_BASE_URL}/stripe/create-payment-intent`, {
                amount: Number(totalAmount), // Ensure it's a number in rupees
            });

            const { clientSecret } = response.data;

            // Confirm the payment with Stripe
            const result = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: elements.getElement(CardElement),
                    billing_details: {
                        name: `${userDetails.firstName} ${userDetails.lastName}`,
                        email: userDetails.email,
                    },
                },
            });

            if (result.error) {
                onError(result.error.message);
                toast.error("Stripe Payment Failed: " + result.error.message);
            } else if (result.paymentIntent.status === "succeeded") {
                toast.success("Stripe Payment Successful!");
                onSuccess(result.paymentIntent.id);
            }
        } catch (error) {
            onError(error.message);
            toast.error("Error processing payment: " + error.message);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mt-4">
            <CardElement
                options={{
                    style: {
                        base: {
                            fontSize: '16px',
                            color: '#424770',
                            '::placeholder': {
                                color: '#aab7c4',
                            },
                        },
                        invalid: {
                            color: '#9e2146',
                        },
                    },
                }}
                className="p-4 border-2 rounded-xl border-gray-200 focus:border-blue-500"
            />
            <button
                type="submit"
                disabled={!stripe}
                className="mt-4 bg-gradient-to-r from-green-500 to-blue-500 text-white py-3 px-8 rounded-xl font-semibold hover:from-green-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Pay with Stripe
            </button>
        </form>
    );
};

const Checkout = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // Extract booking details from state
    const { boardingPoint, selectedSeats, totalFare, busId, busInfo, from, to, date } = location.state || {};

    // Calculate totalAmount
    const serviceFee = 50;
    const totalAmount = totalFare + serviceFee;

    // Log totalFare and totalAmount for debugging
    useEffect(() => {
        console.log("Checkout state:", { totalFare, serviceFee, totalAmount, selectedSeats, busId });
    }, [totalFare, serviceFee, totalAmount, selectedSeats, busId]);

    // Fallback if required state is missing or invalid
    if (!busId || !selectedSeats || !totalFare || totalFare <= 0 || totalAmount < 42) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
                <h1 className="text-2xl font-bold text-[#E04848] mb-4">Invalid or missing booking details</h1>
                <p className="text-gray-600 mb-6">
                    {totalAmount < 42 ? "Total amount must be at least ₹42 for payment." : "Please start your booking from the search page."}
                </p>
                <button
                    onClick={() => navigate("/")}
                    className="bg-gradient-to-r from-[#E04848] to-[#a83279] text-white px-6 py-2 rounded-xl font-semibold hover:from-[#c73e3e] hover:to-[#7b2ff2] transition-all"
                >
                    Go to Home
                </button>
            </div>
        );
    }

    // Component state
    const [busDetails, setBusDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState("Khalti");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);
    const [showReceipt, setShowReceipt] = useState(false);
    const [qrValue, setQrValue] = useState("");

    // User details state
    const [userDetails, setUserDetails] = useState({
        firstName: "",
        lastName: "",
        phone: "",
        email: ""
    });

    // Validation state
    const [errors, setErrors] = useState({});

    // Stripe handlers
    const handleStripeSuccess = async (paymentIntentId) => {
        await submitBooking("Stripe", paymentIntentId);
    };

    const handleStripeError = (error) => {
        toast.error("Stripe Payment Failed: " + error);
    };

    const receiptRef = useRef();

    useEffect(() => {
        if (busId) {
            axios.get(`${API_BASE_URL}/bus/${busId}`)
                .then(response => {
                    setBusDetails(response.data.data);
                    setLoading(false);
                })
                .catch(() => {
                    // Use mock data if API fails
                    setBusDetails({
                        busNumber: busInfo?.busNumber || "BA 1 PA 1282",
                        driverName: busInfo?.driverName || "Ram Kumar",
                        busType: busInfo?.busType || "AC Deluxe",
                        route: {
                            startPoint: from || "Kathmandu",
                            endPoint: to || "Pokhara",
                            routeName: `${from || "Kathmandu"} to ${to || "Pokhara"}`
                        },
                        date: date || new Date().toISOString(),
                        amenities: busInfo?.amenities || ["WiFi", "AC", "Reclining Seats", "Charging Point"]
                    });
                    setLoading(false);
                });
        }
    }, [busId, busInfo, from, to, date]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserDetails({ ...userDetails, [name]: value });

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors({ ...errors, [name]: "" });
        }
    };

    const validateForm = () => {
        const newErrors = {};

        // Required fields validation
        if (!userDetails.firstName.trim()) newErrors.firstName = "First name is required";
        if (!userDetails.lastName.trim()) newErrors.lastName = "Last name is required";
        if (!userDetails.phone.trim()) newErrors.phone = "Phone number is required";
        if (!userDetails.email.trim()) newErrors.email = "Email is required";

        // Email validation
        if (userDetails.email && !/\S+@\S+\.\S+/.test(userDetails.email)) {
            newErrors.email = "Please enter a valid email address";
        }

        // Phone validation
        if (userDetails.phone && !/^\d{10}$/.test(userDetails.phone.replace(/\D/g, ''))) {
            newErrors.phone = "Please enter a valid 10-digit phone number";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handlePaymentChange = (method) => {
        setPaymentMethod(method);
    };

    const khaltiConfig = {
        publicKey: "test_public_key_102ca07b5d6b496984c2ca35b5f0edc5",
        productIdentity: busId,
        productName: "Bus Ticket",
        productUrl: "http://localhost:3000",
        eventHandler: {
            async onSuccess(payload) {
                console.log("Khalti Payment Successful:", payload);

                try {
                    const verifyResponse = await axios.post(`${API_BASE_URL}/khalti/verify`, {
                        token: payload.token,
                        amount: totalAmount * 100, // Khalti expects amount in paise
                    });

                    if (verifyResponse.data.success) {
                        toast.success("Payment verified successfully!");
                        await submitBooking("Khalti");
                    } else {
                        toast.error("Payment verification failed!");
                    }
                } catch (error) {
                    console.error("Payment Verification Error:", error);
                    toast.error("Error verifying payment. Please try again.");
                }
            },
            onError(error) {
                console.error("Khalti Payment Error:", error);
                toast.error("Khalti Payment Failed!");
            },
        },
    };

    const submitBooking = async (paymentMode, paymentIntentId = null) => {
        if (!validateForm()) {
            toast.error("Please fill in all required fields correctly.");
            return;
        }

        setIsSubmitting(true);

        // Format userDetails to match backend expectations
        const formattedUserDetails = {
            name: `${userDetails.firstName} ${userDetails.lastName}`,
            phone: userDetails.phone,
            email: userDetails.email,
            address: "Nepal" // Default address since frontend doesn't collect it
        };

        const bookingData = {
            busId,
            boardingPoint,
            selectedSeats,
            totalFare,
            totalAmount, // Include totalAmount for the booking record
            userDetails: formattedUserDetails,
            paymentMethod: paymentMode,
            ...(paymentMode === "Stripe" && { paymentIntentId }), // Include paymentIntentId for Stripe
        };

        try {
            const response = await axios.post(`${API_BASE_URL}/bookings`, bookingData);

            if (response.data.success) {
                toast.success("Booking Confirmed!");
                // Generate random QR value
                const randomQr = Math.random().toString(36).substring(2, 12) + Date.now();
                setQrValue(randomQr);
                setShowReceipt(true);
            } else {
                toast.error("Booking failed. Please try again.");
            }
        } catch (error) {
            console.error("Booking Error:", error);
            toast.error("Failed to confirm booking: " + error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleConfirmBooking = () => {
        if (paymentMethod === "Khalti") {
            const khalti = new KhaltiCheckout(khaltiConfig);
            khalti.show({ amount: totalAmount * 100 }); // Khalti expects amount in paise
        } else if (paymentMethod === "Cash") {
            submitBooking("Cash");
        }
        // For Stripe, payment is handled via StripePaymentForm
    };

    const goBack = () => {
        navigate(-1);
    };

    const handleDownloadPDF = async () => {
        const input = receiptRef.current;
        if (!input) return;
        const canvas = await html2canvas(input, { scale: 2 });
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF({
            orientation: "portrait",
            unit: "pt",
            format: "a4",
        });
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
        pdf.save("bus_ticket.pdf");
    };

    return (
        <Elements stripe={stripePromise}>
            <div className="min-h-screen bg-gray-50">
                <Header />
                <Navbar />

                <div className="max-w-7xl mx-auto px-4 py-8">
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Left Section: Booking Form */}
                        <div className="lg:w-2/3">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white rounded-2xl shadow-lg p-6"
                            >
                                {/* Header */}
                                <div className="flex items-center justify-between mb-6">
                                    <div>
                                        <h1 className="text-2xl font-bold text-gray-800">Complete Your Booking</h1>
                                        <p className="text-gray-600">Step {currentStep} of 2</p>
                                    </div>
                                    <button
                                        onClick={goBack}
                                        className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                                    >
                                        <FaArrowLeft className="text-gray-600" />
                                    </button>
                                </div>

                                {/* Progress Bar */}
                                <div className="mb-8">
                                    <div className="flex items-center">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${currentStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                                            1
                                        </div>
                                        <div className={`flex-1 h-1 mx-2 ${currentStep >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${currentStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                                            2
                                        </div>
                                    </div>
                                    <div className="flex justify-between mt-2 text-sm text-gray-600">
                                        <span>Passenger Details</span>
                                        <span>Payment</span>
                                    </div>
                                </div>

                                {/* Step 1: Passenger Details */}
                                {currentStep === 1 && (
                                    <motion.div
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                    >
                                        <h2 className="text-xl font-semibold text-gray-800 mb-6">Passenger Information</h2>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {/* First Name */}
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                    First Name *
                                                </label>
                                                <div className="relative">
                                                    <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                                    <input
                                                        type="text"
                                                        name="firstName"
                                                        value={userDetails.firstName}
                                                        onChange={handleInputChange}
                                                        className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${errors.firstName ? 'border-red-500' : 'border-gray-200 focus:border-blue-500'}`}
                                                        placeholder="Enter first name"
                                                    />
                                                </div>
                                                {errors.firstName && (
                                                    <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
                                                )}
                                            </div>

                                            {/* Last Name */}
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                    Last Name *
                                                </label>
                                                <div className="relative">
                                                    <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                                    <input
                                                        type="text"
                                                        name="lastName"
                                                        value={userDetails.lastName}
                                                        onChange={handleInputChange}
                                                        className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${errors.lastName ? 'border-red-500' : 'border-gray-200 focus:border-blue-500'}`}
                                                        placeholder="Enter last name"
                                                    />
                                                </div>
                                                {errors.lastName && (
                                                    <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
                                                )}
                                            </div>

                                            {/* Phone */}
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                    Phone Number *
                                                </label>
                                                <div className="relative">
                                                    <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                                    <input
                                                        type="tel"
                                                        name="phone"
                                                        value={userDetails.phone}
                                                        onChange={handleInputChange}
                                                        className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${errors.phone ? 'border-red-500' : 'border-gray-200 focus:border-blue-500'}`}
                                                        placeholder="Enter phone number"
                                                    />
                                                </div>
                                                {errors.phone && (
                                                    <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                                                )}
                                            </div>

                                            {/* Email */}
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                    Email Address *
                                                </label>
                                                <div className="relative">
                                                    <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                                    <input
                                                        type="email"
                                                        name="email"
                                                        value={userDetails.email}
                                                        onChange={handleInputChange}
                                                        className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${errors.email ? 'border-red-500' : 'border-gray-200 focus:border-blue-500'}`}
                                                        placeholder="Enter email address"
                                                    />
                                                </div>
                                                {errors.email && (
                                                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Next Button */}
                                        <div className="mt-8 flex justify-end">
                                            <button
                                                onClick={() => {
                                                    if (validateForm()) {
                                                        setCurrentStep(2);
                                                    } else {
                                                        toast.error("Please fill in all required fields correctly.");
                                                    }
                                                }}
                                                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-8 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 flex items-center"
                                            >
                                                Next Step
                                                <FaArrowRight className="ml-2" />
                                            </button>
                                        </div>
                                    </motion.div>
                                )}

                                {/* Step 2: Payment */}
                                {currentStep === 2 && (
                                    <motion.div
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                    >
                                        <h2 className="text-xl font-semibold text-gray-800 mb-6">Payment Method</h2>
                                        {/* Payment Options */}
                                        <div className="space-y-4 mb-8">
                                            <div
                                                onClick={() => handlePaymentChange("Khalti")}
                                                className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${paymentMethod === "Khalti"
                                                    ? "border-blue-500 bg-blue-50"
                                                    : "border-gray-200 hover:border-gray-300"
                                                    }`}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center">
                                                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                                                            <FaQrcode className="text-purple-600 text-xl" />
                                                        </div>
                                                        <div>
                                                            <h3 className="font-semibold text-gray-800">Khalti Digital Wallet</h3>
                                                            <p className="text-sm text-gray-600">Pay securely with Khalti</p>
                                                        </div>
                                                    </div>
                                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === "Khalti"
                                                        ? "border-blue-500 bg-blue-500"
                                                        : "border-gray-300"
                                                        }`}>
                                                        {paymentMethod === "Khalti" && (
                                                            <FaCheck className="text-white text-xs" />
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <div
                                                onClick={() => handlePaymentChange("Stripe")}
                                                className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${paymentMethod === "Stripe"
                                                    ? "border-blue-500 bg-blue-50"
                                                    : "border-gray-200 hover:border-gray-300"
                                                    }`}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center">
                                                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                                                            <FaCreditCard className="text-blue-600 text-xl" />
                                                        </div>
                                                        <div>
                                                            <h3 className="font-semibold text-gray-800">Stripe</h3>
                                                            <p className="text-sm text-gray-600">Pay securely with credit/debit card</p>
                                                        </div>
                                                    </div>
                                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === "Stripe"
                                                        ? "border-blue-500 bg-blue-500"
                                                        : "border-gray-300"
                                                        }`}>
                                                        {paymentMethod === "Stripe" && (
                                                            <FaCheck className="text-white text-xs" />
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <div
                                                onClick={() => handlePaymentChange("Cash")}
                                                className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${paymentMethod === "Cash"
                                                    ? "border-blue-500 bg-blue-50"
                                                    : "border-gray-200 hover:border-gray-300"
                                                    }`}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center">
                                                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                                                            <FaMoneyBillWave className="text-green-600 text-xl" />
                                                        </div>
                                                        <div>
                                                            <h3 className="font-semibold text-gray-800">Cash Payment</h3>
                                                            <p className="text-sm text-gray-600">Pay at boarding point</p>
                                                        </div>
                                                    </div>
                                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === "Cash"
                                                        ? "border-blue-500 bg-blue-500"
                                                        : "border-gray-300"
                                                        }`}>
                                                        {paymentMethod === "Cash" && (
                                                            <FaCheck className="text-white text-xs" />
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Stripe Payment Form */}
                                        {paymentMethod === "Stripe" && (
                                            <div className="my-4">
                                                <StripePaymentForm
                                                    totalAmount={totalAmount}
                                                    onSuccess={handleStripeSuccess}
                                                    onError={handleStripeError}
                                                    userDetails={userDetails}
                                                />
                                            </div>
                                        )}

                                        {/* Action Buttons */}
                                        <div className="flex justify-between">
                                            <button
                                                onClick={() => setCurrentStep(1)}
                                                className="bg-gray-200 text-gray-800 py-3 px-6 rounded-xl font-semibold hover:bg-gray-300 transition-colors flex items-center"
                                            >
                                                <FaArrowLeft className="mr-2" />
                                                Back
                                            </button>

                                            {paymentMethod !== "Stripe" && (
                                                <button
                                                    onClick={handleConfirmBooking}
                                                    disabled={isSubmitting}
                                                    className="bg-gradient-to-r from-green-500 to-blue-500 text-white py-3 px-8 rounded-xl font-semibold hover:from-green-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center"
                                                >
                                                    {isSubmitting ? (
                                                        <>
                                                            <FaSpinner className="animate-spin mr-2" />
                                                            Processing...
                                                        </>
                                                    ) : (
                                                        <>
                                                            {paymentMethod === "Khalti" ? "Pay with Khalti" : "Confirm Booking"}
                                                            <FaArrowRight className="ml-2" />
                                                        </>
                                                    )}
                                                </button>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </motion.div>
                        </div>

                        {/* Right Section: Booking Summary */}
                        <div className="lg:w-1/3">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="bg-white rounded-2xl shadow-lg p-6 sticky top-24"
                            >
                                <h3 className="text-xl font-bold text-gray-800 mb-6">Booking Summary</h3>

                                {/* Bus Information */}
                                {loading ? (
                                    <div className="text-center py-8">
                                        <FaSpinner className="animate-spin text-3xl text-blue-600 mx-auto mb-4" />
                                        <p className="text-gray-600">Loading bus details...</p>
                                    </div>
                                ) : error ? (
                                    <div className="text-center py-8">
                                        <FaExclamationTriangle className="text-3xl text-red-500 mx-auto mb-4" />
                                        <p className="text-red-600">{error}</p>
                                    </div>
                                ) : (
                                    <>
                                        {/* Route Info */}
                                        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 mb-6">
                                            <div className="flex items-center justify-between mb-3">
                                                <h4 className="font-semibold text-gray-800">Journey Details</h4>
                                                <FaRoute className="text-blue-500" />
                                            </div>
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-gray-600">From:</span>
                                                    <span className="font-semibold">{busDetails?.route?.startPoint}</span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-gray-600">To:</span>
                                                    <span className="font-semibold">{busDetails?.route?.endPoint}</span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-gray-600">Date:</span>
                                                    <span className="font-semibold">
                                                        {new Date(busDetails?.date).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Bus Details */}
                                        <div className="mb-6">
                                            <h5 className="font-semibold text-gray-700 mb-3">Bus Information</h5>
                                            <div className="space-y-2 text-sm">
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Bus Number:</span>
                                                    <span>{busDetails?.busNumber}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Bus Type:</span>
                                                    <span>{busDetails?.busType}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Boarding Point:</span>
                                                    <span>{boardingPoint}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Selected Seats */}
                                        <div className="mb-6">
                                            <h5 className="font-semibold text-gray-700 mb-3">Selected Seats</h5>
                                            <div className="flex flex-wrap gap-2">
                                                {selectedSeats?.map((seat) => (
                                                    <span
                                                        key={seat}
                                                        className="px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full text-sm font-semibold"
                                                    >
                                                        {seat}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Fare Breakdown */}
                                        <div className="mb-6">
                                            <h5 className="font-semibold text-gray-700 mb-3">Fare Details</h5>
                                            <div className="space-y-2">
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Seat Fare:</span>
                                                    <span>₹{totalFare} × {selectedSeats?.length}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Service Fee:</span>
                                                    <span>₹{serviceFee}</span>
                                                </div>
                                                <div className="border-t pt-2">
                                                    <div className="flex justify-between font-bold text-lg">
                                                        <span>Total Amount:</span>
                                                        <span className="text-blue-600">₹{totalAmount}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Features */}
                                        <div className="mb-6">
                                            <h5 className="font-semibold text-gray-700 mb-3">What's Included</h5>
                                            <div className="space-y-2">
                                                <div className="flex items-center text-sm text-gray-600">
                                                    <FaShieldAlt className="mr-2 text-green-500" />
                                                    <span>Free Cancellation (24h before)</span>
                                                </div>
                                                <div className="flex items-center text-sm text-gray-600">
                                                    <FaTicketAlt className="mr-2 text-blue-500" />
                                                    <span>E-Ticket & SMS Confirmation</span>
                                                </div>
                                                <div className="flex items-center text-sm text-gray-600">
                                                    <FaCreditCard className="mr-2 text-purple-500" />
                                                    <span>Secure Payment Gateway</span>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </motion.div>
                        </div>
                    </div>
                </div>

                {/* Payment Success Modal/Popup */}
                <AnimatePresence>
                    {showReceipt && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60"
                        >
                            <div className="relative w-full max-w-lg mx-auto">
                                {/* Modern Ticket Card */}
                                <div
                                    ref={receiptRef}
                                    className="bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col relative"
                                    style={{ maxHeight: '95vh' }}
                                >
                                    {/* Scrollable Content */}
                                    <div className="flex-1 overflow-y-auto">
                                        {/* Colored Header with App Name */}
                                        <div className="flex items-center justify-center bg-gradient-to-r from-blue-700 to-blue-400 py-5 px-6">
                                            <span className="text-white text-3xl font-extrabold tracking-wider drop-shadow">GoBus Ticket</span>
                                        </div>

                                        {/* Success Icon and Message */}
                                        <div className="flex flex-col items-center px-6 pt-2">
                                            <FaCheckCircle className="text-green-500 text-5xl mb-2 animate-bounce" />
                                            <h2 className="text-2xl font-extrabold mb-1 text-center text-gray-800">Payment Successful!</h2>
                                            <p className="text-gray-600 mb-2 text-center">Your ticket has been booked successfully.</p>
                                        </div>

                                        {/* QR and Barcode */}
                                        <div className="flex flex-col items-center px-6 mt-2 mb-2">
                                            {qrValue && (
                                                <div className="mb-2 border-4 border-blue-200 rounded-xl p-2 bg-blue-50">
                                                    <QRCodeCanvas value={qrValue} size={120} />
                                                </div>
                                            )}
                                            {qrValue && (
                                                <div className="mb-2">
                                                    <div className="bg-gray-900 text-white font-mono text-lg tracking-widest px-4 py-2 rounded">
                                                        {qrValue}
                                                    </div>
                                                    <div className="h-2 bg-gradient-to-r from-gray-900 to-gray-400 rounded mt-1" style={{ width: '80%' }}></div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Ticket Details Grid */}
                                        <div className="px-6 pb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {/* Passenger Details */}
                                            <div className="bg-blue-50 rounded-xl p-4 flex flex-col gap-1 shadow-sm">
                                                <h3 className="font-semibold text-base mb-1 flex items-center"><FaUser className="mr-2 text-blue-600" />Passenger</h3>
                                                <div className="text-gray-800 text-sm">
                                                    <div><span className="font-semibold">Name:</span> {userDetails.firstName} {userDetails.lastName}</div>
                                                    <div><span className="font-semibold">Phone:</span> {userDetails.phone}</div>
                                                    <div><span className="font-semibold">Email:</span> {userDetails.email}</div>
                                                </div>
                                            </div>
                                            {/* Ticket Details */}
                                            <div className="bg-green-50 rounded-xl p-4 flex flex-col gap-1 shadow-sm">
                                                <h3 className="font-semibold text-base mb-1 flex items-center"><FaBus className="mr-2 text-green-600" />Trip</h3>
                                                <div className="text-gray-800 text-sm">
                                                    <div><span className="font-semibold">Bus No:</span> {busDetails?.busNumber || "-"}</div>
                                                    <div><span className="font-semibold">Route:</span> {busDetails?.route?.routeName || from + " to " + to}</div>
                                                    <div><span className="font-semibold">Date:</span> <FaCalendarAlt className="inline mr-1 text-gray-500" />{busDetails?.date ? new Date(busDetails.date).toLocaleDateString() : date}</div>
                                                    <div><span className="font-semibold">Boarding:</span> <FaMapMarkerAlt className="inline mr-1 text-red-500" />{boardingPoint}</div>
                                                </div>
                                            </div>
                                            {/* Seat Details */}
                                            <div className="bg-yellow-50 rounded-xl p-4 flex flex-col gap-1 shadow-sm">
                                                <h3 className="font-semibold text-base mb-1 flex items-center"><FaCouch className="mr-2 text-yellow-600" />Seats</h3>
                                                <div className="text-gray-800 text-sm">
                                                    <div><span className="font-semibold">Selected:</span> {selectedSeats?.join(", ")}</div>
                                                    <div><span className="font-semibold">Count:</span> {selectedSeats?.length || 0}</div>
                                                    <div><span className="font-semibold">Type:</span> {busDetails?.busType || "Standard"}</div>
                                                </div>
                                            </div>
                                            {/* Pricing Details */}
                                            <div className="bg-purple-50 rounded-xl p-4 flex flex-col gap-1 shadow-sm">
                                                <h3 className="font-semibold text-base mb-1 flex items-center"><FaMoneyBillWave className="mr-2 text-purple-600" />Pricing</h3>
                                                <div className="text-gray-800 text-sm">
                                                    <div><span className="font-semibold">Base Fare:</span> ₹{totalFare}</div>
                                                    <div><span className="font-semibold">Service Fee:</span> ₹{serviceFee}</div>
                                                    <div className="border-t pt-1 mt-1 font-bold text-lg text-purple-700"><span className="font-semibold">Total:</span> ₹{totalAmount}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Download Button */}
                                    <div className="flex justify-center bg-gradient-to-r from-blue-700 to-blue-400 rounded-b-3xl shadow-2xl py-5 mt-2 sticky bottom-0 z-10">
                                        <button
                                            onClick={handleDownloadPDF}
                                            className="bg-white text-blue-700 px-8 py-3 rounded-xl font-extrabold text-lg shadow-lg hover:bg-blue-50 border-2 border-blue-700 transition"
                                        >
                                            <FaQrcode className="inline mr-2 text-blue-700 text-xl" /> Download Ticket as PDF
                                        </button>
                                    </div>
                                    {/* Close Button */}
                                    <button
                                        className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 bg-white rounded-full p-1 shadow"
                                        onClick={() => setShowReceipt(false)}
                                    >
                                        <FaTimes size={22} />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <Footer />
                <ToastContainer />
            </div>
        </Elements>
    );
};

export default Checkout;