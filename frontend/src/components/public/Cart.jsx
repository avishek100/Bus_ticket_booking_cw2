import axios from 'axios';
import { Trash, ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import Footer from '../common/customer/Footer';
import Layout from '../common/customer/layout';
import { useAuth } from '../../context/AuthContext';

const Cart = () => {
    const { user } = useAuth();
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Get userId from multiple sources
    const getUserId = () => {
        return sessionStorage.getItem('userId') || localStorage.getItem('userId') || user?.userId;
    };

    const userId = getUserId();
    const navigate = useNavigate();  // Initialize useNavigate

    useEffect(() => {
        if (userId) {
            // Fetch cart data from API
            axios.get(`http://localhost:3000/api/v1/cart/${userId}`)
                .then(response => {
                    // Accessing items array and setting the state
                    setCartItems(response.data.items); // Assuming response.data.items contains the list of items
                    setLoading(false);
                })
                .catch(err => {
                    setError("Error fetching cart data.");
                    setLoading(false);
                });
        } else {
            setError("No user ID found.");
            setLoading(false);
        }
    }, [userId]);

    const handleProceedToCheckout = async () => {
        localStorage.setItem("cartItems", JSON.stringify(cartItems));
        navigate("/checkout");

        const userId = getUserId(); // Retrieve userId

        if (!userId) {
            console.error("Error: No user ID found.");
            return;
        }

        try {
            await axios.delete(`http://localhost:3000/api/v1/cart/clear/${userId}`);
            setCartItems([]); // Clear the cart state
        } catch (error) {
            console.error("Error clearing cart:", error);
        }
    };

    const handleQuantityChange = async (id, type) => {
        setCartItems(prevItems => {
            const updatedItems = prevItems.map(item =>
                item.itemId._id === id
                    ? { ...item, quantity: type === "increase" ? item.quantity + 1 : Math.max(1, item.quantity - 1) }
                    : item
            );
            // Make the API call to update the cart on the server
            const itemToUpdate = updatedItems.find(item => item.itemId._id === id);

            axios.put(`http://localhost:3000/api/v1/cart/update`, {
                customerId: userId,
                itemId: id,
                quantity: itemToUpdate.quantity
            })
                .then(response => {
                    console.log("Cart updated successfully", response.data);
                })
                .catch(error => {
                    console.error("Error updating cart:", error);
                });

            return updatedItems;
        });
    };

    const handleRemoveItem = async (itemId) => {
        const customerId = getUserId();

        if (!customerId) {
            setError("No user ID found.");
            return;
        }

        try {
            // Make the DELETE request to remove the item from the cart
            const response = await axios.delete(`http://localhost:3000/api/v1/cart/remove/${itemId}`, {
                params: { customerId },
            });

            // Log the response to verify success
            console.log(response.data); // Log response
            toast.success("Item removed from cart successfully.");

            // Update cartItems state by removing the deleted item
            setCartItems((prevItems) => prevItems.filter(item => item.itemId._id !== itemId));

        } catch (error) {
            console.error("Error removing item from cart:", error.response ? error.response.data : error.message);
            setError("Error removing item from cart.");
        }
    };

    // Calculate total prices
    const subtotal = cartItems.reduce((total, item) => total + Number(item.itemId.price) * item.quantity, 0);
    const deliveryCharge = subtotal > 0 ? 5.00 : 0; // Set a delivery charge of $5 if subtotal is > $0
    const totalPrice = (subtotal + deliveryCharge).toFixed(2);

    return (
        <>
            <Layout />
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 relative overflow-hidden py-20">
                {/* Background Decorative Elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full opacity-5 blur-3xl"></div>
                    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-400 to-pink-600 rounded-full opacity-5 blur-3xl"></div>
                </div>
                
                <div className="max-w-6xl mx-auto p-6 relative z-10">
                    <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-8 border border-gray-200">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                                <ShoppingCart className="text-white" size={24} />
                            </div>
                            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Shopping Cart</h2>
                        </div>

                        {loading ? (
                            <div className="flex justify-center items-center py-12">
                                <div className="flex items-center space-x-3">
                                    <svg className="animate-spin h-8 w-8 text-blue-600" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                                    </svg>
                                    <span className="text-lg font-semibold text-gray-700">Loading your cart...</span>
                                </div>
                            </div>
                        ) : error ? (
                            <div className="text-center py-12">
                                <div className="w-24 h-24 bg-gradient-to-br from-red-200 to-red-300 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-700 mb-2">Error Loading Cart</h3>
                                <p className="text-red-500 text-lg">{error}</p>
                            </div>
                        ) : cartItems.length > 0 ? (
                            <>
                                {/* Cart Table */}
                                <div className="overflow-x-auto">
                                    <table className="w-full border-collapse">
                                        {/* Table Header */}
                                        <thead>
                                            <tr className="bg-gradient-to-r from-blue-50 to-purple-50 border-b-2 border-blue-200">
                                                <th className="p-4 text-left text-gray-800 font-semibold text-lg">Product</th>
                                                <th className="p-4 text-center text-gray-800 font-semibold text-lg">Image</th>
                                                <th className="p-4 text-center text-gray-800 font-semibold text-lg">Price</th>
                                                <th className="p-4 text-center text-gray-800 font-semibold text-lg">Quantity</th>
                                                <th className="p-4 text-center text-gray-800 font-semibold text-lg">Subtotal</th>
                                                <th className="p-4 text-center text-gray-800 font-semibold text-lg">Action</th>
                                            </tr>
                                        </thead>
                                        {/* Table Body */}
                                        <tbody>
                                            {cartItems.map((item) => (
                                                <tr key={`${item.itemId._id}-${item._id}`} className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-purple-50/50 transition-all duration-300">
                                                    <td className="p-4">
                                                        <div className="font-medium text-lg text-gray-800">{item.itemId.name}</div>
                                                    </td>
                                                    <td className="p-4 text-center">
                                                        <div className="relative">
                                                            <img
                                                                src={item.itemId.image ? `http://localhost:3000/uploads/${item.itemId.image}` : undefined}
                                                                alt={item.itemId.name}
                                                                className="w-20 h-20 object-cover rounded-lg mx-auto shadow-md hover:scale-110 transition-transform duration-300"
                                                            />
                                                        </div>
                                                    </td>
                                                    <td className="p-4 text-center">
                                                        <div className="font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">${item.itemId.price}</div>
                                                    </td>
                                                    <td className="p-4 text-center">
                                                        <div className="flex items-center justify-center">
                                                            <button
                                                                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-2 rounded-l-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-bold shadow-lg"
                                                                onClick={() => handleQuantityChange(item.itemId._id, "decrease")}
                                                                disabled={item.quantity <= 1}
                                                            >
                                                                -
                                                            </button>
                                                            <span className="w-16 py-2 text-center border-t border-b border-blue-500 flex items-center justify-center font-semibold text-lg bg-blue-50">
                                                                {item.quantity}
                                                            </span>
                                                            <button
                                                                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-2 rounded-r-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-bold shadow-lg"
                                                                onClick={() => handleQuantityChange(item.itemId._id, "increase")}
                                                            >
                                                                +
                                                            </button>
                                                        </div>
                                                    </td>
                                                    <td className="p-4 text-center">
                                                        <div className="font-bold text-xl bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                                                            ${(Number(item.itemId.price) * item.quantity).toFixed(2)}
                                                        </div>
                                                    </td>
                                                    <td className="p-4 text-center">
                                                        <button
                                                            className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-lg hover:from-red-600 hover:to-pink-600 transition-all duration-300 flex items-center gap-2 mx-auto shadow-lg hover:shadow-xl"
                                                            onClick={() => handleRemoveItem(item.itemId._id)}
                                                            title="Remove from Cart"
                                                        >
                                                            <Trash size={18} />
                                                            <span className="text-sm font-medium">Remove</span>
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Cart Total Section */}
                                <div className="mt-8 flex justify-end">
                                    <div className="bg-white/60 backdrop-blur-sm p-6 rounded-xl shadow-lg w-full sm:w-1/3 border border-gray-200">
                                        <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Cart Summary</h3>
                                        <div className="space-y-4">
                                            <div className="flex justify-between border-b border-gray-200 pb-3">
                                                <span className="text-gray-600 text-lg">Subtotal:</span>
                                                <span className="font-bold text-lg">${subtotal.toFixed(2)}</span>
                                            </div>
                                            <div className="flex justify-between border-b border-gray-200 pb-3">
                                                <span className="text-gray-600 text-lg">Delivery Charge:</span>
                                                <span className="font-bold text-lg">${deliveryCharge.toFixed(2)}</span>
                                            </div>
                                            <div className="flex justify-between pt-3 text-xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                                                <span>Total:</span>
                                                <span>${totalPrice}</span>
                                            </div>
                                        </div>

                                        {/* Checkout Button */}
                                        <button 
                                            className="w-full mt-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white px-6 py-4 rounded-xl shadow-lg hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 transition-all duration-300 font-semibold text-lg" 
                                            onClick={handleProceedToCheckout}
                                        >
                                            Proceed to Checkout
                                        </button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="text-center py-16">
                                <div className="w-24 h-24 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <ShoppingCart className="w-12 h-12 text-gray-400" />
                                </div>
                                <h3 className="text-2xl font-semibold text-gray-700 mb-2">Your Cart is Empty</h3>
                                <p className="text-gray-500 mb-6">Start adding your favorite cases to your cart!</p>
                                <button 
                                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl"
                                    onClick={() => window.location.href = '/menu'}
                                >
                                    Start Shopping
                                </button>
                            </div>
                        )}
                    </div>
                </div>
                <ToastContainer 
                    position="top-right" 
                    autoClose={3000} 
                    hideProgressBar 
                    theme="light"
                    toastClassName="rounded-lg shadow-lg"
                />
            </div>
            <Footer />
        </>
    );
};

export default Cart;
