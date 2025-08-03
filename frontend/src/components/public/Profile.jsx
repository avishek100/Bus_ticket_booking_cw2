// src/components/Profile.jsx
import { ShoppingBag, User, Settings } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { FaEdit } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Footer from '../common/customer/Footer';
import Layout from '../common/customer/layout';
import { useAuth } from '../../context/AuthContext';

const Profile = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [userData, setUserData] = useState({
    fname: '',
    lname: '',
    phone: '',
    email: '',
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [profilePic, setProfilePic] = useState('/src/assets/images/profile.png');
  const [csrfToken, setCsrfToken] = useState('');

  useEffect(() => {
    console.log('Profile.jsx: isAuthenticated:', isAuthenticated);
    console.log('Profile.jsx: user:', user);
    console.log('Profile.jsx: loading:', loading);
    console.log('Profile.jsx: sessionStorage:', {
      token: sessionStorage.getItem('token'),
      userId: sessionStorage.getItem('userId'),
      rememberMe: localStorage.getItem('rememberMe'),
    });

    // Fetch CSRF token
    axios
      .get('http://localhost:3000/api/v1/auth/csrf-token', { withCredentials: true })
      .then((response) => {
        console.log('Profile.jsx: CSRF Token fetched:', response.data.csrfToken);
        setCsrfToken(response.data.csrfToken);
      })
      .catch((error) => {
        console.error('Profile.jsx: CSRF Token Error:', error.message);
        toast.error('⚠️ Failed to fetch security token. Please refresh the page.', {
          position: "top-right",
          autoClose: 4000,
        });
      });

    if (!isAuthenticated && !user.token) {
      toast.error('🔐 Please log in to view your profile.', {
        position: "top-right",
        autoClose: 4000,
      });
      navigate('/login');
      return;
    }
    if (!loading) {
      fetchUserData();
    }
  }, [user, isAuthenticated, loading, navigate]);

  const fetchUserData = async () => {
    try {
      const userId = user.userId || sessionStorage.getItem('userId') || 'temp-id';
      const token = user.token || sessionStorage.getItem('token');
      const response = await axios.get(`http://localhost:3000/api/v1/auth/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'X-CSRF-Token': csrfToken,
        },
        withCredentials: true,
      });

      if (response.data.success) {
        const { fname, lname, phone, email, image } = response.data.data;
        setUserData((prev) => ({
          ...prev,
          fname: fname || '',
          lname: lname || '',
          phone: phone || '',
          email: email || '',
        }));
        setProfilePic(image ? `/Uploads/${image}` : '/src/assets/images/profile.png');
      } else {
        toast.error('❌ Failed to fetch user data. Please refresh the page and try again.', {
        position: "top-right",
        autoClose: 4000,
      });
      }
    } catch (error) {
      console.error('Profile.jsx: Error fetching user data:', error.response?.data || error.message);
      toast.error(error.response?.data?.message || 'Error fetching user data.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfilePicChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('profilePicture', file);

    try {
      const userId = user.userId || sessionStorage.getItem('userId') || 'temp-id';
      const token = user.token || sessionStorage.getItem('token');
      const response = await axios.post(`http://localhost:3000/api/v1/auth/uploadImage`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
          'X-CSRF-Token': csrfToken,
        },
        withCredentials: true,
      });

      if (response.data.success) {
        setProfilePic(`/Uploads/${response.data.data}`);
        toast.success('📸 Profile picture updated successfully! Your new photo has been saved.', {
          position: "top-right",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } else {
        toast.error('❌ Failed to upload profile picture. Please try again.', {
          position: "top-right",
          autoClose: 4000,
        });
      }
    } catch (error) {
      console.error('Profile.jsx: Error uploading profile picture:', error.response?.data || error.message);
      toast.error(error.response?.data?.message || 'Error uploading profile picture.');
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const userId = user.userId || sessionStorage.getItem('userId') || 'temp-id';
      const token = user.token || sessionStorage.getItem('token');
      const updatedData = {
        fname: userData.fname,
        lname: userData.lname,
        phone: userData.phone,
        email: userData.email,
      };

      const response = await axios.put(`http://localhost:3000/api/v1/auth/update/${userId}`, updatedData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          'X-CSRF-Token': csrfToken,
        },
        withCredentials: true,
      });

      if (response.data.success) {
        toast.success('✅ Profile information updated successfully! Your changes have been saved.', {
          position: "top-right",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } else {
        toast.error('❌ Failed to update profile. Please try again.', {
          position: "top-right",
          autoClose: 4000,
        });
      }
    } catch (error) {
      console.error('Profile.jsx: Error updating profile:', error.response?.data || error.message);
      toast.error(error.response?.data?.message || 'Error updating profile.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (userData.newPassword.length < 8) {
      toast.error('🔒 Password must be at least 8 characters long for security.', {
        position: "top-right",
        autoClose: 4000,
      });
      return;
    }
    if (userData.newPassword !== userData.confirmPassword) {
      toast.error('🔒 Passwords do not match. Please ensure both passwords are identical.', {
        position: "top-right",
        autoClose: 4000,
      });
      return;
    }
    if (userData.newPassword === userData.oldPassword) {
      toast.error('🔒 New password cannot be the same as your current password.', {
        position: "top-right",
        autoClose: 4000,
      });
      return;
    }

    setIsLoading(true);
    try {
      const userId = user.userId || sessionStorage.getItem('userId') || 'temp-id';
      const token = user.token || sessionStorage.getItem('token');
      const passwordData = {
        oldPassword: userData.oldPassword,
        newPassword: userData.newPassword,
        confirmNewPassword: userData.confirmPassword,
      };

      const response = await axios.put(`http://localhost:3000/api/v1/auth/updatePassword/${userId}`, passwordData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          'X-CSRF-Token': csrfToken,
        },
        withCredentials: true,
      });

      if (response.data.success) {
        toast.success('🔐 Password changed successfully! Your new password is now active.', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        setUserData((prev) => ({
          ...prev,
          oldPassword: '',
          newPassword: '',
          confirmPassword: '',
        }));
      } else {
        toast.error('❌ Failed to update password. Please check your old password and try again.', {
          position: "top-right",
          autoClose: 4000,
        });
      }
    } catch (error) {
      console.error('Profile.jsx: Error updating password:', error.response?.data || error.message);
      toast.error(error.response?.data?.message || 'Error updating password.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading || loading) {
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
          <span className="text-lg font-semibold text-gray-700">Loading profile...</span>
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
        
        <div className="max-w-6xl mx-auto p-6 relative z-10">
          <div className="flex gap-6">
            {/* Sidebar */}
            <div className="w-1/4">
              <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-gray-200">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                    <Settings className="text-white" size={20} />
                  </div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Account Settings</h2>
                </div>
                <div className="space-y-3">
                  <button className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg w-full hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-medium shadow-lg">
                    <User size={20} /> My Profile
                  </button>
                  <Link to="/my-orders">
                    <button className="flex items-center gap-3 p-3 border-2 border-gray-300 rounded-lg w-full bg-white text-gray-700 hover:bg-blue-50 hover:border-blue-300 transition-all duration-300 font-medium">
                      <ShoppingBag size={20} /> My Orders
                    </button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="w-3/4 space-y-6">
              {/* Personal Details */}
              <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-8 border border-gray-200">
                <h3 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-600 to-blue-600 rounded-lg flex items-center justify-center">
                    <User className="text-white" size={20} />
                  </div>
                  Personal Details
                </h3>
                <form onSubmit={handleProfileUpdate} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="fname" className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                      <input
                        type="text"
                        id="fname"
                        value={userData.fname}
                        onChange={(e) => setUserData({ ...userData, fname: e.target.value })}
                        className="w-full p-3 border-2 border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-white"
                        placeholder="Enter your first name"
                      />
                    </div>
                    <div>
                      <label htmlFor="lname" className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                      <input
                        type="text"
                        id="lname"
                        value={userData.lname}
                        onChange={(e) => setUserData({ ...userData, lname: e.target.value })}
                        className="w-full p-3 border-2 border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-white"
                        placeholder="Enter your last name"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                      <input
                        type="text"
                        id="phone"
                        value={userData.phone}
                        onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
                        className="w-full p-3 border-2 border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 bg-white"
                        placeholder="Enter your phone number"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                      <input
                        type="email"
                        id="email"
                        value={userData.email}
                        onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                        className="w-full p-3 border-2 border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-4 focus:ring-pink-500/20 focus:border-pink-500 transition-all duration-300 bg-white"
                        placeholder="Enter your email address"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full p-4 rounded-xl font-semibold text-white transition-all duration-300 shadow-lg hover:shadow-xl ${
                      isLoading ? 'bg-gradient-to-r from-gray-400 to-gray-500 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
                    }`}
                  >
                    {isLoading ? 'Updating...' : 'Update Profile'}
                  </button>
                </form>
              </div>

              {/* Change Password */}
              <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-8 border border-gray-200">
                <h3 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-orange-600 to-red-600 rounded-lg flex items-center justify-center">
                    <Settings className="text-white" size={20} />
                  </div>
                  Change Password
                </h3>
                <form onSubmit={handlePasswordChange} className="space-y-6">
                  <div>
                    <label htmlFor="oldPassword" className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                    <input
                      type="password"
                      id="oldPassword"
                      value={userData.oldPassword}
                      onChange={(e) => setUserData({ ...userData, oldPassword: e.target.value })}
                      className="w-full p-3 border-2 border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-white"
                      placeholder="Enter your current password"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                      <input
                        type="password"
                        id="newPassword"
                        value={userData.newPassword}
                        onChange={(e) => setUserData({ ...userData, newPassword: e.target.value })}
                        className="w-full p-3 border-2 border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 bg-white"
                        placeholder="Enter your new password"
                      />
                    </div>
                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                      <input
                        type="password"
                        id="confirmPassword"
                        value={userData.confirmPassword}
                        onChange={(e) => setUserData({ ...userData, confirmPassword: e.target.value })}
                        className="w-full p-3 border-2 border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-4 focus:ring-pink-500/20 focus:border-pink-500 transition-all duration-300 bg-white"
                        placeholder="Confirm your new password"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full p-4 rounded-xl font-semibold text-white transition-all duration-300 shadow-lg hover:shadow-xl ${
                      isLoading ? 'bg-gradient-to-r from-gray-400 to-gray-500 cursor-not-allowed' : 'bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700'
                    }`}
                  >
                    {isLoading ? 'Updating...' : 'Change Password'}
                  </button>
                </form>
              </div>
            </div>
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
};

export default Profile;