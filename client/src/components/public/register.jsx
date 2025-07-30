import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useRef, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { FaCheck, FaEnvelope, FaLock, FaPhone, FaUser } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

// Fetch CSRF token
const fetchCsrfToken = async () => {
  const { data } = await axios.get("http://localhost:3000/api/v1/auth/csrf-token", {
    withCredentials: true,
  });
  return data.csrfToken;
};

// API call function for user registration
const registerUser = async ({ userData, csrfToken }) => {
  console.log("Sending registration data:", userData); // Debug log
  try {
    const { data } = await axios.post("http://localhost:3000/api/v1/auth/register", userData, {
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": csrfToken,
      },
      withCredentials: true,
    });
    return data;
  } catch (error) {
    console.error("Registration error:", error.response?.data || error.message); // Debug log
    throw error;
  }
};

const Register = () => {
  const navigate = useNavigate();
  const recaptchaRef = useRef(null);
  const [formData, setFormData] = useState({
    fname: "",
    lname: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    recaptchaToken: "",
  });
  const [errors, setErrors] = useState({
    fname: "",
    lname: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    recaptcha: "",
  });
  const [loading, setLoading] = useState(false);
  // Password strength state
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    label: "Weak",
    color: "bg-red-500",
  });

  // Fetch CSRF token
  const { data: csrfToken, isLoading: csrfLoading, error: csrfError } = useQuery({
    queryKey: ["csrfToken"],
    queryFn: fetchCsrfToken,
  });

  // Mutation Hook for registration
  const mutation = useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      alert("Registration successful! You can now log in.");
      console.log("User registered:", data);
      navigate("/login"); // Redirect to login page
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || "Registration failed";
      const validationErrors = error.response?.data?.errors || [];
      console.error("Mutation error:", errorMessage, validationErrors); // Debug log
      const newErrors = { ...errors };
      validationErrors.forEach((err) => {
        if (err.param) newErrors[err.param] = err.msg;
      });
      if (errorMessage.includes("reCAPTCHA")) {
        newErrors.recaptcha = errorMessage;
        if (recaptchaRef.current) {
          recaptchaRef.current.reset(); // Reset reCAPTCHA on error
        }
        setFormData({ ...formData, recaptchaToken: "" }); // Clear token
      } else if (errorMessage.includes("Too many requests")) {
        newErrors.recaptcha = "Too many requests. Please try again after 15 minutes.";
      }
      setErrors(newErrors);
      alert(errorMessage);
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" }); // Clear error on change

    // Update password strength if password field changes
    if (name === "password") {
      const strength = calculatePasswordStrength(value);
      setPasswordStrength(strength);
    }
  };

  // Handle reCAPTCHA change
  const handleRecaptchaChange = (token) => {
    console.log("reCAPTCHA token:", token); // Debug log
    setFormData({ ...formData, recaptchaToken: token });
    setErrors({ ...errors, recaptcha: "" });
  };

  // Password strength calculation
  const calculatePasswordStrength = (password) => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score === 0) {
      return { score: 0, label: "Weak", color: "bg-red-500" };
    } else if (score <= 2) {
      return { score: 25 * score, label: "Weak", color: "bg-red-500" };
    } else if (score === 3) {
      return { score: 75, label: "Moderate", color: "bg-yellow-500" };
    } else if (score >= 4) {
      return { score: 100, label: "Strong", color: "bg-green-500" };
    }
  };

  // Password requirements check
  const passwordRequirements = [
    { test: (pwd) => pwd.length >= 8, text: "At least 8 characters" },
    { test: (pwd) => /[A-Z]/.test(pwd), text: "At least one uppercase letter" },
    { test: (pwd) => /[a-z]/.test(pwd), text: "At least one lowercase letter" },
    { test: (pwd) => /[0-9]/.test(pwd), text: "At least one number" },
    { test: (pwd) => /[^A-Za-z0-9]/.test(pwd), text: "At least one special character" },
  ];

  const validateForm = () => {
    let valid = true;
    const newErrors = {
      fname: "",
      lname: "",
      phone: "",
      email: "",
      password: "",
      confirmPassword: "",
      recaptcha: "",
    };

    if (!formData.fname.trim()) {
      newErrors.fname = "Please enter first name.";
      valid = false;
    }
    if (!formData.lname.trim()) {
      newErrors.lname = "Please enter last name.";
      valid = false;
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Please enter phone number.";
      valid = false;
    } else if (!/^\+?\d{10,15}$/.test(formData.phone.trim())) {
      newErrors.phone = "Please enter a valid phone number (10-15 digits).";
      valid = false;
    }
    if (!formData.email.trim()) {
      newErrors.email = "Please enter email.";
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = "Please enter a valid email address.";
      valid = false;
    }
    if (!formData.password) {
      newErrors.password = "Please enter password.";
      valid = false;
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters.";
      valid = false;
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
      valid = false;
    }
    if (!formData.recaptchaToken) {
      newErrors.recaptcha = "Please complete the reCAPTCHA.";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm() && csrfToken) {
      setLoading(true);
      mutation.mutate(
        {
          userData: {
            fname: formData.fname,
            lname: formData.lname,
            phone: formData.phone,
            email: formData.email,
            password: formData.password,
            confirmPassword: formData.confirmPassword,
            recaptchaToken: formData.recaptchaToken,
          },
          csrfToken,
        },
        {
          onSettled: () => setLoading(false),
        }
      );
    } else if (!csrfToken) {
      setErrors({ ...errors, recaptcha: "CSRF token not loaded. Please refresh the page." });
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 items-center justify-center">
      {/* Centered Form Section Only */}
      <div className="w-full max-w-md bg-white/70 backdrop-blur-lg rounded-3xl shadow-2xl p-10 border border-white/40 mx-auto">
        {/* Logo Section */}
        <div className="text-center mb-8">
          {/* <img src="src/assets/images/logo.png" alt="SwiftRide Logo" className="w-16 h-16 mx-auto mb-4 rounded-xl shadow" /> */}
          <h1 className="text-3xl font-extrabold text-[#E04848] mb-2 tracking-tight">SwiftRide</h1>
          <p className="text-base text-gray-600">Create your account to get started</p>
        </div>

        {/* CSRF Token Error */}
        {csrfError && <p className="text-red-500 text-sm mb-4">Failed to load CSRF token. Please refresh the page.</p>}

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* First Name */}
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">First Name</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaUser className="text-gray-400" />
              </div>
              <input
                type="text"
                name="fname"
                value={formData.fname}
                onChange={handleChange}
                placeholder="First Name"
                className="w-full pl-10 pr-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#E04848] transition-colors bg-white/80 shadow-sm border-gray-300"
              />
              {errors.fname && <p className="text-red-500 text-sm mt-1">{errors.fname}</p>}
            </div>
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">Last Name</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaUser className="text-gray-400" />
              </div>
              <input
                type="text"
                name="lname"
                value={formData.lname}
                onChange={handleChange}
                placeholder="Last Name"
                className="w-full pl-10 pr-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#E04848] transition-colors bg-white/80 shadow-sm border-gray-300"
              />
              {errors.lname && <p className="text-red-500 text-sm mt-1">{errors.lname}</p>}
            </div>
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">Mobile Number</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaPhone className="text-gray-400" />
              </div>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Mobile Number"
                className="w-full pl-10 pr-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#E04848] transition-colors bg-white/80 shadow-sm border-gray-300"
              />
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaEnvelope className="text-gray-400" />
              </div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className="w-full pl-10 pr-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#E04848] transition-colors bg-white/80 shadow-sm border-gray-300"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLock className="text-gray-400" />
              </div>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className="w-full pl-10 pr-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#E04848] transition-colors bg-white/80 shadow-sm border-gray-300"
              />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>
            {/* Password Strength Indicator */}
            {formData.password && (
              <div className="mt-2">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                    style={{ width: `${passwordStrength.score}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Password Strength: <span className={passwordStrength.color.replace("bg-", "text-")}>{passwordStrength.label}</span>
                </p>
              </div>
            )}
            {/* Password Requirements */}
            <div className="mt-2 space-y-1">
              {passwordRequirements.map((req, index) => (
                <div key={index} className="flex items-center space-x-2 text-sm">
                  <FaCheck
                    className={`text-${req.test(formData.password) ? "green-500" : "gray-400"}`}
                  />
                  <span className={req.test(formData.password) ? "text-gray-700" : "text-gray-400"}>
                    {req.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">Confirm Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLock className="text-gray-400" />
              </div>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm Password"
                className="w-full pl-10 pr-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#E04848] transition-colors bg-white/80 shadow-sm border-gray-300"
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
              )}
            </div>
          </div>

          {/* reCAPTCHA */}
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">Verify You're Not a Robot</label>
            <ReCAPTCHA
              ref={recaptchaRef}
              sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
              onChange={handleRecaptchaChange}
              theme="light"
              onErrored={() => console.error("reCAPTCHA error occurred")}
            />
            {errors.recaptcha && <p className="text-red-500 text-sm mt-1">{errors.recaptcha}</p>}
          </div>

          {/* Register Button */}
          <button
            type="submit"
            disabled={loading || mutation.isLoading || csrfLoading}
            className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-3 rounded-xl font-semibold hover:from-green-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            {loading || mutation.isLoading || csrfLoading ? (
              <div className="flex justify-center items-center space-x-2">
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  ></path>
                </svg>
                <span>Registering...</span>
              </div>
            ) : (
              "Register"
            )}
          </button>

          {/* Error & Success Messages */}
          {mutation.isError && <p className="text-red-500 text-sm mt-2">{mutation.error.message}</p>}
          {mutation.isSuccess && <p className="text-green-500 text-sm mt-2">Registration successful! You can now log in.</p>}
        </form>

        <p className="text-sm text-gray-500 mt-6 text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-[#E04848] font-medium hover:underline">
            Sign In
          </Link>
        </p>

        <div className="text-sm text-gray-400 mt-6 text-center">© 2025 SwiftRide. All rights reserved.</div>
      </div>
    </div>
  );
};

export default Register;