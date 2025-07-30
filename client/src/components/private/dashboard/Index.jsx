import { Bus, CreditCard, Home, LayoutDashboard, Route, User } from "lucide-react";

const Dashboard = ({ isSidebarCollapsed }) => {
  const cards = [
    { title: "Bookings", value: 8, color: "bg-blue-500", icon: <Home /> },
    { title: "Buses", value: 11, color: "bg-teal-500", icon: <Bus /> },
    { title: "Routes", value: 8, color: "bg-red-500", icon: <Route /> },
    { title: "Seats", value: 418, color: "bg-yellow-500", icon: <LayoutDashboard /> },
    { title: "Customers", value: 7, color: "bg-gray-500", icon: <User /> },
    { title: "Admins", value: 2, color: "bg-slate-500", icon: <User /> },
    { title: "Earnings", value: 678, color: "bg-green-500", icon: <CreditCard /> },
  ];

  const seats = Array(38).fill(false);
  seats[1] = true;
  seats[5] = true;
  seats[11] = true;
  seats[14] = true;
  seats[17] = true;

  return (
    <div
      className={`p-50 bg-background min-h-screen transition-all duration-300 dark:bg-background dark:text-foreground ${isSidebarCollapsed ? "ml-16" : "ml-5"
        }`}
    >
      {/* Main Container */}
      <div className="max-w-7xl mx-auto">
        <div>
          <h1 className="text-2xl font-bold text-center mb-4">Dashboard</h1>
        </div>
        {/* Cards Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6 w-full">
          {cards.map((card, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg shadow-md text-white flex justify-between items-center ${card.color} dark:bg-gray-800 dark:text-white`}
            >
              <div>
                <h2 className="text-lg font-bold">{card.title}</h2>
                <p className="text-2xl font-semibold">{card.value}</p>
                <a href="/" className="text-sm underline hover:text-white">
                  View More →
                </a>
              </div>
              <div className="text-4xl opacity-50">{card.icon}</div>
            </div>
          ))}
        </div>

        {/* Seat Status Section */}
        <div className="bg-white p-6 rounded-lg shadow-md dark:bg-gray-800 dark:text-foreground">
          <h2 className="text-xl font-bold mb-4">Seat Status</h2>
          <div className="flex items-center space-x-4 mb-4">
            <input
              type="text"
              placeholder="Bus Number"
              className="border p-2 rounded w-full sm:w-1/2 bg-white dark:bg-gray-900 dark:text-foreground"
            />
            <button className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white">
              Search
            </button>
          </div>

          <div className="grid grid-cols-10 gap-4">
            {seats.map((isBooked, index) => (
              <div
                key={index}
                className={`w-10 h-10 flex items-center justify-center border rounded ${isBooked ? "bg-red-500 text-white" : "bg-gray-200 text-black"
                  }`}
              >
                {index + 1}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
