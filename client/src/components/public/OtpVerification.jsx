// import axios from 'axios';
// import { useEffect, useRef, useState } from 'react';
// import { Link, useLocation, useNavigate } from 'react-router-dom';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import { useAuth } from '../../context/AuthContext';

// export default function OtpVerification() {
//     const { login } = useAuth();
//     const navigate = useNavigate();
//     const location = useLocation();
//     const { userId, email, rememberMe } = location.state || {};

//     const [otp, setOtp] = useState(['', '', '', '', '', '']);
//     const [errors, setErrors] = useState({});
//     const [loading, setLoading] = useState(false);
//     const [csrfToken, setCsrfToken] = useState('');
//     const inputRefs = useRef([]);

//     // Fetch CSRF token on component mount
//     useEffect(() => {
//         const fetchCsrfToken = async () => {
//             try {
//                 const response = await axios.get('http://localhost:3000/api/v1/auth/csrf-token', {
//                     withCredentials: true,
//                 });
//                 setCsrfToken(response.data.csrfToken);
//             } catch (error) {
//                 console.error('CSRF Token Error:', error);
//                 toast.error('Failed to fetch CSRF token. Please refresh the page.');
//             }
//         };
//         fetchCsrfToken();
//     }, []);

//     const handleChange = (index, value) => {
//         if (/^\d?$/.test(value)) {
//             const newOtp = [...otp];
//             newOtp[index] = value;
//             setOtp(newOtp);
//             setErrors({ ...errors, otp: '' });

//             // Move to next input
//             if (value && index < 5) {
//                 inputRefs.current[index + 1].focus();
//             }
//         }
//     };

//     const handleKeyDown = (index, e) => {
//         if (e.key === 'Backspace' && !otp[index] && index > 0) {
//             inputRefs.current[index - 1].focus();
//         }
//     };

//     const validate = () => {
//         let temp = {};
//         const otpString = otp.join('');
//         if (otpString.length !== 6) {
//             temp.otp = 'Please enter a 6-digit OTP';
//         } else if (!/^\d{6}$/.test(otpString)) {
//             temp.otp = 'OTP must contain only digits';
//         }
//         if (!csrfToken) {
//             temp.csrf = 'CSRF token is missing. Please refresh the page.';
//         }
//         if (!authContext) {
//             temp.context = 'Authentication context is unavailable. Please refresh the page.';
//         }

//         setErrors(temp);
//         return Object.keys(temp).length === 0;
//     };

//     const handleVerify = async (e) => {
//         e.preventDefault();

//         if (!userId || !email) {
//             toast.error('Invalid session. Please try logging in again.');
//             navigate('/login');
//             return;
//         }

//         if (!authContext) {
//             toast.error('Authentication context is unavailable. Please refresh the page.');
//             return;
//         }

//         if (!validate()) {
//             if (errors.csrf) {
//                 toast.error(errors.csrf);
//             } else if (errors.context) {
//                 toast.error(errors.context);
//             }
//             return;
//         }

//         setLoading(true);
//         try {
//             const res = await axios.post(
//                 'http://localhost:3000/api/v1/auth/verify-otp',
//                 {
//                     userId,
//                     otp: otp.join(''),
//                 },
//                 {
//                     headers: {
//                         'Content-Type': 'application/json',
//                         'X-CSRF-Token': csrfToken,
//                     },
//                     withCredentials: true,
//                 }
//             );

//             const { token, userId: returnedUserId, role } = res.data;

//             // Call login from AuthContext
//             login(token, returnedUserId, role, rememberMe);

//             toast.success('OTP verified! Logging in...');

//             setTimeout(() => {
//                 if (role === 'admin') {
//                     navigate('/admin/dashboard');
//                 } else {
//                     navigate('/');
//                 }
//             }, 1000);
//         } catch (err) {
//             console.error('OTP Verification Error:', err.response?.data || err.message);
//             const msg = err.response?.data?.message || 'OTP verification failed';
//             if (msg.includes('Invalid or expired OTP')) {
//                 toast.error('Invalid or expired OTP. Please try again.');
//             } else {
//                 toast.error(msg);
//             }
//             setOtp(['', '', '', '', '', '']); // Clear OTP inputs on error
//             inputRefs.current[0].focus(); // Focus on first input
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="min-h-screen bg-black text-white font-rajdhani flex flex-col items-center">
//             {/* Logo in Top-Left */}
//             <div className="absolute top-5 left-5">
//                 <Link to="/" className="flex items-center space-x-2">
//                     <img
//                         src="src/assets/images/no-bg-logo.png"
//                         alt="GoBus Logo"
//                         className="w-12 h-12 object-contain"
//                     />
//                     <span className="text-white text-xl font-semibold tracking-wide">
//                         GoBus
//                     </span>
//                 </Link>
//             </div>

//             {/* Centered Form */}
//             <div className="flex flex-col justify-center items-center min-h-screen px-4 sm:px-8 w-full max-w-md">
//                 <h1 className="text-3xl font-semibold mb-2">OTP Verification</h1>
//                 <p className="text-lg text-gray-400 mb-6">
//                     Enter OTP sent to {email || 'your email address'}
//                 </p>

//                 <form onSubmit={handleVerify} className="space-y-6 w-full">
//                     {/* OTP Inputs */}
//                     <div className="flex justify-between space-x-2">
//                         {otp.map((digit, index) => (
//                             <input
//                                 key={index}
//                                 type="text"
//                                 maxLength="1"
//                                 value={digit}
//                                 onChange={(e) => handleChange(index, e.target.value)}
//                                 onKeyDown={(e) => handleKeyDown(index, e)}
//                                 ref={(el) => (inputRefs.current[index] = el)}
//                                 className="w-12 h-12 text-center text-[18px] px-2 py-2 bg-[#1E1E1E] rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF4500] text-white"
//                             />
//                         ))}
//                     </div>
//                     {errors.otp && <p className="text-red-500 text-sm mt-1">{errors.otp}</p>}

//                     {/* Verify Button */}
//                     <button
//                         type="submit"
//                         disabled={loading || !csrfToken}
//                         className={`w-full mt-4 py-2 text-[18px] flex justify-center items-center gap-2 rounded-md transition ${loading || !csrfToken ? 'bg-[#FF4500] cursor-not-allowed opacity-50' : 'bg-[#FF4500] hover:bg-[#e63a00]'
//                             }`}
//                     >
//                         {loading && (
//                             <svg
//                                 className="animate-spin h-5 w-5 text-white"
//                                 viewBox="0 0 24 24"
//                             >
//                                 <circle
//                                     className="opacity-25"
//                                     cx="12"
//                                     cy="12"
//                                     r="10"
//                                     stroke="currentColor"
//                                     strokeWidth="4"
//                                     fill="none"
//                                 ></circle>
//                                 <path
//                                     className="opacity-75"
//                                     fill="currentColor"
//                                     d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
//                                 ></path>
//                             </svg>
//                         )}
//                         {loading ? 'Verifying...' : 'Verify'}
//                     </button>
//                 </form>

//                 <p className="mt-10 text-sm text-gray-400">© 2025 GoBus</p>
//             </div>

//             <ToastContainer position="top-right" autoClose={3000} hideProgressBar theme="dark" />
//         </div>
//     );
// }






// import axios from 'axios';
// import { useEffect, useRef, useState } from 'react';
// import { FaCheck } from 'react-icons/fa';
// import { Link, useLocation, useNavigate } from 'react-router-dom';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import { useAuth } from '../../context/AuthContext';

// export default function OtpVerification() {
//     const authContext = useAuth();
//     const { login } = authContext || {}; // Fallback for context
//     const navigate = useNavigate();
//     const location = useLocation();
//     const { userId, email, rememberMe } = location.state || {};

//     const [otp, setOtp] = useState(['', '', '', '', '', '']);
//     const [errors, setErrors] = useState({});
//     const [loading, setLoading] = useState(false);
//     const [csrfToken, setCsrfToken] = useState('');
//     const inputRefs = useRef([]);

//     // Fetch CSRF token on component mount
//     useEffect(() => {
//         const fetchCsrfToken = async () => {
//             try {
//                 const response = await axios.get('http://localhost:3000/api/v1/auth/csrf-token', {
//                     withCredentials: true,
//                 });
//                 setCsrfToken(response.data.csrfToken);
//             } catch (error) {
//                 console.error('CSRF Token Error:', error);
//                 toast.error('Failed to fetch CSRF token. Please refresh the page.');
//             }
//         };
//         fetchCsrfToken();
//     }, []);

//     const handleChange = (index, value) => {
//         if (/^\d?$/.test(value)) {
//             const newOtp = [...otp];
//             newOtp[index] = value;
//             setOtp(newOtp);
//             setErrors({ ...errors, otp: '' });

//             // Move to next input
//             if (value && index < 5) {
//                 inputRefs.current[index + 1].focus();
//             }
//         }
//     };

//     const handleKeyDown = (index, e) => {
//         if (e.key === 'Backspace' && !otp[index] && index > 0) {
//             inputRefs.current[index - 1].focus();
//         }
//     };

//     const validate = () => {
//         let temp = {};
//         const otpString = otp.join('');
//         if (otpString.length !== 6) {
//             temp.otp = 'Please enter a 6-digit OTP';
//         } else if (!/^\d{6}$/.test(otpString)) {
//             temp.otp = 'OTP must contain only digits';
//         }
//         if (!csrfToken) {
//             temp.csrf = 'CSRF token is missing. Please refresh the page.';
//         }
//         if (!authContext) {
//             temp.context = 'Authentication context is unavailable. Please refresh the page.';
//         }

//         setErrors(temp);
//         return Object.keys(temp).length === 0;
//     };

//     const handleVerify = async (e) => {
//         e.preventDefault();

//         if (!userId || !email) {
//             toast.error('Invalid session. Please try logging in again.');
//             navigate('/login');
//             return;
//         }

//         if (!authContext) {
//             toast.error('Authentication context is unavailable. Please refresh the page.');
//             return;
//         }

//         if (!validate()) {
//             if (errors.csrf) {
//                 toast.error(errors.csrf);
//             } else if (errors.context) {
//                 toast.error(errors.context);
//             }
//             return;
//         }

//         setLoading(true);
//         try {
//             const res = await axios.post(
//                 'http://localhost:3000/api/v1/auth/verify-otp',
//                 {
//                     userId,
//                     otp: otp.join(''),
//                 },
//                 {
//                     headers: {
//                         'Content-Type': 'application/json',
//                         'X-CSRF-Token': csrfToken,
//                     },
//                     withCredentials: true,
//                 }
//             );

//             const { token, userId: returnedUserId, role } = res.data;

//             // Store role in localStorage
//             localStorage.setItem('role', role);

//             // Call login from AuthContext
//             login(token, returnedUserId, role, rememberMe);

//             toast.success('OTP verified! Logging in...');

//             setTimeout(() => {
//                 if (role === 'admin') {
//                     navigate('/admin/dashboard');
//                 } else {
//                     navigate('/');
//                 }
//             }, 1000);
//         } catch (err) {
//             console.error('OTP Verification Error:', err.response?.data || err.message);
//             const msg = err.response?.data?.message || 'OTP verification failed';
//             if (msg.includes('Invalid or expired OTP')) {
//                 toast.error('Invalid or expired OTP. Please try again.');
//             } else {
//                 toast.error(msg);
//             }
//             setOtp(['', '', '', '', '', '']); // Clear OTP inputs on error
//             inputRefs.current[0].focus(); // Focus on first input
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="min-h-screen bg-gradient-to-br from-[#f8e1e1] via-[#f3e8ff] to-[#e1eaff] font-rajdhani flex flex-col items-center justify-center px-4 sm:px-8">
//             {/* Glassmorphism Card */}
//             <div className="w-full max-w-md bg-white/70 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/40">
//                 {/* Logo Section */}
//                 <div className="text-center mb-8">
//                     <img
//                         src="src/assets/images/logo.png"
//                         alt="SwiftRide Logo"
//                         className="w-16 h-16 mx-auto mb-4 rounded-xl shadow"
//                     />
//                     <h1 className="text-3xl font-bold text-[#E04848] mb-2 tracking-tight">
//                         OTP Verification
//                     </h1>
//                     <p className="text-sm text-gray-500">
//                         Enter the 6-digit OTP sent to {email || 'your email address'}
//                     </p>
//                 </div>

//                 <form onSubmit={handleVerify} className="space-y-5">
//                     {/* OTP Inputs */}
//                     <div className="flex justify-between space-x-2">
//                         {otp.map((digit, index) => (
//                             <div key={index} className="relative">
//                                 <input
//                                     type="text"
//                                     maxLength="1"
//                                     value={digit}
//                                     onChange={(e) => handleChange(index, e.target.value)}
//                                     onKeyDown={(e) => handleKeyDown(index, e)}
//                                     ref={(el) => (inputRefs.current[index] = el)}
//                                     className="w-12 h-12 text-center text-[18px] px-2 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#E04848] transition-colors bg-white/80 shadow-sm border-gray-300"
//                                 />
//                                 {digit && (
//                                     <FaCheck className="absolute right-2 top-1/2 transform -translate-y-1/2 text-green-500" />
//                                 )}
//                             </div>
//                         ))}
//                     </div>
//                     {errors.otp && <p className="text-red-500 text-sm mt-1">{errors.otp}</p>}
//                     {errors.csrf && <p className="text-red-500 text-sm mt-1">{errors.csrf}</p>}
//                     {errors.context && <p className="text-red-500 text-sm mt-1">{errors.context}</p>}

//                     {/* Verify Button */}
//                     <button
//                         type="submit"
//                         disabled={loading || !csrfToken || !authContext}
//                         className={`w-full py-3 text-[18px] flex justify-center items-center gap-2 rounded-xl font-semibold transition-all ${loading || !csrfToken || !authContext
//                             ? 'bg-gradient-to-r from-[#E04848] to-[#a83279] opacity-50 cursor-not-allowed'
//                             : 'bg-gradient-to-r from-[#E04848] to-[#a83279] hover:from-[#c73e3e] hover:to-[#7b2ff2] focus:ring-2 focus:ring-[#E04848] focus:ring-offset-2'
//                             } text-white shadow-lg`}
//                     >
//                         {loading && (
//                             <svg
//                                 className="animate-spin h-5 w-5 text-white"
//                                 viewBox="0 0 24 24"
//                             >
//                                 <circle
//                                     className="opacity-25"
//                                     cx="12"
//                                     cy="12"
//                                     r="10"
//                                     stroke="currentColor"
//                                     strokeWidth="4"
//                                     fill="none"
//                                 ></circle>
//                                 <path
//                                     className="opacity-75"
//                                     fill="currentColor"
//                                     d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
//                                 ></path>
//                             </svg>
//                         )}
//                         {loading ? 'Verifying...' : 'Verify OTP'}
//                     </button>
//                 </form>

//                 <p className="text-sm text-gray-500 mt-6 text-center">
//                     Back to{' '}
//                     <Link to="/login" className="text-[#E04848] font-medium hover:underline">
//                         Sign In
//                     </Link>
//                 </p>

//                 <div className="text-sm text-gray-400 mt-6 text-center">
//                     © 2025 SwiftRide. All rights reserved.
//                 </div>
//             </div>

//             <ToastContainer
//                 position="top-right"
//                 autoClose={3000}
//                 hideProgressBar
//                 theme="colored"
//                 style={{ fontFamily: 'Rajdhani, sans-serif' }}
//                 toastStyle={{ backgroundColor: '#1E1E1E', color: '#fff' }}
//             />
//         </div>
//     );
// }



import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import { FaCheck } from 'react-icons/fa';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../../context/AuthContext';

export default function OtpVerification() {
    const authContext = useAuth();
    const { login } = authContext || {};
    const navigate = useNavigate();
    const location = useLocation();
    const { userId, email, rememberMe } = location.state || {};

    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [csrfToken, setCsrfToken] = useState(localStorage.getItem('csrfToken') || '');
    const inputRefs = useRef([]);

    // Fetch CSRF token on component mount
    useEffect(() => {
        const fetchCsrfToken = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/v1/auth/csrf-token', {
                    withCredentials: true,
                });
                setCsrfToken(response.data.csrfToken);
                localStorage.setItem('csrfToken', response.data.csrfToken);
            } catch (error) {
                console.error('CSRF Token Error:', error);
                toast.error('Failed to fetch CSRF token. Please refresh the page.');
            }
        };
        if (!csrfToken) {
            fetchCsrfToken();
        }
    }, [csrfToken]);

    const handleChange = (index, value) => {
        if (/^\d?$/.test(value)) {
            const newOtp = [...otp];
            newOtp[index] = value;
            setOtp(newOtp);
            setErrors({ ...errors, otp: '' });

            if (value && index < 5) {
                inputRefs.current[index + 1].focus();
            }
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    const validate = () => {
        let temp = {};
        const otpString = otp.join('');
        if (otpString.length !== 6) {
            temp.otp = 'Please enter a 6-digit OTP';
        } else if (!/^\d{6}$/.test(otpString)) {
            temp.otp = 'OTP must contain only digits';
        }
        if (!csrfToken) {
            temp.csrf = 'CSRF token is missing. Please refresh the page.';
        }
        if (!authContext) {
            temp.context = 'Authentication context is unavailable. Please refresh the page.';
        }
        setErrors(temp);
        return Object.keys(temp).length === 0;
    };

    const handleVerify = async (e) => {
        e.preventDefault();

        if (!userId || !email) {
            toast.error('Invalid session. Please try logging in again.');
            navigate('/login');
            return;
        }

        if (!authContext) {
            toast.error('Authentication context is unavailable. Please refresh the page.');
            return;
        }

        if (!validate()) {
            if (errors.csrf) {
                toast.error(errors.csrf);
            } else if (errors.context) {
                toast.error(errors.context);
            }
            return;
        }

        setLoading(true);
        try {
            const res = await axios.post(
                'http://localhost:3000/api/v1/auth/verify-otp',
                {
                    userId,
                    otp: otp.join(''),
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-Token': csrfToken,
                    },
                    withCredentials: true,
                }
            );

            const { success, token, userId: returnedUserId, role } = res.data;

            if (!success) {
                throw new Error('OTP verification failed');
            }

            // Store in localStorage
            localStorage.setItem('authToken', token);
            localStorage.setItem('userId', returnedUserId);
            localStorage.setItem('role', role);

            // Call login from AuthContext
            login(token, returnedUserId, role, rememberMe);

            toast.success('OTP verified! Logging in...');

            setTimeout(() => {
                if (role === 'admin') {
                    navigate('/admin/dashboard');
                } else {
                    navigate('/');
                }
            }, 1000);
        } catch (err) {
            console.error('OTP Verification Error:', err.response?.data || err.message);
            const msg = err.response?.data?.message || 'OTP verification failed';
            if (msg.includes('Invalid or expired OTP')) {
                toast.error('Invalid or expired OTP. Please try again.');
            } else {
                toast.error(msg);
            }
            setOtp(['', '', '', '', '', '']);
            inputRefs.current[0].focus();
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#f8e1e1] via-[#f3e8ff] to-[#e1eaff] font-rajdhani flex flex-col items-center justify-center px-4 sm:px-8">
            <div className="w-full max-w-md bg-white/70 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/40">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-[#E04848] mb-2 tracking-tight">
                        OTP Verification
                    </h1>
                    <p className="text-sm text-gray-500">
                        Enter the 6-digit OTP sent to {email || 'your email address'}
                    </p>
                </div>

                <form onSubmit={handleVerify} className="space-y-5">
                    <div className="flex justify-between space-x-2">
                        {otp.map((digit, index) => (
                            <div key={index} className="relative">
                                <input
                                    type="text"
                                    maxLength="1"
                                    value={digit}
                                    onChange={(e) => handleChange(index, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    ref={(el) => (inputRefs.current[index] = el)}
                                    className="w-12 h-12 text-center text-[18px] px-2 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#E04848] transition-colors bg-white/80 shadow-sm border-gray-300"
                                />
                                {digit && (
                                    <FaCheck className="absolute right-2 top-1/2 transform -translate-y-1/2 text-green-500" />
                                )}
                            </div>
                        ))}
                    </div>
                    {errors.otp && <p className="text-red-500 text-sm mt-1">{errors.otp}</p>}
                    {errors.csrf && <p className="text-red-500 text-sm mt-1">{errors.csrf}</p>}
                    {errors.context && <p className="text-red-500 text-sm mt-1">{errors.context}</p>}

                    <button
                        type="submit"
                        disabled={loading || !csrfToken || !authContext}
                        className={`w-full py-3 text-[18px] flex justify-center items-center gap-2 rounded-xl font-semibold transition-all ${loading || !csrfToken || !authContext
                            ? 'bg-gradient-to-r from-[#E04848] to-[#a83279] opacity-50 cursor-not-allowed'
                            : 'bg-gradient-to-r from-[#E04848] to-[#a83279] hover:from-[#c73e3e] hover:to-[#7b2ff2] focus:ring-2 focus:ring-[#E04848] focus:ring-offset-2'
                            } text-white shadow-lg`}
                    >
                        {loading && (
                            <svg
                                className="animate-spin h-5 w-5 text-white"
                                viewBox="0 0 24 24"
                            >
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
                        )}
                        {loading ? 'Verifying...' : 'Verify OTP'}
                    </button>
                </form>

                <p className="text-sm text-gray-500 mt-6 text-center">
                    Back to{' '}
                    <Link to="/login" className="text-[#E04848] font-medium hover:underline">
                        Sign In
                    </Link>
                </p>

                <div className="text-sm text-gray-400 mt-6 text-center">
                    © 2025 SwiftRide. All rights reserved.
                </div>
            </div>

            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar
                theme="colored"
                style={{ fontFamily: 'Rajdhani, sans-serif' }}
                toastStyle={{ backgroundColor: '#1E1E1E', color: '#fff' }}
            />
        </div>
    );
}
// 