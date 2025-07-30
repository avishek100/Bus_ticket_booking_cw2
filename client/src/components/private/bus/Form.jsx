import React, { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";

// API base URL
const API_BASE_URL = "http://localhost:3000/api/v1";

// API function to fetch routes
const fetchRoutes = async () => {
  try {
    const { data } = await axios.get(`${API_BASE_URL}/route`);
    if (!data.success || !data.data) {
      throw new Error("No routes available");
    }
    return data.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch routes");
  }
};

// API function to add a bus
const addBus = async (busData) => {
  try {
    const { data } = await axios.post(`${API_BASE_URL}/bus`, busData, {
      headers: { "Content-Type": "application/json" },
    });
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to add bus");
  }
};

const AddBusses = () => {
  const [formData, setFormData] = useState({
    busNumber: "",
    driverName: "",
    route: "", // Storing route ID
    capacity: "",
    busType: "",
    date: "", // New date field for scheduling
  });

  // Fetch routes using useQuery
  const {
    data: routes,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["routes"],
    queryFn: fetchRoutes,
  });

  // Mutation Hook for Adding a Bus
  const mutation = useMutation({
    mutationFn: addBus,
    onSuccess: () => {
      alert("Bus added successfully!");
      setFormData({
        busNumber: "",
        driverName: "",
        route: "",
        capacity: "",
        busType: "",
        date: "", // Reset the date field
      });
    },
    onError: (error) => {
      console.error("API Error:", error.message);
      alert(error.message);
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting form data:", formData); // Debug: check payload
    mutation.mutate({
      busNumber: formData.busNumber,
      driverName: formData.driverName,
      route: formData.route,
      capacity: Number(formData.capacity),
      busType: formData.busType,
      date: formData.date, // Ensure this is a valid date string
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-center text-purple-700 mb-8">
        Add New Bus
      </h1>

      <div className="bg-white shadow-md rounded-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Bus Number */}
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Bus Number
            </label>
            <input
              type="text"
              name="busNumber"
              value={formData.busNumber}
              onChange={handleChange}
              placeholder="Enter bus number"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
              required
            />
          </div>

          {/* Driver Name */}
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Driver Name
            </label>
            <input
              type="text"
              name="driverName"
              value={formData.driverName}
              onChange={handleChange}
              placeholder="Enter driver's name"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
              required
            />
          </div>

          {/* Route (Dropdown) */}
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Route
            </label>
            {isLoading ? (
              <p className="text-gray-500 text-sm">Loading routes...</p>
            ) : isError ? (
              <p className="text-red-500 text-sm">{error.message}</p>
            ) : (
              <select
                name="route"
                value={formData.route}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
                required
              >
                <option value="">Select a route</option>
                {routes.length > 0 ? (
                  routes.map((route) => (
                    <option key={route._id} value={route._id}>
                      {route.routeName} ({route.startPoint} → {route.endPoint})
                    </option>
                  ))
                ) : (
                  <option value="" disabled>No routes available</option>
                )}
              </select>
            )}
          </div>

          {/* Capacity */}
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Capacity
            </label>
            <input
              type="number"
              name="capacity"
              value={formData.capacity}
              onChange={handleChange}
              placeholder="Enter bus capacity"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
              required
            />
          </div>

          {/* Bus Type */}
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Bus Type
            </label>
            <select
              name="busType"
              value={formData.busType}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
              required
            >
              <option value="">Select bus type</option>
              <option value="AC">AC</option>
              <option value="Non-AC">Non-AC</option>
              <option value="Luxury">Luxury</option>
              <option value="Sleeper">Sleeper</option>
            </select>
          </div>

          {/* Date Field */}
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Schedule Date
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-[#E04848] text-white py-2 rounded-md hover:bg-purple-700 transition duration-300"
            disabled={mutation.isLoading}
          >
            {mutation.isLoading ? "Adding Bus..." : "Add Bus"}
          </button>

          {/* Error Message */}
          {mutation.isError && (
            <p className="text-red-500 text-sm mt-2">{mutation.error.message}</p>
          )}

          {/* Success Message */}
          {mutation.isSuccess && (
            <p className="text-green-500 text-sm mt-2">Bus added successfully!</p>
          )}
        </form>
      </div>
    </div>
  );
};

export default AddBusses;
