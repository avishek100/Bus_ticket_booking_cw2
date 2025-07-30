// import { useMutation, useQuery } from "@tanstack/react-query";
// import axios from "axios";
// import { Eye, EyeOff } from "lucide-react";
// import { useEffect, useState } from "react";
// import ReCAPTCHA from "react-google-recaptcha";
// import { FaEnvelope, FaLock, FaTimes, FaUser } from "react-icons/fa";
// import { Link, useNavigate } from "react-router-dom";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// // Fetch CSRF token
// const fetchCsrfToken = async () => {
//   const { data } = await axios.get("http://localhost:3000/api/v1/auth/csrf-token", {
//     withCredentials: true,
//   });
//   return data.csrfToken;
// };

// // API function for login
// const loginUser = async ({ userData, csrfToken }) => {
//   try {
//     const { data } = await axios.post(
//       "http://localhost:3000/api/v1/auth/login",
//       userData,
//       {
//         headers: {
//           "Content-Type": "application/json",
//           "X-CSRF-Token": csrfToken,
//         },
//         withCredentials: true,
//       }
//     );
//     return data;
//   } catch (error) {
//     throw error;
//   }
// };

// const Login = () => {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//     recaptchaToken: "",
//     rememberMe: false,
//   });
//   const [showPassword, setShowPassword] = useState(false);
//   const [errors, setErrors] = useState({});
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);

//   // Fetch CSRF token
//   const { data: csrfToken, isLoading: csrfLoading, error: csrfError } = useQuery({
//     queryKey: ["csrfToken"],
//     queryFn: fetchCsrfToken,
//   });

//   // Check for stored credentials on mount
//   useEffect(() => {
//     const storedToken = localStorage.getItem("authToken");
//     const storedUserId = localStorage.getItem("userId");
//     const storedRole = localStorage.getItem("role");

//     if (storedToken && storedUserId && storedRole) {
//       axios
//         .get("http://localhost:3000/api/v1/customers/me", {
//           headers: { Authorization: `Bearer ${storedToken}` },
//           withCredentials: true,
//         })
//         .then(() => {
//           setIsAuthenticated(true);
//           toast.success("Auto-logged in from saved credentials");
//           navigate(storedRole === "admin" ? "/admin/dashboard" : "/");
//         })
//         .catch(() => {
//           localStorage.removeItem("authToken");
//           localStorage.removeItem("userId");
//           localStorage.removeItem("role");
//           toast.error("Saved session expired. Please log in again.");
//         });
//     }
//   }, [navigate]);

//   // Redirect if already authenticated
//   useEffect(() => {
//     if (isAuthenticated) {
//       const storedRole = localStorage.getItem("role");
//       navigate(storedRole === "admin" ? "/admin/dashboard" : "/");
//     }
//   }, [isAuthenticated, navigate]);

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
//     setErrors({ ...errors, [name]: "" });
//   };

//   const handleRecaptchaChange = (token) => {
//     setFormData({ ...formData, recaptchaToken: token });
//     setErrors({ ...errors, recaptchaToken: "" });
//   };

//   const validate = () => {
//     const temp = {};
//     if (!formData.email.trim()) {
//       temp.email = "Email is required";
//     } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
//       temp.email = "Enter a valid email";
//     }
//     if (!formData.password) {
//       temp.password = "Password is required";
//     }
//     if (!formData.recaptchaToken) {
//       temp.recaptchaToken = "Please complete the reCAPTCHA";
//     }
//     setErrors(temp);
//     return Object.keys(temp).length === 0;
//   };

//   // Mutation Hook for login
//   const mutation = useMutation({
//     mutationFn: loginUser,
//     onSuccess: (data) => {
//       setIsSubmitting(false);
//       toast.success("OTP sent to your email!");
//       navigate("/verify-otp", {
//         state: { userId: data.userId, email: formData.email, rememberMe: formData.rememberMe },
//       });
//     },
//     onError: (error) => {
//       setIsSubmitting(false);
//       const msg = error.response?.data?.message || "Login failed. Please try again.";
//       const validationErrors = error.response?.data?.errors || [];
//       const newErrors = { ...errors };
//       validationErrors.forEach((err) => {
//         if (err.param) newErrors[err.param] = err.msg;
//       });
//       if (msg.includes("reCAPTCHA")) {
//         newErrors.recaptchaToken = msg;
//       } else if (msg.includes("Account is locked")) {
//         newErrors.submit = "Too many attempts. Try again after 15 minutes.";
//       } else if (msg.includes("Please verify your email")) {
//         newErrors.submit = "Please verify your email before logging in.";
//       } else if (msg.includes("Invalid credentials")) {
//         newErrors.submit = "Invalid email or password.";
//       } else if (msg.includes("Too many requests")) {
//         newErrors.submit = "Too many requests. Please try again after 15 minutes.";
//       } else {
//         newErrors.submit = msg;
//       }
//       setErrors(newErrors);
//       toast.error(newErrors.submit);
//     },
//   });

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (!validate() || !csrfToken) {
//       if (!csrfToken) {
//         setErrors({ ...errors, submit: "CSRF token not loaded. Please refresh the page." });
//         toast.error("CSRF token not loaded. Please refresh the page.");
//       }
//       return;
//     }
//     setIsSubmitting(true);
//     mutation.mutate({
//       userData: {
//         email: formData.email.trim().toLowerCase(),
//         password: formData.password,
//         recaptchaToken: formData.recaptchaToken,
//       },
//       csrfToken,
//     });
//   };

//   return (
//     <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 items-center justify-center">
//       {/* Centered Form Section Only */}
//       <div className="w-full max-w-md bg-white/70 backdrop-blur-lg rounded-3xl shadow-2xl p-10 border border-white/40 mx-auto">
//         {/* Logo Section */}
//         <div className="text-center mb-8">
//           <img src="src/assets/images/logo.png" alt="SwiftRide Logo" className="w-16 h-16 mx-auto mb-4 rounded-xl shadow" />
//           <h1 className="text-3xl font-extrabold text-[#E04848] mb-2 tracking-tight">SwiftRide</h1>
//           <p className="text-base text-gray-600">Welcome back! Sign in to your account</p>
//         </div>

//         {/* CSRF Token Error */}
//         {csrfError && (
//           <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-6 shadow">
//             <p className="text-red-600 text-sm">Failed to load CSRF token. Please refresh the page.</p>
//           </div>
//         )}

//         {/* Login Form */}
//         <form onSubmit={handleSubmit} className="space-y-5">
//           {/* Email */}
//           <div>
//             <label className="block text-gray-700 text-sm font-medium mb-2">Email Address</label>
//             <div className="relative">
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <FaEnvelope className="text-gray-400" />
//               </div>
//               <input
//                 type="email"
//                 name="email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 placeholder="your@email.com"
//                 className={`w-full pl-10 pr-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#E04848] transition-colors bg-white/80 shadow-sm ${errors.email ? "border-red-500" : "border-gray-300"}`}
//               />
//               {errors.email && (
//                 <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
//                   <FaTimes className="text-red-500" />
//                 </div>
//               )}
//             </div>
//             {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
//           </div>

//           {/* Password */}
//           <div>
//             <label className="block text-gray-700 text-sm font-medium mb-2">Password</label>
//             <div className="relative">
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <FaLock className="text-gray-400" />
//               </div>
//               <input
//                 type={showPassword ? "text" : "password"}
//                 name="password"
//                 value={formData.password}
//                 onChange={handleChange}
//                 placeholder="Enter your password"
//                 className={`w-full pl-10 pr-12 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#E04848] transition-colors bg-white/80 shadow-sm ${errors.password ? "border-red-500" : "border-gray-300"}`}
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowPassword(!showPassword)}
//                 className="absolute inset-y-0 right-0 pr-3 flex items-center"
//                 tabIndex={-1}
//                 aria-label="Toggle password visibility"
//               >
//                 {showPassword ? <EyeOff size={20} className="text-gray-400" /> : <Eye size={20} className="text-gray-400" />}
//               </button>
//             </div>
//             {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
//           </div>

//           {/* reCAPTCHA */}
//           <div>
//             <label className="block text-gray-700 text-sm font-medium mb-2">Verify You're Not a Robot</label>
//             <div className="flex justify-center">
//               <ReCAPTCHA
//                 sitekey="6LfdWZIrAAAAABEHkzQkNm2HY1LiSUJ92cqyKrPi"
//                 onChange={handleRecaptchaChange}
//                 theme="light"
//                 onErrored={() => console.error("reCAPTCHA error occurred")}
//               />
//             </div>
//             {errors.recaptchaToken && <p className="text-red-500 text-sm mt-1 text-center">{errors.recaptchaToken}</p>}
//           </div>

//           {/* Remember + Forgot */}
//           <div className="flex items-center justify-between">
//             <div className="flex items-center">
//               <input
//                 id="remember-me"
//                 name="rememberMe"
//                 type="checkbox"
//                 checked={formData.rememberMe}
//                 onChange={handleChange}
//                 className="h-4 w-4 text-[#E04848] focus:ring-[#E04848] border-gray-300 rounded"
//               />
//               <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-600">
//                 Remember me
//               </label>
//             </div>
//             <Link to="/forgot-password" className="text-sm text-[#E04848] hover:underline">
//               Forgot password?
//             </Link>
//           </div>

//           {/* Submit Error */}
//           {errors.submit && (
//             <div className="bg-red-50 border border-red-200 rounded-lg p-3 shadow">
//               <p className="text-red-600 text-sm">{errors.submit}</p>
//             </div>
//           )}

//           {/* Login Button */}
//           <button
//             type="submit"
//             disabled={isSubmitting || mutation.isLoading || csrfLoading}
//             className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-3 rounded-xl font-semibold hover:from-green-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
//           >
//             {(isSubmitting || mutation.isLoading || csrfLoading) ? (
//               <div className="flex items-center justify-center">
//                 <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
//                 Signing In...
//               </div>
//             ) : (
//               "Sign In to SwiftRide"
//             )}
//           </button>
//         </form>

//         {/* Divider */}
//         <div className="my-6">
//           <div className="relative">
//             <div className="absolute inset-0 flex items-center">
//               <div className="w-full border-t border-gray-300"></div>
//             </div>
//             <div className="relative flex justify-center text-sm">
//               <span className="px-2 bg-white/80 text-gray-500 rounded-full">Or continue with</span>
//             </div>
//           </div>
//         </div>

//         {/* Social Login Buttons */}
//         <div className="space-y-3">
//           <button className="w-full flex items-center justify-center px-4 py-2 border border-green-500 rounded-xl text-sm font-medium text-green-700 bg-white/80 hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors shadow">
//             <FaUser className="mr-2" />
//             Continue as Guest
//           </button>
//         </div>

//         <p className="text-sm text-gray-500 mt-6 text-center">
//           Don't have an account?{" "}
//           <Link to="/register" className="text-[#E04848] font-medium hover:underline">
//             Sign Up
//           </Link>
//         </p>

//         <div className="text-sm text-gray-400 mt-6 text-center">© 2025 GoBus. All rights reserved.</div>
//       </div>
//       <ToastContainer position="top-right" autoClose={3000} hideProgressBar theme="dark" />
//     </div>
//   );
// };

// export default Login;




import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
import { useEffect, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { FaEnvelope, FaLock, FaTimes, FaUser } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Fetch CSRF token
const fetchCsrfToken = async () => {
  const { data } = await axios.get("http://localhost:3000/api/v1/auth/csrf-token", {
    withCredentials: true,
  });
  return data.csrfToken;
};

// API function for login
const loginUser = async ({ userData, csrfToken }) => {
  const { data } = await axios.post(
    "http://localhost:3000/api/v1/auth/login",
    userData,
    {
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": csrfToken,
      },
      withCredentials: true,
    }
  );
  return data;
};

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    recaptchaToken: "",
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Fetch CSRF token
  const { data: csrfToken, isLoading: csrfLoading, error: csrfError } = useQuery({
    queryKey: ["csrfToken"],
    queryFn: fetchCsrfToken,
  });

  // Check for stored credentials on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    const storedUserId = localStorage.getItem("userId");
    const storedRole = localStorage.getItem("role");

    if (storedToken && storedUserId && storedRole) {
      axios
        .get("http://localhost:3000/api/v1/auth/customer/me", {
          headers: { Authorization: `Bearer ${storedToken}` },
          withCredentials: true,
        })
        .then(() => {
          setIsAuthenticated(true);
          toast.success("Auto-logged in from saved credentials");
          navigate(storedRole === "admin" ? "/admin/dashboard" : "/");
        })
        .catch(() => {
          localStorage.removeItem("authToken");
          localStorage.removeItem("userId");
          localStorage.removeItem("role");
          toast.error("Saved session expired. Please log in again.");
        });
    }
  }, [navigate]);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const storedRole = localStorage.getItem("role");
      navigate(storedRole === "admin" ? "/admin/dashboard" : "/");
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
    setErrors({ ...errors, [name]: "" });
  };

  const handleRecaptchaChange = (token) => {
    setFormData({ ...formData, recaptchaToken: token });
    setErrors({ ...errors, recaptchaToken: "" });
  };

  const validate = () => {
    const temp = {};
    if (!formData.email.trim()) {
      temp.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      temp.email = "Enter a valid email";
    }
    if (!formData.password) {
      temp.password = "Password is required";
    }
    if (!formData.recaptchaToken) {
      temp.recaptchaToken = "Please complete the reCAPTCHA";
    }
    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  // Mutation Hook for login
  const mutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      setIsSubmitting(false);
      // Store temporary data for OTP verification
      localStorage.setItem("tempUserId", data.userId);
      localStorage.setItem("tempEmail", formData.email);
      localStorage.setItem("tempRememberMe", formData.rememberMe);
      toast.success("OTP sent to your email!");
      navigate("/verify-otp", {
        state: { userId: data.userId, email: formData.email, rememberMe: formData.rememberMe },
      });
    },
    onError: (error) => {
      setIsSubmitting(false);
      const msg = error.response?.data?.message || "Login failed. Please try again.";
      const validationErrors = error.response?.data?.errors || [];
      const newErrors = { ...errors };
      validationErrors.forEach((err) => {
        if (err.param) newErrors[err.param] = err.msg;
      });
      if (msg.includes("reCAPTCHA")) {
        newErrors.recaptchaToken = msg;
      } else if (msg.includes("Account is locked")) {
        newErrors.submit = "Too many attempts. Try again after 15 minutes.";
      } else if (msg.includes("Please verify your email")) {
        newErrors.submit = "Please verify your email before logging in.";
      } else if (msg.includes("Invalid credentials")) {
        newErrors.submit = "Invalid email or password.";
      } else if (msg.includes("Too many requests")) {
        newErrors.submit = "Too many requests. Please try again after 15 minutes.";
      } else {
        newErrors.submit = msg;
      }
      setErrors(newErrors);
      toast.error(newErrors.submit);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate() || !csrfToken) {
      if (!csrfToken) {
        setErrors({ ...errors, submit: "CSRF token not loaded. Please refresh the page." });
        toast.error("CSRF token not loaded. Please refresh the page.");
      }
      return;
    }
    setIsSubmitting(true);
    mutation.mutate({
      userData: {
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        recaptchaToken: formData.recaptchaToken,
      },
      csrfToken,
    });
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 items-center justify-center">
      <div className="w-full max-w-md bg-white/70 backdrop-blur-lg rounded-3xl shadow-2xl p-10 border border-white/40 mx-auto">
        <div className="text-center mb-8">
          {/* <img src="src/assets/images/logo.png" alt="SwiftRide Logo" className="w-16 h-16 mx-auto mb-4 rounded-xl shadow" /> */}
          <h1 className="text-3xl font-extrabold text-[#E04848] mb-2 tracking-tight">SwiftRide</h1>
          <p className="text-base text-gray-600">Welcome back! Sign in to your account</p>
        </div>

        {csrfError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-6 shadow">
            <p className="text-red-600 text-sm">Failed to load CSRF token. Please refresh the page.</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaEnvelope className="text-gray-400" />
              </div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
                className={`w-full pl-10 pr-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#E04848] transition-colors bg-white/80 shadow-sm ${errors.email ? "border-red-500" : "border-gray-300"}`}
              />
              {errors.email && (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <FaTimes className="text-red-500" />
                </div>
              )}
            </div>
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLock className="text-gray-400" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className={`w-full pl-10 pr-12 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#E04848] transition-colors bg-white/80 shadow-sm ${errors.password ? "border-red-500" : "border-gray-300"}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                tabIndex={-1}
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff size={20} className="text-gray-400" /> : <Eye size={20} className="text-gray-400" />}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">Verify You're Not a Robot</label>
            <div className="flex justify-center">
              <ReCAPTCHA
                sitekey="6LfdWZIrAAAAABEHkzQkNm2HY1LiSUJ92cqyKrPi"
                onChange={handleRecaptchaChange}
                theme="light"
                onErrored={() => console.error("reCAPTCHA error occurred")}
              />
            </div>
            {errors.recaptchaToken && <p className="text-red-500 text-sm mt-1 text-center">{errors.recaptchaToken}</p>}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="rememberMe"
                type="checkbox"
                checked={formData.rememberMe}
                onChange={handleChange}
                className="h-4 w-4 text-[#E04848] focus:ring-[#E04848] border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-600">
                Remember me
              </label>
            </div>
            <Link to="/forgot-password" className="text-sm text-[#E04848] hover:underline">
              Forgot password?
            </Link>
          </div>

          {errors.submit && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 shadow">
              <p className="text-red-600 text-sm">{errors.submit}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting || mutation.isLoading || csrfLoading}
            className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-3 rounded-xl font-semibold hover:from-green-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            {(isSubmitting || mutation.isLoading || csrfLoading) ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Signing In...
              </div>
            ) : (
              "Sign In to SwiftRide"
            )}
          </button>
        </form>

        <div className="my-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white/80 text-gray-500 rounded-full">Or continue with</span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <button className="w-full flex items-center justify-center px-4 py-2 border border-green-500 rounded-xl text-sm font-medium text-green-700 bg-white/80 hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors shadow">
            <FaUser className="mr-2" />
            Continue as Guest
          </button>
        </div>

        <p className="text-sm text-gray-500 mt-6 text-center">
          Don't have an account?{" "}
          <Link to="/register" className="text-[#E04848] font-medium hover:underline">
            Sign Up
          </Link>
        </p>

        <div className="text-sm text-gray-400 mt-6 text-center">© 2025 GoBus. All rights reserved.</div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar theme="dark" />
    </div>
  );
};

export default Login;
// 