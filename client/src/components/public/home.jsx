import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  FaArrowRight,
  FaCalendarAlt,
  FaClock,
  FaExchangeAlt,
  FaMapMarkerAlt,
  FaRoute,
  FaSearch,
  FaShieldAlt,
  FaStar,
  FaTicketAlt,
  FaUser,
  FaUsers
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import Footer from "../../components/common/customer/Footer";
import Header from "../../components/common/customer/Header";
import Navbar from "../../components/common/customer/Navbar";

import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";

import bus2 from "../../assets/images/bus2.png";
import bus3 from "../../assets/images/bus3.jpg";
import bus4 from "../../assets/images/bus4.jpg";

const API_BASE_URL = "http://localhost:3000/api/v1";

const fetchRoutes = async () => {
  const { data } = await axios.get(`${API_BASE_URL}/route`);
  return data.data;
};

function Home() {
  const navigate = useNavigate();
  const [startLocation, setStartLocation] = useState("");
  const [destination, setDestination] = useState("");
  const [searchDate, setSearchDate] = useState(() => {
    const today = new Date();
    return today.toISOString().slice(0, 10);
  });
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [scrollPosition, setScrollPosition] = useState(0);

  const {
    data: routes,
    isLoading: routesLoading,
    isError: routesError,
    error: routesFetchError,
  } = useQuery({ queryKey: ["routes"], queryFn: fetchRoutes });

  const uniqueStartPoints = routes ? [...new Set(routes.map((r) => r.startPoint))] : [];
  const uniqueEndPoints = routes ? [...new Set(routes.map((r) => r.endPoint))] : [];

  const handleSearch = (e) => {
    e.preventDefault();
    if (startLocation && destination && searchDate) {
      navigate(
        `/search?start=${encodeURIComponent(startLocation)}&end=${encodeURIComponent(
          destination
        )}&date=${encodeURIComponent(searchDate)}`
      );
    }
  };

  // Auto-advance date buttons
  useEffect(() => {
    const interval = setInterval(() => {
      setSearchDate(prevDate => {
        const current = new Date(prevDate);
        const next = new Date(current);
        next.setDate(next.getDate() + 1);
        return next.toISOString().slice(0, 10);
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Scroll functions for destinations
  const scrollLeft = () => {
    const container = document.querySelector('.destinations-scroll');
    if (container) {
      container.scrollBy({ left: -320, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    const container = document.querySelector('.destinations-scroll');
    if (container) {
      container.scrollBy({ left: 320, behavior: 'smooth' });
    }
  };

  const features = [
    {
      icon: <FaShieldAlt className="text-3xl" />,
      title: "Safe Travel",
      description: "Your safety is our top priority with modern, well-maintained vehicles"
    },
    {
      icon: <FaClock className="text-3xl" />,
      title: "On Time",
      description: "Punctual departures and arrivals for your convenience"
    },
    {
      icon: <FaUsers className="text-3xl" />,
      title: "24/7 Support",
      description: "Round-the-clock customer service for all your needs"
    },
    {
      icon: <FaTicketAlt className="text-3xl" />,
      title: "Easy Booking",
      description: "Simple and secure online booking process"
    }
  ];

  const popularRoutes = routes
    ? routes.slice(0, 8).map((r, idx) => ({
      from: r.startPoint,
      to: r.endPoint,
      price: r.price ? `₹${r.price}` : "N/A",
      duration: r.duration || "-",
      image: [bus2, bus3, bus4][idx % 3], // cycle images
      rating: r.rating || 4.5,
      travelers: r.travelers || "-"
    }))
    : [];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Frequent Traveler",
      content: "GoBus has made my travels so much easier. The booking process is smooth and the service is excellent!",
      rating: 5
    },
    {
      name: "Rajesh Kumar",
      role: "Business Traveler",
      content: "Reliable service and comfortable rides. I always choose GoBus for my business trips.",
      rating: 5
    },
    {
      name: "Priya Sharma",
      role: "Student",
      content: "Affordable prices and great service. Perfect for students like me!",
      rating: 4
    }
  ];

  const todayDate = new Date().toISOString().slice(0, 10);

  return (
    <div className="flex flex-col min-h-screen overflow-hidden font-sans bg-gradient-to-br from-blue-50 via-purple-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />
      <Navbar />

      {/* Hero Section with background image and glassmorphism */}
      <section className="relative flex items-center justify-center min-h-[60vh] bg-cover bg-center" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80)' }}>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/70 via-purple-900/60 to-blue-700/60"></div>
        <div className="relative z-10 max-w-3xl mx-auto text-center p-10 rounded-3xl backdrop-blur-md bg-white/20 shadow-2xl border border-white/30">
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-5xl md:text-6xl font-extrabold text-white drop-shadow-lg mb-6">
            Book Your Next <span className="text-yellow-300">Adventure</span> with SwiftRide
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }} className="text-xl md:text-2xl text-blue-100 mb-8">
            Fast, safe, and comfortable bus journeys across Nepal. Experience the difference.
          </motion.p>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => window.scrollTo({ top: 600, behavior: 'smooth' })} className="bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold py-4 px-10 rounded-2xl shadow-xl hover:from-green-600 hover:to-blue-600 transition-all duration-300 text-lg">
            Start Exploring
          </motion.button>
        </div>
      </section>

      {/* Enhanced Search Section */}
      <section className="relative py-16 bg-gradient-to-br from-blue-100 via-blue-50 to-purple-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 dark:from-gray-900/80 dark:to-gray-800/80"></div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative max-w-7xl mx-auto px-4"
        >
          <div className="text-center mb-12">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-4xl md:text-5xl font-bold text-gray-800 mb-4"
            >
              Find Your Perfect Journey
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-xl text-gray-600 max-w-2xl mx-auto"
            >
              Search, compare, and book bus tickets to your favorite destinations
            </motion.p>
          </div>

          {/* Enhanced Search Form */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className={`bg-white rounded-2xl shadow-2xl p-8 transition-all duration-300 border-2 border-blue-100 ${isSearchFocused ? 'ring-4 ring-blue-200 border-blue-300' : ''
              }`}
          >
            <form className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end" onSubmit={handleSearch}>
              {/* Start Location */}
              <div className="lg:col-span-3">
                <label className="block text-sm font-semibold text-gray-700 mb-2">From</label>
                <div className="relative">
                  <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <select
                    className="w-full pl-10 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white"
                    value={startLocation}
                    onChange={(e) => setStartLocation(e.target.value)}
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setIsSearchFocused(false)}
                    required
                  >
                    <option value="">Select departure city</option>
                    {uniqueStartPoints.map((start, index) => (
                      <option key={index} value={start}>
                        {start}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Destination */}
              <div className="lg:col-span-3">
                <label className="block text-sm font-semibold text-gray-700 mb-2">To</label>
                <div className="relative">
                  <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <select
                    className="w-full pl-10 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setIsSearchFocused(false)}
                    required
                  >
                    <option value="">Select destination city</option>
                    {uniqueEndPoints.map((end, index) => (
                      <option key={index} value={end}>
                        {end}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Date Picker */}
              <div className="lg:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Date</label>
                <div className="relative">
                  <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="date"
                    className="w-full pl-10 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white"
                    value={searchDate}
                    onChange={(e) => setSearchDate(e.target.value)}
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setIsSearchFocused(false)}
                    required
                  />
                </div>
              </div>

              {/* Quick Date Selection */}
              <div className="lg:col-span-3">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Quick Select</label>
                <div className="flex gap-2">
                  {Array.from({ length: 5 }).map((_, index) => {
                    const date = new Date();
                    date.setDate(date.getDate() + index);
                    const formattedDate = date.toISOString().slice(0, 10);
                    const isSelected = formattedDate === searchDate;
                    const isToday = index === 0;

                    return (
                      <motion.button
                        key={index}
                        type="button"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`flex flex-col items-center px-3 py-2 rounded-lg border-2 transition-all duration-200 ${isSelected
                          ? "bg-blue-600 border-blue-600 text-white shadow-lg"
                          : "bg-white border-gray-200 hover:border-blue-300 hover:shadow-md"
                          }`}
                        onClick={() => setSearchDate(formattedDate)}
                      >
                        <span className={`text-sm font-bold ${isToday ? 'text-blue-600' : ''}`}>
                          {date.getDate()}
                        </span>
                        <span className="text-xs">
                          {date.toLocaleString("en-US", { weekday: "short" })}
                        </span>
                        {isToday && <span className="text-xs text-blue-600 font-medium">Today</span>}
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Search Button */}
              <div className="lg:col-span-1">
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white py-4 px-6 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  <FaSearch className="text-lg" />
                  <span className="hidden sm:inline">Search</span>
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Why Choose SwiftRide?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the best in bus travel with our premium services and customer-focused approach
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                className="text-center p-6 rounded-2xl bg-white border border-gray-200 hover:shadow-xl transition-all duration-300 shadow-md"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white mx-auto mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Destinations Section */}
      <section className="py-20 bg-gradient-to-br from-white/80 via-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Discover Amazing Destinations</h2>
            <p className="text-xl text-gray-600">Explore our featured routes and popular destinations</p>
          </motion.div>

          {/* Scrollable Destinations Container */}
          <div className="relative">
            {/* Scroll Indicators */}
            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 hidden md:block">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={scrollLeft}
                className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-all duration-300"
              >
                <FaArrowRight className="text-gray-600 rotate-180" />
              </motion.button>
            </div>

            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 hidden md:block">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={scrollRight}
                className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-all duration-300"
              >
                <FaArrowRight className="text-gray-600" />
              </motion.button>
            </div>

            {/* Scrollable Destinations Grid */}
            <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide destinations-scroll px-4 md:px-16">
              {popularRoutes.map((route, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -10, scale: 1.02 }}
                  className="flex-shrink-0 w-72 sm:w-80 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100"
                >
                  {/* Destination Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={route.image}
                      alt={`${route.from} to ${route.to}`}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>

                    {/* Rating Badge */}
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
                      <FaStar className="text-yellow-400 text-sm" />
                      <span className="text-sm font-semibold text-gray-800">{route.rating}</span>
                    </div>

                    {/* Popular Badge */}
                    {index < 3 && (
                      <div className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        POPULAR
                      </div>
                    )}
                  </div>

                  {/* Destination Info */}
                  <div className="p-6">
                    {/* Route Info */}
                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <FaMapMarkerAlt className="text-green-500" />
                        <span className="font-semibold text-gray-800">{route.from}</span>
                      </div>
                      <div className="flex items-center gap-2 mb-3">
                        <FaMapMarkerAlt className="text-red-500" />
                        <span className="font-semibold text-gray-800">{route.to}</span>
                      </div>

                      {/* Route Line */}
                      <div className="flex items-center gap-2 mb-4">
                        <div className="flex-1 h-px bg-gradient-to-r from-green-500 to-red-500"></div>
                        <FaExchangeAlt className="text-gray-400 text-sm" />
                        <div className="flex-1 h-px bg-gradient-to-r from-red-500 to-green-500"></div>
                      </div>
                    </div>

                    {/* Journey Details */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <FaClock className="text-blue-500" />
                        <span>{route.duration}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <FaUsers className="text-purple-500" />
                        <span>{route.travelers} travelers</span>
                      </div>
                    </div>

                    {/* Price and Action */}
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-2xl font-bold text-blue-600">{route.price}</span>
                        <span className="text-sm text-gray-500 ml-1">per person</span>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate(`/search?start=${route.from}&end=${route.to}`)}
                        className="bg-gradient-to-r from-green-500 to-blue-500 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg flex items-center gap-2"
                      >
                        <FaTicketAlt className="text-sm" />
                        Book Now
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Scroll Progress Indicator */}
            <div className="mt-8 flex justify-center">
              <div className="flex gap-2">
                {popularRoutes.slice(0, 4).map((_, index) => (
                  <div
                    key={index}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${index === 0 ? 'bg-blue-600' : 'bg-gray-300'
                      }`}
                  ></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Routes Section */}
      <section className="py-20 bg-white/90">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Popular Routes</h2>
            <p className="text-xl text-gray-600">Most traveled routes with competitive prices</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularRoutes.map((route, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <FaRoute className="text-blue-600" />
                    <span className="text-sm font-medium text-gray-500">Popular Route</span>
                  </div>
                  <FaStar className="text-yellow-400" />
                </div>

                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <FaMapMarkerAlt className="text-green-500" />
                    <span className="font-semibold text-gray-800">{route.from}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaMapMarkerAlt className="text-red-500" />
                    <span className="font-semibold text-gray-800">{route.to}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-1">
                    <FaClock />
                    <span>{route.duration}</span>
                  </div>
                  <div className="font-semibold text-blue-600">{route.price}</div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate(`/search?start=${route.from}&end=${route.to}`)}
                  className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg"
                >
                  Book Now
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-4">What Our Customers Say</h2>
            <p className="text-xl text-gray-600">Real experiences from our valued customers</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <FaStar key={i} className="text-yellow-400" />
                  ))}
                </div>

                <p className="text-gray-600 mb-6 italic">"{testimonial.content}"</p>

                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold mr-4">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">{testimonial.name}</h4>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-blue-900 mb-6 drop-shadow-lg">
              Ready to Start Your Journey?
            </h2>
            <p className="text-xl text-blue-800 mb-8 max-w-2xl mx-auto">
              Join thousands of satisfied customers who trust SwiftRide for their travel needs
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/search")}
                className="bg-gradient-to-r from-green-500 to-blue-500 text-white py-4 px-8 rounded-xl text-lg font-semibold transition-all duration-300 hover:shadow-xl flex items-center justify-center gap-2 hover:from-green-600 hover:to-blue-600"
              >
                <FaSearch />
                Search Buses
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/register")}
                className="border-2 border-green-600 text-green-700 py-4 px-8 rounded-xl text-lg font-semibold transition-all duration-300 hover:bg-green-600 hover:text-white flex items-center justify-center gap-2"
              >
                <FaUser />
                Create Account
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Home;

