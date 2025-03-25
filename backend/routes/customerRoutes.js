const express = require("express");
const router = express.Router();
const { authenticate } = require("../middleware/authMiddleware");
const User = require("../models/User"); // Ensure correct User model import
const Order = require("../models/Order");
const bcrypt = require("bcryptjs");

// ✅ GET Customer Profile
router.get("/profile", authenticate, async (req, res) => {
  console.log("🔍 Fetching Customer Profile for User ID:", req.user.userId);
  try {
      const customer = await User.findById(req.user.userId).select("-password");

      if (!customer) {
          console.error("❌ Customer not found in DB");
          return res.status(404).json({ message: "Customer not found" });
      }

      res.json({
          success: true,
          customer: {
              id: customer._id,
              name: customer.username,
              email: customer.email,
              isVerified: customer.isVerified, 
              orders: [],
              wishlist: [],
          },
      });
  } catch (error) {
      console.error("🔥 Error fetching customer profile:", error);
      res.status(500).json({ message: "Server error" });
  }
});

// ✅ UPDATE Customer Profile (Prevent email change for security reasons)
router.put("/profile", authenticate, async (req, res) => {
  try {
    const { username, email, phone, address } = req.body;

    const updatedCustomer = await User.findByIdAndUpdate(
      req.user.userId,
      { username, email, phone, address },
      { new: true, runValidators: true }
    );

    if (!updatedCustomer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.json({ message: "Profile updated successfully", user: updatedCustomer });

  } catch (error) {
    console.error("🔥 Error updating customer profile:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ CHANGE Customer Password
router.put("/change-password", authenticate, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const customer = await User.findById(req.user.userId).select("+password");

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, customer.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect current password" });
    }

    // Hash and update new password
    customer.password = await bcrypt.hash(newPassword, 10);
    await customer.save();

    res.json({ success: true, message: "Password changed successfully" });
  } catch (error) {
    console.error("🔥 Error changing password:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ GET Customer Orders (Populate order details)
router.get("/orders", authenticate, async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.user.userId }).populate("items.product", "name price");
    res.json({ success: true, orders });
  } catch (error) {
    console.error("🔥 Error fetching orders:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;