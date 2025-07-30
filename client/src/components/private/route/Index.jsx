import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

// API base URL
const API_BASE_URL = "http://localhost:3000/api/v1";

// API function to fetch routes
const fetchRoutes = async () => {
  try {
    const { data } = await axios.get(`${API_BASE_URL}/route`);
    return data.data; // Assuming API returns { success: true, data: [...] }
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch routes");
  }
};

// API function to delete a route
const deleteRoute = async (routeId) => {
  try {
    await axios.delete(`${API_BASE_URL}/route/${routeId}`);
    return routeId;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to delete route");
  }
};

const ViewRoute = () => {
  const queryClient = useQueryClient();

  // Fetch routes using react-query
  const { data: routes, isLoading, isError, error } = useQuery({
    queryKey: ["routes"],
    queryFn: fetchRoutes,
  });

  // Mutation for deleting a route
  const mutation = useMutation({
    mutationFn: deleteRoute,
    onSuccess: (deletedRouteId) => {
      queryClient.setQueryData(["routes"], (oldRoutes) =>
        oldRoutes.filter((route) => route._id !== deletedRouteId)
      );
    },
  });

  return (
    <div className="p-4">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">View Routes</h1>
      </div>

      <div className="mt-4">
        {isLoading ? (
          <p className="text-gray-500 text-sm text-center">Loading routes...</p>
        ) : isError ? (
          <p className="text-red-500 text-sm text-center">{error.message}</p>
        ) : routes.length === 0 ? (
          <p className="text-gray-700 text-center">No routes available.</p>
        ) : (
          <table className="w-full table-auto border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 px-4 py-2">Route ID</th>
                <th className="border border-gray-300 px-4 py-2">Source</th>
                <th className="border border-gray-300 px-4 py-2">Destination</th>
                <th className="border border-gray-300 px-4 py-2">Distance (if available)</th>
                <th className="border border-gray-300 px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {routes.map((route, index) => (
                <tr key={route._id} className="text-center hover:bg-gray-100">
                  <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                  <td className="border border-gray-300 px-4 py-2">{route.startPoint}</td>
                  <td className="border border-gray-300 px-4 py-2">{route.endPoint}</td>
                  <td className="border border-gray-300 px-4 py-2">{route.distance || "N/A"}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    {/* <button className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 mr-2">
                      Edit
                    </button> */}
                    <button
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                      onClick={() => mutation.mutate(route._id)}
                      disabled={mutation.isLoading}
                    >
                      {mutation.isLoading ? "Deleting..." : "Delete"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ViewRoute;
