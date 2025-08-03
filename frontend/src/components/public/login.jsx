
import axios from 'axios';
import { Eye, EyeOff } from 'lucide-react';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ReCAPTCHA from 'react-google-recaptcha';
import { useAuth } from '../../context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../common/ui/card';
import { Input } from '../common/ui/input';
import { Button } from '../common/ui/button';
import { Separator } from '../common/ui/separator';

const Login = () => {
  const { isAuthenticated, getRole } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '', recaptchaToken: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [csrfToken, setCsrfToken] = useState('');
  const [isCsrfLoading, setIsCsrfLoading] = useState(true);
  const [rememberMe, setRememberMe] = useState(false);

  // Debug log for re-renders
  console.log('Login component rendered, formData:', formData);

  // Track re-renders
  useEffect(() => {
    console.log('Login component re-rendered, formData:', formData);
  });

  useEffect(() => {
    // Fetch CSRF token
    const fetchCsrfToken = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/v1/auth/csrf-token', { withCredentials: true });
        setCsrfToken(response.data.csrfToken);
        console.log('Login.jsx: CSRF Token fetched:', response.data.csrfToken);
      } catch (error) {
        console.error('Login.jsx: CSRF Token Error:', error.message);
        toast.error('Failed to fetch CSRF token. Please refresh the page.');
      } finally {
        setIsCsrfLoading(false);
      }
    };
    fetchCsrfToken();
  }, []);

  // Memoize the form handlers to prevent re-renders
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    console.log('handleChange called:', { name, value }); // Debug log
    setFormData(prev => {
      const newData = { ...prev, [name]: value };
      console.log('New form data:', newData);
      return newData;
    });
    setErrors(prev => ({ ...prev, [name]: '' }));
  }, []);

  const handleRecaptchaChange = useCallback((token) => {
    console.log('handleRecaptchaChange called:', token); // Debug log
    setFormData(prev => ({ ...prev, recaptchaToken: token }));
    setErrors(prev => ({ ...prev, recaptchaToken: '' }));
  }, []);

  const handleRememberMeChange = useCallback((e) => {
    setRememberMe(e.target.checked);
  }, []);

  const validate = () => {
    let temp = {};
    if (!formData.email.trim()) {
      temp.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      temp.email = 'Enter a valid email';
    }
    if (!formData.password) {
      temp.password = 'Password is required';
    }
    if (!formData.recaptchaToken) {
      temp.recaptchaToken = 'Please complete the reCAPTCHA';
    }
    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const response = await axios.post(
        'http://localhost:3000/api/v1/auth/login',
        {
          email: formData.email.trim().toLowerCase(),
          password: formData.password,
          recaptchaToken: formData.recaptchaToken,
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
        navigate('/verify-otp', { state: { userId: response.data.userId, email: formData.email, rememberMe } });
      }
    } catch (error) {
      const msg = error.response?.data?.message || error.message;
      if (msg.includes('Please verify your email')) {
        toast.error('Please verify your email before logging in');
        navigate('/verify-otp', { state: { userId: error.response?.data?.userId, email: formData.email, rememberMe } });
      } else if (msg.includes('Invalid credentials')) {
        toast.error('Invalid email or password');
      } else if (msg.includes('reCAPTCHA')) {
        toast.error('reCAPTCHA verification failed');
      } else if (msg.includes('Account is locked')) {
        toast.error('Too many attempts. Please try again after 15 minutes.');
      } else if (msg.includes('Error sending OTP email')) {
        toast.error('Failed to send OTP email. Please try again later.');
      } else if (error.response?.data?.errors) {
        error.response.data.errors.forEach((err) => toast.error(err.msg));
      } else {
        toast.error('Login failed: Please try again.');
      }
      console.error('Login.jsx: Login Error:', error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const role = getRole();
      toast.success('Already logged in!');
      navigate(role === 'admin' ? '/admin/dashboard' : '/');
    }
  }, [isAuthenticated, getRole, navigate]);

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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
          </div>
          <CardTitle className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-lg text-gray-600 max-w-sm mx-auto">
            Sign in to your account and continue your shopping journey
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email address"
                style={{
                  width: '100%',
                  height: '48px',
                  padding: '12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '16px',
                  backgroundColor: 'white',
                  color: '#111827',
                  outline: 'none'
                }}
                className={errors.email ? "border-red-500" : "focus:border-blue-500"}
              />
              {errors.email && (
                <p className="text-red-500 text-xs flex items-center">
                  <span className="mr-1">⚠</span>
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center">
                <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  style={{
                    width: '100%',
                    height: '48px',
                    padding: '12px',
                    paddingRight: '40px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '16px',
                    backgroundColor: 'white',
                    color: '#111827',
                    outline: 'none'
                  }}
                  className={errors.password ? "border-red-500" : "focus:border-blue-500"}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs flex items-center">
                  <span className="mr-1">⚠</span>
                  {errors.password}
                </p>
              )}
            </div>

            {/* CAPTCHA */}
            <div className="flex justify-center">
              <ReCAPTCHA
                sitekey="6LfdWZIrAAAAABEHkzQkNm2HY1LiSUJ92cqyKrPi"
                onChange={handleRecaptchaChange}
              />
            </div>
            {errors.recaptchaToken && (
              <p className="text-red-500 text-xs text-center flex items-center justify-center">
                <span className="mr-1">⚠</span>
                {errors.recaptchaToken}
              </p>
            )}

            <Separator className="bg-gradient-to-r from-transparent via-gray-300 to-transparent" />

            {/* Remember Me & Forgot Password */}
            <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={rememberMe}
                  onChange={handleRememberMeChange}
                  className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="rememberMe" className="text-sm text-gray-700">
                  Remember me
                </label>
              </div>
              <Link to="/forgot-password" className="text-sm text-blue-600 hover:text-blue-700 font-semibold underline transition-colors duration-200">
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading || isCsrfLoading}
              className="w-full h-14 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white font-bold text-lg rounded-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
              {loading ? (
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
                  <span>Signing In...</span>
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  <span>Sign In</span>
                </div>
              )}
            </Button>
          </form>

          {/* Register Link */}
          <div className="text-center pt-4">
            <p className="text-sm text-gray-600">
              New to Case?{' '}
              <Link to="/register" className="text-blue-600 hover:text-blue-700 font-semibold underline transition-colors duration-200">
                Create your account
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

export default Login;
