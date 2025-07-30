import { QueryClient, QueryClientProvider } from "@tanstack/react-query"; // ✅ Import React Query
import React from "react";
import { createRoot } from "react-dom/client"; // Correct import
import App from "./App.jsx";
import { AuthProvider } from './context/AuthContext';
import "./index.css"; // Tailwind CSS file
// Create a QueryClient instance
const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>  {/* ✅ Wrap with QueryClientProvider */}
      <AuthProvider>
        <App />
      </AuthProvider>

    </QueryClientProvider>
  </React.StrictMode>
);
