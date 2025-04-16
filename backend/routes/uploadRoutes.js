const express = require("express");
const multer = require("multer");
const path = require("path");
const router = express.Router();
const { authenticate, authorize } = require("../middleware/authMiddleware");

// Set up storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/products/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// Upload product image
router.post("/product", authenticate, authorize("Vendor"), upload.single("image"), (req, res) => {
    if (!req.file) return res.status(400).json({ message: "No image uploaded" });
  
    res.json({ imageUrl: `/uploads/products/${req.file.filename}` });
  });

module.exports = router;