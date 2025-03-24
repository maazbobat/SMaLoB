const express = require("express");
const router = express.Router();
const { authenticate } = require("../middleware/authMiddleware");
const cartController = require("../controllers/cartController");

// ✅ Add to cart (Protected route)
router.post("/add", authenticate, cartController.addToCart);

// ✅ Get user cart (Protected route)
router.get("/", authenticate, cartController.getCart);

// ✅ Update quantity
router.put("/update/:productId", authenticate, async (req, res) => {
    try {
      const { quantity } = req.body;
      const cart = await Cart.findOne({ user: req.user.userId });
  
      if (!cart) return res.status(404).json({ message: "Cart not found" });
  
      const item = cart.items.find(
        (item) => item.product.toString() === req.params.productId
      );
  
      if (!item) return res.status(404).json({ message: "Item not found in cart" });
  
      item.quantity = quantity;
      await cart.save();
  
      const updatedCart = await cart.populate("items.product");
      res.json(updatedCart);
    } catch (error) {
      console.error("🔥 Error updating quantity:", error);
      res.status(500).json({ message: "Server error" });
    }
  });
  
  // ✅ Remove item
  router.delete("/remove/:productId", authenticate, async (req, res) => {
    try {
      const cart = await Cart.findOne({ user: req.user.userId });
      if (!cart) return res.status(404).json({ message: "Cart not found" });
  
      cart.items = cart.items.filter(
        (item) => item.product.toString() !== req.params.productId
      );
  
      await cart.save();
  
      const updatedCart = await cart.populate("items.product");
      res.json(updatedCart);
    } catch (error) {
      console.error("🔥 Error removing from cart:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

module.exports = router;