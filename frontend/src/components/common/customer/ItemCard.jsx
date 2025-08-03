
import axios from 'axios';
import { Eye, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { FaHeart } from 'react-icons/fa';
import Modal from 'react-modal';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

Modal.setAppElement('#root');

const checkWishlist = async (itemId, customerId, token, csrfToken) => {
    try {
        const response = await axios.get(`http://localhost:3000/api/v1/wishlist/check/${itemId}?customerId=${customerId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                'X-CSRF-Token': csrfToken
            },
            withCredentials: true
        });
        return response.data.isWishlisted;
    } catch (error) {
        console.error('ItemCard.jsx: Error checking wishlist:', error.response?.data || error.message);
        throw error;
    }
};

const ItemCard = ({ item, customerId }) => {
    const navigate = useNavigate();
    const [quantity, setQuantity] = useState(1);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [csrfToken, setCsrfToken] = useState('');
    const [isCsrfLoading, setIsCsrfLoading] = useState(true);

    useEffect(() => {
        const fetchCsrfToken = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/v1/auth/csrf-token', {
                    withCredentials: true
                });
                setCsrfToken(response.data.csrfToken);
                console.log('ItemCard.jsx: CSRF Token fetched:', response.data.csrfToken);
            } catch (error) {
                console.error('ItemCard.jsx: CSRF Token Error:', error.message);
                toast.error('Failed to initialize. Please refresh the page.');
            } finally {
                setIsCsrfLoading(false);
            }
        };
        fetchCsrfToken();
    }, []);

    const { data: isWishlisted, isLoading: isWishlistLoading } = useQuery({
        queryKey: ['WISHLIST_CHECK', item._id, customerId],
        queryFn: async () => {
            const token = sessionStorage.getItem('token');
            console.log('ItemCard.jsx: JWT Token for wishlist check:', token);
            if (!token || !customerId) {
                return false;
            }
            return checkWishlist(item._id, customerId, token, csrfToken);
        },
        enabled: !!customerId && !!csrfToken,
        onError: (error) => {
            if (error.response?.status === 401) {
                toast.error('Session expired. Please log in again.', { autoClose: 4000 });
                setTimeout(() => navigate('/login'), 4000);
            }
        }
    });

    useEffect(() => {
        document.body.style.overflow = modalIsOpen ? 'hidden' : 'auto';
        return () => { document.body.style.overflow = 'auto'; };
    }, [modalIsOpen]);

    const toggleWishlistMutation = useMutation({
        mutationFn: async () => {
            const token = sessionStorage.getItem('token');
            const userId = sessionStorage.getItem('userId');
            console.log('ItemCard.jsx: JWT Token for wishlist toggle:', token);
            if (!token || !userId) {
                throw new Error('No authentication token or user ID found');
            }
            if (isWishlisted) {
                return axios.delete(`http://localhost:3000/api/v1/wishlist/remove/${item._id}`, {
                    params: { customerId: userId },
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'X-CSRF-Token': csrfToken
                    },
                    withCredentials: true
                });
            } else {
                return axios.post(`http://localhost:3000/api/v1/wishlist/add`, { customerId: userId, itemId: item._id }, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'X-CSRF-Token': csrfToken
                    },
                    withCredentials: true
                });
            }
        },
        onSuccess: () => {
            toast.success(isWishlisted ? 'Removed from wishlist.' : 'Added to wishlist.', { autoClose: 4000 });
        },
        onError: (error) => {
            console.error('ItemCard.jsx: Error toggling wishlist:', error.response?.data || error.message);
            if (error.response?.status === 401) {
                toast.error('Session expired. Please log in again.', { autoClose: 4000 });
                setTimeout(() => navigate('/login'), 4000);
            } else {
                toast.error(error.response?.data?.message || 'Failed to update wishlist.');
            }
        }
    });

    const addToCartMutation = useMutation({
        mutationFn: async () => {
            const token = sessionStorage.getItem('token');
            const userId = sessionStorage.getItem('userId');
            console.log('ItemCard.jsx: JWT Token for add to cart:', token);
            if (!token || !userId) {
                throw new Error('No authentication token or user ID found');
            }
            return axios.post(`http://localhost:3000/api/v1/cart/add`, {
                customerId: userId,
                itemId: item._id,
                quantity
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'X-CSRF-Token': csrfToken
                },
                withCredentials: true
            });
        },
        onSuccess: () => {
            toast.success('Item added to cart successfully.', { autoClose: 4000 });
        },
        onError: (error) => {
            console.error('ItemCard.jsx: Error adding to cart:', error.response?.data || error.message);
            if (error.response?.status === 401) {
                toast.error('Session expired. Please log in again.', { autoClose: 4000 });
                setTimeout(() => navigate('/login'), 4000);
            } else {
                toast.error(error.response?.data?.message || 'Failed to add item to cart.');
            }
        }
    });

    const toggleWishlist = () => {
        if (!csrfToken) {
            toast.error('CSRF token not loaded. Please refresh the page.');
            return;
        }
        toggleWishlistMutation.mutate();
    };

    const addToCart = () => {
        if (!csrfToken) {
            toast.error('CSRF token not loaded. Please refresh the page.');
            return;
        }
        addToCartMutation.mutate();
    };

    const handleQuantityChange = (type) => {
        setQuantity((prev) => (type === 'increase' ? prev + 1 : Math.max(1, prev - 1)));
    };

    return (
        <div className="bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 relative cursor-pointer group border border-gray-200" onClick={() => navigate(`/item/details/${item._id}`)}>
            <ToastContainer theme="light" position="top-right" autoClose={4000} />
            <div className="relative">
                <img
                    src={`http://localhost:3000/uploads/${item.image}`}
                    alt={item.name}
                    className="w-full h-48 object-cover rounded-lg transition duration-300 group-hover:opacity-70 cursor-pointer border border-gray-200"
                />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex space-x-3 opacity-0 group-hover:opacity-100 transition duration-300">
                    <button
                        className="bg-white/90 backdrop-blur-sm text-blue-600 border border-gray-300 p-3 rounded-lg shadow-lg hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 hover:text-white transition-all duration-200"
                        onClick={(e) => {
                            e.stopPropagation();
                            setModalIsOpen(true);
                        }}
                    >
                        <Eye size={22} />
                    </button>
                    <button
                        className={`bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-lg transition-all duration-200 ${
                            isWishlisted 
                                ? 'text-red-500 hover:bg-gradient-to-r hover:from-red-500 hover:to-pink-500 hover:text-white' 
                                : 'text-blue-600 hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 hover:text-white'
                        }`}
                        onClick={(e) => {
                            e.stopPropagation();
                            toggleWishlist();
                        }}
                        disabled={isWishlistLoading || isCsrfLoading}
                    >
                        <FaHeart size={22} />
                    </button>
                </div>
            </div>
            <div className="flex justify-between items-center mt-4">
                <h3 className="text-base font-semibold text-gray-800 cursor-pointer hover:text-blue-600 transition-colors duration-200">
                    {item.name}
                </h3>
            </div>
            <span className="font-bold text-lg mt-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent block">Rs {item.price}</span>
            <div className="flex items-center mt-4 space-x-2">
                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden shadow-sm">
                    <button
                        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleQuantityChange('decrease');
                        }}
                    >
                        -
                    </button>
                    <span className="w-12 h-10 flex items-center justify-center text-center text-gray-800 bg-gray-50">
                        {quantity}
                    </span>
                    <button
                        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleQuantityChange('increase');
                        }}
                    >
                        +
                    </button>
                </div>
                <button
                    className="border-2 border-blue-600 text-blue-600 font-medium px-4 py-2 rounded-lg hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 hover:text-white transition-all duration-200"
                    onClick={(e) => {
                        e.stopPropagation();
                        addToCart();
                    }}
                    disabled={addToCartMutation.isLoading || isCsrfLoading}
                >
                    {addToCartMutation.isLoading ? 'Adding...' : 'Add to cart'}
                </button>
            </div>
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={() => setModalIsOpen(false)}
                contentLabel="Item Details"
                className="fixed bg-white/95 backdrop-blur-sm p-6 rounded-2xl shadow-2xl max-w-md w-full mx-auto border border-gray-200"
                overlayClassName="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-[1000]"
            >
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{item.name}</h2>
                    <button
                        onClick={() => setModalIsOpen(false)}
                        className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
                    >
                        <X size={24} />
                    </button>
                </div>
                <div className="relative">
                    <img
                        src={`http://localhost:3000/uploads/${item.image}`}
                        alt={item.name}
                        className="w-full h-48 object-cover rounded-lg mb-4 border border-gray-200"
                    />
                    <button
                        className={`absolute bottom-2 right-2 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg transition-all duration-200 ${
                            isWishlisted 
                                ? 'text-red-500 hover:bg-gradient-to-r hover:from-red-500 hover:to-pink-500 hover:text-white' 
                                : 'text-blue-600 hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 hover:text-white'
                        }`}
                        onClick={toggleWishlist}
                        disabled={isWishlistLoading || isCsrfLoading}
                    >
                        <FaHeart size={18} />
                    </button>
                </div>
                <p className="text-gray-700 mb-4">{item.description}</p>
                <span className="font-bold text-lg bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent block mb-4">Rs {item.price}</span>
                <div className="flex items-center justify-between space-x-4">
                    <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden shadow-sm">
                        <button
                            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
                            onClick={() => handleQuantityChange('decrease')}
                        >
                            -
                        </button>
                        <span className="w-12 h-10 flex items-center justify-center text-center text-gray-800 bg-gray-50">
                            {quantity}
                        </span>
                        <button
                            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
                            onClick={() => handleQuantityChange('increase')}
                        >
                            +
                        </button>
                    </div>
                    <button
                        className="border-2 border-blue-600 text-blue-600 font-medium px-4 py-2 rounded-lg flex-1 hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 hover:text-white transition-all duration-200"
                        onClick={addToCart}
                        disabled={addToCartMutation.isLoading || isCsrfLoading}
                    >
                        {addToCartMutation.isLoading ? 'Adding...' : 'Add to cart'}
                    </button>
                </div>
            </Modal>
        </div>
    );
};

export default ItemCard;
