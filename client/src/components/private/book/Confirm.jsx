import axios from "axios";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_BASE_URL = "http://localhost:3000/api/v1";

const Confirm = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch pending bookings
    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const res = await axios.get(`${API_BASE_URL}/bookings?status=pending`);
                setBookings(res.data.data || []);
            } catch (err) {
                setError("Failed to fetch bookings");
            } finally {
                setLoading(false);
            }
        };
        fetchBookings();
    }, []);

    // Confirm booking
    const handleConfirm = async (id) => {
        try {
            await axios.patch(`${API_BASE_URL}/bookings/${id}/confirm`);
            setBookings((prev) =>
                prev.map((b) =>
                    b._id === id ? { ...b, status: "confirmed" } : b
                )
            );
            toast.success("Booking confirmed!");
        } catch (err) {
            toast.error("Failed to confirm booking");
        }
    };

    return (
        <div className="p-8">
            <ToastContainer />
            <h1 className="text-2xl font-bold mb-6">Confirm Bookings</h1>
            {loading ? (
                <div>Loading...</div>
            ) : error ? (
                <div className="text-red-500">{error}</div>
            ) : bookings.length === 0 ? (
                <div>No pending bookings.</div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="py-2 px-4 border">Booking ID</th>
                                <th className="py-2 px-4 border">Customer Name</th>
                                <th className="py-2 px-4 border">Bus Number</th>
                                <th className="py-2 px-4 border">Route</th>
                                <th className="py-2 px-4 border">Date</th>
                                <th className="py-2 px-4 border">Seats</th>
                                <th className="py-2 px-4 border">Total Fare</th>
                                <th className="py-2 px-4 border">Status</th>
                                <th className="py-2 px-4 border">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookings.map((b) => (
                                <tr key={b._id} className="text-center">
                                    <td className="py-2 px-4 border">{b._id}</td>
                                    <td className="py-2 px-4 border">{b.userDetails?.name || "-"}</td>
                                    <td className="py-2 px-4 border">{b.bus?.busNumber || "-"}</td>
                                    <td className="py-2 px-4 border">{b.bus?.route?.routeName || "-"}</td>
                                    <td className="py-2 px-4 border">{b.date ? new Date(b.date).toLocaleDateString() : "-"}</td>
                                    <td className="py-2 px-4 border">{b.selectedSeats?.join(", ") || "-"}</td>
                                    <td className="py-2 px-4 border">₹{b.totalFare}</td>
                                    <td className="py-2 px-4 border capitalize">{b.status}</td>
                                    <td className="py-2 px-4 border">
                                        {b.status === "pending" ? (
                                            <button
                                                onClick={() => handleConfirm(b._id)}
                                                className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded"
                                            >
                                                Confirm
                                            </button>
                                        ) : (
                                            <span className="text-green-600 font-semibold">Confirmed</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default Confirm; 