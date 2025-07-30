import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
    const email = location.state?.email || sessionStorage.getItem('resetEmail') || '';

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

    const handleVerifyOtp = (e) => {
        e.preventDefault();
        if (!validateOtp()) return;

        setLoading(true);
        setTimeout(() => {
            toast.success('OTP verified successfully!');
            setOtpVerified(true);
            setLoading(false);
        }, 1000);
    };

    const handleResetPassword = (e) => {
        e.preventDefault();
        if (!validatePassword()) return;

        setLoading(true);
        setTimeout(() => {
            toast.success('Password reset successful! Please log in.');
            sessionStorage.removeItem('resetEmail');
            setLoading(false);
            navigate('/login');
        }, 1000);
    };

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 items-center justify-center">
            <div className="w-full max-w-md bg-white/70 backdrop-blur-lg rounded-3xl shadow-2xl p-10 border border-white/40 mx-auto">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-extrabold text-[#E04848] mb-2 tracking-tight">
                        {otpVerified ? 'Reset Password' : 'Verify OTP'}
                    </h2>
                    <p className="text-base text-gray-600">
                        {otpVerified
                            ? 'Enter your new password.'
                            : 'Enter the 6-digit OTP sent to your email.'}
                    </p>
                </div>
                {!otpVerified ? (
                    <form onSubmit={handleVerifyOtp} className="space-y-5">
                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-2">OTP</label>
                            <input
                                type="text"
                                value={otp}
                                onChange={handleOtpChange}
                                className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#E04848] transition-colors bg-white/80 shadow-sm border-gray-300 text-black"
                                placeholder="Enter 6-digit OTP"
                            />
                            {errors.otp && <p className="text-red-500 text-sm mt-1">{errors.otp}</p>}
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-3 rounded-xl font-semibold text-white transition text-lg ${loading ? 'bg-[#E04848]/70 cursor-not-allowed' : 'bg-[#E04848] hover:bg-[#c43c3c]'}`}
                        >
                            {loading ? (
                                <div className="flex justify-center items-center space-x-2">
                                    <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                                    </svg>
                                    <span>Verifying OTP...</span>
                                </div>
                            ) : (
                                'Verify OTP'
                            )}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleResetPassword} className="space-y-5">
                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-2">New Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={formData.password}
                                    onChange={handlePasswordChange}
                                    className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#E04848] transition-colors bg-white/80 shadow-sm border-gray-300 text-black"
                                    placeholder="Enter new password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-2">Confirm New Password</label>
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handlePasswordChange}
                                    className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#E04848] transition-colors bg-white/80 shadow-sm border-gray-300 text-black"
                                    placeholder="Confirm new password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                                >
                                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                            {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-3 rounded-xl font-semibold text-white transition text-lg ${loading ? 'bg-[#E04848]/70 cursor-not-allowed' : 'bg-[#E04848] hover:bg-[#c43c3c]'}`}
                        >
                            {loading ? (
                                <div className="flex justify-center items-center space-x-2">
                                    <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                                    </svg>
                                    <span>Resetting Password...</span>
                                </div>
                            ) : (
                                'Reset Password'
                            )}
                        </button>
                    </form>
                )}
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

export default ResetPassword;