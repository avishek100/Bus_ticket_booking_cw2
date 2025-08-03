import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import { FaCreditCard, FaMoneyBillWave, FaTruck, FaShieldAlt, FaLock, FaCheckCircle, FaMapMarkerAlt, FaUser, FaEnvelope, FaPhone } from "react-icons/fa";

import "react-toastify/dist/ReactToastify.css";
import Footer from "../common/customer/Footer";
import Layout from "../common/customer/layout";

const Checkout = () => {

    const { user } = useAuth();
    const userId = user.userId || sessionStorage.getItem('userId');

    const navigate = useNavigate();
    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

    if (!cartItems || cartItems.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center relative overflow-hidden">
                {/* Background Decorative Elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full opacity-5 blur-3xl"></div>
                    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-400 to-pink-600 rounded-full opacity-5 blur-3xl"></div>
                </div>
                
                <div className="text-center relative z-10">
                    <div className="w-24 h-24 bg-gradient-to-br from-orange-200 to-red-300 rounded-full flex items-center justify-center mx-auto mb-6">
                        <FaTruck className="w-12 h-12 text-orange-500" />
                    </div>
                    <h2 className="text-2xl font-semibold text-gray-800 mb-2">Your Cart is Empty</h2>
                    <p className="text-gray-600 mb-6">Add some items to your cart to proceed with checkout.</p>
                    <button 
                        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                        onClick={() => navigate('/menu')}
                    >
                        Continue Shopping
                    </button>
                </div>
            </div>
        );
    }

    const subtotal = cartItems.reduce((total, item) => total + Number(item.itemId.price) * item.quantity, 0);
    const deliveryCharge = subtotal > 0 ? 5.00 : 0;
    const totalPrice = (subtotal + deliveryCharge).toFixed(2);

    const [paymentMethod, setPaymentMethod] = useState("cod");
    const [billingDetails, setBillingDetails] = useState({
        fullName: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        zipCode: "",
    });

    const [cardDetails, setCardDetails] = useState({
        cardNumber: "",
        cvv: "",
        zipCode: "",
    });

    const [showCardForm, setShowCardForm] = useState(false);

    const handleInputChange = (e) => {
        setBillingDetails({ ...billingDetails, [e.target.name]: e.target.value });
    };

    const handleCardInputChange = (e) => {
        setCardDetails({ ...cardDetails, [e.target.name]: e.target.value });
    };

    const handlePaymentChange = (method) => {
        setPaymentMethod(method);
        if (method === "stripe") {
            setShowCardForm(true);
        } else {
            setShowCardForm(false);
        }
    }

    const handleStripePayment = async () => {
        // Validate card details
        if (!cardDetails.cardNumber || !cardDetails.cvv || !cardDetails.zipCode) {
            toast.error('Please fill in all card details.');
            return;
        }

        if (cardDetails.cardNumber.length < 16) {
            toast.error('Please enter a valid card number.');
            return;
        }

        if (cardDetails.cvv.length < 3) {
            toast.error('Please enter a valid CVV.');
            return;
        }

        try {
            // Simulate payment processing
            toast.info('Processing payment...', { autoClose: 2000 });
            
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 2000));

            // For demo purposes, simulate successful payment
            toast.success('Payment processed successfully!', { autoClose: 3000 });

            // Create order data
            const orderData = {
                userId: userId || null, // Allow null for guest orders
                cartItems: cartItems.map(item => ({
                    itemId: item.itemId._id || item.itemId, // Ensure we send the ID
                    price: Number(item.itemId.price),
                    quantity: item.quantity,
                })),
                billingDetails,
                paymentMethod: "stripe",
                subtotal: Number(subtotal),
                deliveryCharge: Number(deliveryCharge),
                totalPrice: Number(totalPrice),
                status: "paid",
                stripeSessionId: "demo_session_" + Date.now(),
            };

            // Create order in database
            const response = await fetch("http://localhost:3000/api/v1/order/orders", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(orderData),
            });

            if (response.ok) {
                localStorage.removeItem("cartItems");
                toast.success("🎉 Order placed successfully!", {
                    position: "top-right",
                    autoClose: 5000,
                });

                setTimeout(() => {
                    navigate("/checkout/success");
                }, 3000);
            } else {
                const errorData = await response.json();
                toast.error(errorData.message || "❌ Error creating order. Please try again.", {
                    position: "top-right",
                    autoClose: 5000,
                });
            }
        } catch (error) {
            console.error("Payment error:", error);
            toast.error("❌ Payment failed. Please try again.", {
                position: "top-right",
                autoClose: 5000,
            });
        }
    };

    const handleOrderSubmit = async () => {
        if (totalPrice > 5000.0) {
            toast.error("Amount exceeds the limit of Rs 5000. Please reduce the total price.");
            return;
        }

        if (paymentMethod === "stripe") {
            await handleStripePayment();
            return;
        }

        const orderData = {
            userId: userId || null, // Allow null for guest orders
            cartItems: cartItems.map(item => ({
                itemId: item.itemId._id || item.itemId, // Ensure we send the ID
                price: Number(item.itemId.price),
                quantity: item.quantity,
            })),
            billingDetails,
            paymentMethod,
            subtotal: Number(subtotal),
            deliveryCharge: Number(deliveryCharge),
            totalPrice: Number(totalPrice),
            status: "pending",
        };

        try {
            const response = await fetch("http://localhost:3000/api/v1/order/orders", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(orderData),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.removeItem("cartItems");
                
                // Clear cart from database only if user is logged in
                if (userId) {
                    try {
                        const clearCartResponse = await fetch(`http://localhost:3000/api/v1/cart/clear/${userId}`, {
                            method: 'DELETE',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                        });
                        
                        if (clearCartResponse.ok) {
                            console.log('Cart cleared successfully from database');
                        } else {
                            console.log('Failed to clear cart from database');
                        }
                    } catch (error) {
                        console.error('Error clearing cart:', error);
                    }
                }
                
                toast.success("Order placed successfully!", {
                    position: "top-right",
                    autoClose: 5000,
                });

                setTimeout(() => {
                    navigate("/checkout/success");
                }, 5000);
            } else {
                toast.error(data.message || "Error placing order. Please try again.", {
                    position: "top-right",
                    autoClose: 5000,
                });
            }
        } catch (error) {
            console.error("Error:", error);
            toast.error("Network error. Please try again.", {
                position: "top-right",
                autoClose: 5000,
            });
        }
    };

    return (
        <>
            <Layout />
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 relative overflow-hidden py-20">
                {/* Background Decorative Elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full opacity-5 blur-3xl"></div>
                    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-400 to-pink-600 rounded-full opacity-5 blur-3xl"></div>
                </div>
                
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white">
                            <div className="flex items-center space-x-3">
                                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                                    <FaCheckCircle className="w-6 h-6" />
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold">Secure Checkout</h1>
                                    <p className="text-blue-100">Complete your order with confidence</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-8">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* Left Column - Billing & Payment */}
                                <div className="space-y-8">
                                    {/* Billing Details */}
                                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-200">
                                        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                                            <FaMapMarkerAlt className="w-6 h-6 text-blue-600 mr-3" />
                                            Billing Details
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="md:col-span-2">
                                                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                                                    <FaUser className="w-4 h-4 mr-2" />
                                                    Full Name
                                                </label>
                                                <input 
                                                    type="text" 
                                                    name="fullName" 
                                                    placeholder="Enter your full name" 
                                                    value={billingDetails.fullName} 
                                                    onChange={handleInputChange} 
                                                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white" 
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                                                    <FaEnvelope className="w-4 h-4 mr-2" />
                                                    Email Address
                                                </label>
                                                <input 
                                                    type="email" 
                                                    name="email" 
                                                    placeholder="your@email.com" 
                                                    value={billingDetails.email} 
                                                    onChange={handleInputChange} 
                                                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white" 
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                                                    <FaPhone className="w-4 h-4 mr-2" />
                                                    Phone Number
                                                </label>
                                                <input 
                                                    type="tel" 
                                                    name="phone" 
                                                    placeholder="+1 (555) 123-4567" 
                                                    value={billingDetails.phone} 
                                                    onChange={handleInputChange} 
                                                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white" 
                                                />
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                                                    <FaMapMarkerAlt className="w-4 h-4 mr-2" />
                                                    Street Address
                                                </label>
                                                <input 
                                                    type="text" 
                                                    name="address" 
                                                    placeholder="123 Main Street, Apt 4B" 
                                                    value={billingDetails.address} 
                                                    onChange={handleInputChange} 
                                                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white" 
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">City</label>
                                                <input 
                                                    type="text" 
                                                    name="city" 
                                                    placeholder="New York" 
                                                    value={billingDetails.city} 
                                                    onChange={handleInputChange} 
                                                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white" 
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">Zip Code</label>
                                                <input 
                                                    type="text" 
                                                    name="zipCode" 
                                                    placeholder="10001" 
                                                    value={billingDetails.zipCode} 
                                                    onChange={handleInputChange} 
                                                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white" 
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Payment Method */}
                                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
                                        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                                            <FaCreditCard className="w-6 h-6 text-green-600 mr-3" />
                                            Payment Method
                                        </h3>
                                        <div className="space-y-4">
                                            <label className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                                                paymentMethod === "stripe" 
                                                    ? "border-green-500 bg-green-50" 
                                                    : "border-gray-200 hover:border-green-300"
                                            }`} onClick={() => handlePaymentChange("stripe")}>
                                                <input type="radio" name="paymentMethod" value="stripe" checked={paymentMethod === "stripe"} onChange={() => handlePaymentChange("stripe")} className="hidden" />
                                                <div className="flex items-center space-x-4">
                                                    <div className="w-6 h-6 border-2 border-gray-400 rounded-full flex justify-center items-center">
                                                        {paymentMethod === "stripe" && <div className="w-3 h-3 bg-green-600 rounded-full"></div>}
                                                    </div>
                                                    <div className="flex items-center space-x-3">
                                                        <FaCreditCard className="w-5 h-5 text-green-600" />
                                                        <div>
                                                            <span className="font-semibold text-gray-800">Online Payment</span>
                                                            <p className="text-sm text-gray-600">Secure payment with card details</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </label>

                                            <label className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                                                paymentMethod === "cod" 
                                                    ? "border-orange-500 bg-orange-50" 
                                                    : "border-gray-200 hover:border-orange-300"
                                            }`} onClick={() => handlePaymentChange("cod")}>
                                                <input type="radio" name="paymentMethod" value="cod" checked={paymentMethod === "cod"} onChange={() => handlePaymentChange("cod")} className="hidden" />
                                                <div className="flex items-center space-x-4">
                                                    <div className="w-6 h-6 border-2 border-gray-400 rounded-full flex justify-center items-center">
                                                        {paymentMethod === "cod" && <div className="w-3 h-3 bg-orange-600 rounded-full"></div>}
                                                    </div>
                                                    <div className="flex items-center space-x-3">
                                                        <FaMoneyBillWave className="w-5 h-5 text-orange-600" />
                                                        <div>
                                                            <span className="font-semibold text-gray-800">Cash on Delivery</span>
                                                            <p className="text-sm text-gray-600">Pay in cash when your order is delivered</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </label>
                                        </div>

                                        {/* Card Details Form */}
                                        {showCardForm && (
                                            <div className="mt-6 bg-white p-6 rounded-xl border border-green-200">
                                                <h4 className="text-lg font-semibold mb-4 text-green-600 flex items-center">
                                                    <FaLock className="w-5 h-5 mr-2" />
                                                    Secure Card Details
                                                </h4>
                                                <div className="space-y-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
                                                        <input
                                                            type="text"
                                                            name="cardNumber"
                                                            placeholder="1234 5678 9012 3456"
                                                            value={cardDetails.cardNumber}
                                                            onChange={handleCardInputChange}
                                                            className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200"
                                                            maxLength="19"
                                                        />
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-2">CVV</label>
                                                            <input
                                                                type="text"
                                                                name="cvv"
                                                                placeholder="123"
                                                                value={cardDetails.cvv}
                                                                onChange={handleCardInputChange}
                                                                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200"
                                                                maxLength="4"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-2">Zip Code</label>
                                                            <input
                                                                type="text"
                                                                name="zipCode"
                                                                placeholder="12345"
                                                                value={cardDetails.zipCode}
                                                                onChange={handleCardInputChange}
                                                                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200"
                                                                maxLength="10"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Right Column - Order Summary */}
                                <div className="space-y-6">
                                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200">
                                        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                                            <FaTruck className="w-6 h-6 text-purple-600 mr-3" />
                                            Order Summary
                                        </h3>
                                        
                                        {/* Cart Items */}
                                        <div className="space-y-4 mb-6">
                                            {cartItems.map((item, index) => (
                                                <div key={index} className="flex items-center space-x-4 p-4 bg-white rounded-xl border border-gray-200">
                                                    <img 
                                                        src={item.itemId.image ? `http://localhost:3000/uploads/${item.itemId.image}` : undefined} 
                                                        className="w-16 h-16 rounded-lg object-cover border border-gray-200" 
                                                        alt={item.itemId.name}
                                                    />
                                                    <div className="flex-1">
                                                        <h4 className="font-semibold text-gray-800">{item.itemId.name}</h4>
                                                        <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <span className="font-bold text-gray-800">${(item.itemId.price * item.quantity).toFixed(2)}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Price Breakdown */}
                                        <div className="space-y-3 border-t pt-4">
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-600">Subtotal:</span>
                                                <span className="font-semibold">${subtotal.toFixed(2)}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-600">Delivery Charge:</span>
                                                <span className="font-semibold">${deliveryCharge.toFixed(2)}</span>
                                            </div>
                                            <div className="flex justify-between items-center pt-3 border-t">
                                                <span className="text-lg font-bold text-gray-800">Total:</span>
                                                <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">${totalPrice}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Security Badges */}
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="text-center p-4 bg-green-50 rounded-xl border border-green-200">
                                            <FaShieldAlt className="w-6 h-6 text-green-600 mx-auto mb-2" />
                                            <p className="text-xs font-medium text-green-800">Secure Payment</p>
                                        </div>
                                        <div className="text-center p-4 bg-blue-50 rounded-xl border border-blue-200">
                                            <FaTruck className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                                            <p className="text-xs font-medium text-blue-800">Fast Delivery</p>
                                        </div>
                                        <div className="text-center p-4 bg-purple-50 rounded-xl border border-purple-200">
                                            <FaCheckCircle className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                                            <p className="text-xs font-medium text-purple-800">Quality Assured</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="mt-8 flex justify-end space-x-4">
                                <button 
                                    onClick={() => navigate('/menu')}
                                    className="px-8 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:border-gray-400 transition-all duration-200"
                                >
                                    Continue Shopping
                                </button>
                                <button 
                                    onClick={handleOrderSubmit} 
                                    className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                                >
                                    {paymentMethod === "stripe" ? "Pay Now" : "Confirm Order"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer 
                position="top-right" 
                autoClose={3000} 
                hideProgressBar 
                theme="light"
                toastClassName="rounded-lg shadow-lg"
            />
            <Footer />
        </>
    );
};

export default Checkout; 