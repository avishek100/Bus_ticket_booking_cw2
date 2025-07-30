// routes/stripe.js
const express = require("express");
const router = express.Router();
const stripeController = require("../controllers/stripeController");

router.post("/create-payment-intent", stripeController.createStripePaymentIntent);

module.exports = router;
