const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order'); // Adjust the path to your controller
const { protect } = require('../middleware/auth');

// Order Routes
router.post("/orders", orderController.createOrder);
router.get("/orders", protect, orderController.getAllOrders);
router.get("/orders/:id", protect, orderController.getOrderById);
router.get("/orders/user/:userId", protect, orderController.getOrdersByUserId);
router.get("/revenue", protect, orderController.getTotalRevenue);
router.get("/orders-revenue", protect, orderController.getOrdersRevenue);
router.get("/popular-categories", protect, orderController.getPopularCategories);
router.get("/top-selling-foods", protect, orderController.getTopSellingFoods);
router.get("/popular-foods", protect, orderController.getPopularFoods);

module.exports = router;



