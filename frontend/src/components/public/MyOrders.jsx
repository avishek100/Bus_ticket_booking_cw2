
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from '../common/customer/Navbar';
import Footer from '../common/customer/Footer';
import { useAuth } from '../../context/AuthContext';
import { ShoppingBag, Package, User } from 'lucide-react';

function MyOrders() {
  const { user, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const customerId = user.userId || sessionStorage.getItem('userId');
  const [userData, setUserData] = useState({
    fname: '',
    lname: '',
    email: '',
  });
  const [isUserLoading, setIsUserLoading] = useState(true);
  const [csrfToken, setCsrfToken] = useState('');

  // Fetch CSRF token and user data
  useEffect(() => {
    console.log('MyOrders.jsx: isAuthenticated:', isAuthenticated);
    console.log('MyOrders.jsx: user:', user);
    console.log('MyOrders.jsx: loading:', loading);
    console.log('MyOrders.jsx: sessionStorage:', {
      token: sessionStorage.getItem('token'),
      userId: sessionStorage.getItem('userId'),
      rememberMe: localStorage.getItem('rememberMe'),
    });

    // Fetch CSRF token
    axios
      .get('http://localhost:3000/api/v1/auth/csrf-token', { withCredentials: true })
      .then((response) => {
        console.log('MyOrders.jsx: CSRF Token fetched:', response.data.csrfToken);
        setCsrfToken(response.data.csrfToken);
      })
      .catch((error) => {
        console.error('MyOrders.jsx: CSRF Token Error:', error.message);
        toast.error('Failed to fetch CSRF token. Please refresh the page.');
      });

    if (!isAuthenticated && !user.token) {
      toast.error('Please log in to view your orders.');
      navigate('/login');
      return;
    }
    if (!loading) {
      fetchUserData();
    }
  }, [user, isAuthenticated, loading, navigate]);

  const fetchUserData = async () => {
    try {
      const token = user.token || sessionStorage.getItem('token');
      const response = await axios.get(`http://localhost:3000/api/v1/auth/${customerId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'X-CSRF-Token': csrfToken,
        },
        withCredentials: true,
      });

      if (response.data.success) {
        const { fname, lname, email } = response.data.data;
        setUserData({
          fname: fname || '',
          lname: lname || '',
          email: email || '',
        });
      } else {
        toast.error('Failed to fetch user data.');
      }
    } catch (error) {
      console.error('MyOrders.jsx: Error fetching user data:', error.response?.data || error.message);
      toast.error(error.response?.data?.message || 'Error fetching user data.');
    } finally {
      setIsUserLoading(false);
    }
  };

  const { data: orders, error, isLoading: isOrdersLoading } = useQuery({
    queryKey: ['orders', customerId],
    queryFn: async () => {
      if (!customerId) return [];
      const res = await axios.get(`http://localhost:3000/api/v1/order/orders/user/${customerId}`, {
        headers: {
          Authorization: `Bearer ${user.token || sessionStorage.getItem('token')}`,
          'X-CSRF-Token': csrfToken,
        },
        withCredentials: true,
      });
      return res.data; // The API returns orders directly, not wrapped in data
    },
    enabled: !!customerId && !!csrfToken,
  });

  const statusBadge = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-gradient-to-r from-orange-100 to-red-100 text-orange-700 border border-orange-200';
      case 'processing':
        return 'bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 border border-blue-200';
      case 'shipped':
        return 'bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 border border-indigo-200';
      case 'delivered':
        return 'bg-gradient-to-r from-green-100 to-blue-100 text-green-700 border border-green-200';
      case 'cancelled':
        return 'bg-gradient-to-r from-red-100 to-pink-100 text-red-700 border border-red-200';
      default:
        return 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 border border-gray-200';
    }
  };

  const paymentBadge = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-gradient-to-r from-orange-100 to-red-100 text-orange-700 border border-orange-200';
      case 'paid':
        return 'bg-gradient-to-r from-green-100 to-blue-100 text-green-700 border border-green-200';
      case 'failed':
        return 'bg-gradient-to-r from-red-100 to-pink-100 text-red-700 border border-red-200';
      default:
        return 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 border border-gray-200';
    }
  };

  if (!customerId || !isAuthenticated || !user.token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center relative overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full opacity-5 blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-400 to-pink-600 rounded-full opacity-5 blur-3xl"></div>
        </div>
        
        <div className="text-center relative z-10">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-200 to-purple-300 rounded-full flex items-center justify-center mx-auto mb-6">
            <User className="w-12 h-12 text-blue-600" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Please Log In</h2>
          <p className="text-gray-600 mb-6">You need to be logged in to view your orders.</p>
          <button 
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            onClick={() => navigate('/login')}
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  if (isUserLoading || isOrdersLoading || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 relative overflow-hidden">
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
          <span className="text-lg font-semibold text-gray-700">Loading your orders...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center relative overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full opacity-5 blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-400 to-pink-600 rounded-full opacity-5 blur-3xl"></div>
        </div>
        
        <div className="text-center relative z-10">
          <div className="w-24 h-24 bg-gradient-to-br from-red-200 to-red-300 rounded-full flex items-center justify-center mx-auto mb-6">
            <Package className="w-12 h-12 text-red-500" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Failed to Load Orders</h2>
          <p className="text-gray-600 mb-6">Please try again later.</p>
          <button 
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center relative overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full opacity-5 blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-400 to-pink-600 rounded-full opacity-5 blur-3xl"></div>
        </div>
        
        <div className="text-center relative z-10">
          <div className="w-24 h-24 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-12 h-12 text-gray-400" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">No Orders Yet</h2>
          <p className="text-gray-500 mb-6">Start shopping to see your orders here!</p>
          <button 
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            onClick={() => navigate('/menu')}
          >
            Start Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 relative overflow-hidden py-20">
        {/* Background Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full opacity-5 blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-400 to-pink-600 rounded-full opacity-5 blur-3xl"></div>
        </div>
        
        <div className="max-w-6xl mx-auto p-6 relative z-10">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-8 mb-8 border border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                <ShoppingBag className="text-white" size={24} />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">My Orders</h1>
            </div>
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Welcome back, {userData.fname} {userData.lname}!
              </h2>
              <p className="text-gray-600">Email: {userData.email}</p>
            </div>
          </div>

          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 border border-gray-200"
              >
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">Order #{order._id.slice(-8)}</h2>
                    <p className="text-sm text-gray-600">
                      Placed on {new Date(order.createdAt).toLocaleDateString('en-GB', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                  <span className={`px-4 py-2 rounded-full text-sm font-medium shadow-lg ${statusBadge(order.orderStatus)}`}>
                    {order.orderStatus}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-gray-200">
                    <h3 className="font-semibold text-gray-800 mb-2">Payment Status</h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium shadow-md ${paymentBadge(order.paymentStatus)}`}>
                      {order.paymentStatus}
                    </span>
                    <p className="text-sm text-gray-600 mt-1">Method: {order.paymentMethod}</p>
                  </div>
                  <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-4 border border-gray-200">
                    <h3 className="font-semibold text-gray-800 mb-2">Total Amount</h3>
                    <p className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">${order.totalPrice.toFixed(2)}</p>
                  </div>
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border border-gray-200">
                    <h3 className="font-semibold text-gray-800 mb-2">Items</h3>
                    <p className="text-lg font-medium text-gray-800">{order.cartItems.length} item(s)</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-3 text-gray-800 flex items-center gap-2">
                      <div className="w-6 h-6 bg-gradient-to-br from-green-600 to-blue-600 rounded-lg flex items-center justify-center">
                        <User size={16} className="text-white" />
                      </div>
                      Billing Details
                    </h3>
                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
                      <p className="text-gray-800 font-medium">{order.billingDetails.fullName}</p>
                      <p className="text-gray-600">{order.billingDetails.email}</p>
                      <p className="text-gray-600">{order.billingDetails.phone}</p>
                      <p className="text-gray-600">
                        {order.billingDetails.address}, {order.billingDetails.city} - {order.billingDetails.zipCode}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3 text-gray-800 flex items-center gap-2">
                      <div className="w-6 h-6 bg-gradient-to-br from-orange-600 to-red-600 rounded-lg flex items-center justify-center">
                        <Package size={16} className="text-white" />
                      </div>
                      Order Items
                    </h3>
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {order.cartItems.map((item) => {
                        const product = item.itemId;
                        return (
                          <div key={product._id || product} className="flex items-center gap-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-3 border border-gray-200 hover:shadow-md transition-all duration-300">
                            <img
                              src={`http://localhost:3000/uploads/${product.image}`}
                              alt={product.name}
                              className="w-16 h-16 object-cover rounded-lg border border-gray-200 hover:scale-110 transition-transform duration-300"
                            />
                            <div className="flex-1">
                              <p className="font-medium text-gray-800">{product.name || 'Unnamed Product'}</p>
                              <p className="text-sm text-gray-600">
                                Qty: {item.quantity} | Price: ${item.price}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
      <ToastContainer 
        position="top-right" 
        autoClose={3000} 
        hideProgressBar 
        theme="light"
        toastClassName="rounded-lg shadow-lg"
      />
    </>
  );
}

export default MyOrders;
