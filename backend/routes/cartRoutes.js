// /routes/cartRoutes.js
const express = require("express");
const router = express.Router();
const { authenticate } = require("../middleware/authMiddleware");
const cartController = require("../controllers/cartController");

router.post("/add", authenticate, cartController.addToCart);
router.get("/", authenticate, cartController.getCart);
router.put("/update/:productId", authenticate, cartController.updateCartQuantity);
router.delete("/remove/:productId", authenticate, cartController.removeFromCart);

module.exports = router;