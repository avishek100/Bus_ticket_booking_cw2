import { useNavigate } from "react-router-dom";
import { Link } from "react-scroll"; // Importing Link from react-scroll
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

const Hero = () => {
  const navigate = useNavigate();
  return (
    <Swiper
      spaceBetween={30}
      centeredSlides={true}
      loop={true}
      autoplay={{
        delay: 2500,
        disableOnInteraction: false,
      }}
      pagination={{
        clickable: true,
      }}
      // navigation={true}
      modules={[Autoplay, Pagination, Navigation]}
      className="mySwiper relative z-[10]"
    >
      {/* Slide 1 */}
      <SwiperSlide>
        <div className="flex flex-col md:flex-row items-center justify-between px-20 py-20 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 relative overflow-hidden">
          {/* Background Decorative Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full opacity-10 blur-3xl"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-400 to-pink-600 rounded-full opacity-10 blur-3xl"></div>
          </div>
          
          {/* Text Section */}
          <div className="md:w-1/2 text-left relative z-10">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
              Protect Your Device with Style
            </h1>
            <p className="text-xl text-gray-700 mb-8 leading-relaxed">
              Discover our premium collection of phone cases that combine protection with stunning design. 
              Keep your device safe while expressing your unique style.
            </p>
            <button
              onClick={() => navigate("/menu")}
              className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white py-4 px-10 text-lg font-semibold rounded-xl hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <span>Shop Now</span>
              </div>
            </button>
          </div>
          {/* Image Section */}
          <div className="md:w-1/2 flex justify-center ml-16 relative z-10">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl transform rotate-6 scale-105 opacity-20"></div>
              <img
                src="/src/assets/images/restaurant.jpg"
                alt="Premium Phone Cases"
                className="w-full max-w-lg rounded-2xl shadow-2xl relative z-10 transform hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>
        </div>
      </SwiperSlide>

      {/* Slide 2 */}
      <SwiperSlide>
        <div className="flex flex-col md:flex-row items-center justify-between px-20 py-20 bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 relative overflow-hidden">
          {/* Background Decorative Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-400 to-pink-600 rounded-full opacity-10 blur-3xl"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-pink-400 to-indigo-600 rounded-full opacity-10 blur-3xl"></div>
          </div>
          
          <div className="md:w-1/2 text-left relative z-10">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
              Quality Meets Protection
            </h1>
            <p className="text-xl text-gray-700 mb-8 leading-relaxed">
              Experience the perfect blend of durability and style with our premium phone cases. 
              Each case is designed to provide maximum protection while maintaining a sleek appearance.
            </p>
            <Link
              to="order-section"
              smooth={true}
              duration={500}
            >
              <button className="bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 text-white py-4 px-10 text-lg font-semibold rounded-xl hover:from-purple-700 hover:via-pink-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <span>Explore Collection</span>
                </div>
              </button>
            </Link>
          </div>
          <div className="md:w-1/2 flex justify-center relative z-10">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl transform -rotate-6 scale-105 opacity-20"></div>
              <img
                src="/src/assets/images/restaurant.jpg"
                alt="Quality Phone Cases"
                className="w-full max-w-lg rounded-2xl shadow-2xl relative z-10 transform hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>
        </div>
      </SwiperSlide>

      {/* Slide 3 */}
      <SwiperSlide>
        <div className="flex flex-col md:flex-row items-center justify-between px-20 py-20 bg-gradient-to-br from-pink-50 via-indigo-50 to-blue-50 relative overflow-hidden">
          {/* Background Decorative Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-pink-400 to-indigo-600 rounded-full opacity-10 blur-3xl"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-indigo-400 to-blue-600 rounded-full opacity-10 blur-3xl"></div>
          </div>
          
          <div className="md:w-1/2 text-left relative z-10">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-pink-600 to-indigo-600 bg-clip-text text-transparent mb-6">
              Fast & Secure Delivery
            </h1>
            <p className="text-xl text-gray-700 mb-8 leading-relaxed">
              Get your favorite phone cases delivered quickly and safely to your doorstep. 
              Free shipping on orders over $50 with our premium delivery service.
            </p>
            <button
              className="bg-gradient-to-r from-pink-600 via-indigo-600 to-blue-600 text-white py-4 px-10 text-lg font-semibold rounded-xl hover:from-pink-700 hover:via-indigo-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              onClick={() => navigate("/contact-us")}
            >
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>Contact Us</span>
              </div>
            </button>
          </div>
          <div className="md:w-1/2 flex justify-center relative z-10">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-600 to-indigo-600 rounded-2xl transform rotate-6 scale-105 opacity-20"></div>
              <img
                src="/src/assets/images/restaurant.jpg"
                alt="Fast Delivery"
                className="w-full max-w-lg rounded-2xl shadow-2xl relative z-10 transform hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>
        </div>
      </SwiperSlide>
    </Swiper>
  );
};

export default Hero;
