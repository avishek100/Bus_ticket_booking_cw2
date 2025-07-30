const Stripe = require("stripe");

// Initialize Stripe with the secret key
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// ✅ Create Payment Intent for Stripe
exports.createStripePaymentIntent = async (req, res) => {
    try {
        const { amount } = req.body;

        // Log the received amount for debugging (amount in rupees)
        console.log(`Received amount from frontend: ₹${amount}`);

        // Validate amount
        if (!amount || typeof amount !== "number" || amount <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid or missing amount. Amount must be a positive number.",
            });
        }

        // Set minimum amount to ₹42 for INR (4200 paise ≈ $0.50 USD)
        const MINIMUM_AMOUNT_INR = 42;
        if (amount < MINIMUM_AMOUNT_INR) {
            return res.status(400).json({
                success: false,
                message: `Amount must be at least ₹${MINIMUM_AMOUNT_INR} to meet Stripe's minimum transaction requirement.`,
            });
        }

        // Convert amount to paise (Stripe expects smallest currency unit)
        const amountInPaise = Math.round(amount * 100);

        // Create payment intent with INR currency (amount in paise)
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amountInPaise, // Send amount in paise (e.g., ₹1250 → 125000 paise)
            currency: "inr",
            payment_method_types: ["card"],
            description: "Bus ticket booking payment",
        });

        // Log success for debugging (remove in production)
        console.log(`PaymentIntent created: ${paymentIntent.id} for amount ₹${amount} (${amountInPaise} paise)`);

        res.status(200).json({
            success: true,
            clientSecret: paymentIntent.client_secret,
        });
    } catch (error) {
        // Log error for debugging
        console.error("Error creating PaymentIntent:", error.message);

        res.status(500).json({
            success: false,
            message: `Failed to create payment intent: ${error.message}`,
        });
    }
};