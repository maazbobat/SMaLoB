const express = require("express");
const router = express.Router();
const { authenticate, authorize } = require("../middleware/authMiddleware");
const Vendor = require("../models/Vendor");
const Product = require("../models/Product"); 
const Order = require("../models/Order");

// ✅ Test Route
router.get("/test", (req, res) => {
  res.json({ message: "Vendor route is working!" });
});

// ✅ Get All Vendors
router.get("/", async (req, res) => {
  try {
    const vendors = await Vendor.find().select("-password");
    res.json(vendors);
  } catch (error) {
    console.error("🔥 Error fetching vendors:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/profile", authenticate, authorize("Vendor"), async (req, res) => {
    console.log("🔍 Vendor Profile API Hit, User ID:", req.user?.userId);

    try {
        const vendor = await Vendor.findById(req.user.userId).select("-password");

        if (!vendor) {
            console.log("❌ Vendor not found in DB");
            return res.status(404).json({ message: "Vendor not found" });
        }

        res.json({ success: true, vendor });
    } catch (error) {
        console.error("🔥 Error fetching vendor profile:", error);
        res.status(500).json({ message: "Server error" });
    }
});

router.post("/products", authenticate, authorize("Vendor"), async (req, res) => {
  try {
      const { name, description, price, stock, category, images } = req.body;

      if (!name || !price || !stock || !category) {
          return res.status(400).json({ message: "All fields are required." });
      }

      const vendor = await Vendor.findById(req.user.userId);
      if (!vendor) {
          return res.status(404).json({ message: "Vendor not found" });
      }

      // ✅ Create and save product
      const newProduct = new Product({
          name,
          description,
          price,
          stock,
          category,
          images,
          vendor: vendor._id, // ✅ Associate product with vendor
      });

      await newProduct.save();
      res.status(201).json({ message: "Product added successfully", product: newProduct });

  } catch (error) {
      console.error("🔥 Error adding product:", error);
      res.status(500).json({ message: "Server error" });
  }
});

router.get("/products", authenticate, async (req, res) => {
  try {
    const vendorId = req.user.userId; // Ensure user is authenticated
    const products = await Product.find({ vendor: vendorId });
    res.json(products);
  } catch (error) {
    console.error("🔥 Error fetching vendor products:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/orders", authenticate, async (req, res) => {
  try {
    const orders = await Order.find({ vendor: req.user.userId }).populate("customer");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Update Order Status
router.put("/orders/:orderId", authenticate, async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.vendor.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    order.status = req.body.status;
    await order.save();
    res.json({ message: "Order updated", order });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;