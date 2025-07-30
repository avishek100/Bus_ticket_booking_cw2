import { useState } from "react";
import { FaEnvelope, FaFacebook, FaInstagram, FaMapMarkerAlt, FaPhoneAlt, FaTwitter, FaUser } from "react-icons/fa";

const ContactUs = () => {
  const [showToast, setShowToast] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8e1e1] via-[#f3e8ff] to-[#e1eaff] dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex flex-col items-center py-10 px-4 text-foreground dark:text-foreground">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg animate-fade-in-up font-semibold">
          Your message has been submitted
        </div>
      )}
      {/* Title */}
      <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#E04848] to-[#a83279] mb-8 drop-shadow-lg animate-fade-in-up">Contact Us</h1>

      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Contact Information */}
        <div className="bg-white/70 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-white/40 animate-fade-in-up">
          <h2 className="text-2xl font-bold text-[#E04848] mb-4">Contact Information</h2>
          <ul className="space-y-4">
            {/* Phone Number */}
            <li className="flex items-center space-x-3">
              <FaPhoneAlt className="text-[#E04848]" />
              <span className="text-gray-700 font-medium">+1 234 567 890</span>
            </li>
            {/* Email */}
            <li className="flex items-center space-x-3">
              <FaEnvelope className="text-[#E04848]" />
              <span className="text-gray-700 font-medium">info@bussewa.com</span>
            </li>
            {/* Address */}
            <li className="flex items-center space-x-3">
              <FaMapMarkerAlt className="text-[#E04848]" />
              <span className="text-gray-700 font-medium">123 Bus Street, Travel City, Country</span>
            </li>
          </ul>
          {/* Social Media Links */}
          <div className="flex items-center space-x-4 mt-8">
            <a href="#" className="bg-[#E04848]/10 hover:bg-[#E04848]/20 p-3 rounded-full transition shadow">
              <FaFacebook size={22} className="text-[#E04848]" />
            </a>
            <a href="#" className="bg-[#E04848]/10 hover:bg-[#E04848]/20 p-3 rounded-full transition shadow">
              <FaInstagram size={22} className="text-[#E04848]" />
            </a>
            <a href="#" className="bg-[#E04848]/10 hover:bg-[#E04848]/20 p-3 rounded-full transition shadow">
              <FaTwitter size={22} className="text-[#E04848]" />
            </a>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white/70 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-white/40 animate-fade-in-up">
          <h2 className="text-2xl font-bold text-[#E04848] mb-4">Send Us a Message</h2>
          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Full Name */}
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Your Name"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#E04848] transition-colors bg-white/80 shadow-sm border-gray-300"
                />
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
                  placeholder="Your Email"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#E04848] transition-colors bg-white/80 shadow-sm border-gray-300"
                />
              </div>
            </div>
            {/* Phone Number */}
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">Phone Number</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaPhoneAlt className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Your Phone Number"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#E04848] transition-colors bg-white/80 shadow-sm border-gray-300"
                />
              </div>
            </div>
            {/* Message */}
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">Message</label>
              <textarea
                placeholder="Your Message"
                rows="4"
                className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#E04848] transition-colors bg-white/80 shadow-sm border-gray-300"
              ></textarea>
            </div>
            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#E04848] to-[#a83279] text-white py-3 rounded-xl font-semibold hover:from-[#c73e3e] hover:to-[#7b2ff2] focus:outline-none focus:ring-2 focus:ring-[#E04848] focus:ring-offset-2 transition-all shadow-lg"
            >
              Submit
            </button>
          </form>
        </div>
      </div>

      {/* Google Map Section */}
      <div className="w-full mt-16 animate-fade-in-up">
        <h2 className="text-2xl font-bold text-[#E04848] mb-4 text-center">Find Us on the Map</h2>
        <div className="w-full h-96 rounded-2xl overflow-hidden shadow-2xl border border-white/40">
          <iframe
            title="Google Map"
            src="https://www.google.com/maps?q=P86R%2BXCF%20Kathmandu&output=embed"
            width="100%"
            height="100%"
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
