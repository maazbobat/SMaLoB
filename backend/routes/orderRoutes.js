const express = require("express");
const router = express.Router();
const { authenticate } = require("../middleware/authMiddleware");
const Order = require("../models/Order");
const Product = require("../models/Product");

// ✅ Create a New Order
router.post("/place", authenticate, async (req, res) => {
  try {
    const { items } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No items in order" });
    }

    let totalPrice = 0;
    const orderItems = [];

    for (let item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ message: `Product not found: ${item.product}` });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({ message: `Not enough stock for ${product.name}` });
      }

      orderItems.push({
        product: product._id,
        quantity: item.quantity,
        price: product.price * item.quantity
      });

      totalPrice += product.price * item.quantity;

      // Reduce stock
      product.stock -= item.quantity;
      await product.save();
    }

    const order = new Order({
      customer: req.user.userId,
      items: orderItems,
      totalPrice,
    });

    await order.save();

    res.status(201).json({ message: "Order placed successfully", order });
  } catch (error) {
    console.error("🔥 Error placing order:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/", authenticate, async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const order = new Order({
            customer: req.user.userId,
            items: [{ product: productId, quantity }],
            status: "Pending",
        });

        await order.save();
        res.status(201).json({ message: "Order placed successfully", order });
    } catch (error) {
        console.error("🔥 Error placing order:", error);
        res.status(500).json({ message: "Failed to place order" });
    }
});

module.exports = router;