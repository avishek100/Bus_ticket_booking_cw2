import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FaBus, 
  FaClock, 
  FaMapMarkerAlt, 
  FaUser, 
  FaTicketAlt, 
  FaCreditCard, 
  FaShieldAlt,
  FaCheckCircle,
  FaTimes,
  FaInfoCircle,
  FaExclamationTriangle,
  FaSpinner,
  FaArrowLeft,
  FaArrowRight,
  FaStar,
  FaWifi,
  FaSnowflake,
  FaCouch,
  FaPlug
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const API_BASE_URL = "http://localhost:3000/api/v1";

function SeatSelection({ busId }) {
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [boardingPoint, setBoardingPoint] = useState("");
    const [seatLayout, setSeatLayout] = useState([]);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [maxSeatsReached, setMaxSeatsReached] = useState(false);
    const navigate = useNavigate();

    // Mock data for demonstration (replace with actual API call)
    const seatFare = 1200;
    const maxSeatsAllowed = 6;
    const busInfo = {
        busNumber: "BA 1 PA 1282",
        driverName: "Ram Kumar",
        busType: "AC Deluxe",
        departure: "07:00 AM",
        arrival: "03:00 PM",
        duration: "8 Hours",
        amenities: ["WiFi", "AC", "Reclining Seats", "Charging Point"]
    };

    // Fetch seat data from the backend
    const { data: seats, isLoading, isError } = useQuery({
        queryKey: ["seatData", busId],
        queryFn: async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/bus/${busId}/seats`);
                return response.data.seats;
            } catch (error) {
                // Return mock data if API fails
                return generateMockSeats();
            }
        },
        enabled: !!busId,
    });

    // Generate mock seats for demonstration
    const generateMockSeats = () => {
        const mockSeats = [];
        const totalSeats = 40;
        const bookedSeats = ["A3", "A7", "B5", "B9", "A12", "B15", "A18", "B22"];
        
        for (let i = 1; i <= totalSeats; i++) {
            const seatNumber = i <= 20 ? `A${i}` : `B${i-20}`;
            mockSeats.push({
                number: seatNumber,
                booked: bookedSeats.includes(seatNumber),
                price: seatFare
            });
        }
        return mockSeats;
    };

    // Update seat layout dynamically when seats data is available
    useEffect(() => {
        if (seats) {
            setSeatLayout(generateLayout(seats));
        }
    }, [seats]);

    // Check if max seats reached
    useEffect(() => {
        setMaxSeatsReached(selectedSeats.length >= maxSeatsAllowed);
    }, [selectedSeats]);

    // Toggle seat selection
    const toggleSeatSelection = (seat) => {
        if (seat.booked) return;
        
        if (selectedSeats.includes(seat.number)) {
            setSelectedSeats(prev => prev.filter(s => s !== seat.number));
        } else {
            if (selectedSeats.length < maxSeatsAllowed) {
                setSelectedSeats(prev => [...prev, seat.number]);
            }
        }
    };

    // Calculate total fare
    const totalFare = selectedSeats.length * seatFare;

    // Function to generate the seat layout with a proper gap
    const generateLayout = (seats) => {
        if (!seats || seats.length === 0) return [];

        const layout = [];
        const leftSide = [];
        const rightSide = [];

        // Sort seats into left and right sections
        seats.forEach((seat) => {
            if (seat.number.startsWith("A")) {
                leftSide.push(seat);
            } else if (seat.number.startsWith("B")) {
                rightSide.push(seat);
            }
        });

        // Arrange seats in rows with a gap in the middle
        const rows = Math.max(leftSide.length, rightSide.length) / 2;
        for (let i = 0; i < rows; i++) {
            const leftSeat1 = leftSide[i * 2] || null;
            const leftSeat2 = leftSide[i * 2 + 1] || null;
            const rightSeat1 = rightSide[i * 2] || null;
            const rightSeat2 = rightSide[i * 2 + 1] || null;

            layout.push([leftSeat1, leftSeat2, null, rightSeat1, rightSeat2]);
        }

        return layout;
    };

    // Handle checkout
    const handleCheckout = () => {
        if (!boardingPoint || selectedSeats.length === 0) {
            alert("Please select a boarding point and at least one seat.");
            return;
        }
        setShowConfirmation(true);
    };

    // Confirm booking
    const confirmBooking = () => {
        navigate("/checkout", {
            state: {
                busId,
                boardingPoint,
                selectedSeats,
                totalFare,
                busInfo
            },
        });
    };

    // Boarding points
    const boardingPoints = [
        { value: "kathmandu_bus_park", label: "Kathmandu Bus Park", time: "06:30 AM" },
        { value: "kalanki", label: "Kalanki Chowk", time: "06:45 AM" },
        { value: "balaju", label: "Balaju Chowk", time: "07:00 AM" },
        { value: "gongabu", label: "Gongabu Bus Park", time: "07:15 AM" }
    ];

    return (
        <div className="bg-white rounded-2xl shadow-lg p-6">
            {/* Header */}
            <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Select Your Seats</h3>
                <p className="text-gray-600">Choose your preferred seats from the layout below</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Left Section: Bus Info & Seat Layout */}
                <div className="lg:w-2/3">
                    {/* Bus Information */}
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 mb-6">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                            <div>
                                <h4 className="text-lg font-semibold text-gray-800 mb-2">
                                    {busInfo.busNumber} - {busInfo.driverName}
                                </h4>
                                <p className="text-gray-600 mb-2">{busInfo.busType}</p>
                                <div className="flex items-center space-x-4 text-sm text-gray-500">
                                    <div className="flex items-center">
                                        <FaClock className="mr-1" />
                                        <span>{busInfo.departure} - {busInfo.arrival}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <FaUser className="mr-1" />
                                        <span>{busInfo.duration}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-4 md:mt-0">
                                <div className="flex flex-wrap gap-2">
                                    {busInfo.amenities.map((amenity) => {
                                        const icons = {
                                            "WiFi": FaWifi,
                                            "AC": FaSnowflake,
                                            "Reclining Seats": FaCouch,
                                            "Charging Point": FaPlug
                                        };
                                        const Icon = icons[amenity];
                                        return (
                                            <span
                                                key={amenity}
                                                className="flex items-center px-3 py-1 bg-white rounded-full text-sm shadow-sm"
                                            >
                                                <Icon className="mr-1 text-blue-500" />
                                                {amenity}
                                            </span>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Seat Layout */}
                    <div className="bg-gray-50 p-6 rounded-2xl shadow-inner border border-gray-200">
                        {/* Driver Section */}
                        <div className="flex justify-center mb-6">
                            <div className="bg-gray-800 text-white px-6 py-3 rounded-xl text-center shadow-lg font-bold flex items-center">
                                <FaBus className="mr-2" />
                                Driver
                            </div>
                        </div>

                        {/* Loading State */}
                        {isLoading && (
                            <div className="text-center py-8">
                                <FaSpinner className="animate-spin text-3xl text-blue-600 mx-auto mb-4" />
                                <p className="text-gray-600">Loading seat layout...</p>
                            </div>
                        )}

                        {/* Error State */}
                        {isError && (
                            <div className="text-center py-8">
                                <FaExclamationTriangle className="text-3xl text-red-500 mx-auto mb-4" />
                                <p className="text-gray-600">Error loading seats. Using demo layout.</p>
                            </div>
                        )}

                        {/* Seat Grid */}
                        {!isLoading && (
                            <div className="flex flex-col items-center">
                                {seatLayout.map((row, rowIndex) => (
                                    <div key={rowIndex} className="flex justify-center space-x-3 mb-3">
                                        {row.map((seat, colIndex) =>
                                            seat === null ? (
                                                <div key={`gap-${rowIndex}-${colIndex}`} className="w-12"></div>
                                            ) : (
                                                <motion.button
                                                    key={seat.number}
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    className={`w-12 h-12 border-2 rounded-lg text-sm font-semibold shadow-md transition-all duration-200 ${
                                                        seat.booked 
                                                            ? "bg-gray-400 cursor-not-allowed opacity-60 border-gray-400" 
                                                            : selectedSeats.includes(seat.number)
                                                                ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white border-blue-600 scale-110 shadow-lg"
                                                                : "bg-white hover:bg-blue-50 border-gray-300 hover:border-blue-400"
                                                    }`}
                                                    onClick={() => toggleSeatSelection(seat)}
                                                    disabled={seat.booked || (maxSeatsReached && !selectedSeats.includes(seat.number))}
                                                >
                                                    {seat.number}
                                                </motion.button>
                                            )
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Seat Legend */}
                        <div className="mt-6 flex justify-center space-x-6 text-xs">
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

                        {/* Max Seats Warning */}
                        {maxSeatsReached && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg"
                            >
                                <div className="flex items-center text-yellow-800">
                                    <FaInfoCircle className="mr-2" />
                                    <span className="text-sm">Maximum {maxSeatsAllowed} seats allowed per booking</span>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>

                {/* Right Section: Booking Details */}
                <div className="lg:w-1/3">
                    <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-6 shadow-lg">
                        <h4 className="text-xl font-bold text-gray-800 mb-6">Booking Summary</h4>

                        {/* Boarding Point Selection */}
                        <div className="mb-6">
                            <label className="block text-gray-700 font-semibold mb-3">Boarding Point</label>
                            <select
                                className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white"
                                value={boardingPoint}
                                onChange={(e) => setBoardingPoint(e.target.value)}
                            >
                                <option value="">Select Boarding Point</option>
                                {boardingPoints.map((point) => (
                                    <option key={point.value} value={point.value}>
                                        {point.label} ({point.time})
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Selected Seats */}
                        <div className="mb-6">
                            <h5 className="font-semibold text-gray-700 mb-3">Selected Seats</h5>
                            {selectedSeats.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {selectedSeats.map((seat) => (
                                        <span
                                            key={seat}
                                            className="px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full text-sm font-semibold"
                                        >
                                            {seat}
                                        </span>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 text-sm">No seats selected</p>
                            )}
                        </div>

                        {/* Fare Breakdown */}
                        <div className="mb-6">
                            <h5 className="font-semibold text-gray-700 mb-3">Fare Details</h5>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Seat Fare:</span>
                                    <span>₹{seatFare} × {selectedSeats.length}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Service Fee:</span>
                                    <span>₹50</span>
                                </div>
                                <div className="border-t pt-2">
                                    <div className="flex justify-between font-bold text-lg">
                                        <span>Total Amount:</span>
                                        <span className="text-blue-600">₹{totalFare + 50}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Features */}
                        <div className="mb-6">
                            <h5 className="font-semibold text-gray-700 mb-3">What's Included</h5>
                            <div className="space-y-2">
                                <div className="flex items-center text-sm text-gray-600">
                                    <FaShieldAlt className="mr-2 text-green-500" />
                                    <span>Free Cancellation (24h before)</span>
                                </div>
                                <div className="flex items-center text-sm text-gray-600">
                                    <FaTicketAlt className="mr-2 text-blue-500" />
                                    <span>E-Ticket & SMS Confirmation</span>
                                </div>
                                <div className="flex items-center text-sm text-gray-600">
                                    <FaCreditCard className="mr-2 text-purple-500" />
                                    <span>Secure Payment Gateway</span>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-3">
                            <button
                                onClick={handleCheckout}
                                disabled={selectedSeats.length === 0 || !boardingPoint}
                                className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-4 px-6 rounded-xl font-semibold hover:from-green-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
                            >
                                <FaArrowRight className="mr-2" />
                                Continue to Payment
                            </button>
                            
                            {selectedSeats.length === 0 && (
                                <p className="text-center text-sm text-gray-500">
                                    Please select at least one seat
                                </p>
                            )}
                            
                            {selectedSeats.length > 0 && !boardingPoint && (
                                <p className="text-center text-sm text-gray-500">
                                    Please select a boarding point
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Confirmation Modal */}
            <AnimatePresence>
                {showConfirmation && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-2xl p-6 max-w-md w-full"
                        >
                            <div className="text-center">
                                <FaCheckCircle className="text-5xl text-green-500 mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-gray-800 mb-2">Confirm Booking</h3>
                                <p className="text-gray-600 mb-6">
                                    You're about to book {selectedSeats.length} seat(s) for ₹{totalFare + 50}
                                </p>
                                
                                <div className="space-y-2 mb-6 text-left">
                                    <div className="flex justify-between">
                                        <span>Seats:</span>
                                        <span className="font-semibold">{selectedSeats.join(", ")}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Boarding Point:</span>
                                        <span className="font-semibold">{boardingPoints.find(p => p.value === boardingPoint)?.label}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Total Amount:</span>
                                        <span className="font-semibold text-blue-600">₹{totalFare + 50}</span>
                                    </div>
                                </div>

                                <div className="flex space-x-3">
                                    <button
                                        onClick={() => setShowConfirmation(false)}
                                        className="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={confirmBooking}
                                        className="flex-1 bg-gradient-to-r from-green-500 to-blue-500 text-white py-3 px-4 rounded-xl font-semibold hover:from-green-600 hover:to-blue-600 transition-all duration-300"
                                    >
                                        Confirm
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default SeatSelection;
