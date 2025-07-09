const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const User = require("../models/User");

dotenv.config();


exports.auth = async (req, res, next) => {
    try {
        const token = req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            return res.status(401).json({ success: false, message: "No token provided" });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(401).json({ success: false, message: "User not found" });
        }

        // console.log("Authenticated User:", user);

        req.user = {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        };

        next();
    } catch (error) {
        res.status(401).json({ success: false, message: "Authentication failed", error: error.message });
    }
};

// Middleware to check if the user is a Admin

exports.isAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== "admin") {
        return res.status(403).json({ success: false, message: "Access denied. Admins only." });
    }
    next();
};

// Middleware to check if the user is a Customer
exports.isCustomer = (req, res, next) => {
    if (!req.user || req.user.role !== "customer") {
        return res.status(403).json({ success: false, message: "Access denied. Customers only." });
    }
    next();
};