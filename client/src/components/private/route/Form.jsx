import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";

// API function to add a route
const addRoute = async (routeData) => {
  const { data } = await axios.post("http://localhost:3000/api/v1/route", routeData, {
    headers: { "Content-Type": "application/json" }
  });
  return data;
};

const AddRoute = () => {
  const [formData, setFormData] = useState({
    routeName: "",
    startPoint: "",
    endPoint: "",
    distance: "",
  });

  // Mutation Hook for Adding a Route
  const mutation = useMutation({
    mutationFn: addRoute,
    onSuccess: (data) => {
      alert("Route added successfully!");
      console.log("Route Created:", data);
      setFormData({
        routeName: "",
        startPoint: "",
        endPoint: "",
        distance: "",
      });
    },
    onError: (error) => {
      console.error("API Error:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Failed to add route.");
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate({
      routeName: formData.routeName,
      startPoint: formData.startPoint,
      endPoint: formData.endPoint,
      distance: Number(formData.distance), // Ensure it's a number
    });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="p-6 bg-white shadow-lg rounded-lg w-full" style={{ maxWidth: "600px" }}>
        <h1 className="text-2xl font-bold mb-6 text-center">Add New Route</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Route Name</label>
            <input
              type="text"
              name="routeName"
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="Enter route name"
              value={formData.routeName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Start Point</label>
            <input
              type="text"
              name="startPoint"
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="Enter start point"
              value={formData.startPoint}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">End Point</label>
            <input
              type="text"
              name="endPoint"
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="Enter end point"
              value={formData.endPoint}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Distance</label>
            <input
              type="number"
              name="distance"
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="Enter distance (in km)"
              value={formData.distance}
              onChange={handleChange}
              required
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              disabled={mutation.isLoading}
            >
              {mutation.isLoading ? "Adding Route..." : "Add Route"}
            </button>
          </div>

          {/* Error Message */}
          {mutation.isError && (
            <p className="text-red-500 text-sm mt-2">
              {mutation.error.message || "Something went wrong"}
            </p>
          )}

          {/* Success Message */}
          {mutation.isSuccess && (
            <p className="text-green-500 text-sm mt-2">Route added successfully!</p>
          )}
        </form>
      </div>
    </div>
  );
};

export default AddRoute;



