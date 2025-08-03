
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../../context/AuthContext';
import { jwtDecode } from 'jwt-decode';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../common/ui/card';
import { Input } from '../common/ui/input';
import { Button } from '../common/ui/button';
import { Link } from 'react-router-dom';

const OtpVerification = () => {
  const { login, getRole, isAuthenticated } = useAuth();
  const { state } = useLocation();
  const navigate = useNavigate();
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [csrfToken, setCsrfToken] = useState('');
  const [isCsrfLoading, setIsCsrfLoading] = useState(true);

  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/v1/auth/csrf-token', { withCredentials: true });
        setCsrfToken(response.data.csrfToken);
        console.log('VerifyOtp.jsx: CSRF Token fetched:', response.data.csrfToken);
      } catch (error) {
        console.error('VerifyOtp.jsx: CSRF Token Error:', error.message);
        toast.error('Failed to initialize. Please refresh the page.');
      } finally {
        setIsCsrfLoading(false);
      }
    };
    fetchCsrfToken();
  }, []);

  useEffect(() => {
  if (isAuthenticated) {
    const role = getRole();
    console.log('VerifyOtp.jsx: isAuthenticated changed, role:', role);
    toast.success('Logged in successfully!');
    
    setTimeout(() => {
      window.location.href = role === 'admin' ? '/admin/dashboard' : '/';
    }, 1500); // Delay to allow toast to show
  }
}, [isAuthenticated, getRole]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!otp || otp.length !== 6 || !/^\d{6}$/.test(otp)) {
      toast.error('Please enter a valid 6-digit OTP.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(
        'http://localhost:3000/api/v1/auth/verify-otp',
        { userId: state?.userId, otp },
        { headers: { 'X-CSRF-Token': csrfToken }, withCredentials: true }
      );

      console.log('VerifyOtp.jsx: OTP Verification Response:', response.data);

      if (response.data.success) {
        const { token, userId } = response.data;
        if (!token || !userId) {
          throw new Error('Missing token or userId in response');
        }
        console.log('VerifyOtp.jsx: JWT Token:', token);
        const decoded = jwtDecode(token);
        console.log('VerifyOtp.jsx: Decoded JWT:', decoded);
        sessionStorage.clear(); // Clear any stale tokens
        login(token, userId, state?.rememberMe);
        console.log('VerifyOtp.jsx: Login called with:', { userId, rememberMe: state?.rememberMe });
      } else {
        toast.error(response.data.message || 'Invalid or expired OTP.');
      }
    } catch (error) {
      console.error('VerifyOtp.jsx: OTP Verification Error:', error.response?.data || error.message);
      const message = error.response?.data?.message || 'Error verifying OTP. Please try again.';
      toast.error(message);
      if (message.includes('Invalid or expired OTP')) {
        setTimeout(() => navigate('/login'), 3000);
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!state?.userId || !state?.email) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full opacity-10 blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-400 to-pink-600 rounded-full opacity-10 blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-indigo-400 to-blue-600 rounded-full opacity-5 blur-3xl"></div>
        </div>

        {/* Brand Header */}
        <div className="absolute top-8 left-8 z-10">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
              <span className="text-white font-bold text-lg">C</span>
            </div>
            <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Case</span>
          </Link>
        </div>

        {/* Error Card */}
        <Card className="w-full max-w-lg shadow-2xl border-0 bg-white/90 backdrop-blur-md relative z-10">
          <CardHeader className="space-y-4 pb-6 text-center">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center shadow-lg mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <CardTitle className="text-4xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
              Session Expired
            </CardTitle>
            <CardDescription className="text-lg text-gray-600 max-w-sm mx-auto">
              Invalid session. Please log in again to continue.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <Button
              onClick={() => navigate('/login')}
              className="w-full h-14 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white font-bold text-lg rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
            >
              <div className="flex items-center justify-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                <span>Go to Sign In</span>
              </div>
            </Button>
          </CardContent>
        </Card>

        <ToastContainer 
          position="top-right" 
          autoClose={3000} 
          hideProgressBar 
          theme="light"
          toastClassName="rounded-lg shadow-lg"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full opacity-10 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-400 to-pink-600 rounded-full opacity-10 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-indigo-400 to-blue-600 rounded-full opacity-5 blur-3xl"></div>
      </div>

      {/* Brand Header */}
      <div className="absolute top-8 left-8 z-10">
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
            <span className="text-white font-bold text-lg">C</span>
          </div>
          <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Case</span>
        </Link>
      </div>

      {/* Main Card */}
      <Card className="w-full max-w-lg shadow-2xl border-0 bg-white/90 backdrop-blur-md relative z-10">
        <CardHeader className="space-y-4 pb-6 text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <CardTitle className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Verify OTP
          </CardTitle>
          <CardDescription className="text-lg text-gray-600 max-w-sm mx-auto">
            Enter the 6-digit OTP sent to {state.email || 'your email'}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* OTP Field */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center justify-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                OTP Code
              </label>
                             <Input
                 type="text"
                 value={otp}
                 onChange={(e) => {
                   const value = e.target.value.replace(/[^0-9]/g, '');
                   setOtp(value);
                 }}
                 placeholder="Enter 6-digit OTP"
                 maxLength={6}
                 className="h-16 text-center text-2xl font-mono bg-white text-black border-2 border-gray-300 focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-200 tracking-widest shadow-lg hover:shadow-xl"
               />
              <p className="text-xs text-gray-500 text-center">
                Enter the 6-digit code sent to your email
              </p>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading || isCsrfLoading}
              className="w-full h-14 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white font-bold text-lg rounded-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-3">
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
                  <span>Verifying...</span>
                </div>
              ) : isCsrfLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
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
                  <span>Loading...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Verify OTP</span>
                </div>
              )}
            </Button>
          </form>

          {/* Back to Login Link */}
          <div className="text-center pt-4">
            <p className="text-sm text-gray-600">
              Didn't receive the OTP?{' '}
              <Link to="/login" className="text-blue-600 hover:text-blue-700 font-semibold underline transition-colors duration-200">
                Try again
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>

      <ToastContainer 
        position="top-right" 
        autoClose={3000} 
        hideProgressBar 
        theme="light"
        toastClassName="rounded-lg shadow-lg"
      />
    </div>
  );
};

export default OtpVerification;
