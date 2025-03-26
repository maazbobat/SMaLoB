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
      const vendor = await Vendor.findById(req.user.userId)
      .select("-password")
      .populate({
        path: "products",
        model: "Product"
      });

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

router.get("/orders", authenticate, authorize("Vendor"), async (req, res) => {
  try {
    const vendorId = req.user.userId;

    // Find products that belong to this vendor
    const vendorProducts = await Product.find({ vendor: vendorId }).select("_id");
    const productIds = vendorProducts.map(p => p._id);

    // Find orders that include any of these products
    const orders = await Order.find({ "items.product": { $in: productIds } })
      .populate("customer")
      .populate("items.product");

    // Filter each order to include only the items sold by this vendor
    const filteredOrders = orders.map(order => {
      const filteredItems = order.items.filter(item =>
        item.product.vendor.toString() === vendorId
      );

      return {
        _id: order._id,
        customer: order.customer,
        items: filteredItems,
        status: order.status,
        totalPrice: filteredItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
        createdAt: order.createdAt,
      };
    });

    res.json(filteredOrders);
  } catch (error) {
    console.error("🔥 Vendor order fetch error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Update Order Status
router.put("/orders/:orderId", authenticate, authorize("Vendor"), async (req, res) => {
  try {
    const vendorId = req.user.userId;
    const order = await Order.findById(req.params.orderId).populate("items.product");

    if (!order) return res.status(404).json({ message: "Order not found" });

    const hasVendorItems = order.items.some(item =>
      item.product.vendor.toString() === vendorId
    );

    if (!hasVendorItems) {
      return res.status(403).json({ message: "Unauthorized - Order doesn't include your products" });
    }

    order.status = req.body.status;
    await order.save();

    res.json({ message: "✅ Order status updated", order });
  } catch (error) {
    console.error("🔥 Error updating order status:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Vendor Sales Data
router.get("/sales", authenticate, authorize("Vendor"), async (req, res) => {
  try {
    const vendorId = req.user.userId;

    const vendorProducts = await Product.find({ vendor: vendorId }).select("_id");
    const productIds = vendorProducts.map(p => p._id);

    const sales = await Order.aggregate([
      { $unwind: "$items" },
      { $match: { "items.product": { $in: productIds } } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } },
          totalUnitsSold: { $sum: "$items.quantity" },
          orderIds: { $addToSet: "$_id" } // Collect unique orders
        }
      },
      {
        $project: {
          totalRevenue: 1,
          totalUnitsSold: 1,
          totalOrders: { $size: "$orderIds" }
        }
      }
    ]);

    res.json(sales[0] || { totalRevenue: 0, totalUnitsSold: 0, totalOrders: 0 });
  } catch (error) {
    console.error("🔥 Vendor sales error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// 📍 GET /api/vendors/with-products
router.get("/with-products", async (req, res) => {
  try {
    const vendors = await Vendor.find().select("-password");

    // Fetch products for each vendor
    const vendorWithProducts = await Promise.all(
      vendors.map(async (vendor) => {
        const products = await Product.find({ vendor: vendor._id });
        return {
          _id: vendor._id,
          name: vendor.name,
          email: vendor.email,
          products,
        };
      })
    );

    res.json(vendorWithProducts);
  } catch (error) {
    console.error("🔥 Error fetching vendors with products:", error);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;