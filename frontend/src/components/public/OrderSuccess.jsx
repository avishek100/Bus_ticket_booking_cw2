import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import { FaCheckCircle, FaHome, FaEnvelope, FaPhone, FaTruck, FaStar, FaGift } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";

const OrderSuccess = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [isProcessing, setIsProcessing] = useState(false);
    const { user } = useAuth();
    const userId = user.userId || sessionStorage.getItem('userId');

    const sessionId = searchParams.get('session_id');
    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

    useEffect(() => {
        // If there's a session_id, it means this is a Stripe payment success
        if (sessionId) {
            handleStripePaymentSuccess();
        }
    }, [sessionId]);

    const handleStripePaymentSuccess = async () => {
        if (isProcessing) return;
        
        setIsProcessing(true);
        
        try {
            // Create order data
            const subtotal = cartItems.reduce((total, item) => total + Number(item.itemId.price) * item.quantity, 0);
            const deliveryCharge = subtotal > 0 ? 5.00 : 0;
            const totalPrice = (subtotal + deliveryCharge).toFixed(2);

            const orderData = {
                userId: userId || null, // Allow null for guest orders
                cartItems: cartItems.map(item => ({
                    itemId: item.itemId._id || item.itemId, // Ensure we send the ID
                    price: Number(item.itemId.price),
                    quantity: item.quantity,
                })),
                billingDetails: {
                    fullName: "",
                    email: "",
                    phone: "",
                    address: "",
                    city: "",
                    zipCode: "",
                },
                paymentMethod: "stripe",
                subtotal: Number(subtotal),
                deliveryCharge: Number(deliveryCharge),
                totalPrice: Number(totalPrice),
                status: "paid",
                stripeSessionId: sessionId,
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
                
                toast.success("🎉 Payment successful! Your order has been placed.", {
                    position: "top-right",
                    autoClose: 5000,
                });
            } else {
                toast.error("❌ Error creating order. Please contact support.", {
                    position: "top-right",
                    autoClose: 5000,
                });
            }
        } catch (error) {
            console.error("Error creating order:", error);
            toast.error("❌ Network error. Please contact support.", {
                position: "top-right",
                autoClose: 5000,
            });
        } finally {
            setIsProcessing(false);
        }
    };

    // Function to redirect the user back to the home page
    const handleGoHome = () => {
        navigate("/");
    };

    return (
        <>
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex flex-col justify-center items-center py-20 relative overflow-hidden">
                {/* Background Decorative Elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full opacity-10 blur-3xl"></div>
                    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full opacity-10 blur-3xl"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-indigo-400 to-blue-600 rounded-full opacity-5 blur-3xl"></div>
                        </div>

                <div className="max-w-4xl mx-auto px-6 relative z-10">
                    <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-200 overflow-hidden">
                        {/* Success Header */}
                        <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-8 text-center relative overflow-hidden">
                            <div className="absolute inset-0 bg-black/10"></div>
                            <div className="relative z-10">
                                <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                                    <FaCheckCircle className="w-12 h-12 text-white" />
                    </div>
                                <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
                        {sessionId ? "Payment Successful!" : "Order Placed Successfully!"}
                                </h1>
                                <p className="text-white/90 text-lg max-w-2xl mx-auto">
                        {sessionId 
                                        ? "Your payment has been processed successfully and your order has been placed. Thank you for choosing our service!"
                                        : "Your order has been placed successfully. Thank you for choosing our service!"
                        }
                    </p>
                            </div>
                        </div>

                        {/* Order Details */}
                        <div className="p-8 lg:p-12">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* Left Column - Order Summary */}
                                <div className="space-y-6">
                                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-200">
                                        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                                            <FaGift className="w-6 h-6 text-blue-600 mr-3" />
                                            Order Summary
                                        </h3>
                                        <div className="space-y-3">
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-600">Items:</span>
                                                <span className="font-semibold">{cartItems.length}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-600">Total Amount:</span>
                                                <span className="font-bold text-lg text-green-600">
                                                    ${cartItems.reduce((total, item) => total + Number(item.itemId.price) * item.quantity, 0).toFixed(2)}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-600">Payment Method:</span>
                                                <span className="font-semibold text-blue-600">
                                                    {sessionId ? "Online Payment" : "Cash on Delivery"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* What's Next */}
                                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
                                        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                                            <FaTruck className="w-6 h-6 text-green-600 mr-3" />
                                            What's Next?
                                        </h3>
                                        <div className="space-y-4">
                                            <div className="flex items-start space-x-3">
                                                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                                    <span className="text-white text-xs font-bold">1</span>
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-800">Order Confirmation</p>
                                                    <p className="text-sm text-gray-600">You'll receive an email confirmation shortly</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start space-x-3">
                                                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                                    <span className="text-white text-xs font-bold">2</span>
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-800">Order Processing</p>
                                                    <p className="text-sm text-gray-600">We'll start preparing your order right away</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start space-x-3">
                                                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                                    <span className="text-white text-xs font-bold">3</span>
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-800">Delivery</p>
                                                    <p className="text-sm text-gray-600">Your order will be delivered within 2-3 business days</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Column - Contact & Actions */}
                                <div className="space-y-6">
                                    {/* Contact Information */}
                                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200">
                                        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                                            <FaEnvelope className="w-6 h-6 text-purple-600 mr-3" />
                                            Need Help?
                                        </h3>
                                        <div className="space-y-4">
                                            <div className="flex items-center space-x-3">
                                                <FaEnvelope className="w-5 h-5 text-purple-600" />
                                                <div>
                                                    <p className="font-semibold text-gray-800">Email Support</p>
                                                    <p className="text-sm text-gray-600">support@example.com</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-3">
                                                <FaPhone className="w-5 h-5 text-purple-600" />
                                                <div>
                                                    <p className="font-semibold text-gray-800">Phone Support</p>
                                                    <p className="text-sm text-gray-600">+1 (555) 123-4567</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="space-y-4">
                        <button
                            onClick={handleGoHome}
                                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-lg transform hover:scale-105 flex items-center justify-center space-x-3"
                                        >
                                            <FaHome size={20} />
                                            <span>Back to Home</span>
                                        </button>
                                        
                                        <button
                                            onClick={() => navigate("/menu")}
                                            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-lg transform hover:scale-105 flex items-center justify-center space-x-3"
                                        >
                                            <FaStar size={20} />
                                            <span>Continue Shopping</span>
                        </button>
                                    </div>

                                    {/* Trust Badges */}
                                    <div className="grid grid-cols-3 gap-4 pt-4">
                                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                                            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2">
                                                <FaCheckCircle className="w-4 h-4 text-white" />
                                            </div>
                                            <p className="text-xs font-medium text-gray-700">Secure Payment</p>
                                        </div>
                                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                                            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-2">
                                                <FaTruck className="w-4 h-4 text-white" />
                                            </div>
                                            <p className="text-xs font-medium text-gray-700">Fast Delivery</p>
                                        </div>
                                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                                            <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-2">
                                                <FaStar className="w-4 h-4 text-white" />
                                            </div>
                                            <p className="text-xs font-medium text-gray-700">Quality Assured</p>
                                        </div>
                                    </div>
                                </div>
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
        </>
    );
};

export default OrderSuccess;
