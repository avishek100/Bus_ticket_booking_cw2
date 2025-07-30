import axios from "axios";
import { useEffect, useState } from "react";

const API_BASE_URL = "http://localhost:3000/api/v1";

const ViewBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/bookings`);
        setBookings(res.data.data || []);
      } catch (err) {
        setError("Failed to fetch bookings");
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-center text-purple-700 mb-8">Booking Details</h1>
      <div className="bg-white shadow-md rounded-lg p-6">
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border-collapse border border-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border border-gray-200 px-4 py-2 text-left font-medium text-gray-700">
                    Booking ID
                  </th>
                  <th className="border border-gray-200 px-4 py-2 text-left font-medium text-gray-700">
                    Customer Name
                  </th>
                  <th className="border border-gray-200 px-4 py-2 text-left font-medium text-gray-700">
                    Bus Number
                  </th>
                  <th className="border border-gray-200 px-4 py-2 text-left font-medium text-gray-700">
                    Route
                  </th>
                  <th className="border border-gray-200 px-4 py-2 text-left font-medium text-gray-700">
                    Date
                  </th>
                  <th className="border border-gray-200 px-4 py-2 text-left font-medium text-gray-700">
                    Time
                  </th>
                  <th className="border border-gray-200 px-4 py-2 text-left font-medium text-gray-700">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking, index) => (
                  <tr
                    key={booking._id}
                    className={`${index % 2 === 0 ? "bg-gray-50" : "bg-white"}`}
                  >
                    <td className="border border-gray-200 px-4 py-2 text-gray-700">
                      {booking._id}
                    </td>
                    <td className="border border-gray-200 px-4 py-2 text-gray-700">
                      {booking.userDetails?.name || "-"}
                    </td>
                    <td className="border border-gray-200 px-4 py-2 text-gray-700">
                      {booking.bus?.busNumber || "-"}
                    </td>
                    <td className="border border-gray-200 px-4 py-2 text-gray-700">
                      {booking.bus?.route?.routeName || "-"}
                    </td>
                    <td className="border border-gray-200 px-4 py-2 text-gray-700">
                      {booking.date ? new Date(booking.date).toLocaleDateString() : "-"}
                    </td>
                    <td className="border border-gray-200 px-4 py-2 text-gray-700">
                      {booking.time || "-"}
                    </td>
                    <td
                      className={`border border-gray-200 px-4 py-2 font-semibold ${booking.status === "confirmed"
                        ? "text-green-600"
                        : booking.status === "cancelled"
                          ? "text-red-600"
                          : "text-yellow-600"
                        }`}
                    >
                      {booking.status ? booking.status.charAt(0).toUpperCase() + booking.status.slice(1) : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewBookings;
