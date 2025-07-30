const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
// require('dotenv').config({ path: './config/config.env' }); // Specify the path to .env file
const morgan = require("morgan");
const colors = require("colors");
const connectDB = require("./config/db");
const cookieParser = require("cookie-parser");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const xss = require("xss-clean");
const csurf = require("csurf");
const bodyParser = require("body-parser");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const app = express();

// ✅ Load env file
dotenv.config({
  path: "./config/config.env",
});

// ✅ Connect to database
// Connect to database
connectDB();
require("./utils/cleanup");

// ✅ Enable CORS (Fix OPTIONS 204 No Content issue)
// app.use(cors({
//   origin: "*",
//   methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
//   allowedHeaders: "Content-Type, Authorization"
// }));
// CORS configuration
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ limit: "200mb", extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ✅ Dev logging middleware (Only in development mode)
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// ✅ Security Middleware
app.use(mongoSanitize());
app.use(helmet()); // Prevent security vulnerabilities
app.use(xss()); // Prevent cross-site scripting (XSS) attacks

// ✅ Fix "Cross-Origin Resource Policy" Issue
app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
  res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
  next();
});

// Rate limiting for brute-force prevention
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // Limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: "Too many requests from this IP, please try again after 15 minutes",
  },
});
app.use("/api/v1/auth", limiter);
// Initialize CSRF protection
const csrfProtection = csurf({
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  },
});
app.use(csrfProtection);

// CSRF token endpoint
app.get("/api/v1/auth/csrf-token", (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});
// ✅ Set static folder
app.use(express.static(path.join(__dirname, "public")));


// ✅ Import Routes
const authRoutes = require("./routes/customer");
const routeRoutes = require("./routes/route");
const busRoutes = require("./routes/BusRoute");
const stripeRoutes = require("./routes/stripe");

const bookingRoutes = require("./routes/BookingRoute"); // ✅ Fix import (Ensure file exists)

// ✅ Mount Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/route", routeRoutes);
app.use("/api/v1/bus", busRoutes);
app.use("/api/v1/stripe", stripeRoutes);


app.use("/api/v1/bookings", bookingRoutes); // ✅ Ensure this is correct

// Error handling for CSRF token validation
app.use((err, req, res, next) => {
  if (err.code === "EBADCSRFTOKEN") {
    return res.status(403).json({ success: false, message: "Invalid CSRF token" });
  }
  next(err);
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: "Something went wrong!" });
});

const PORT = process.env.PORT || 3000;

const server = app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
);

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {

  server.close(() => process.exit(1));
});

// ✅ Export `app` for testing

module.exports = app;



