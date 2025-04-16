// ✅ Working for square@42.0.0
const express = require("express");
const router = express.Router();
const squareConnect = require("square-connect");
const { authenticate } = require("../middleware/authMiddleware");
const crypto = require("crypto");
const Order = require("../models/Order");
const Cart = require("../models/Cart");
const twilio = require("twilio");
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioClient = twilio(accountSid, authToken);

// Configure Square environment
const defaultClient = squareConnect.ApiClient.instance;
defaultClient.basePath = "https://connect.squareupsandbox.com";

const oauth2 = defaultClient.authentications["oauth2"];
oauth2.accessToken = process.env.SQUARE_ACCESS_TOKEN;

const formatPhone = (phone) => {
  const cleaned = phone.replace(/\D/g, "");
  return cleaned.startsWith("1") ? `+${cleaned}` : `+1${cleaned}`;
};

const paymentsApi = new squareConnect.PaymentsApi();

router.post("/", authenticate, async (req, res) => {
  const { sourceId, amount, customerInfo } = req.body;

  console.log("📦 Checkout request body:", { sourceId, amount, customerInfo });

  if (!sourceId || !amount) {
    return res.status(400).json({ success: false, message: "Missing required fields" });
  }

  try {
    const response = await paymentsApi.createPayment({
      source_id: sourceId, // ✅ FIXED
      idempotency_key: crypto.randomUUID(), // ✅ FIXED
      amount_money: {
        amount: Math.round(amount * 100),
        currency: "CAD",
      },
    });

    // ✅ Get user's cart
    const cart = await Cart.findOne({ user: req.user.userId }).populate("items.product");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // ✅ Create new order
    const newOrder = new Order({
      customer: req.user.userId,
      items: cart.items.map((item) => ({
        product: item.product._id,
        quantity: item.quantity,
        price: item.product.price,
      })),
      totalPrice: amount,
      customerInfo, // Save name, email, phone, postalCode
    });

    await newOrder.save();

    const io = req.app.get("io");

order.items.forEach(item => {
  const vendorId = item.product.vendor.toString();
  io.emit(`vendor:${vendorId}`, {
    type: "NEW_ORDER",
    message: `🎉 New order for ${item.product.name}`,
    orderId: order._id,
  });
});

    // ✅ Send confirmation SMS
await twilioClient.messages.create({
  body: `✅ Hi ${customerInfo.name}, your order has been placed successfully on SMaLoB. Total: $${amount} CAD. Thank you for shopping with us!`,
  from: process.env.TWILIO_PHONE_NUMBER,
  to: formatPhone(customerInfo.phone),
});

    // ✅ Clear cart
    cart.items = [];
    await cart.save();

    res.status(200).json({ success: true, payment: response.payment });
  } catch (error) {
    console.error("💥 Checkout error:", error);
    res.status(500).json({
      success: false,
      message: error.errors?.[0]?.detail || error.message,
    });
  }
});

module.exports = router;