import axios from "axios";
import { ShoppingCart, Trash, Heart } from "lucide-react";
import { useEffect, useState } from "react";
import Footer from '../common/customer/Footer';
import Layout from '../common/customer/layout';

const API_BASE_URL = "http://localhost:3000/api/v1/wishlist";

const Wishlist = () => {
    const [wishlistItems, setWishlistItems] = useState([]);
    const [cartItems, setCartItems] = useState([]);
    const [customerId, setCustomerId] = useState(null);  // Store userId from localStorage

    // Fetch userId from localStorage on component mount
    useEffect(() => {
        const storedUserId = localStorage.getItem("userId");
        if (storedUserId) {
            setCustomerId(storedUserId);
            fetchWishlist(storedUserId);  // Fetch wishlist for this user
        }
    }, []);

    // Fetch Wishlist Items from API
    const fetchWishlist = async (id) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/customer/${id}`);
            setWishlistItems(response.data.wishlist.map(item => ({
                ...item,
                itemId: { ...item.itemId, price: Number(item.itemId.price) }
            })));
        } catch (error) {
            console.error("Error fetching wishlist:", error);
        }
    };

    const handleRemoveItem = async (itemId) => {
        try {
            const response = await axios.delete(`${API_BASE_URL}/remove/${itemId}`, { params: { customerId } });
            console.log(response.data); // Log the response to check success message

            // Directly update the wishlistItems state by removing the deleted item
            setWishlistItems((prevItems) => prevItems.filter(item => item._id !== itemId));
        } catch (error) {
            console.error("Error removing item:", error);
        }
    };


    // Handle Move Item to Cart
    const handleMoveToCart = async (item) => {
        try {
            // Simulate adding item to cart
            setCartItems(prevItems => [...prevItems, { ...item, quantity: 1 }]);
            // Remove item from wishlist after moving it to cart
            await handleRemoveItem(item._id);
        } catch (error) {
            console.error("Error moving to cart:", error);
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
                
                <div className="max-w-6xl mx-auto p-6 relative z-10">
                    <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-8 border border-gray-200">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-500 rounded-lg flex items-center justify-center shadow-lg">
                                <Heart className="text-white" size={24} />
                            </div>
                            <h2 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">My Wishlist</h2>
                        </div>

                        {wishlistItems.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse">
                                    <thead>
                                        <tr className="bg-gradient-to-r from-red-50 to-pink-50 border-b-2 border-red-200">
                                            <th className="p-4 text-left text-gray-800 font-semibold text-lg">Product</th>
                                            <th className="p-4 text-center text-gray-800 font-semibold text-lg">Image</th>
                                            <th className="p-4 text-center text-gray-800 font-semibold text-lg">Price</th>
                                            <th className="p-4 text-center text-gray-800 font-semibold text-lg">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {wishlistItems.map((item) => (
                                            <tr key={item._id} className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-red-50/50 hover:to-pink-50/50 transition-all duration-300">
                                                <td className="p-4 text-gray-800">
                                                    <div className="font-medium text-lg">{item.itemId.name}</div>
                                                </td>
                                                <td className="p-4 text-center">
                                                    <div className="relative">
                                                        <img 
                                                            src={item.itemId.image ? `http://localhost:3000/uploads/${item.itemId.image}` : undefined} 
                                                            className="w-20 h-20 object-cover rounded-lg mx-auto shadow-md hover:scale-110 transition-transform duration-300" 
                                                            alt={item.itemId.name}
                                                        />
                                                    </div>
                                                </td>
                                                <td className="p-4 text-center">
                                                    <div className="font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                                        ${item.itemId.price.toFixed(2)}
                                                    </div>
                                                </td>
                                                <td className="p-4 text-center">
                                                    <div className="flex items-center justify-center gap-3">
                                                        <button
                                                            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl"
                                                            onClick={() => handleMoveToCart(item)}
                                                            title="Move to Cart"
                                                        >
                                                            <ShoppingCart size={18} />
                                                            <span className="text-sm font-medium">Add to Cart</span>
                                                        </button>
                                                        <button
                                                            className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-lg hover:from-red-600 hover:to-pink-600 transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl"
                                                            onClick={() => handleRemoveItem(item._id)}
                                                            title="Remove from Wishlist"
                                                        >
                                                            <Trash size={18} />
                                                            <span className="text-sm font-medium">Remove</span>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-center py-16">
                                <div className="w-24 h-24 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Heart className="w-12 h-12 text-gray-400" />
                                </div>
                                <h3 className="text-2xl font-semibold text-gray-700 mb-2">Your Wishlist is Empty</h3>
                                <p className="text-gray-500 mb-6">Start adding your favorite cases to your wishlist!</p>
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
            </div>
            <Footer />
        </>
    );
};

export default Wishlist;
