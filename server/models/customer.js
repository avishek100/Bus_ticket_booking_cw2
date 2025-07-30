// const mongoose = require("mongoose");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const crypto = require("crypto");

// const customerSchema = new mongoose.Schema({
//     fname: {
//         type: String,
//         required: true,
//         trim: true,
//     },
//     lname: {
//         type: String,
//         required: true,
//         trim: true,
//     },
//     phone: {
//         type: String,
//         required: true,
//         trim: true,
//     },
//     email: {
//         type: String,
//         required: true,
//         trim: true,
//         unique: true, // Ensure unique emails
//     },
//     password: {
//         type: String,
//         required: true,
//         trim: true,
//     },
//     role: {
//         type: String,
//         enum: ["customer", "admin"],
//         default: "customer", // Default role is "customer"
//     },
//     image: {
//         type: String,
//         default: null,
//     },
//     resetPasswordToken: String,
//     resetPasswordExpire: Date,
// });

// // Encrypt password before saving
// customerSchema.pre("save", async function (next) {
//     if (!this.isModified("password")) {
//         next();
//     }
//     const salt = await bcrypt.genSalt(10);
//     this.password = await bcrypt.hash(this.password, salt);
// });

// // Sign JWT and return (Include Role)
// customerSchema.methods.getSignedJwtToken = function () {
//     return jwt.sign({ id: this._id, role: this.role }, process.env.JWT_SECRET, {
//         expiresIn: process.env.JWT_EXPIRE,
//     });
// };

// // Match entered password with hashed password
// customerSchema.methods.matchPassword = async function (enteredPassword) {
//     return await bcrypt.compare(enteredPassword, this.password);
// };

// // Generate Reset Password Token
// customerSchema.methods.getResetPasswordToken = function () {
//     const resetToken = crypto.randomBytes(20).toString("hex");

//     this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
//     this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

//     return resetToken;
// };

// module.exports = mongoose.model("Customer", customerSchema);




const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const customerSchema = new mongoose.Schema(
    {
        fname: {
            type: String,
            required: [true, "First name is required"],
            trim: true,
        },
        lname: {
            type: String,
            required: [true, "Last name is required"],
            trim: true,
        },
        phone: {
            type: String,
            required: [true, "Phone number is required"],
            trim: true,
            match: [/^\+?\d{10,15}$/, "Phone number must be 10-15 digits"],
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            trim: true,
            lowercase: true,
            unique: true,
            sparse: true,
            match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please enter a valid email"],
        },
        password: {
            type: String,
            trim: true,
            required: [true, "Password is required"],
            minlength: [8, "Password must be at least 8 characters"],
            select: false,
        },
        image: {
            type: String,
            default: null,
            trim: true,
        },
        role: {
            type: String,
            enum: ["customer", "admin"],
            default: "customer",
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        otp: {
            type: String,
            default: null,
            select: false,
        },
        otpExpire: {
            type: Date,
            default: null,
            select: false,
        },
        termsAccepted: {
            type: Boolean,
            required: [true, "You must accept the Terms and Conditions"],
            default: false,
        },
        resetPasswordToken: {
            type: String,
            default: null,
            select: false,
        },
        resetPasswordExpire: {
            type: Date,
            default: null,
            select: false,
        },
        loginAttempts: {
            type: Number,
            default: 0,
        },
        lockUntil: {
            type: Date,
            default: null,
        },
        isPasswordModified: {
            type: Boolean,
            default: false,
            select: false,
        },
    },
    { timestamps: true }
);

// Pre-save password hashing
customerSchema.pre("save", async function (next) {
    if (!this.isModified("password") || this.isPasswordModified) {
        return next();
    }

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        this.isPasswordModified = false;
        next();
    } catch (error) {
        console.error('Password Hashing Error:', error.message);
        next(error);
    }
});

// Generate JWT
customerSchema.methods.getSignedJwtToken = function () {
    return jwt.sign(
        { id: this._id, role: this.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE }
    );
};

// Match passwords
customerSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Generate 6-digit OTP
customerSchema.methods.getOtp = function () {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    this.otp = crypto.createHash("sha256").update(otp).digest("hex");
    this.otpExpire = Date.now() + 10 * 60 * 1000;
    return otp;
};

module.exports = mongoose.model("Customer", customerSchema);