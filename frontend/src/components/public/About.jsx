import { FaEnvelope, FaMobileAlt, FaMoneyBillWave, FaPhone, FaShieldAlt, FaShippingFast, FaUsers, FaShoePrints } from "react-icons/fa";
import Footer from '../../components/common/customer/Footer';
import Layout from '../../components/common/customer/layout';

const About = () => {
    return (
        <>
            <Layout />
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 relative overflow-hidden">
                {/* Background Decorative Elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full opacity-5 blur-3xl"></div>
                    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-400 to-pink-600 rounded-full opacity-5 blur-3xl"></div>
                </div>
                
                <div className="max-w-5xl mx-auto p-6 mt-10 relative z-10">
                    <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-8 border border-gray-200">
                        <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6 flex items-center justify-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                                <FaShoePrints className="text-white text-xl" />
                            </div>
                            About Case
                        </h1>
                        <p className="text-gray-600 text-lg text-center mb-8">
                            Protecting Your Device with Style, One Case at a Time 📱
                        </p>

                        <div className="space-y-8 text-gray-700">
                            {/* Our Story */}
                            <section className="bg-white/60 rounded-xl p-6 shadow-lg border border-gray-200">
                                <h2 className="text-2xl font-semibold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Our Story</h2>
                                <p className="text-lg leading-relaxed">
                                    Case was founded with the passion to protect your valuable devices while adding style to your life.
                                    What started as a small local store has grown into a trusted phone case platform, bringing protection and design together.
                                </p>
                            </section>

                            {/* Our Mission */}
                            <section className="bg-white/60 rounded-xl p-6 shadow-lg border border-gray-200">
                                <h2 className="text-2xl font-semibold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Our Mission</h2>
                                <p className="text-lg leading-relaxed">
                                    We strive to make phone protection effortless and stylish, ensuring everyone has access to quality cases
                                    without compromising on design. Case is committed to reliable protection, premium materials, and customer satisfaction.
                                </p>
                            </section>

                            {/* Why Choose Case */}
                            <section className="bg-white/60 rounded-xl p-6 shadow-lg border border-gray-200">
                                <h2 className="text-2xl font-semibold mb-4 flex items-center gap-3 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                                    <FaUsers className="text-green-600" /> Why Choose Case?
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex items-start gap-3 p-4 bg-white/40 rounded-lg border border-gray-200 hover:shadow-md transition-all duration-300">
                                        <FaShippingFast className="text-blue-600 mt-1 flex-shrink-0" />
                                        <div>
                                            <strong className="text-gray-800">Fast & Reliable Delivery</strong>
                                            <p className="text-sm text-gray-600 mt-1">Get your cases delivered quickly to your doorstep.</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3 p-4 bg-white/40 rounded-lg border border-gray-200 hover:shadow-md transition-all duration-300">
                                        <FaMoneyBillWave className="text-green-600 mt-1 flex-shrink-0" />
                                        <div>
                                            <strong className="text-gray-800">Affordable Pricing</strong>
                                            <p className="text-sm text-gray-600 mt-1">Quality cases at wallet-friendly prices.</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3 p-4 bg-white/40 rounded-lg border border-gray-200 hover:shadow-md transition-all duration-300">
                                        <FaMobileAlt className="text-purple-600 mt-1 flex-shrink-0" />
                                        <div>
                                            <strong className="text-gray-800">Easy Shopping</strong>
                                            <p className="text-sm text-gray-600 mt-1">Simple app and website for a smooth experience.</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3 p-4 bg-white/40 rounded-lg border border-gray-200 hover:shadow-md transition-all duration-300">
                                        <FaShieldAlt className="text-red-600 mt-1 flex-shrink-0" />
                                        <div>
                                            <strong className="text-gray-800">Secure Payments</strong>
                                            <p className="text-sm text-gray-600 mt-1">Multiple safe and secure payment options.</p>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Our Team */}
                            <section className="bg-white/60 rounded-xl p-6 shadow-lg border border-gray-200">
                                <h2 className="text-2xl font-semibold mb-4 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">Our Team</h2>
                                <p className="text-lg leading-relaxed">
                                    We are a dedicated team of tech enthusiasts, design experts, and delivery professionals
                                    working together to make your Case experience seamless and delightful.
                                    Customer satisfaction is our top priority.
                                </p>
                            </section>

                            {/* Join Our Community */}
                            <section className="bg-white/60 rounded-xl p-6 shadow-lg border border-gray-200">
                                <h2 className="text-2xl font-semibold mb-4 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">Join Our Community</h2>
                                <p className="text-lg leading-relaxed">
                                    Whether you're a tech lover looking for stylish protection or a brand wanting to reach more customers,
                                    Case welcomes you. Join us in redefining phone protection!
                                </p>
                            </section>

                            {/* Contact Us */}
                            <section className="bg-white/60 rounded-xl p-6 shadow-lg border border-gray-200">
                                <h2 className="text-2xl font-semibold mb-4 flex items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                    <FaEnvelope className="text-blue-600" /> Contact Us
                                </h2>
                                <p className="text-lg mb-4">Have questions or feedback? We'd love to hear from you!</p>
                                <div className="space-y-3">
                                    <p className="flex items-center gap-3 text-lg">
                                        <FaEnvelope className="text-blue-600" />
                                        <strong>Email:</strong> support@case.com
                                    </p>
                                    <p className="flex items-center gap-3 text-lg">
                                        <FaPhone className="text-purple-600" />
                                        <strong>Phone:</strong> +1 234 567 890
                                    </p>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default About;
