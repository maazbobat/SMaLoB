const Product = require("../models/Product");
const { io } = require("../server"); // Import Socket.io for real-time updates

// ✅ Fetch all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    console.error("🔥 Error fetching products:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Add a new product
exports.addProduct = async (req, res) => {
  try {
    const newProduct = await Product.create(req.body);
    io.emit("productUpdated", newProduct); // Notify clients in real-time
    res.status(201).json(newProduct);
  } catch (error) {
    console.error("🔥 Error adding product:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Delete a product
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    io.emit("productUpdated", product); // Notify clients
    res.json({ message: "✅ Product deleted successfully" });
  } catch (error) {
    console.error("🔥 Error deleting product:", error);
    res.status(500).json({ message: "Server error" });
  }
};