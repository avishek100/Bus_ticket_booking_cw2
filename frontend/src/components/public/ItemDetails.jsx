import axios from "axios";
import { useEffect, useState } from "react";
import { FaHeart, FaShoppingCart, FaStar, FaTruck, FaShieldAlt, FaUndo } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Footer from "../common/customer/Footer";
import Layout from "../common/customer/Layout";
import { useAuth } from "../../context/AuthContext";

const ItemDetails = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const [item, setItem] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [selectedImage, setSelectedImage] = useState(0);

    // Get customerId from multiple sources
    const getCustomerId = () => {
        // Try sessionStorage first, then localStorage, then useAuth context
        return sessionStorage.getItem('userId') || localStorage.getItem('userId') || user?.userId;
    };

    useEffect(() => {
        const fetchItemDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/api/v1/item/getItem/${id}`);
                console.log("Fetched item data:", response.data.data);
                setItem(response.data.data);
            } catch (error) {
                console.error("Error fetching item:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchItemDetails();
    }, [id]);

    useEffect(() => {
        const customerId = getCustomerId();
        if (!customerId || !item) return;

        axios.get(`http://localhost:3000/api/v1/wishlist/check/${item._id}`, { params: { customerId } })
            .then((res) => {
                console.log("Wishlist status:", res.data.isWishlisted);
                setIsWishlisted(res.data.isWishlisted);
            })
            .catch((err) => console.error("Error checking wishlist:", err));
    }, [item]);

    const toggleWishlist = async () => {
        const customerId = getCustomerId();
        if (!customerId) {
            toast.error("Please log in to manage your wishlist.");
            return;
        }
        try {
            if (isWishlisted) {
                await axios.delete(`http://localhost:3000/api/v1/wishlist/remove/${item._id}`, { params: { customerId } });
            } else {
                await axios.post(`http://localhost:3000/api/v1/wishlist/add`, { customerId, itemId: item._id });
            }
            setIsWishlisted((prev) => !prev);
            toast.success(isWishlisted ? "Removed from wishlist" : "Added to wishlist");
        } catch (error) {
            console.error("Error toggling wishlist:", error);
            toast.error("Failed to update wishlist.");
        }
    };

    const addToCart = async () => {
        const customerId = getCustomerId();
        if (!customerId) {
            toast.error("Please log in to add items to your cart.");
            return;
        }
        try {
            await axios.post(`http://localhost:3000/api/v1/cart/add`, {
                customerId,
                itemId: item._id,
                quantity,
            });
            toast.success("Item added to cart successfully.");
        } catch (error) {
            console.error("Error adding to cart:", error);
            toast.error("Failed to add item to cart.");
        }
    };

    const handleQuantityChange = (type) => {
        setQuantity((prev) => (type === "increase" ? prev + 1 : Math.max(1, prev - 1)));
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center relative overflow-hidden">
                {/* Background Decorative Elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full opacity-5 blur-3xl"></div>
                    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-400 to-pink-600 rounded-full opacity-5 blur-3xl"></div>
                </div>
                
                <div className="flex items-center space-x-3 relative z-10">
                    <svg className="animate-spin h-8 w-8 text-blue-600" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                    </svg>
                    <span className="text-lg font-semibold text-gray-700">Loading product details...</span>
                </div>
            </div>
        );
    }
    
    if (!item) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center relative overflow-hidden">
                {/* Background Decorative Elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full opacity-5 blur-3xl"></div>
                    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-400 to-pink-600 rounded-full opacity-5 blur-3xl"></div>
                </div>
                
                <div className="text-center relative z-10">
                    <div className="w-24 h-24 bg-gradient-to-br from-red-200 to-red-300 rounded-full flex items-center justify-center mx-auto mb-6">
                        <FaStar className="w-12 h-12 text-red-500" />
                    </div>
                    <h2 className="text-2xl font-semibold text-gray-800 mb-2">Product Not Found</h2>
                    <p className="text-gray-600">The product you're looking for doesn't exist.</p>
                </div>
            </div>
        );
    }

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
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                            {/* Image Section */}
                            <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 p-8">
                                <div className="relative group">
                                    <img
                                        src={`http://localhost:3000/uploads/${item.image}`}
                                        className="w-full h-[500px] object-cover rounded-xl shadow-lg group-hover:scale-105 transition-all duration-500"
                                        alt={item.name} 
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl"></div>
                                    
                                    {/* Wishlist Button */}
                                    <button 
                                        className={`absolute top-6 right-6 bg-white/90 backdrop-blur-sm p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 ${
                                            isWishlisted ? "text-red-500" : "text-gray-600 hover:text-red-500"
                                        }`} 
                                        onClick={toggleWishlist}
                                    >
                                        <FaHeart size={24} className={isWishlisted ? "fill-current" : ""} />
                                    </button>
                                    
                                    {/* Price Badge */}
                                    <div className="absolute bottom-6 left-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-full shadow-lg">
                                        <span className="text-2xl font-bold">${parseFloat(item.price).toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Details Section */}
                            <div className="p-8 lg:p-12 flex flex-col justify-center space-y-8">
                                {/* Product Title and Rating */}
                                <div className="space-y-4">
                                    <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                        {item.name}
                                    </h1>
                                    <div className="flex items-center space-x-2">
                                        <div className="flex items-center space-x-1">
                                            {[...Array(5)].map((_, i) => (
                                                <FaStar key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                                            ))}
                                        </div>
                                        <span className="text-gray-600">(4.8/5)</span>
                                    </div>
                                </div>

                                {/* Price */}
                                <div className="space-y-2">
                                    <span className="text-3xl lg:text-4xl font-bold text-gray-800">
                                        ${parseFloat(item.price).toLocaleString()}
                                    </span>
                                    <p className="text-green-600 font-medium">Free shipping on orders over $50</p>
                                </div>

                                {/* Description */}
                                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                                        Product Description
                                    </h3>
                                    <p className="text-gray-700 leading-relaxed text-lg">{item.description}</p>
                                </div>

                                {/* Features */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg border border-green-200">
                                        <FaTruck className="w-5 h-5 text-green-600" />
                                        <span className="text-sm font-medium text-green-800">Free Shipping</span>
                                    </div>
                                    <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                                        <FaShieldAlt className="w-5 h-5 text-blue-600" />
                                        <span className="text-sm font-medium text-blue-800">Secure Payment</span>
                                    </div>
                                    <div className="flex items-center space-x-3 p-4 bg-purple-50 rounded-lg border border-purple-200">
                                        <FaUndo className="w-5 h-5 text-purple-600" />
                                        <span className="text-sm font-medium text-purple-800">Easy Returns</span>
                                    </div>
                                </div>

                                {/* Quantity and Add to Cart */}
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-700 font-semibold text-lg">Quantity:</span>
                                        <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden shadow-lg">
                                            <button
                                                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-4 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
                                                onClick={() => handleQuantityChange("decrease")}
                                                disabled={quantity <= 1}
                                            >
                                                <span className="text-xl font-bold">−</span>
                                            </button>
                                            <span className="w-20 h-16 flex items-center justify-center text-xl font-bold bg-white text-gray-800 border-x border-gray-200">
                                                {quantity}
                                            </span>
                                            <button
                                                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-4 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
                                                onClick={() => handleQuantityChange("increase")}
                                            >
                                                <span className="text-xl font-bold">+</span>
                                            </button>
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-4">
                                        <button 
                                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold px-8 py-5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-xl transform hover:scale-105 flex items-center justify-center space-x-3" 
                                            onClick={addToCart}
                                        >
                                            <FaShoppingCart size={24} />
                                            <span>Add to Cart</span>
                                        </button>
                                        
                                        <button 
                                            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold px-8 py-5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-xl transform hover:scale-105 flex items-center justify-center space-x-3" 
                                            onClick={addToCart}
                                        >
                                            <FaHeart size={24} />
                                            <span>Buy Now</span>
                                        </button>
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
            <Footer />
        </>
    );
};

export default ItemDetails;
