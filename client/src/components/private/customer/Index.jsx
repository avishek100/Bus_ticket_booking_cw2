import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

// API base URL
const API_BASE_URL = "http://localhost:3000/api/v1/auth";

// API function to fetch customers with Bearer token
const fetchCustomers = async () => {
  try {
    const token = localStorage.getItem("token"); // Retrieve token from localStorage

    if (!token) {
      throw new Error("Unauthorized: Please log in.");
    }

    const { data } = await axios.get(`${API_BASE_URL}/customers`, {
      headers: {
        Authorization: `Bearer ${token}`, // Send token in request headers
        "Content-Type": "application/json",
      },
    });

    return data.data; // Assuming API response format is { success: true, data: [...] }
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch customers");
  }
};

const Users = () => {
  // Fetch customers using react-query
  const { data: customers, isLoading, isError, error } = useQuery({
    queryKey: ["customers"],
    queryFn: fetchCustomers,
  });

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-center text-purple-700 mb-8">
        Registered Customers
      </h1>

      <div className="bg-white shadow-md rounded-lg p-6">
        {isLoading ? (
          <p className="text-gray-500 text-sm text-center">Loading customers...</p>
        ) : isError ? (
          <p className="text-red-500 text-sm text-center">{error.message}</p>
        ) : customers.length === 0 ? (
          <p className="text-gray-700 text-center">No customers found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border-collapse border border-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border border-gray-200 px-4 py-2 text-left font-medium text-gray-700">#</th>
                  <th className="border border-gray-200 px-4 py-2 text-left font-medium text-gray-700">Name</th>
                  <th className="border border-gray-200 px-4 py-2 text-left font-medium text-gray-700">Email</th>
                  <th className="border border-gray-200 px-4 py-2 text-left font-medium text-gray-700">Role</th>
                  <th className="border border-gray-200 px-4 py-2 text-left font-medium text-gray-700">Last Login</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer, index) => (
                  <tr key={customer._id} className={`${index % 2 === 0 ? "bg-gray-50" : "bg-white"}`}>
                    <td className="border border-gray-200 px-4 py-2 text-gray-700">{index + 1}</td>
                    <td className="border border-gray-200 px-4 py-2 text-gray-700">
  {customer.fname || "Unknown"}
</td>
                    <td className="border border-gray-200 px-4 py-2 text-gray-700">{customer.email}</td>
                    <td className="border border-gray-200 px-4 py-2 text-gray-700">{customer.role || "Customer"}</td>
                    <td className="border border-gray-200 px-4 py-2 text-gray-700">{customer.lastLogin || "N/A"}</td>
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

export default Users;
