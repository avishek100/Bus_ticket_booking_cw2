import { FaEnvelope, FaFacebookF, FaInstagram, FaMapMarkerAlt, FaPhoneAlt, FaTwitter } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="bg-gradient-to-br from-[#E04848] to-[#a83279] text-white pt-12 pb-4 mt-12">
            <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-5 gap-10">
                {/* Branding */}
                <div className="md:col-span-1 flex flex-col items-start gap-4">
                    {/* <img src={logo} alt="GoBus Logo" className="w-20 h-20 object-contain mb-2 rounded-xl bg-white p-2" /> */}
                    <p className="text-sm text-white/90 max-w-xs">
                        GoBus is your trusted partner for safe, reliable, and comfortable bus journeys across Nepal. Book your next trip with us and experience the difference!
                    </p>
                    <div className="flex gap-3 mt-2">
                        <a href="#" aria-label="Facebook" className="bg-white/20 hover:bg-white/40 p-2 rounded-full transition"><FaFacebookF /></a>
                        <a href="#" aria-label="Twitter" className="bg-white/20 hover:bg-white/40 p-2 rounded-full transition"><FaTwitter /></a>
                        <a href="#" aria-label="Instagram" className="bg-white/20 hover:bg-white/40 p-2 rounded-full transition"><FaInstagram /></a>
                    </div>
                </div>

                {/* Quick Links */}
                <div>
                    <h3 className="text-lg font-bold mb-4">Quick Links</h3>
                    <ul className="space-y-2 text-sm">
                        <li><a href="/" className="hover:underline focus:underline">Bus</a></li>
                        <li><a href="/PrivacyPolicy" className="hover:underline focus:underline">Privacy Policy</a></li>
                        <li><a href="/ManageTickets" className="hover:underline focus:underline">Manage Tickets</a></li>
                        <li><a href="/ContactUs" className="hover:underline focus:underline">Contact Us</a></li>
                        <li><a href="/FAQ" className="hover:underline focus:underline">FAQ</a></li>
                    </ul>
                </div>

                {/* Top Routes */}
                <div>
                    <h3 className="text-lg font-bold mb-4">Top Routes</h3>
                    <ul className="space-y-2 text-sm">
                        <li><a href="#" className="hover:underline">Kathmandu - Pokhara</a></li>
                        <li><a href="#" className="hover:underline">Pokhara - Kathmandu</a></li>
                        <li><a href="#" className="hover:underline">Kathmandu - Butwal</a></li>
                        <li><a href="#" className="hover:underline">Butwal - Kathmandu</a></li>
                        <li><a href="#" className="hover:underline">Kathmandu - Baglung</a></li>
                        <li><a href="#" className="hover:underline">Kathmandu - Chitwan</a></li>
                        <li><a href="#" className="hover:underline">Kathmandu - Kakadvitta</a></li>
                        <li><a href="#" className="hover:underline">Kathmandu - Nepalgunj</a></li>
                        <li><a href="#" className="hover:underline">Kathmandu - Biratnagar</a></li>
                        <li><a href="#" className="hover:underline">Kathmandu - Dang</a></li>
                    </ul>
                </div>

                {/* Top Operators */}
                <div>
                    <h3 className="text-lg font-bold mb-4">Top Operators</h3>
                    <ul className="space-y-2 text-sm">
                        <li><a href="#" className="hover:underline">Pashchim Nepal Bus Byabasayi Pvt. Ltd.</a></li>
                        <li><a href="#" className="hover:underline">Baba Adventure Travels</a></li>
                        <li><a href="#" className="hover:underline">Dhaulagiri Gandaki Yatayat Sewa Pvt. Ltd.</a></li>
                        <li><a href="#" className="hover:underline">Lotus Adventure Travels & Tours Pvt. Ltd.</a></li>
                        <li><a href="#" className="hover:underline">Greyhound Tours & Travels Pvt. Ltd.</a></li>
                        <li><a href="#" className="hover:underline">Sajha Yatayat</a></li>
                        <li><a href="#" className="hover:underline">Tahalka Travels & Tours Pvt. Ltd.</a></li>
                        <li><a href="#" className="hover:underline">Namaste Kapilvastu Tours & Travels</a></li>
                        <li><a href="#" className="hover:underline">Shuva Jagadamba Travels</a></li>
                        <li><a href="#" className="hover:underline">MNS Tours & Travels Pvt. Ltd.</a></li>
                    </ul>
                </div>

                {/* Contact & Payment */}
                <div className="flex flex-col gap-6">
                    <div>
                        <h3 className="text-lg font-bold mb-4">Contact Us</h3>
                        <ul className="space-y-2 text-sm">
                            <li className="flex items-center gap-2"><FaEnvelope className="text-white/80" /> support@gobus.com</li>
                            <li className="flex items-center gap-2"><FaPhoneAlt className="text-white/80" /> +977-1-1234567</li>
                            <li className="flex items-center gap-2"><FaMapMarkerAlt className="text-white/80" /> Kathmandu, Nepal</li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-lg font-bold mb-2">Payment Partners</h3>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#" className="hover:underline">Khalti</a></li>
                        </ul>
                    </div>
                </div>
            </div>
            {/* Divider */}
            <div className="border-t border-white/20 my-6"></div>
            {/* Copyright */}
            <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between text-sm text-white/70">
                <span>&copy; {new Date().getFullYear()} GoBus. All rights reserved.</span>
                <span>Made with <span className="text-red-300">♥</span> in Nepal</span>
            </div>
        </footer>
    );
};

export default Footer;

