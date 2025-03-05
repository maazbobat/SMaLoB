const express = require("express");
const router = express.Router();
const { authenticate } = require("../middleware/authMiddleware");
const wishlistController = require("../controllers/wishlistController");

// 📌 Ensure the correct path and method
router.post("/add", authenticate, wishlistController.addToWishlist);
router.get("/", authenticate, wishlistController.getWishlist);
router.delete("/remove/:productId", authenticate, wishlistController.removeFromWishlist);

module.exports = router;