import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { 
  FaBus, 
  FaClock, 
  FaMapMarkerAlt, 
  FaStar, 
  FaWifi, 
  FaSnowflake, 
  FaCouch, 
  FaPlug, 
  FaFilm, 
  FaBed, 
  FaCoffee,
  FaFilter,
  FaSort,
  FaSearch,
  FaTimes,
  FaCheck,
  FaUser,
  FaRoute,
  FaCalendarAlt,
  FaArrowLeft,
  FaSpinner,
  FaExclamationTriangle,
  FaTicketAlt,
  FaShieldAlt,
  FaHeadset
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../common/customer/Navbar";
import Header from "../common/customer/Header";
import Footer from "../common/customer/Footer";
import SeatSelection from "./SeatSelection";

const API_BASE_URL = "http://localhost:3000/api/v1";

// Mock amenities data for demonstration
const getAmenitiesForBus = (busType) => {
  const amenities = {
    "AC": ["WiFi", "Air Conditioning", "Reclining Seats", "Charging Point"],
    "Non-AC": ["Reclining Seats"],
    "Deluxe": ["WiFi", "Air Conditioning", "Reclining Seats", "Charging Point", "Entertainment", "Blankets"],
    "Tourist": ["Air Conditioning", "Reclining Seats", "Snacks & Beverages"]
  };
  return amenities[busType] || ["Reclining Seats"];
};

const amenitiesIcons = {
  "WiFi": { icon: FaWifi, color: "text-blue-500" },
  "Charging Point": { icon: FaPlug, color: "text-green-500" },
  "Reclining Seats": { icon: FaCouch, color: "text-purple-500" },
  "Air Conditioning": { icon: FaSnowflake, color: "text-cyan-500" },
  "Entertainment": { icon: FaFilm, color: "text-pink-500" },
  "Blankets": { icon: FaBed, color: "text-orange-500" },
  "Snacks & Beverages": { icon: FaCoffee, color: "text-red-500" }
};

function SearchResults() {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const startLocation = queryParams.get("start");
  const destination = queryParams.get("end");
  const searchDate = queryParams.get("date");

  // State management
  const [selectedBus, setSelectedBus] = useState(null);
  const [filteredBuses, setFilteredBuses] = useState([]);
  const [filters, setFilters] = useState({
    departureTime: "",
    busType: "",
    priceRange: "",
    amenities: [],
    rating: ""
  });
  const [sortBy, setSortBy] = useState("departure");

  // Fetch buses
  const { data: buses, isLoading, isError, error } = useQuery({
    queryKey: ["busSearch", startLocation, destination, searchDate],
    queryFn: async () => {
      const response = await axios.get(`${API_BASE_URL}/bus/bus-search/search`, {
        params: {
          startPoint: startLocation,
          endPoint: destination,
          date: searchDate,
        },
      });
      return response.data.buses;
    },
    enabled: !!(startLocation && destination && searchDate),
  });

  // Process and enhance bus data
  useEffect(() => {
    if (buses) {
      const enhancedBuses = buses.map(bus => ({
        ...bus,
        amenities: getAmenitiesForBus(bus.busType),
        rating: Math.floor(Math.random() * 2) + 4, // Mock rating between 4-5
        reviews: Math.floor(Math.random() * 100) + 20, // Mock reviews
        seatsAvailable: Math.floor(Math.random() * 20) + 5, // Mock available seats
        totalSeats: bus.capacity || 40,
        departure: "07:00 AM", // Mock departure time
        arrival: "15:00 PM", // Mock arrival time
        duration: "8 Hours", // Mock duration
        price: Math.floor(Math.random() * 500) + 800, // Mock price between 800-1300
        departureLocation: `${startLocation} Bus Park`,
        arrivalLocation: `${destination} Bus Park`
      }));
      setFilteredBuses(enhancedBuses);
    }
  }, [buses, startLocation, destination]);

  // Apply filters and sorting
  useEffect(() => {
    if (!buses) return;

    let filtered = buses.map(bus => ({
      ...bus,
      amenities: getAmenitiesForBus(bus.busType),
      rating: Math.floor(Math.random() * 2) + 4,
      reviews: Math.floor(Math.random() * 100) + 20,
      seatsAvailable: Math.floor(Math.random() * 20) + 5,
      totalSeats: bus.capacity || 40,
      departure: "07:00 AM",
      arrival: "15:00 PM",
      duration: "8 Hours",
      price: Math.floor(Math.random() * 500) + 800,
      departureLocation: `${startLocation} Bus Park`,
      arrivalLocation: `${destination} Bus Park`
    }));

    // Apply departure time filter
    if (filters.departureTime) {
      filtered = filtered.filter(bus => {
        const hour = parseInt(bus.departure.split(':')[0]);
        if (filters.departureTime === 'morning') return hour < 10;
        if (filters.departureTime === 'afternoon') return hour >= 10 && hour < 17;
        if (filters.departureTime === 'evening') return hour >= 17;
        return true;
      });
    }

    // Apply bus type filter
    if (filters.busType) {
      filtered = filtered.filter(bus => 
        bus.busType.toLowerCase().includes(filters.busType.toLowerCase())
      );
    }

    // Apply price range filter
    if (filters.priceRange) {
      const [min, max] = filters.priceRange.split('-').map(Number);
      filtered = filtered.filter(bus => bus.price >= min && bus.price <= max);
    }

    // Apply amenities filter
    if (filters.amenities.length > 0) {
      filtered = filtered.filter(bus =>
        filters.amenities.every(amenity => 
          bus.amenities.includes(amenity)
        )
      );
    }

    // Apply rating filter
    if (filters.rating) {
      filtered = filtered.filter(bus => bus.rating >= parseFloat(filters.rating));
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'departure':
          return new Date(`2000-01-01 ${a.departure}`) - new Date(`2000-01-01 ${b.departure}`);
        case 'price':
          return a.price - b.price;
        case 'rating':
          return b.rating - a.rating;
        case 'duration':
          return parseInt(a.duration) - parseInt(b.duration);
        default:
          return 0;
      }
    });

    setFilteredBuses(filtered);
  }, [buses, filters, sortBy, startLocation, destination]);

  const handleContinue = (bus) => {
    navigate("/checkout", {
      state: {
        bus,
        selectedSeats: [],
        totalPrice: bus.price,
        from: startLocation,
        to: destination,
        date: searchDate
      }
    });
  };

  const toggleAmenity = (amenity) => {
    setFilters(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const clearFilters = () => {
    setFilters({
      departureTime: "",
      busType: "",
      priceRange: "",
      amenities: [],
      rating: ""
    });
    setSortBy("departure");
  };

  const goBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Navbar />

      {/* Search Summary */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white shadow-sm border-b"
      >
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={goBack}
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <FaArrowLeft className="text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                  Search Results
                </h1>
                <div className="flex items-center space-x-4 text-gray-600">
                  <div className="flex items-center space-x-2">
                    <FaMapMarkerAlt className="text-red-500" />
                    <span className="capitalize">{startLocation}</span>
                  </div>
                  <FaRoute className="text-gray-400" />
                  <div className="flex items-center space-x-2">
                    <FaMapMarkerAlt className="text-green-500" />
                    <span className="capitalize">{destination}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FaCalendarAlt className="text-blue-500" />
                    <span>{new Date(searchDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4 md:mt-0">
              <span className="text-gray-600">
                {isLoading ? "Searching..." : `${filteredBuses.length} buses found`}
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-1/4">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl shadow-lg p-6 sticky top-24"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                  <FaFilter className="mr-2" />
                  Filters
                </h3>
                <button
                  onClick={clearFilters}
                  className="text-sm text-red-500 hover:text-red-700"
                >
                  Clear All
                </button>
              </div>

              {/* Departure Time */}
              <div className="mb-6">
                <h4 className="font-medium mb-3 text-gray-700">Departure Time</h4>
                <div className="space-y-2">
                  {[
                    { value: 'morning', label: 'Before 10 AM' },
                    { value: 'afternoon', label: '10 AM - 5 PM' },
                    { value: 'evening', label: 'After 5 PM' }
                  ].map((time) => (
                    <label key={time.value} className="flex items-center">
                      <input
                        type="radio"
                        name="departureTime"
                        value={time.value}
                        checked={filters.departureTime === time.value}
                        onChange={(e) => setFilters(prev => ({ ...prev, departureTime: e.target.value }))}
                        className="mr-2 text-blue-600"
                      />
                      <span className="text-sm">{time.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h4 className="font-medium mb-3 text-gray-700">Price Range</h4>
                <div className="space-y-2">
                  {[
                    { value: '0-1000', label: 'Under ₹1000' },
                    { value: '1000-1500', label: '₹1000 - ₹1500' },
                    { value: '1500-2000', label: '₹1500 - ₹2000' },
                    { value: '2000-9999', label: 'Above ₹2000' }
                  ].map((range) => (
                    <label key={range.value} className="flex items-center">
                      <input
                        type="radio"
                        name="priceRange"
                        value={range.value}
                        checked={filters.priceRange === range.value}
                        onChange={(e) => setFilters(prev => ({ ...prev, priceRange: e.target.value }))}
                        className="mr-2 text-blue-600"
                      />
                      <span className="text-sm">{range.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Rating */}
              <div className="mb-6">
                <h4 className="font-medium mb-3 text-gray-700">Rating</h4>
                <div className="space-y-2">
                  {[4.5, 4.0, 3.5, 3.0].map((rating) => (
                    <label key={rating} className="flex items-center">
                      <input
                        type="radio"
                        name="rating"
                        value={rating}
                        checked={filters.rating === rating.toString()}
                        onChange={(e) => setFilters(prev => ({ ...prev, rating: e.target.value }))}
                        className="mr-2 text-blue-600"
                      />
                      <div className="flex items-center">
                        <span className="text-sm mr-2">{rating}+</span>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <FaStar 
                              key={i} 
                              className={`w-3 h-3 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`} 
                            />
                          ))}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Amenities */}
              <div className="mb-6">
                <h4 className="font-medium mb-3 text-gray-700">Amenities</h4>
                <div className="space-y-2">
                  {Object.entries(amenitiesIcons).map(([amenity, { icon: Icon, color }]) => (
                    <label key={amenity} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.amenities.includes(amenity)}
                        onChange={() => toggleAmenity(amenity)}
                        className="mr-2 text-blue-600"
                      />
                      <Icon className={`mr-2 ${color}`} />
                      <span className="text-sm">{amenity}</span>
                    </label>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Bus Results */}
          <div className="lg:w-3/4">
            {/* Sort Options */}
            <div className="bg-white rounded-2xl shadow-lg p-4 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center space-x-4 mb-4 sm:mb-0">
                  <span className="text-gray-600">Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="departure">Departure Time</option>
                    <option value="price">Price</option>
                    <option value="rating">Rating</option>
                    <option value="duration">Duration</option>
                  </select>
                </div>
                <div className="flex items-center space-x-2">
                  <FaBus className="text-gray-400" />
                  <span className="text-sm text-gray-600">
                    {filteredBuses.length} buses available
                  </span>
                </div>
              </div>
            </div>

            {/* Loading State */}
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <FaSpinner className="animate-spin text-4xl text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">Searching for buses...</h3>
                <p className="text-gray-500">Please wait while we find the best options for you</p>
              </motion.div>
            )}

            {/* Error State */}
            {isError && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <FaExclamationTriangle className="text-4xl text-red-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">Something went wrong</h3>
                <p className="text-gray-500 mb-4">{error.message}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Try Again
                </button>
              </motion.div>
            )}

            {/* Bus Cards */}
            {!isLoading && !isError && (
              <div className="space-y-6">
                <AnimatePresence>
                  {filteredBuses.map((bus, index) => (
                    <motion.div
                      key={bus._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                    >
                      <div className="p-6">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                          {/* Bus Info */}
                          <div className="lg:w-2/3">
                            <div className="flex items-start justify-between mb-4">
                              <div>
                                <h3 className="text-xl font-bold text-gray-800 mb-1">
                                  {bus.busNumber} - {bus.driverName}
                                </h3>
                                <p className="text-gray-600 mb-2">{bus.busType} Bus</p>
                                <div className="flex items-center space-x-4 text-sm text-gray-500">
                                  <div className="flex items-center">
                                    <FaBus className="mr-1" />
                                    <span>{bus.busNumber}</span>
                                  </div>
                                  <div className="flex items-center">
                                    <FaUser className="mr-1" />
                                    <span>{bus.seatsAvailable} seats available</span>
                                  </div>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="flex items-center mb-1">
                                  <FaStar className="text-yellow-400 mr-1" />
                                  <span className="font-semibold">{bus.rating}</span>
                                  <span className="text-gray-500 text-sm ml-1">({bus.reviews})</span>
                                </div>
                                <div className="text-2xl font-bold text-blue-600">₹{bus.price}</div>
                              </div>
                            </div>

                            {/* Route Info */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                              <div className="flex items-center space-x-2">
                                <FaClock className="text-blue-500" />
                                <div>
                                  <div className="font-semibold">{bus.departure} - {bus.arrival}</div>
                                  <div className="text-sm text-gray-500">{bus.duration}</div>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <FaMapMarkerAlt className="text-red-500" />
                                <div>
                                  <div className="font-semibold">From</div>
                                  <div className="text-sm text-gray-500">{bus.departureLocation}</div>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <FaMapMarkerAlt className="text-green-500" />
                                <div>
                                  <div className="font-semibold">To</div>
                                  <div className="text-sm text-gray-500">{bus.arrivalLocation}</div>
                                </div>
                              </div>
                            </div>

                            {/* Amenities */}
                            <div className="flex flex-wrap gap-2 mb-4">
                              {bus.amenities.map((amenity) => {
                                const amenityData = amenitiesIcons[amenity];
                                if (!amenityData) return null;
                                const Icon = amenityData.icon;
                                return (
                                  <span
                                    key={amenity}
                                    className="flex items-center px-3 py-1 bg-gray-100 rounded-full text-sm"
                                  >
                                    <Icon className={`mr-1 ${amenityData.color}`} />
                                    {amenity}
                                  </span>
                                );
                              })}
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="lg:w-1/3 lg:pl-6">
                            <div className="space-y-3">
                              <button
                                onClick={() => setSelectedBus(selectedBus === bus._id ? null : bus._id)}
                                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
                              >
                                {selectedBus === bus._id ? 'Hide Seats' : 'Select Seats'}
                              </button>
                              <button
                                onClick={() => handleContinue(bus)}
                                className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-3 px-6 rounded-xl font-semibold hover:from-green-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105"
                              >
                                Book Now
                              </button>
                              <div className="text-center text-sm text-gray-500">
                                {bus.seatsAvailable} of {bus.totalSeats} seats available
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Seat Selection */}
                        <AnimatePresence>
                          {selectedBus === bus._id && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3 }}
                              className="mt-6 border-t pt-6"
                            >
                              <SeatSelection busId={bus._id} />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* No Results */}
                {filteredBuses.length === 0 && !isLoading && !isError && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-12"
                  >
                    <div className="text-gray-400 text-6xl mb-4">🚌</div>
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">No buses found</h3>
                    <p className="text-gray-500 mb-4">
                      Sorry, no buses are available for {startLocation} to {destination} on {new Date(searchDate).toLocaleDateString()}
                    </p>
                    <div className="space-x-4">
                      <button
                        onClick={goBack}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Try Different Date
                      </button>
                      <button
                        onClick={clearFilters}
                        className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                      >
                        Clear Filters
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default SearchResults;
