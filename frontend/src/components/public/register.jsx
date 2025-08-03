
import axios from "axios";
import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReCAPTCHA from "react-google-recaptcha";
import zxcvbn from "zxcvbn";
import { useAuth } from "../../context/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../common/ui/card";
import { Input } from "../common/ui/input";
import { Button } from "../common/ui/button";
import { Separator } from "../common/ui/separator";

const Register = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fname: "",
    lname: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [isChecked, setIsChecked] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [csrfToken, setCsrfToken] = useState("");

  // Debug log for re-renders
  console.log('Register component rendered, formData:', formData);

  // Track re-renders
  useEffect(() => {
    console.log('Register component re-rendered, formData:', formData);
  });

  // Fetch CSRF token on component mount
  useEffect(() => {
    axios
      .get("http://localhost:3000/api/v1/auth/csrf-token", { withCredentials: true })
      .then((response) => {
        console.log("CSRF Token fetched:", response.data.csrfToken);
        setCsrfToken(response.data.csrfToken);
      })
      .catch((error) => {
        console.error("Error fetching CSRF token:", error);
        toast.error("Failed to initialize form security.");
      });
  }, []);

  // Memoize the form handlers to prevent re-renders
  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    console.log('handleChange called:', { name, value, type, checked }); // Debug log

    if (type === "checkbox" && name === "terms") {
      setIsChecked(checked);
      setErrors((prevErrors) => ({ ...prevErrors, terms: "" }));
    } else if (type === "checkbox" && name === "rememberMe") {
      setRememberMe(checked);
    } else {
      setFormData((prevData) => {
        const newData = { ...prevData, [name]: value };
        console.log('New form data:', newData);
        return newData;
      });
      setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
    }
  }, []);

  const validatePassword = (password) => {
    const result = zxcvbn(password);
    const minScore = 3; // Require "good" strength
    const requirements = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[@#$%^&*]/.test(password),
      strength: result.score >= minScore,
    };

    return {
      isValid: Object.values(requirements).every(Boolean),
      requirements,
      errors: {
        length: requirements.length ? "" : "Password must be at least 8 characters.",
        uppercase: requirements.uppercase ? "" : "Password must include at least one uppercase letter.",
        lowercase: requirements.lowcase ? "" : "Password must include at least one lowercase letter.",
        number: requirements.number ? "" : "Password must include at least one number.",
        special: requirements.special ? "" : "Password must include at least one special character (@, #, $, etc.).",
        strength: requirements.strength ? "" : "Password is too weak.",
      },
    };
  };

  const validateForm = () => {
    let newErrors = {};

    if (!formData.fname.trim()) newErrors.fname = "First name is required.";
    if (!formData.lname.trim()) newErrors.lname = "Last name is required.";
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required.";
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = "Phone number must be 10 digits.";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Enter a valid email address.";
    }
    if (!formData.password.trim()) {
      newErrors.password = "Password is required.";
    } else {
      const passwordValidation = validatePassword(formData.password);
      if (!passwordValidation.isValid) {
        newErrors.password = Object.values(passwordValidation.errors)
          .filter(Boolean)
          .join(" ");
      }
    }
    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = "Confirm password is required.";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }
    if (!isChecked) {
      newErrors.terms = "You must agree to the Terms and Conditions.";
    }
    if (!recaptchaToken) {
      newErrors.captcha = "Please complete the CAPTCHA.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3000/api/v1/auth/register",
        {
          ...formData,
          recaptchaToken,
          termsAccepted: isChecked,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "X-CSRF-Token": csrfToken,
          },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        toast.success("Registration successful! Please log in with your new account.");
        
        // Don't automatically log in the user
        // Just redirect to login page after a short delay
        setTimeout(() => {
          navigate('/login');
        }, 2000);

      }
    } catch (error) {
      console.error("Error during registration:", error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error.response?.data?.errors) {
        error.response.data.errors.forEach((err) => toast.error(err.msg));
      } else {
        toast.error("Registration failed! Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const onCaptchaChange = (value) => {
    setRecaptchaToken(value);
    setErrors((prevErrors) => ({ ...prevErrors, captcha: "" }));
  };

  const passwordValidation = validatePassword(formData.password);

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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <CardTitle className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Join Case
          </CardTitle>
          <CardDescription className="text-lg text-gray-600 max-w-sm mx-auto">
            Create your account and discover premium phone cases for every device
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  First Name
                </label>
                <input
                  type="text"
                  name="fname"
                  value={formData.fname}
                  onChange={handleChange}
                  placeholder="Enter your first name"
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
                  className={errors.fname ? "border-red-500" : "focus:border-blue-500"}
                />
                {errors.fname && (
                  <p className="text-red-500 text-xs flex items-center">
                    <span className="mr-1">⚠</span>
                    {errors.fname}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                  Last Name
                </label>
                <input
                  type="text"
                  name="lname"
                  value={formData.lname}
                  onChange={handleChange}
                  placeholder="Enter your last name"
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
                  className={errors.lname ? "border-red-500" : "focus:border-purple-500"}
                />
                {errors.lname && (
                  <p className="text-red-500 text-xs flex items-center">
                    <span className="mr-1">⚠</span>
                    {errors.lname}
                  </p>
                )}
              </div>
            </div>

            {/* Phone Field */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
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
                className={errors.phone ? "border-red-500" : "focus:border-green-500"}
              />
              {errors.phone && (
                <p className="text-red-500 text-xs flex items-center">
                  <span className="mr-1">⚠</span>
                  {errors.phone}
                </p>
              )}
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center">
                <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
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
                className={errors.email ? "border-red-500" : "focus:border-orange-500"}
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
                <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a secure password"
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
                className={errors.password ? "border-red-500" : "focus:border-red-500"}
              />
              {errors.password && (
                <p className="text-red-500 text-xs flex items-center">
                  <span className="mr-1">⚠</span>
                  {errors.password}
                </p>
              )}
              
              {/* Password Requirements */}
              <div className="mt-3 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                <p className="text-xs font-semibold text-gray-700 mb-3 flex items-center">
                  <svg className="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Password Requirements:
                </p>
                <div className="grid grid-cols-1 gap-2 text-xs">
                  <div className={`flex items-center space-x-2 p-2 rounded-lg ${passwordValidation.requirements.length ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                    <span className={`w-4 h-4 rounded-full flex items-center justify-center ${passwordValidation.requirements.length ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}>
                      {passwordValidation.requirements.length ? "✓" : "✗"}
                    </span>
                    <span>At least 8 characters</span>
                  </div>
                  <div className={`flex items-center space-x-2 p-2 rounded-lg ${passwordValidation.requirements.uppercase ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                    <span className={`w-4 h-4 rounded-full flex items-center justify-center ${passwordValidation.requirements.uppercase ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}>
                      {passwordValidation.requirements.uppercase ? "✓" : "✗"}
                    </span>
                    <span>One uppercase letter</span>
                  </div>
                  <div className={`flex items-center space-x-2 p-2 rounded-lg ${passwordValidation.requirements.lowercase ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                    <span className={`w-4 h-4 rounded-full flex items-center justify-center ${passwordValidation.requirements.lowercase ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}>
                      {passwordValidation.requirements.lowercase ? "✓" : "✗"}
                    </span>
                    <span>One lowercase letter</span>
                  </div>
                  <div className={`flex items-center space-x-2 p-2 rounded-lg ${passwordValidation.requirements.number ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                    <span className={`w-4 h-4 rounded-full flex items-center justify-center ${passwordValidation.requirements.number ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}>
                      {passwordValidation.requirements.number ? "✓" : "✗"}
                    </span>
                    <span>One number</span>
                  </div>
                  <div className={`flex items-center space-x-2 p-2 rounded-lg ${passwordValidation.requirements.special ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                    <span className={`w-4 h-4 rounded-full flex items-center justify-center ${passwordValidation.requirements.special ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}>
                      {passwordValidation.requirements.special ? "✓" : "✗"}
                    </span>
                    <span>One special character (@#$%^&*)</span>
                  </div>
                  <div className={`flex items-center space-x-2 p-2 rounded-lg ${passwordValidation.requirements.strength ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                    <span className={`w-4 h-4 rounded-full flex items-center justify-center ${passwordValidation.requirements.strength ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}>
                      {passwordValidation.requirements.strength ? "✓" : "✗"}
                    </span>
                    <span>Strong password</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center">
                <span className="w-2 h-2 bg-pink-500 rounded-full mr-2"></span>
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your secure password"
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
                className={errors.confirmPassword ? "border-red-500" : "focus:border-pink-500"}
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs flex items-center">
                  <span className="mr-1">⚠</span>
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* CAPTCHA */}
            <div className="flex justify-center">
              <ReCAPTCHA
                sitekey="6LfdWZIrAAAAABEHkzQkNm2HY1LiSUJ92cqyKrPi"
                onChange={onCaptchaChange}
              />
            </div>
            {errors.captcha && (
              <p className="text-red-500 text-xs text-center flex items-center justify-center">
                <span className="mr-1">⚠</span>
                {errors.captcha}
              </p>
            )}

            <Separator className="bg-gradient-to-r from-transparent via-gray-300 to-transparent" />

            {/* Terms and Conditions */}
            <div className="flex items-start space-x-3 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
              <input
                type="checkbox"
                id="terms"
                name="terms"
                checked={isChecked}
                onChange={handleChange}
                className="mt-1 h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="terms" className="text-sm text-gray-700">
                I agree to the{" "}
                <a href="#" className="text-blue-600 hover:text-blue-700 font-semibold underline">
                  Terms and Conditions
                </a>
              </label>
            </div>
            {errors.terms && (
              <p className="text-red-500 text-xs flex items-center">
                <span className="mr-1">⚠</span>
                {errors.terms}
              </p>
            )}

            {/* Remember Me */}
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <input
                type="checkbox"
                id="rememberMe"
                name="rememberMe"
                checked={rememberMe}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="rememberMe" className="text-sm text-gray-700">
                Remember me
              </label>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
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
                  <span>Creating Your Account...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span>Create Account</span>
                </div>
              )}
            </Button>
          </form>

          {/* Login Link */}
          <div className="text-center pt-4">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-600 hover:text-blue-700 font-semibold underline transition-colors duration-200">
                Sign in to continue shopping
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

export default Register;
