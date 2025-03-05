const express = require("express");
const router = express.Router();
const { authenticate } = require("../middleware/authMiddleware");
const orderController = require("../controllers/orderController");

// ✅ Place a new order
router.post("/place", authenticate, orderController.placeOrder);

// ✅ Update order status
router.put("/:id/status", authenticate, orderController.updateOrderStatus);

// ✅ Get all orders for a customer
router.get("/", authenticate, orderController.getCustomerOrders);

module.exports = router;