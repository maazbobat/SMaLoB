const express = require("express");
const router = express.Router();
const { authenticate } = require("../middleware/authMiddleware");
const cartController = require("../controllers/cartController");

// ✅ Add to cart (Protected route)
router.post("/add", authenticate, cartController.addToCart);

// ✅ Get user cart (Protected route)
router.get("/", authenticate, cartController.getCart);

module.exports = router;