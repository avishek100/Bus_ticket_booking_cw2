
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
        <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 items-center justify-center">
            <div className="w-full max-w-md bg-white/70 backdrop-blur-lg rounded-3xl shadow-2xl p-10 border border-white/40 mx-auto">
                <div className="text-center mb-8">
                    {/* Logo removed for consistency */}
                    <h2 className="text-3xl font-extrabold text-[#E04848] mb-2 tracking-tight">Forgot Password</h2>
                    <p className="text-base text-gray-600">Enter your email to receive a 6-digit OTP to reset your password.</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-gray-700 text-sm font-medium mb-2">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#E04848] transition-colors bg-white/80 shadow-sm border-gray-300 text-black"
                            placeholder="Enter email"
                        />
                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </div>
                    <button
                        type="submit"
                        disabled={loading || isCsrfLoading}
                        className={`w-full py-3 rounded-xl font-semibold text-white transition text-lg ${loading || isCsrfLoading ? 'bg-[#E04848]/70 cursor-not-allowed' : 'bg-[#E04848] hover:bg-[#c43c3c]'}`}
                    >
                        {loading ? (
                            <div className="flex justify-center items-center space-x-2">
                                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                                </svg>
                                <span>Sending OTP...</span>
                            </div>
                        ) : isCsrfLoading ? (
                            'Loading...'
                        ) : (
                            'Send OTP'
                        )}
                    </button>
                </form>
                <p className="text-center text-sm text-gray-500 mt-4">
                    Back to{' '}
                    <Link to="/login" className="text-[#E04848] font-medium hover:underline">
                        Log in
                    </Link>
                </p>
                <ToastContainer position="top-right" autoClose={3000} hideProgressBar theme="light" />
            </div>
        </div>
    );
};

export default ForgotPassword;
