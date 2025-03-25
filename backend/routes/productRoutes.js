const express = require("express");
const router = express.Router();
const { authenticate } = require("../middleware/authMiddleware");
const productController = require("../controllers/productController");
const Product = require("../models/Product");

// ✅ Fetch all products
router.get("/", productController.getAllProducts);

// ✅ Add a new product (only vendors can add products)
router.post("/add", authenticate, productController.addProduct);

// ✅ Delete a product
router.delete("/:id", authenticate, productController.deleteProduct);

// ✅ Get a single product by ID
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    console.error("🔥 Error fetching product:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;