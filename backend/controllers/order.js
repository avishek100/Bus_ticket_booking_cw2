const Order = require("../models/Order"); // Assuming the model is in the "models" folder

// Create a new order
exports.createOrder = async (req, res) => {
    try {
        const { userId, cartItems, billingDetails, paymentMethod, status, subtotal, deliveryCharge, totalPrice, stripeSessionId } = req.body;

        // Convert string values to numbers
        const numericSubtotal = Number(subtotal);
        const numericDeliveryCharge = Number(deliveryCharge);
        const numericTotalPrice = Number(totalPrice);

        // Validate required fields
        if (!billingDetails || !billingDetails.fullName || !billingDetails.email || 
            !billingDetails.phone || !billingDetails.address || !billingDetails.city || 
            !billingDetails.zipCode) {
            return res.status(400).json({ 
                message: "Missing required billing details. Please provide fullName, email, phone, address, city, and zipCode" 
            });
        }

        // Validate cartItems
        if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
            return res.status(400).json({ 
                message: "Cart items are required and must be an array" 
            });
        }

        // Validate payment method
        if (!paymentMethod || !['cod', 'khalti', 'stripe'].includes(paymentMethod)) {
            return res.status(400).json({ 
                message: "Valid payment method is required (cod, khalti, or stripe)" 
            });
        }

        const newOrder = new Order({
            userId: userId || null, // Allow null for guest orders
            cartItems,
            billingDetails,
            paymentMethod,
            paymentStatus: status || 'pending', // Map status to paymentStatus
            subtotal: numericSubtotal,
            deliveryCharge: numericDeliveryCharge,
            totalPrice: numericTotalPrice,
            orderStatus: 'pending', // Default order status
            stripeSessionId: stripeSessionId || null
        });

        // Save the order to the database
        const order = await newOrder.save();
        res.status(201).json(order);
    } catch (error) {
        console.error('Order creation error:', error);
        res.status(500).json({ 
            message: "Error creating order",
            error: error.message 
        });
    }
};

// Get all orders
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find();
        res.status(200).json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching orders" });
    }
};

// Get order by ID
exports.getOrderById = async (req, res) => {
    try {
        const { id } = req.params;

        const order = await Order.findById(id);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        res.status(200).json(order);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching order" });
    }
};

exports.getOrdersByUserId = async (req, res) => {
    try {
        const { userId } = req.params;

        // Validate userId
        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        // Check if user is requesting their own orders or is admin
        if (req.user.role !== 'admin' && req.user._id.toString() !== userId) {
            return res.status(403).json({ message: "Not authorized to view these orders" });
        }

        const orders = await Order.find({ userId }).populate('cartItems.itemId');

        // Return empty array if no orders found (not 404)
        res.status(200).json(orders);
    } catch (error) {
        console.error('Error fetching orders by userId:', error);
        res.status(500).json({ message: "Error fetching orders" });
    }
};
exports.getTotalRevenue = async (req, res) => {
    try {
        const revenue = await Order.aggregate([
            { $match: { orderStatus: "Completed" } }, // Only count completed orders
            { $group: { _id: null, totalRevenue: { $sum: "$totalPrice" } } }
        ]);

        const totalRevenue = revenue.length > 0 ? revenue[0].totalRevenue : 0;

        res.status(200).json({ totalRevenue });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error calculating revenue" });
    }
};

exports.getOrdersRevenue = async (req, res) => {
    try {
        const ordersRevenue = await Order.aggregate([
            { $match: { orderStatus: "Completed" } }, // Filter completed orders
            {
                $group: {
                    _id: { month: { $month: "$createdAt" }, year: { $year: "$createdAt" } },
                    totalOrders: { $sum: 1 },
                    totalRevenue: { $sum: "$totalPrice" }
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } }
        ]);

        res.status(200).json(ordersRevenue);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching orders revenue" });
    }
};

exports.getPopularCategories = async (req, res) => {
    try {
        const popularCategories = await Order.aggregate([
            { $unwind: "$cartItems" }, // Flatten the cartItems array
            {
                $group: {
                    _id: "$cartItems.category", // Group by category
                    totalOrders: { $sum: 1 }
                }
            },
            { $sort: { totalOrders: -1 } }, // Sort in descending order
            { $limit: 5 } // Limit to top 5 popular categories
        ]);

        res.status(200).json(popularCategories);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching popular categories" });
    }
};

// Get top-selling foods based on total quantity sold
exports.getTopSellingFoods = async (req, res) => {
    try {
        const topSellingFoods = await Order.aggregate([
            { $unwind: "$cartItems" }, // Flatten the cartItems array
            {
                $group: {
                    _id: "$cartItems.itemId", // Group by itemId
                    totalQuantity: { $sum: "$cartItems.quantity" }
                }
            },
            { $sort: { totalQuantity: -1 } }, // Sort in descending order
            { $limit: 5 } // Limit to top 5 best-selling foods
        ]);

        res.status(200).json(topSellingFoods);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching top-selling foods" });
    }
};

// Get most popular foods based on number of orders
exports.getPopularFoods = async (req, res) => {
    try {
        const popularFoods = await Order.aggregate([
            { $unwind: "$cartItems" }, // Flatten the cartItems array
            {
                $group: {
                    _id: "$cartItems.itemId", // Group by itemId
                    totalOrders: { $sum: 1 }
                }
            },
            { $sort: { totalOrders: -1 } }, // Sort in descending order
            { $limit: 5 } // Limit to top 5 most ordered foods
        ]);

        res.status(200).json(popularFoods);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching popular foods" });
    }
};

