const asyncHandler = require("../middleware/async");
const Customer = require("../models/customer");
const ActivityLog = require("../models/activityLog");
const { body, validationResult } = require("express-validator");
const sanitizeHtml = require("sanitize-html");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const path = require("path");
const fs = require("fs");
const axios = require("axios");

// Validation middleware for registration
const validateRegister = [
  body("fname").trim().notEmpty().withMessage("First name is required"),
  body("lname").trim().notEmpty().withMessage("Last name is required"),
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please enter a valid email"),
  body("phone")
    .matches(/^\+?\d{10,15}$/)
    .withMessage("Phone number must be 10-15 digits"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter")
    .matches(/[a-z]/)
    .withMessage("Password must contain at least one lowercase letter")
    .matches(/[0-9]/)
    .withMessage("Password must contain at least one number")
    .matches(/[!@#$%^&*(),.?":{}|<>]/)
    .withMessage("Password must contain at least one special character"),
  body("confirmPassword")
    .custom((value, { req }) => value === req.body.password)
    .withMessage("Passwords do not match"),
  body("recaptchaToken")
    .notEmpty()
    .withMessage("reCAPTCHA token is required"),
];

// Validation middleware for login
const validateLogin = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please enter a valid email"),
  body("password")
    .notEmpty()
    .withMessage("Password is required"),
];

// Validation middleware for OTP verification
const validateOtp = [
  body("userId").isMongoId().withMessage("Invalid user ID"),
  body("otp")
    .isLength({ min: 6, max: 6 })
    .withMessage("OTP must be 6 digits")
    .matches(/^\d{6}$/)
    .withMessage("OTP must contain only digits"),
];

// ==================== ADMIN ROUTES ====================

// @desc    Get all customers (Admin Only)
// @route   GET /api/v1/customers
// @access  Private (Admin)
exports.getCustomers = asyncHandler(async (req, res, next) => {
  console.log("Get Customers Request:", { user: req.user.email });
  const customers = await Customer.find({});
  res.status(200).json({ success: true, count: customers.length, data: customers });
});

// @desc    Get single customer
// @route   GET /api/v1/customers/:id
// @access  Private (Admin or User)
exports.getCustomer = asyncHandler(async (req, res, next) => {
  console.log("Get Customer Request:", { id: req.params.id, user: req.user.email });
  const customer = await Customer.findById(req.params.id);
  if (!customer) {
    try {
      await ActivityLog.create({
        action: "Get Customer Attempt",
        userId: req.user.id,
        userEmail: req.user.email,
        success: false,
        details: `Customer not found with id ${req.params.id}`,
        ipAddress: req.ip || req.connection.remoteAddress,
      });
    } catch (logError) {
      console.error("ActivityLog Error:", logError.message);
    }
    return res.status(404).json({ success: false, message: "Customer not found" });
  }
  res.status(200).json({ success: true, data: customer });
});

// ==================== REGISTRATION FLOW ====================

// @desc    Register new customer
// @route   POST /api/v1/auth/register
// @access  Public
exports.register = asyncHandler(async (req, res, next) => {
  console.log("Register Payload:", req.body);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    try {
      await ActivityLog.create({
        action: "Registration Attempt",
        userEmail: req.body.email || "Unknown",
        success: false,
        details: "Validation errors: " + JSON.stringify(errors.array()),
        ipAddress: req.ip || req.connection.remoteAddress,
      });
    } catch (logError) {
      console.error("ActivityLog Error:", logError.message);
    }
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const { fname, lname, email, phone, password, recaptchaToken } = req.body;

  // Verify reCAPTCHA
  try {
    console.log("Verifying reCAPTCHA token:", recaptchaToken);
    const response = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify`,
      null,
      {
        params: {
          secret: process.env.RECAPTCHA_SECRET_KEY,
          response: recaptchaToken,
        },
      }
    );
    console.log("reCAPTCHA response:", response.data);
    if (!response.data.success || response.data.score < 0.5) {
      try {
        await ActivityLog.create({
          action: "Registration Attempt",
          userEmail: email || "Unknown",
          success: false,
          details: "reCAPTCHA verification failed",
          ipAddress: req.ip || req.connection.remoteAddress,
        });
      } catch (logError) {
        console.error("ActivityLog Error:", logError.message);
      }
      return res.status(400).json({ success: false, message: "reCAPTCHA verification failed" });
    }
  } catch (error) {
    console.error("reCAPTCHA Verification Error:", error.message);
    try {
      await ActivityLog.create({
        action: "Registration Attempt",
        userEmail: email || "Unknown",
        success: false,
        details: `reCAPTCHA verification error: ${error.message}`,
        ipAddress: req.ip || req.connection.remoteAddress,
      });
    } catch (logError) {
      console.error("ActivityLog Error:", logError.message);
    }
    return res.status(500).json({ success: false, message: `reCAPTCHA verification error: ${error.message}` });
  }

  // Sanitize inputs
  const sanitizedData = {
    fname: sanitizeHtml(fname),
    lname: sanitizeHtml(lname),
    email: sanitizeHtml(email.trim().toLowerCase()),
    phone: sanitizeHtml(phone),
    password,
    isVerified: true, // No OTP verification required
    role: "customer",
  };

  // Check for duplicate email
  try {
    console.log("Checking for existing email:", sanitizedData.email);
    const existingCustomer = await Customer.findOne({ email: sanitizedData.email });
    if (existingCustomer) {
      try {
        await ActivityLog.create({
          action: "Registration Attempt",
          userEmail: sanitizedData.email,
          success: false,
          details: "Email already in use",
          ipAddress: req.ip || req.connection.remoteAddress,
        });
      } catch (logError) {
        console.error("ActivityLog Error:", logError.message);
      }
      return res.status(400).json({ success: false, message: "Email already exists" });
    }
  } catch (error) {
    console.error("Duplicate Email Check Error:", error.message);
    try {
      await ActivityLog.create({
        action: "Registration Attempt",
        userEmail: sanitizedData.email || "Unknown",
        success: false,
        details: `Error checking email: ${error.message}`,
        ipAddress: req.ip || req.connection.remoteAddress,
      });
    } catch (logError) {
      console.error("ActivityLog Error:", logError.message);
    }
    return res.status(500).json({ success: false, message: `Error checking email: ${error.message}` });
  }

  // Create new customer
  try {
    console.log("Creating customer with data:", sanitizedData);
    const customer = await Customer.create(sanitizedData);
    console.log("Customer Created:", { id: customer._id, email: customer.email });

    try {
      await ActivityLog.create({
        action: "Registration Attempt",
        userId: customer._id,
        userEmail: customer.email,
        success: true,
        details: "User registered successfully",
        ipAddress: req.ip || req.connection.remoteAddress,
      });
    } catch (logError) {
      console.error("ActivityLog Error:", logError.message);
    }

    return res.status(200).json({
      success: true,
      message: "Registration successful. You can now log in.",
      userId: customer._id,
    });
  } catch (error) {
    console.error("Customer Creation Error:", error.message, error.code);
    if (error.code === 11000) {
      try {
        await ActivityLog.create({
          action: "Registration Attempt",
          userEmail: sanitizedData.email,
          success: false,
          details: `Duplicate email error: ${error.message}`,
          ipAddress: req.ip || req.connection.remoteAddress,
        });
      } catch (logError) {
        console.error("ActivityLog Error:", logError.message);
      }
      return res.status(400).json({ success: false, message: "Email already exists" });
    }
    try {
      await ActivityLog.create({
        action: "Registration Attempt",
        userEmail: sanitizedData.email || "Unknown",
        success: false,
        details: `Error creating customer: ${error.message}`,
        ipAddress: req.ip || req.connection.remoteAddress,
      });
    } catch (logError) {
      console.error("ActivityLog Error:", logError.message);
    }
    return res.status(500).json({ success: false, message: `Error creating customer: ${error.message}` });
  }
});

// @desc    Verify OTP for registration (Removed as no OTP is sent)
// @route   POST /api/v1/auth/verify-register-otp
// @access  Public
exports.verifyRegisterOtp = asyncHandler(async (req, res, next) => {
  return res.status(410).json({ success: false, message: "This endpoint is no longer used as registration does not require OTP verification." });
});

// ==================== AUTHENTICATION ====================

// @desc    Login (Step 1: Validate credentials and send OTP)
// @route   POST /api/v1/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res, next) => {
  console.log("Login Payload:", req.body);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    try {
      await ActivityLog.create({
        action: "Login Attempt",
        userEmail: req.body.email || "Unknown",
        success: false,
        details: "Validation errors: " + JSON.stringify(errors.array()),
        ipAddress: req.ip || req.connection.remoteAddress,
      });
    } catch (logError) {
      console.error("ActivityLog Error:", logError.message);
    }
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const { email, password } = req.body;

  // Sanitize inputs
  const sanitizedEmail = sanitizeHtml(email.trim().toLowerCase());

  // Find customer
  try {
    console.log("Checking for customer with email:", sanitizedEmail);
    const customer = await Customer.findOne({ email: sanitizedEmail }).select("+password");
    if (!customer) {
      try {
        await ActivityLog.create({
          action: "Login Attempt",
          userEmail: sanitizedEmail,
          success: false,
          details: "Invalid email",
          ipAddress: req.ip || req.connection.remoteAddress,
        });
      } catch (logError) {
        console.error("ActivityLog Error:", logError.message);
      }
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    // Check if account is locked
    if (customer.lockUntil && customer.lockUntil > Date.now()) {
      try {
        await ActivityLog.create({
          action: "Login Attempt",
          userId: customer._id,
          userEmail: sanitizedEmail,
          success: false,
          details: `Account locked until ${new Date(customer.lockUntil).toISOString()}`,
          ipAddress: req.ip || req.connection.remoteAddress,
        });
      } catch (logError) {
        console.error("ActivityLog Error:", logError.message);
      }
      return res.status(403).json({
        success: false,
        message: `Account is locked. Try again after ${new Date(customer.lockUntil).toLocaleString()}`,
      });
    }

    // Verify password
    const isMatch = await customer.matchPassword(password);
    if (!isMatch) {
      // Increment login attempts
      customer.loginAttempts += 1;
      if (customer.loginAttempts >= 5) {
        customer.lockUntil = Date.now() + 15 * 60 * 1000; // Lock for 15 minutes
      }
      await customer.save();
      try {
        await ActivityLog.create({
          action: "Login Attempt",
          userId: customer._id,
          userEmail: sanitizedEmail,
          success: false,
          details: `Invalid password. Attempt ${customer.loginAttempts}/5`,
          ipAddress: req.ip || req.connection.remoteAddress,
        });
      } catch (logError) {
        console.error("ActivityLog Error:", logError.message);
      }
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    // Generate and send OTP
    const otp = customer.getOtp();
    await customer.save();

    try {
      console.log("Sending OTP email to:", customer.email);
      await sendEmail({
        email: customer.email,
        subject: "Your GoBus Login OTP",
        message: `Hi ${customer.fname},\n\nYour 6-digit OTP for login is: ${otp}\n\nThis OTP is valid for 10 minutes.\n\nBest regards,\nGoBus Team`,
      });
      console.log("OTP email sent successfully");
      try {
        await ActivityLog.create({
          action: "Login Attempt",
          userId: customer._id,
          userEmail: customer.email,
          success: true,
          details: "Credentials validated, OTP sent",
          ipAddress: req.ip || req.connection.remoteAddress,
        });
      } catch (logError) {
        console.error("ActivityLog Error:", logError.message);
      }
      return res.status(200).json({
        success: true,
        message: "Please check your email for the OTP.",
        userId: customer._id,
      });
    } catch (error) {
      console.error("OTP Email Sending Error:", error.message);
      customer.otp = null;
      customer.otpExpire = null;
      await customer.save();
      try {
        await ActivityLog.create({
          action: "Login Attempt",
          userId: customer._id,
          userEmail: customer.email,
          success: false,
          details: `Failed to send OTP email: ${error.message}`,
          ipAddress: req.ip || req.connection.remoteAddress,
        });
      } catch (logError) {
        console.error("ActivityLog Error:", logError.message);
      }
      return res.status(500).json({ success: false, message: `Error sending OTP email: ${error.message}` });
    }
  } catch (error) {
    console.error("Login Error:", error.message);
    try {
      await ActivityLog.create({
        action: "Login Attempt",
        userEmail: sanitizedEmail || "Unknown",
        success: false,
        details: `Error during login: ${error.message}`,
        ipAddress: req.ip || req.connection.remoteAddress,
      });
    } catch (logError) {
      console.error("ActivityLog Error:", logError.message);
    }
    return res.status(500).json({ success: false, message: `Error during login: ${error.message}` });
  }
});

// @desc    Verify OTP for login
// @route   POST /api/v1/auth/verify-otp
// @access  Public
exports.verifyOtp = asyncHandler(async (req, res, next) => {
  console.log("Verify OTP Payload:", req.body);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    try {
      await ActivityLog.create({
        action: "OTP Verification Attempt",
        userEmail: req.body.email || "Unknown",
        success: false,
        details: "Validation errors: " + JSON.stringify(errors.array()),
        ipAddress: req.ip || req.connection.remoteAddress,
      });
    } catch (logError) {
      console.error("ActivityLog Error:", logError.message);
    }
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const { userId, otp } = req.body;
  const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

  try {
    const customer = await Customer.findOne({
      _id: userId,
      otp: hashedOtp,
      otpExpire: { $gt: Date.now() },
    });

    if (!customer) {
      try {
        await ActivityLog.create({
          action: "OTP Verification Attempt",
          userId,
          success: false,
          details: "Invalid or expired OTP",
          ipAddress: req.ip || req.connection.remoteAddress,
        });
      } catch (logError) {
        console.error("ActivityLog Error:", logError.message);
      }
      return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
    }

    // Reset login attempts and OTP fields
    customer.otp = null;
    customer.otpExpire = null;
    customer.loginAttempts = 0;
    customer.lockUntil = null;
    await customer.save();

    try {
      await ActivityLog.create({
        action: "OTP Verification Attempt",
        userId: customer._id,
        userEmail: customer.email,
        success: true,
        details: "OTP verified successfully",
        ipAddress: req.ip || req.connection.remoteAddress,
      });
    } catch (logError) {
      console.error("ActivityLog Error:", logError.message);
    }

    // Send JWT token
    sendTokenResponse(customer, 200, res);
  } catch (error) {
    console.error("OTP Verification Error:", error.message);
    try {
      await ActivityLog.create({
        action: "OTP Verification Attempt",
        userId,
        success: false,
        details: `Error verifying OTP: ${error.message}`,
        ipAddress: req.ip || req.connection.remoteAddress,
      });
    } catch (logError) {
      console.error("ActivityLog Error:", logError.message);
    }
    return res.status(500).json({ success: false, message: `Error verifying OTP: ${error.message}` });
  }
});

// ==================== PROFILE UPDATE ====================

// @desc    Update customer profile (Admin or User)
// @route   PUT /api/v1/customers/:id
// @access  Private (Admin or User)
exports.updateCustomer = asyncHandler(async (req, res, next) => {
  console.log("Update Customer Payload:", req.body, "ID:", req.params.id);
  let customer = await Customer.findById(req.params.id);
  if (!customer) {
    try {
      await ActivityLog.create({
        action: "Update Profile Attempt",
        userId: req.user.id,
        userEmail: req.user.email,
        success: false,
        details: `Customer not found with id ${req.params.id}`,
        ipAddress: req.ip || req.connection.remoteAddress,
      });
    } catch (logError) {
      console.error("ActivityLog Error:", logError.message);
    }
    return res.status(404).json({ success: false, message: `Customer not found with id ${req.params.id}` });
  }

  // Only allow update if admin or the customer themselves
  if (req.user.role !== "admin" && req.user.id !== customer.id) {
    try {
      await ActivityLog.create({
        action: "Update Profile Attempt",
        userId: req.user.id,
        userEmail: req.user.email,
        success: false,
        details: "Access denied",
        ipAddress: req.ip || req.connection.remoteAddress,
      });
    } catch (logError) {
      console.error("ActivityLog Error:", logError.message);
    }
    return res.status(403).json({ success: false, message: "Access denied" });
  }

  const { fname, lname, phone, email, role } = req.body;
  let image = customer.image;

  // Check if a new image is uploaded
  if (req.file) {
    if (customer.image) {
      const imagePath = path.join(__dirname, "../public/uploads", customer.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    image = req.file.filename;
  }

  // Sanitize inputs
  const sanitizedData = {
    fname: fname ? sanitizeHtml(fname) : customer.fname,
    lname: lname ? sanitizeHtml(lname) : customer.lname,
    phone: phone ? sanitizeHtml(phone) : customer.phone,
    email: email ? sanitizeHtml(email.trim().toLowerCase()) : customer.email,
    image,
    role: req.user.role === "admin" && role ? role : customer.role,
  };

  try {
    customer = await Customer.findByIdAndUpdate(req.params.id, sanitizedData, {
      new: true,
      runValidators: true,
    });

    try {
      await ActivityLog.create({
        action: "Update Profile Attempt",
        userId: customer._id,
        userEmail: customer.email,
        success: true,
        details: "Customer profile updated successfully",
        ipAddress: req.ip || req.connection.remoteAddress,
      });
    } catch (logError) {
      console.error("ActivityLog Error:", logError.message);
    }

    res.status(200).json({
      success: true,
      message: "Customer updated successfully",
      data: customer,
    });
  } catch (error) {
    console.error("Update Customer Error:", error.message);
    try {
      await ActivityLog.create({
        action: "Update Profile Attempt",
        userId: req.user.id,
        userEmail: req.user.email,
        success: false,
        details: `Error updating customer: ${error.message}`,
        ipAddress: req.ip || req.connection.remoteAddress,
      });
    } catch (logError) {
      console.error("ActivityLog Error:", logError.message);
    }
    return res.status(500).json({ success: false, message: `Error updating customer: ${error.message}` });
  }
});

// @desc    Update password
// @route   PUT /api/v1/customers/password/:id
// @access  Private (User)
exports.updatePassword = asyncHandler(async (req, res, next) => {
  console.log("Update Password Payload:", req.body, "ID:", req.params.id);
  const { oldPassword, newPassword, confirmNewPassword } = req.body;

  // Ensure all password fields are provided
  if (!oldPassword || !newPassword || !confirmNewPassword) {
    try {
      await ActivityLog.create({
        action: "Update Password Attempt",
        userId: req.user.id,
        userEmail: req.user.email,
        success: false,
        details: "Missing password fields",
        ipAddress: req.ip || req.connection.remoteAddress,
      });
    } catch (logError) {
      console.error("ActivityLog Error:", logError.message);
    }
    return res.status(400).json({ success: false, message: "Old password, new password, and confirm password are required" });
  }

  // Validate new password
  if (newPassword !== confirmNewPassword) {
    try {
      await ActivityLog.create({
        action: "Update Password Attempt",
        userId: req.user.id,
        userEmail: req.user.email,
        success: false,
        details: "New passwords do not match",
        ipAddress: req.ip || req.connection.remoteAddress,
      });
    } catch (logError) {
      console.error("ActivityLog Error:", logError.message);
    }
    return res.status(400).json({ success: false, message: "New passwords do not match" });
  }

  if (
    newPassword.length < 8 ||
    !/[A-Z]/.test(newPassword) ||
    !/[a-z]/.test(newPassword) ||
    !/[0-9]/.test(newPassword) ||
    !/[!@#$%^&*(),.?":{}|<>]/.test(newPassword)
  ) {
    try {
      await ActivityLog.create({
        action: "Update Password Attempt",
        userId: req.user.id,
        userEmail: req.user.email,
        success: false,
        details: "New password does not meet requirements",
        ipAddress: req.ip || req.connection.remoteAddress,
      });
    } catch (logError) {
      console.error("ActivityLog Error:", logError.message);
    }
    return res.status(400).json({
      success: false,
      message: "New password must be at least 8 characters and include uppercase, lowercase, number, and special character",
    });
  }

  // Find the customer
  let customer = await Customer.findById(req.params.id).select("+password");
  if (!customer) {
    try {
      await ActivityLog.create({
        action: "Update Password Attempt",
        userId: req.user.id,
        userEmail: req.user.email,
        success: false,
        details: "Customer not found",
        ipAddress: req.ip || req.connection.remoteAddress,
      });
    } catch (logError) {
      console.error("ActivityLog Error:", logError.message);
    }
    return res.status(404).json({ success: false, message: "Customer not found" });
  }

  // Check if the old password matches
  const isMatch = await customer.matchPassword(oldPassword);
  if (!isMatch) {
    try {
      await ActivityLog.create({
        action: "Update Password Attempt",
        userId: req.user.id,
        userEmail: req.user.email,
        success: false,
        details: "Incorrect old password",
        ipAddress: req.ip || req.connection.remoteAddress,
      });
    } catch (logError) {
      console.error("ActivityLog Error:", logError.message);
    }
    return res.status(400).json({ success: false, message: "Incorrect old password" });
  }

  // Update password
  customer.password = newPassword;
  customer.isPasswordModified = true;
  await customer.save();

  try {
    await ActivityLog.create({
      action: "Update Password Attempt",
      userId: customer._id,
      userEmail: customer.email,
      success: true,
      details: "Password updated successfully",
      ipAddress: req.ip || req.connection.remoteAddress,
    });
  } catch (logError) {
    console.error("ActivityLog Error:", logError.message);
  }

  // Generate new JWT token
  const token = customer.getSignedJwtToken();

  res.status(200).json({
    success: true,
    message: "Password updated successfully",
    token,
  });
});

// @desc    Send password reset link
// @route   POST /api/v1/auth/forgot-password
// @access  Public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  console.log("Forgot Password Payload:", req.body);
  const { email } = req.body;

  if (!email) {
    try {
      await ActivityLog.create({
        action: "Password Reset Request",
        userEmail: email || "Unknown",
        success: false,
        details: "Email is required",
        ipAddress: req.ip || req.connection.remoteAddress,
      });
    } catch (logError) {
      console.error("ActivityLog Error:", logError.message);
    }
    return res.status(400).json({ success: false, message: "Email is required" });
  }

  const customer = await Customer.findOne({ email: sanitizeHtml(email.trim().toLowerCase()) });
  if (!customer) {
    try {
      await ActivityLog.create({
        action: "Password Reset Request",
        userEmail: email,
        success: false,
        details: "No account found with that email",
        ipAddress: req.ip || req.connection.remoteAddress,
      });
    } catch (logError) {
      console.error("ActivityLog Error:", logError.message);
    }
    return res.status(404).json({ success: false, message: "No account found with that email" });
  }

  const resetToken = crypto.randomBytes(20).toString("hex");
  const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

  customer.resetPasswordToken = hashedToken;
  customer.resetPasswordExpire = Date.now() + 60 * 60 * 1000; // 1 hour
  await customer.save();

  const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;

  try {
    console.log("Sending password reset email to:", customer.email);
    await sendEmail({
      email: customer.email,
      subject: "Reset Your GoBus Password",
      message: `Hi ${customer.fname},\n\nYou requested to reset your password. Please click the link below:\n\n${resetUrl}\n\nThis link will expire in 1 hour.\n\nIf you didn’t request this, please ignore this email.\n\nBest regards,\nGoBus Team`,
    });
    try {
      await ActivityLog.create({
        action: "Password Reset Request",
        userId: customer._id,
        userEmail: customer.email,
        success: true,
        details: "Password reset email sent",
        ipAddress: req.ip || req.connection.remoteAddress,
      });
    } catch (logError) {
      console.error("ActivityLog Error:", logError.message);
    }
    res.status(200).json({
      success: true,
      message: "Reset password email sent. Please check your inbox.",
    });
  } catch (error) {
    console.error("Password Reset Email Error:", error.message);
    customer.resetPasswordToken = null;
    customer.resetPasswordExpire = null;
    await customer.save();
    try {
      await ActivityLog.create({
        action: "Password Reset Request",
        userId: customer._id,
        userEmail: customer.email,
        success: false,
        details: `Error sending reset email: ${error.message}`,
        ipAddress: req.ip || req.connection.remoteAddress,
      });
    } catch (logError) {
      console.error("ActivityLog Error:", logError.message);
    }
    res.status(500).json({ success: false, message: `Error sending reset email: ${error.message}` });
  }
});

// @desc    Reset password via email token
// @route   POST /api/v1/auth/reset-password/:token
// @access  Public
exports.resetPassword = asyncHandler(async (req, res, next) => {
  console.log("Reset Password Payload:", req.body, "Token:", req.params.token);
  const hashedToken = crypto.createHash("sha256").update(req.params.token).digest("hex");

  const customer = await Customer.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!customer) {
    try {
      await ActivityLog.create({
        action: "Password Reset Attempt",
        userEmail: "Unknown",
        success: false,
        details: "Invalid or expired reset token",
        ipAddress: req.ip || req.connection.remoteAddress,
      });
    } catch (logError) {
      console.error("ActivityLog Error:", logError.message);
    }
    return res.status(400).json({ success: false, message: "Invalid or expired reset token" });
  }

  const { password, confirmPassword } = req.body;
  if (!password || !confirmPassword) {
    try {
      await ActivityLog.create({
        action: "Password Reset Attempt",
        userId: customer._id,
        userEmail: customer.email,
        success: false,
        details: "Password and confirm password are required",
        ipAddress: req.ip || req.connection.remoteAddress,
      });
    } catch (logError) {
      console.error("ActivityLog Error:", logError.message);
    }
    return res.status(400).json({ success: false, message: "Password and confirm password are required" });
  }

  if (password !== confirmPassword) {
    try {
      await ActivityLog.create({
        action: "Password Reset Attempt",
        userId: customer._id,
        userEmail: customer.email,
        success: false,
        details: "Passwords do not match",
        ipAddress: req.ip || req.connection.remoteAddress,
      });
    } catch (logError) {
      console.error("ActivityLog Error:", logError.message);
    }
    return res.status(400).json({ success: false, message: "Passwords do not match" });
  }

  if (
    password.length < 8 ||
    !/[A-Z]/.test(password) ||
    !/[a-z]/.test(password) ||
    !/[0-9]/.test(password) ||
    !/[!@#$%^&*(),.?":{}|<>]/.test(password)
  ) {
    try {
      await ActivityLog.create({
        action: "Password Reset Attempt",
        userId: customer._id,
        userEmail: customer.email,
        success: false,
        details: "Password does not meet requirements",
        ipAddress: req.ip || req.connection.remoteAddress,
      });
    } catch (logError) {
      console.error("ActivityLog Error:", logError.message);
    }
    return res.status(400).json({
      success: false,
      message: "Password must be at least 8 characters and include uppercase, lowercase, number, and special character",
    });
  }

  customer.password = password;
  customer.resetPasswordToken = null;
  customer.resetPasswordExpire = null;
  await customer.save();

  try {
    await ActivityLog.create({
      action: "Password Reset Attempt",
      userId: customer._id,
      userEmail: customer.email,
      success: true,
      details: "Password reset successfully",
      ipAddress: req.ip || req.connection.remoteAddress,
    });
  } catch (logError) {
    console.error("ActivityLog Error:", logError.message);
  }

  res.status(200).json({ success: true, message: "Password reset successful. You can now log in." });
});

// ==================== DELETE CUSTOMER ====================

// @desc    Delete Customer (Admin Only)
// @route   DELETE /api/v1/customers/:id
// @access  Private (Admin)
exports.deleteCustomer = asyncHandler(async (req, res, next) => {
  console.log("Delete Customer Request:", { id: req.params.id, user: req.user.email });
  if (req.user.role !== "admin") {
    try {
      await ActivityLog.create({
        action: "Delete Customer Attempt",
        userId: req.user.id,
        userEmail: req.user.email,
        success: false,
        details: "Access denied",
        ipAddress: req.ip || req.connection.remoteAddress,
      });
    } catch (logError) {
      console.error("ActivityLog Error:", logError.message);
    }
    return res.status(403).json({ success: false, message: "Access denied" });
  }

  const customer = await Customer.findByIdAndDelete(req.params.id);

  if (!customer) {
    try {
      await ActivityLog.create({
        action: "Delete Customer Attempt",
        userId: req.user.id,
        userEmail: req.user.email,
        success: false,
        details: "Customer not found",
        ipAddress: req.ip || req.connection.remoteAddress,
      });
    } catch (logError) {
      console.error("ActivityLog Error:", logError.message);
    }
    return res.status(404).json({ success: false, message: "Customer not found" });
  }

  try {
    await ActivityLog.create({
      action: "Delete Customer Attempt",
      userId: customer._id,
      userEmail: customer.email,
      success: true,
      details: "Customer deleted successfully",
      ipAddress: req.ip || req.connection.remoteAddress,
    });
  } catch (logError) {
    console.error("ActivityLog Error:", logError.message);
  }

  res.status(200).json({ success: true, message: "Customer deleted successfully" });
});

// ==================== IMAGE UPLOAD ====================

// @desc    Upload Single Image
// @route   POST /api/v1/customers/upload
// @access  Private (Logged-in Users)
exports.uploadImage = asyncHandler(async (req, res, next) => {
  console.log("Image Upload Request:", { user: req.user.email, file: req.file });
  if (!req.file) {
    try {
      await ActivityLog.create({
        action: "Image Upload Attempt",
        userId: req.user.id,
        userEmail: req.user.email,
        success: false,
        details: "No file uploaded",
        ipAddress: req.ip || req.connection.remoteAddress,
      });
    } catch (logError) {
      console.error("ActivityLog Error:", logError.message);
    }
    return res.status(400).json({ success: false, message: "Please upload a file" });
  }

  try {
    await ActivityLog.create({
      action: "Image Upload Attempt",
      userId: req.user.id,
      userEmail: req.user.email,
      success: true,
      details: "Image uploaded successfully",
      ipAddress: req.ip || req.connection.remoteAddress,
    });
  } catch (logError) {
    console.error("ActivityLog Error:", logError.message);
  }

  res.status(200).json({
    success: true,
    message: "Image uploaded successfully",
    data: req.file.filename,
  });
});

// @desc    Get current logged-in customer
// @route   GET /api/v1/customers/me
// @access  Private
exports.getMe = asyncHandler(async (req, res, next) => {
  const customer = await Customer.findById(req.user.id);
  if (!customer) {
    try {
      await ActivityLog.create({
        action: "Get Me Attempt",
        userId: req.user.id,
        userEmail: req.user.email,
        success: false,
        details: "Customer not found",
        ipAddress: req.ip || req.connection.remoteAddress,
      });
    } catch (logError) {
      console.error("ActivityLog Error:", logError.message);
    }
    return res.status(404).json({ success: false, message: "Customer not found" });
  }
  res.status(200).json({ success: true, data: customer });
});

// ==================== HELPER ====================

const sendTokenResponse = (customer, statusCode, res) => {
  const token = customer.getSignedJwtToken();
  const options = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
  };

  res
    .status(statusCode)
    .cookie("token", token, options)
    .json({ success: true, token, userId: customer._id, role: customer.role });
};

// Export all functions
exports.validateRegister = validateRegister;
exports.validateLogin = validateLogin;
exports.validateOtp = validateOtp;
exports.getCustomers = exports.getCustomers;
exports.getCustomer = exports.getCustomer;
exports.register = exports.register;
exports.verifyRegisterOtp = exports.verifyRegisterOtp;
exports.login = exports.login;
exports.verifyOtp = exports.verifyOtp;
exports.updateCustomer = exports.updateCustomer;
exports.updatePassword = exports.updatePassword;
exports.forgotPassword = exports.forgotPassword;
exports.resetPassword = exports.resetPassword;
exports.deleteCustomer = exports.deleteCustomer;
exports.uploadImage = exports.uploadImage;
exports.getMe = exports.getMe;