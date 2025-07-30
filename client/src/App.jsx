import { lazy, Suspense } from "react";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";

// Lazy Load Components
const Home = lazy(() => import("./components/public/home"));
const OtpVerification = lazy(() => import("./components/public/OtpVerification"));
const Login = lazy(() => import("./components/public/login"));
const Register = lazy(() => import("./components/public/register"));
const ContactUs = lazy(() => import("./components/public/ContactUs"));
const PrivacyPolicy = lazy(() => import("./components/public/PrivacyPolicy"));
const ManageTickets = lazy(() => import("./components/public/ManageTickets"));
const Dashboard = lazy(() => import("./components/private/dashboard"));
const ViewRoutes = lazy(() => import("./components/private/route"));
const AddRoute = lazy(() => import("./components/private/route/Form"));
const Support = lazy(() => import("./components/private/customer/Support"));
const Users = lazy(() => import("./components/private/customer"));
const ViewBookings = lazy(() => import("./components/private/book"));
const Checkout = lazy(() => import("./components/public/Checkout"));
const BusSearchResults = lazy(() => import("./components/public/BusSearchResults"));
const Profile = lazy(() => import("./components/public/Profile"));
const AddBuses = lazy(() => import("./components/private/bus/Form"));
const Layout = lazy(() => import("./components/private"));
const ViewBuses = lazy(() => import("./components/private/bus"));
const FAQ = lazy(() => import("./components/public/FAQ"));
const SearchResults = lazy(() => import("./components/public/SearchResults"));
const Confirm = lazy(() => import("./components/private/book/Confirm"));

// Get user role from localStorage
const getUserRole = () => {
    return localStorage.getItem("role"); // Admin or Customer
};

// Protect Admin Routes
const PrivateAdminRoute = ({ element }) => {
    return getUserRole() === "admin" ? element : <Navigate to="/" />;
};

// Public Routes (Accessible to Everyone)
const publicRoutes = [
    { path: "/", element: <Suspense><Home /></Suspense> },
    { path: "/verify-otp", element: <Suspense><OtpVerification /></Suspense> },
    { path: "/login", element: <Suspense><Login /></Suspense> },
    { path: "/register", element: <Suspense><Register /></Suspense> },
    { path: "/contact-us", element: <Suspense><ContactUs /></Suspense> },
    { path: "/privacy-policy", element: <Suspense><PrivacyPolicy /></Suspense> },
    { path: "/manage-tickets", element: <Suspense><ManageTickets /></Suspense> },
    { path: "/bus-search-results", element: <Suspense><BusSearchResults /></Suspense> },
    { path: "/checkout", element: <Suspense><Checkout /></Suspense> },
    { path: "/faq", element: <Suspense><FAQ /></Suspense> },
    { path: "/profile", element: <Suspense><Profile /></Suspense> },
    { path: "/search", element: <Suspense><SearchResults /></Suspense> },
];

// Private Admin Routes (Only for Admins)
const privateRoutes = [
    {
        path: "/admin",
        element: <PrivateAdminRoute element={<Suspense><Layout /></Suspense>} />,
        children: [
            { path: "dashboard", element: <Suspense><Dashboard /></Suspense> },
            { path: "viewroutes", element: <Suspense><ViewRoutes /></Suspense> },
            { path: "AddRoute", element: <Suspense><AddRoute /></Suspense> },
            { path: "support", element: <Suspense><Support /></Suspense> },
            { path: "users", element: <Suspense><Users /></Suspense> },
            { path: "viewbookings", element: <Suspense><ViewBookings /></Suspense> },
            { path: "AddBuses", element: <Suspense><AddBuses /></Suspense> },
            { path: "viewbuses", element: <Suspense><ViewBuses /></Suspense> },
            { path: "Confirm", element: <Suspense><Confirm /></Suspense> },
        ],
    },
];

// Combine Routes
const routes = [...publicRoutes, ...privateRoutes];

function App() {
    return <RouterProvider router={createBrowserRouter(routes)} />;
}

export default App;
// 