const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

// ✅ Fetch all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find(); // Fetch all products
    res.json(products);
  } catch (error) {
    console.error("🔥 Error fetching products:", error);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;