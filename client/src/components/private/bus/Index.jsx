import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

// API base URL
const API_BASE_URL = "http://localhost:3000/api/v1";

// API function to fetch buses
const fetchBuses = async () => {
  try {
    const { data } = await axios.get(`${API_BASE_URL}/bus`);
    return data.data; // Assuming API returns { success: true, data: [...] }
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch buses");
  }
};

const ViewBuses = () => {
  // Fetch buses using react-query
  const { data: buses, isLoading, isError, error } = useQuery({
    queryKey: ["buses"],
    queryFn: fetchBuses,
  });

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-center text-purple-700 mb-8">
        View Buses
      </h1>

      <div className="bg-white shadow-md rounded-lg p-6">
        {isLoading ? (
          <p className="text-gray-500 text-sm text-center">Loading buses...</p>
        ) : isError ? (
          <p className="text-red-500 text-sm text-center">{error.message}</p>
        ) : buses.length === 0 ? (
          <p className="text-gray-700 text-center">No buses available.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border-collapse border border-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border border-gray-200 px-4 py-2 text-left font-medium text-gray-700">#</th>
                  <th className="border border-gray-200 px-4 py-2 text-left font-medium text-gray-700">Bus Number</th>
                  <th className="border border-gray-200 px-4 py-2 text-left font-medium text-gray-700">Driver Name</th>
                  <th className="border border-gray-200 px-4 py-2 text-left font-medium text-gray-700">Route</th>
                  <th className="border border-gray-200 px-4 py-2 text-left font-medium text-gray-700">Capacity</th>
                  <th className="border border-gray-200 px-4 py-2 text-left font-medium text-gray-700">Bus Type</th>
                  <th className="border border-gray-200 px-4 py-2 text-left font-medium text-gray-700">Schedule Date</th>
                </tr>
              </thead>
              <tbody>
                {buses.map((bus, index) => (
                  <tr key={bus._id} className={`${index % 2 === 0 ? "bg-gray-50" : "bg-white"}`}>
                    <td className="border border-gray-200 px-4 py-2 text-gray-700">{index + 1}</td>
                    <td className="border border-gray-200 px-4 py-2 text-gray-700">{bus.busNumber}</td>
                    <td className="border border-gray-200 px-4 py-2 text-gray-700">{bus.driverName}</td>
                    <td className="border border-gray-200 px-4 py-2 text-gray-700">
                      {bus.route
                        ? `${bus.route.routeName} (${bus.route.startPoint} → ${bus.route.endPoint})`
                        : "No route available"}
                    </td>
                    <td className="border border-gray-200 px-4 py-2 text-gray-700">{bus.capacity}</td>
                    <td className="border border-gray-200 px-4 py-2 text-gray-700">{bus.busType}</td>
                    <td className="border border-gray-200 px-4 py-2 text-gray-700">
                      {new Date(bus.date).toLocaleDateString()}
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

export default ViewBuses;
