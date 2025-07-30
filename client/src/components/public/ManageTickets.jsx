import React from "react";
import { FaTicketAlt } from "react-icons/fa";

const ManageTickets = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center px-4">
      <div className="w-full max-w-5xl bg-white rounded-lg shadow-md p-8 flex">
        {/* Left Section - Menu */}
        <div className="w-1/3 pr-4">
          <div className="flex flex-col space-y-4">
            {/* Print Ticket */}
            <button className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 flex items-center justify-center">
              <FaTicketAlt className="mr-2" />
              Print Ticket
            </button>

            {/* Cancel Ticket */}
            <button className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 flex items-center justify-center">
              Cancel Ticket
            </button>
          </div>
        </div>

        {/* Right Section - Form */}
        <div className="w-2/3 pl-4">
          {/* Title */}
          <h2 className="text-2xl font-bold text-gray-700 mb-6 flex items-center">
            <FaTicketAlt className="text-purple-600 mr-2" />
            Search Ticket
          </h2>

          {/* Form */}
          <form className="space-y-4">
            {/* Ticket Number */}
            <div>
              <label className="block text-gray-600 text-sm mb-1">Ticket Number</label>
              <input
                type="text"
                placeholder="Ticket Number"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>

            {/* Mobile Number */}
            <div>
              <label className="block text-gray-600 text-sm mb-1">Mobile Number</label>
              <input
                type="text"
                placeholder="Mobile Number"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>

            {/* Search Button */}
            <div>
              <button
                type="submit"
                className="w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700"
              >
                Search
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ManageTickets;
