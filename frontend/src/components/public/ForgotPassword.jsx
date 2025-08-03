
import axios from 'axios';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../common/ui/card';
import { Input } from '../common/ui/input';
import { Button } from '../common/ui/button';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [csrfToken, setCsrfToken] = useState('');
  const [isCsrfLoading, setIsCsrfLoading] = useState(true);

  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/v1/auth/csrf-token', { withCredentials: true });
        setCsrfToken(response.data.csrfToken);
        console.log('ForgotPassword.jsx: CSRF Token fetched:', response.data.csrfToken);
      } catch (error) {
        console.error('ForgotPassword.jsx: CSRF Token Error:', error.message);
        toast.error('Failed to fetch CSRF token. Please refresh the page.');
      } finally {
        setIsCsrfLoading(false);
      }
    };
    fetchCsrfToken();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  const validate = () => {
    let temp = {};
    if (!formData.email.trim()) {
      temp.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      temp.email = 'Enter a valid email';
    }
    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const response = await axios.post(
        'http://localhost:3000/api/v1/auth/forgot-password',
        {
          email: formData.email.trim().toLowerCase(),
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
        toast.success('OTP sent to your email!');
        sessionStorage.setItem('resetEmail', formData.email);
        sessionStorage.setItem('userId', response.data.userId);
        navigate('/reset-password', { state: { email: formData.email } });
      }
    } catch (error) {
      const msg = error.response?.data?.message || error.message;
      if (msg.includes('No account found')) {
        toast.error('No account found with that email');
      } else if (msg.includes('Error sending OTP email')) {
        toast.error('Failed to send OTP email. Please try again later.');
      } else {
        toast.error('Failed to process request. Please try again.');
      }
      console.error('ForgotPassword.jsx: Error:', error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-4 relative overflow-hidden">
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
      <Card className="w-full max-w-lg shadow-2xl border-0 bg-white/90 backdrop-blur-md relative z-10">
        <CardHeader className="space-y-1 pb-4">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Reset Password
          </CardTitle>
          <CardDescription className="text-center text-gray-600 text-lg max-w-sm mx-auto">
            Enter your email to receive a 6-digit OTP to reset your password
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                Email Address
              </label>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email address"
                className={`h-12 text-base bg-white ${errors.email ? "border-red-500 focus:ring-red-500" : "focus:ring-blue-500 focus:border-blue-500"}`}
              />
              {errors.email && (
                <p className="text-red-500 text-xs flex items-center">
                  <span className="mr-1">⚠</span>
                  {errors.email}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading || isCsrfLoading}
              className="w-full h-14 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white font-bold text-lg rounded-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
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
                  <span>Sending OTP...</span>
                </div>
              ) : isCsrfLoading ? (
                <div className="flex items-center justify-center space-x-2">
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
                  <span>Loading...</span>
                </div>
              ) : (
                'Send OTP'
              )}
            </Button>
          </form>

          {/* Back to Login Link */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Back to{' '}
              <Link to="/login" className="text-blue-600 hover:text-blue-700 font-semibold underline">
                Sign in
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

export default ForgotPassword;
