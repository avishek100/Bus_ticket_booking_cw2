import {
  FaFacebookF,
  FaInstagram,
  FaPhoneAlt,
  FaUser,
  FaWhatsapp,
  FaYoutube
} from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className={`w-full bg-gradient-to-r from-green-500 to-blue-500 text-white shadow-md`}>
      <div className="max-w-7xl mx-auto px-4 py-2 flex flex-col md:flex-row items-center justify-between gap-2 md:gap-0">
        {/* Left: Logo & Brand */}
        <div className="flex items-center gap-3 flex-shrink-0 cursor-pointer" onClick={() => navigate('/')}>
          {/* <img src={logo} alt="SwiftRide Logo" className="w-10 h-10 rounded-lg bg-white p-1" /> */}
          <span className="text-xl font-bold tracking-wide">SwiftRide</span>
        </div>

        {/* Center: Social & Contact */}
        <div className="flex flex-col md:flex-row items-center gap-2 md:gap-6 text-sm">
          {/* Socials */}
          <div className="flex gap-2">
            <a href="https://www.facebook.com/profile.php?id=100012521027764" aria-label="Facebook" className="bg-white/20 hover:bg-white/40 p-2 rounded-full transition"><FaFacebookF /></a>
            <a href="#" aria-label="Instagram" className="bg-white/20 hover:bg-white/40 p-2 rounded-full transition"><FaInstagram /></a>
            <a href="#" aria-label="YouTube" className="bg-white/20 hover:bg-white/40 p-2 rounded-full transition"><FaYoutube /></a>
            <a href="#" aria-label="WhatsApp" className="bg-white/20 hover:bg-white/40 p-2 rounded-full transition"><FaWhatsapp /></a>
          </div>
          {/* Contact */}
          <div className="flex items-center gap-4 text-xs md:text-sm">
            <span className="flex items-center gap-1"><FaPhoneAlt /> 01-5970798</span>
            <span className="flex items-center gap-1"><FaPhoneAlt /> 014115951</span>
            <span className="flex items-center gap-1"><FaUser /> <a href="mailto:info@gobus.com" className="underline hover:text-white/80">info@gobus.com</a></span>
          </div>
        </div>

        {/* Right: Navigation */}
        <div className="flex items-center gap-4 mt-2 md:mt-0">
          <nav className="hidden md:flex gap-4 text-sm font-medium">
            <a href="/" className="hover:underline">Home</a>
            <Link to="/contact-us" className="hover:underline">Contact</Link>
            <a href="/FAQ" className="hover:underline">FAQ</a>
          </nav>
        </div>
      </div>
      {/* Mobile Nav */}
      <nav className="flex md:hidden justify-center gap-4 pb-2 text-sm font-medium">
        <a href="/" className="hover:underline">Home</a>
        <Link to="/contact-us" className="hover:underline">Contact</Link>
        <a href="/FAQ" className="hover:underline">FAQ</a>
      </nav>
    </header>
  );
};

export default Header;
