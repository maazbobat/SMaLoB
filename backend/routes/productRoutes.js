const express = require("express");
const router = express.Router();
const { authenticate } = require("../middleware/authMiddleware");
const productController = require("../controllers/productController");

// ✅ Fetch all products
router.get("/", productController.getAllProducts);

// ✅ Add a new product (only vendors can add products)
router.post("/add", authenticate, productController.addProduct);

// ✅ Delete a product
router.delete("/:id", authenticate, productController.deleteProduct);

module.exports = router;