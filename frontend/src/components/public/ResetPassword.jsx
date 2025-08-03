import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Eye, EyeOff } from 'lucide-react';
import axios from 'axios';

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [otp, setOtp] = useState('');
  const [otpVerified, setOtpVerified] = useState(false);
  const [formData, setFormData] = useState({ password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [csrfToken, setCsrfToken] = useState('');
  const email = location.state?.email || sessionStorage.getItem('resetEmail') || '';
  const userId = sessionStorage.getItem('userId');

  // Fetch CSRF token on component mount
  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/v1/auth/csrf-token', { withCredentials: true });
        setCsrfToken(response.data.csrfToken);
      } catch (error) {
        console.error('Error fetching CSRF token:', error);
        toast.error('Failed to initialize form security.');
      }
    };
    fetchCsrfToken();
  }, []);

  const validateOtp = () => {
    let temp = {};
    if (!otp.trim()) {
      temp.otp = 'OTP is required';
    } else if (!/^\d{6}$/.test(otp)) {
      temp.otp = 'OTP must be 6 digits';
    }
    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  const validatePassword = () => {
    let temp = {};
    if (!formData.password) {
      temp.password = 'New password is required';
    } else if (
      formData.password.length < 8 ||
      !/[A-Z]/.test(formData.password) ||
      !/[a-z]/.test(formData.password) ||
      !/[0-9]/.test(formData.password) ||
      !/[!@#$%^&*(),.?":{}|<>]/.test(formData.password)
    ) {
      temp.password = 'Password must be at least 8 characters and include uppercase, lowercase, number, and special character';
    }
    if (!formData.confirmPassword) {
      temp.confirmPassword = 'Confirm password is required';
    } else if (formData.password !== formData.confirmPassword) {
      temp.confirmPassword = 'Passwords do not match';
    }
    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
    setErrors({ ...errors, otp: '' });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!validateOtp()) return;

    setLoading(true);
    try {
      const response = await axios.post(
        'http://localhost:3000/api/v1/auth/verify-otp',
        { userId, otp },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-Token': csrfToken,
          },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        toast.success('OTP verified successfully!');
        // Store the reset token for password reset
        sessionStorage.setItem('resetToken', response.data.token);
        setOtpVerified(true);
      } else {
        toast.error(response.data.message || 'Invalid OTP');
      }
    } catch (error) {
      console.error('OTP Verification Error:', error.response?.data || error.message);
      toast.error(error.response?.data?.message || 'Error verifying OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!validatePassword()) return;

    const resetToken = sessionStorage.getItem('resetToken');
    if (!resetToken) {
      toast.error('Reset token not found. Please try the forgot password process again.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `http://localhost:3000/api/v1/auth/reset-password/${resetToken}`,
        {
          password: formData.password,
          confirmPassword: formData.confirmPassword,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-Token': csrfToken,
          },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        toast.success('Password reset successful! Please log in.');
        sessionStorage.removeItem('resetEmail');
        sessionStorage.removeItem('userId');
        sessionStorage.removeItem('resetToken');
        setLoading(false);
        navigate('/login');
      } else {
        toast.error(response.data.message || 'Failed to reset password');
      }
    } catch (error) {
      console.error('Password Reset Error:', error.response?.data || error.message);
      toast.error(error.response?.data?.message || 'Error resetting password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full opacity-5 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-400 to-pink-600 rounded-full opacity-5 blur-3xl"></div>
      </div>

      {/* Brand Header */}
      <div className="absolute top-8 left-8">
        <Link to="/" className="flex items-center space-x-2 group">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
            <span className="text-white font-bold text-xl">C</span>
          </div>
          <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Case</span>
        </Link>
      </div>

      {/* Main Card */}
      <div className="bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-[30rem] max-w-lg border border-gray-200 relative z-10">
        <div className="flex items-center justify-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
        </div>
        
        <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
          {otpVerified ? 'Reset Password' : 'Verify OTP'}
        </h2>
        <p className="text-lg text-gray-600 text-center mb-8 max-w-sm mx-auto">
          {otpVerified
            ? 'Enter your new password to complete the reset.'
            : 'Enter the 6-digit OTP sent to your email.'}
        </p>

        {!otpVerified ? (
          <form onSubmit={handleVerifyOtp} className="space-y-6">
            <div>
              <label className="block text-gray-700 font-semibold mb-2 flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                OTP Code
              </label>
              <input
                type="text"
                value={otp}
                onChange={handleOtpChange}
                className="w-full p-4 text-black border-2 border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-300 text-center text-2xl font-mono tracking-widest"
                placeholder="000000"
                maxLength="6"
              />
              {errors.otp && (
                <p className="text-red-500 text-sm mt-2 flex items-center">
                  <span className="mr-1">⚠</span>
                  {errors.otp}
                </p>
              )}
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full h-14 rounded-xl font-bold text-white transition-all duration-300 shadow-lg hover:shadow-xl ${
                loading ? 'bg-gradient-to-r from-gray-400 to-gray-500 cursor-not-allowed' : 'bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700'
              }`}
            >
              {loading ? (
                <div className="flex justify-center items-center space-x-2">
                  <svg className="animate-spin h-6 w-6 text-white" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    />
                  </svg>
                  <span>Verifying OTP...</span>
                </div>
              ) : (
                'Verify OTP'
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-6">
            <div>
              <label className="block text-gray-700 font-semibold mb-2 flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={handlePasswordChange}
                  className="w-full p-4 text-black border-2 border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300"
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors duration-200"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-2 flex items-center">
                  <span className="mr-1">⚠</span>
                  {errors.password}
                </p>
              )}
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2 flex items-center">
                <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  autoComplete="new-password"
                  value={formData.confirmPassword}
                  onChange={handlePasswordChange}
                  className="w-full p-4 text-black border-2 border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300"
                  placeholder="Confirm new password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-600 transition-colors duration-200"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-2 flex items-center">
                  <span className="mr-1">⚠</span>
                  {errors.confirmPassword}
                </p>
              )}
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full h-14 rounded-xl font-bold text-white transition-all duration-300 shadow-lg hover:shadow-xl ${
                loading ? 'bg-gradient-to-r from-gray-400 to-gray-500 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700'
              }`}
            >
              {loading ? (
                <div className="flex justify-center items-center space-x-2">
                  <svg className="animate-spin h-6 w-6 text-white" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    />
                  </svg>
                  <span>Resetting Password...</span>
                </div>
              ) : (
                'Reset Password'
              )}
            </button>
          </form>
        )}
        
        <p className="text-center text-sm text-gray-600 mt-6">
          Back to{' '}
          <Link to="/login" className="text-blue-600 hover:text-blue-700 font-semibold underline">
            Log in
          </Link>
        </p>
      </div>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar theme="light" toastClassName="rounded-lg shadow-lg" />
    </div>
  );
};

export default ResetPassword;