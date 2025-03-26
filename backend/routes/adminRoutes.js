const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const { authenticate, authorize } = require("../middleware/authMiddleware");
const User = require("../models/User");
const Vendor = require("../models/Vendor");
const Order = require("../models/Order");

// ✅ GET Admin Dashboard Stats (Users, Vendors, Orders, Sales Data)
router.get("/stats", authenticate, authorize("Admin"), async (req, res) => {
    try {
      const usersCount = await User.countDocuments();
      const vendorsCount = await Vendor.countDocuments({ role: "Vendor" });
      const orders = await Order.find();
      const ordersCount = orders.length;
  
      const totalRevenue = orders.reduce((acc, order) => acc + order.totalPrice, 0);
      const averageOrderValue = ordersCount > 0 ? totalRevenue / ordersCount : 0;
  
      // ✅ Group sales data by month
      const salesDataRaw = await Order.aggregate([
        {
          $group: {
            _id: { $month: "$createdAt" },
            totalSales: { $sum: "$totalPrice" },
          },
        },
        { $sort: { _id: 1 } },
      ]);
  
      const formattedSalesData = {
        labels: salesDataRaw.map((d) => `Month ${d._id}`),
        datasets: [
          {
            label: "Sales Revenue",
            data: salesDataRaw.map((d) => d.totalSales),
            borderColor: "blue",
            backgroundColor: "rgba(0, 0, 255, 0.2)",
            fill: true,
          },
        ],
      };
  
      // ✅ Sales growth rate (Month over Month)
      const thisMonth = salesDataRaw[salesDataRaw.length - 1]?.totalSales || 0;
      const lastMonth = salesDataRaw[salesDataRaw.length - 2]?.totalSales || 0;
      const salesGrowthRate =
        lastMonth > 0 ? ((thisMonth - lastMonth) / lastMonth) * 100 : 0;
  
      // ✅ Status breakdown
      const statusBreakdown = orders.reduce((acc, order) => {
        acc[order.status] = (acc[order.status] || 0) + 1;
        return acc;
      }, {});
  
      res.json({
        users: usersCount,
        vendors: vendorsCount,
        orders: ordersCount,
        totalRevenue,
        averageOrderValue,
        salesGrowthRate,
        statusBreakdown,
        salesData: formattedSalesData,
      });
    } catch (error) {
      console.error("🔥 Error fetching admin stats:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

router.get("/users", authenticate, authorize("Admin"), async (req, res) => {
    try {
        const users = await User.find().select("-password"); // Exclude passwords
        res.json(users);
    } catch (error) {
        console.error("🔥 Error fetching users:", error);
        res.status(500).json({ message: "Server error" });
    }
});

router.get("/vendors", authenticate, authorize("Admin"), async (req, res) => {
    try {
        const vendors = await Vendor.find().select("-password"); // Exclude passwords
        res.json(vendors);
    } catch (error) {
        console.error("🔥 Error fetching vendors:", error);
        res.status(500).json({ message: "Server error" });
    }
});


// ✅ In routes/adminRoutes.js
router.get("/analytics", authenticate, authorize("Admin"), async (req, res) => {
    try {
      const totalSalesAgg = await Order.aggregate([
        { $group: { _id: null, total: { $sum: "$totalPrice" } } },
      ]);
      const totalSales = totalSalesAgg[0]?.total || 0;
  
      const newUsers = await User.countDocuments(); // optionally filter by month
      const activeVendors = await Vendor.countDocuments();
  
      const salesData = await Order.aggregate([
        {
          $group: {
            _id: { $month: "$createdAt" },
            totalSales: { $sum: "$totalPrice" },
          },
        },
        { $sort: { _id: 1 } },
      ]);
  
      const userGrowth = await User.aggregate([
        {
          $group: {
            _id: { $month: "$createdAt" },
            users: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]);
  
      const salesChart = {
        labels: salesData.map((d) => `Month ${d._id}`),
        datasets: [
          {
            label: "Monthly Sales",
            data: salesData.map((d) => d.totalSales),
            borderColor: "blue",
            backgroundColor: "rgba(0, 0, 255, 0.2)",
            fill: true,
          },
        ],
      };
  
      const usersChart = {
        labels: userGrowth.map((d) => `Month ${d._id}`),
        datasets: [
          {
            label: "New Users",
            data: userGrowth.map((d) => d.users),
            backgroundColor: "rgba(255, 99, 132, 0.5)",
            borderColor: "red",
          },
        ],
      };
  
      res.json({
        totalSales,
        newUsers,
        activeVendors,
        salesChart,
        usersChart,
      });
    } catch (error) {
      console.error("🔥 Error in /admin/analytics:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

  router.get("/profile", authenticate, authorize("Admin"), async (req, res) => {
    try {
        const admin = await User.findById(req.user.userId).select("-password");

        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }

        res.json({ success: true, admin });
    } catch (error) {
        console.error("🔥 Error fetching admin profile:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// ✅ Update Admin Profile
router.put("/profile", authenticate, authorize("Admin"), async (req, res) => {
    try {
        const { username, email, phone } = req.body;

        const updatedAdmin = await User.findByIdAndUpdate(
            req.user.userId,
            { username, email, phone },
            { new: true, runValidators: true }
        ).select("-password");

        res.json({ success: true, admin: updatedAdmin });
    } catch (error) {
        console.error("🔥 Error updating admin profile:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// ✅ Change Password
router.put("/change-password", authenticate, authorize("Admin"), async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        // ✅ Ensure both passwords are provided
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: "Both current and new password are required." });
        }

        // ✅ Fetch admin including password field
        const admin = await User.findById(req.user.userId).select("+password");

        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }

        // ✅ Ensure the current password is valid
        const isMatch = await bcrypt.compare(currentPassword, admin.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Incorrect current password" });
        }

        // ✅ Hash the new password before saving
        admin.password = await bcrypt.hash(newPassword, 10);
        await admin.save();

        res.json({ success: true, message: "Password updated successfully" });
    } catch (error) {
        console.error("🔥 Error changing password:", error);
        res.status(500).json({ message: "Server error" });
    }
});


module.exports = router;