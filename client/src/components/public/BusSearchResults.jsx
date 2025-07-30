import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  FaBlanket,
  FaBus,
  FaCalendarAlt,
  FaClock,
  FaCoffee,
  FaCouch,
  FaFilm,
  FaFilter,
  FaMapMarkerAlt,
  FaPlug,
  FaRoute,
  FaSnowflake,
  FaStar,
  FaUser,
  FaWifi
} from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import Footer from "../../components/common/customer/Footer";
import Header from "../../components/common/customer/Header";
import Navbar from "../../components/common/customer/Navbar";

const seatLayout = [
  ["A1", "A2", "", "A3", "A4"],
  ["A5", "A6", "", "A7", "A8"],
  ["A9", "A10", "", "A11", "A12"],
  ["A13", "A14", "", "B13", "B14"],
  ["A15", "A16", "", "B17", "B18"],
  ["B1", "B2", "", "B3", "B4"],
  ["B5", "B6", "", "B7", "B8"],
  ["B9", "B10", "", "B11", "B12"],
];

const bookedSeats = ["A3", "A7", "B13", "B17", "B5", "B9"];

const amenities = [
  { name: "WiFi", icon: FaWifi, color: "text-blue-500" },
  { name: "Charging Point", icon: FaPlug, color: "text-green-500" },
  { name: "Reclining Seats", icon: FaCouch, color: "text-purple-500" },
  { name: "Air Conditioning", icon: FaSnowflake, color: "text-cyan-500" },
  { name: "Entertainment System", icon: FaFilm, color: "text-pink-500" },
  { name: "Blankets", icon: FaBlanket, color: "text-orange-500" },
  { name: "Snacks & Beverages", icon: FaCoffee, color: "text-red-500" }
];

const dummyBuses = [
  {
    id: 1,
    name: "Sanjog Travels",
    type: "2×2 Sofa Seater",
    departure: "07:15 AM",
    duration: "8 Hours",
    arrival: "15:15 PM",
    price: 1200,
    busNumber: "BA 1 PA 1282",
    rating: 4.5,
    reviews: 128,
    amenities: ["WiFi", "AC", "Reclining Seats", "Charging Point"],
    seatsAvailable: 32,
    totalSeats: 40,
    departureLocation: "Kathmandu Bus Park",
    arrivalLocation: "Pokhara Bus Park"
  },
  {
    id: 2,
    name: "Happy Harry Travels",
    type: "AC with air suspension",
    departure: "07:00 AM",
    duration: "8 Hours",
    arrival: "15:00 PM",
    price: 1100,
    seatsAvailable: 7,
    busNumber: "BA 1 PA 1026",
    rating: 4.2,
    reviews: 95,
    amenities: ["WiFi", "AC", "Entertainment", "Snacks"],
    totalSeats: 35,
    departureLocation: "Kathmandu Bus Park",
    arrivalLocation: "Pokhara Bus Park"
  },
  {
    id: 3,
    name: "Everest Express",
    type: "Deluxe AC Bus",
    departure: "08:30 AM",
    duration: "7.5 Hours",
    arrival: "16:00 PM",
    price: 1350,
    busNumber: "BA 1 PA 1456",
    rating: 4.7,
    reviews: 156,
    amenities: ["WiFi", "AC", "Reclining Seats", "Charging Point", "Entertainment", "Blankets"],
    seatsAvailable: 15,
    totalSeats: 45,
    departureLocation: "Kathmandu Bus Park",
    arrivalLocation: "Pokhara Bus Park"
  },
  {
    id: 4,
    name: "Greenline Travels",
    type: "Tourist Bus",
    departure: "06:45 AM",
    duration: "8.5 Hours",
    arrival: "15:15 PM",
    price: 950,
    busNumber: "BA 1 PA 1123",
    rating: 4.0,
    reviews: 87,
    amenities: ["AC", "Reclining Seats"],
    seatsAvailable: 28,
    totalSeats: 38,
    departureLocation: "Kathmandu Bus Park",
    arrivalLocation: "Pokhara Bus Park"
  }
];

function BusSearchResults() {
  const [selectedBus, setSelectedBus] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    departureTime: "",
    busType: "",
    priceRange: "",
    amenities: [],
    rating: ""
  });
  const [sortBy, setSortBy] = useState("departure");
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const from = searchParams.get('start') || '';
  const to = searchParams.get('end') || '';
  let date = searchParams.get('date');

  // Auto-set date to today if missing
  useEffect(() => {
    if ((from && to) && !date) {
      const today = new Date().toISOString().slice(0, 10);
      searchParams.set('date', today);
      navigate(`${location.pathname}?${searchParams.toString()}`, { replace: true });
    }
    // eslint-disable-next-line
  }, [from, to, date, location.pathname]);

  useEffect(() => {
    const fetchBuses = async () => {
      if (!from || !to) {
        setBuses(dummyBuses);
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const params = { startPoint: from, endPoint: to };
        if (date) params.date = date;
        const res = await axios.get("http://localhost:3000/api/v1/bus/bus-search/search", { params });
        if (Array.isArray(res.data.buses) && res.data.buses.length > 0) {
          setBuses(res.data.buses);
        } else {
          setBuses(dummyBuses);
        }
        setError(null);
      } catch (err) {
        setError("Failed to fetch buses");
        setBuses(dummyBuses);
      }
      setLoading(false);
    };
    fetchBuses();
  }, [from, to, date]);

  // Filtering and sorting logic (apply to fetched buses)
  const getFilteredBuses = () => {
    let filtered = [...buses];

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
        bus.type.toLowerCase().includes(filters.busType.toLowerCase())
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

    return filtered;
  };

  const filteredBuses = getFilteredBuses();

  const handleSeatSelection = (seat) => {
    if (!seat || bookedSeats.includes(seat)) return;
    setSelectedSeats((prev) =>
      prev.includes(seat) ? prev.filter((s) => s !== seat) : [...prev, seat]
    );
  };

  const handleContinue = (bus) => {
    if (selectedSeats.length === 0) {
      alert("Please select at least one seat");
      return;
    }
    navigate("/checkout", {
      state: {
        bus,
        selectedSeats,
        totalPrice: selectedSeats.length * bus.price,
        from,
        to,
        date
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
            <div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                Bus Search Results
              </h1>
              <div className="flex items-center space-x-4 text-gray-600">
                <div className="flex items-center space-x-2">
                  <FaMapMarkerAlt className="text-red-500" />
                  <span>{from}</span>
                </div>
                <FaRoute className="text-gray-400" />
                <div className="flex items-center space-x-2">
                  <FaMapMarkerAlt className="text-green-500" />
                  <span>{to}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FaCalendarAlt className="text-blue-500" />
                  <span>{new Date(date).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            <div className="mt-4 md:mt-0">
              <span className="text-gray-600">
                {filteredBuses.length} buses found
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
                  {amenities.map((amenity) => (
                    <label key={amenity.name} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.amenities.includes(amenity.name)}
                        onChange={() => toggleAmenity(amenity.name)}
                        className="mr-2 text-blue-600"
                      />
                      <amenity.icon className={`mr-2 ${amenity.color}`} />
                      <span className="text-sm">{amenity.name}</span>
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

            {/* Bus Cards */}
            <div className="space-y-6">
              <AnimatePresence>
                {loading ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-12"
                  >
                    <div className="text-gray-400 text-6xl mb-4">⚙️</div>
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">Loading buses...</h3>
                    <p className="text-gray-500 mb-4">Please wait while we fetch the bus details.</p>
                  </motion.div>
                ) : error ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-12"
                  >
                    <div className="text-gray-400 text-6xl mb-4">❌</div>
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">Error: {error}</h3>
                    <p className="text-gray-500 mb-4">Could not fetch bus data. Please try again later.</p>
                    <button
                      onClick={clearFilters}
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Clear Filters
                    </button>
                  </motion.div>
                ) : filteredBuses.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-12"
                  >
                    <div className="text-gray-400 text-6xl mb-4">🚌</div>
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">No buses found</h3>
                    <p className="text-gray-500 mb-4">Try adjusting your filters or search criteria</p>
                    <button
                      onClick={clearFilters}
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Clear Filters
                    </button>
                  </motion.div>
                ) : (
                  filteredBuses.map((bus, index) => (
                    <motion.div
                      key={bus.id}
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
                                <h3 className="text-xl font-bold text-gray-800 mb-1">{bus.name}</h3>
                                <p className="text-gray-600 mb-2">{bus.type}</p>
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
                                const amenityData = amenities.find(a => a.name === amenity);
                                return (
                                  <span
                                    key={amenity}
                                    className="flex items-center px-3 py-1 bg-gray-100 rounded-full text-sm"
                                  >
                                    <amenityData.icon className={`mr-1 ${amenityData.color}`} />
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
                                onClick={() => setSelectedBus(selectedBus === bus.id ? null : bus.id)}
                                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
                              >
                                {selectedBus === bus.id ? 'Hide Seats' : 'Select Seats'}
                              </button>
                              <div className="text-center text-sm text-gray-500">
                                {bus.seatsAvailable} of {bus.totalSeats} seats available
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Seat Selection */}
                        <AnimatePresence>
                          {selectedBus === bus.id && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3 }}
                              className="mt-6 border-t pt-6"
                            >
                              <div className="text-center mb-6">
                                <h4 className="text-xl font-bold text-gray-800 mb-2">Select Your Seats</h4>
                                <p className="text-gray-600">Choose your preferred seats from the layout below</p>
                              </div>

                              {/* Bus Seat Layout */}
                              <div className="bg-gray-50 p-6 rounded-2xl shadow-inner w-fit mx-auto border border-gray-200">
                                <div className="flex justify-center mb-4">
                                  <div className="bg-gray-800 text-white px-6 py-3 rounded-xl text-center shadow-lg font-bold">
                                    🚌 Driver
                                  </div>
                                </div>

                                <div className="grid grid-cols-5 gap-2">
                                  {seatLayout.flat().map((seat, index) => (
                                    <button
                                      key={index}
                                      className={`w-12 h-12 border-2 rounded-lg text-xs font-semibold shadow-md transition-all duration-200 ${selectedSeats.includes(seat)
                                        ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white border-blue-600 scale-110 shadow-lg"
                                        : "bg-white hover:bg-blue-50 border-gray-300 hover:border-blue-400"
                                        } ${bookedSeats.includes(seat)
                                          ? "bg-gray-400 cursor-not-allowed opacity-60 border-gray-400"
                                          : ""
                                        }`}
                                      onClick={() => handleSeatSelection(seat)}
                                      disabled={bookedSeats.includes(seat)}
                                    >
                                      {seat}
                                    </button>
                                  ))}
                                </div>

                                {/* Seat Legend */}
                                <div className="mt-4 flex justify-center space-x-6 text-xs">
                                  <div className="flex items-center">
                                    <div className="w-4 h-4 bg-white border-2 border-gray-300 rounded mr-2"></div>
                                    <span>Available</span>
                                  </div>
                                  <div className="flex items-center">
                                    <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded mr-2"></div>
                                    <span>Selected</span>
                                  </div>
                                  <div className="flex items-center">
                                    <div className="w-4 h-4 bg-gray-400 rounded mr-2"></div>
                                    <span>Booked</span>
                                  </div>
                                </div>

                                {/* Summary and Continue */}
                                <div className="mt-6 p-4 bg-white rounded-xl border">
                                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                    <div className="mb-4 sm:mb-0">
                                      <div className="text-lg font-semibold text-gray-800">
                                        Selected Seats: {selectedSeats.length}
                                      </div>
                                      <div className="text-2xl font-bold text-blue-600">
                                        Total: ₹{selectedSeats.length * bus.price}
                                      </div>
                                    </div>
                                    <button
                                      onClick={() => handleContinue(bus)}
                                      disabled={selectedSeats.length === 0}
                                      className="bg-gradient-to-r from-green-500 to-blue-500 text-white py-3 px-8 rounded-xl font-semibold hover:from-green-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                    >
                                      Continue to Checkout
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default BusSearchResults;
