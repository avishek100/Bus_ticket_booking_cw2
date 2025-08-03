
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Footer from '../common/customer/Footer';
import Hero from '../common/customer/Hero';
import ItemCard from '../common/customer/ItemCard';
import Layout from '../common/customer/layout';

const fetchItems = async (token, csrfToken) => {
    try {
        const headers = {
            'X-CSRF-Token': csrfToken
        };
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        const response = await axios.get('http://localhost:3000/api/v1/item/items-by-tags', {
            headers,
            withCredentials: true
        });
        console.log('Home.jsx: fetchItems response:', response.status, response.data);
        if (response.status === 304) {
            // Handle 304 by returning null; useQuery will use cache
            return null;
        }
        // Check if response.data has the expected structure
        if (response.data && ('Featured' in response.data || 'Popular' in response.data || 'Trending' in response.data || 'Special' in response.data)) {
            return response.data;
        }
        // Fallback: check for success field for backward compatibility
        if (response.data.success && response.data.data) {
            return response.data.data;
        }
        throw new Error('Invalid response structure from server');
    } catch (error) {
        console.error('Home.jsx: Error fetching items by tags:', error.response?.data || error.message);
        throw error;
    }
};

const Home = () => {
    const [csrfToken, setCsrfToken] = useState('');
    const [isCsrfLoading, setIsCsrfLoading] = useState(true);
    const navigate = useNavigate();
    const customerId = sessionStorage.getItem('userId');

    useEffect(() => {
        const fetchCsrfToken = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/v1/auth/csrf-token', {
                    withCredentials: true
                });
                setCsrfToken(response.data.csrfToken);
                console.log('Home.jsx: CSRF Token fetched:', response.data.csrfToken);
            } catch (error) {
                console.error('Home.jsx: CSRF Token Error:', error.message);
                toast.error('Failed to initialize. Please refresh the page.');
            } finally {
                setIsCsrfLoading(false);
            }
        };
        fetchCsrfToken();
    }, []);

    const { data, isLoading, error } = useQuery({
        queryKey: ['ITEMS_BY_TAGS'],
        queryFn: async () => {
            const token = sessionStorage.getItem('token');
            console.log('Home.jsx: JWT Token:', token);
            // Allow guests: fetch without token if not present
            return fetchItems(token, csrfToken);
        },
        enabled: !!csrfToken,
        select: (data) => data || undefined,
        onError: (error) => {
            if (error.response?.status === 401) {
                toast.error('Session expired. Please log in again.', { autoClose: 4000 });
                setTimeout(() => navigate('/login'), 4000);
            } else {
                toast.error(error.response?.data?.message || 'Failed to load items.', { autoClose: 4000 });
            }
        }
    });

    const featuredItems = data?.Featured ?? [];
    const trendingItems = data?.Trending ?? [];
    const bestSellerItems = data?.Popular ?? [];
    const specialItems = data?.Special ?? [];

    if (isLoading || isCsrfLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
                <div className="flex items-center space-x-3">
                    <svg className="animate-spin h-8 w-8 text-blue-600" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                    </svg>
                    <span className="text-lg font-semibold text-gray-700">Loading Case Collection...</span>
                </div>
            </div>
        );
    }
    
    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Oops! Something went wrong</h2>
                    <p className="text-gray-600 mb-4">{error.response?.data?.message || error.message}</p>
                    <button 
                        onClick={() => window.location.reload()} 
                        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <>
            <Layout />
            <Hero />
            <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 min-h-screen relative overflow-hidden">
                {/* Background Decorative Elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full opacity-5 blur-3xl"></div>
                    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-400 to-pink-600 rounded-full opacity-5 blur-3xl"></div>
                </div>
                
                <ToastContainer theme="light" position="top-right" autoClose={4000} />
                
                <section className="p-6 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl m-6">
                    <div className="flex items-center space-x-3 mb-6">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                            </svg>
                        </div>
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            Featured Collection
                        </h2>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                        {featuredItems.length > 0 ? (
                            featuredItems.map((item) => (
                                <ItemCard key={item._id || item.name} item={item} customerId={customerId} />
                            ))
                        ) : (
                            <div className="col-span-full text-center py-12">
                                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                </svg>
                                <p className="text-gray-600 text-lg">No featured cases available</p>
                            </div>
                        )}
                    </div>
                </section>
                
                <section className="p-6 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl m-6">
                    <div className="flex items-center space-x-3 mb-6">
                        <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                            Trending Styles
                        </h2>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                        {trendingItems.length > 0 ? (
                            trendingItems.map((item) => (
                                <ItemCard key={item._id || item.name} item={item} customerId={customerId} />
                            ))
                        ) : (
                            <div className="col-span-full text-center py-12">
                                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                                <p className="text-gray-600 text-lg">No trending cases available</p>
                            </div>
                        )}
                    </div>
                </section>
                
                <section className="p-6 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl m-6">
                    <div className="flex items-center space-x-3 mb-6">
                        <div className="w-8 h-8 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                            Best Sellers
                        </h2>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                        {bestSellerItems.length > 0 ? (
                            bestSellerItems.map((item) => (
                                <ItemCard key={item._id || item.name} item={item} customerId={customerId} />
                            ))
                        ) : (
                            <div className="col-span-full text-center py-12">
                                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p className="text-gray-600 text-lg">No best seller cases available</p>
                            </div>
                        )}
                    </div>
                </section>
                
                <section className="p-6 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl m-6">
                    <div className="flex items-center space-x-3 mb-6">
                        <div className="w-8 h-8 bg-gradient-to-br from-red-600 to-orange-600 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                            </svg>
                        </div>
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                            Special Offers
                        </h2>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                        {specialItems.length > 0 ? (
                            specialItems.map((item) => (
                                <ItemCard key={item._id || item.name} item={item} customerId={customerId} />
                            ))
                        ) : (
                            <div className="col-span-full text-center py-12">
                                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                                </svg>
                                <p className="text-gray-600 text-lg">No special offers available</p>
                            </div>
                        )}
                    </div>
                </section>
            </div>
            <Footer />
        </>
    );
};

export default Home;
