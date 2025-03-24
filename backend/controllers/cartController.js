const Product = require("../models/Product");
const Cart = require("../models/Cart");

exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({ message: "Product ID is required." });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    let cart = await Cart.findOne({ user: req.user.userId });
    if (!cart) {
      cart = new Cart({ user: req.user.userId, items: [] });
    }

    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({
        product: product._id,
        quantity,
        price: product.price,
      });
    }

    await cart.save();

    res.status(200).json({ message: "Item added to cart", cart });
  } catch (error) {
    console.error("🔥 Error adding to cart:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.userId }).populate("items.product");

    if (!cart) return res.json({ items: [], total: 0 });

    const total = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    res.json({ ...cart.toObject(), total });
  } catch (error) {
    console.error("🔥 Error fetching cart:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateCartQuantity = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    const cart = await Cart.findOne({ user: req.user.userId });

    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.items.find((item) => item.product.toString() === productId);

    if (!item) return res.status(404).json({ message: "Item not found in cart" });

    item.quantity = quantity;
    await cart.save();

    const updatedCart = await Cart.findOne({ user: req.user.userId }).populate("items.product");
    res.json(updatedCart);
  } catch (error) {
    console.error("🔥 Error updating quantity:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({ user: req.user.userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter((item) => item.product.toString() !== productId);
    await cart.save();

    const updatedCart = await Cart.findOne({ user: req.user.userId }).populate("items.product");
    res.json(updatedCart);
  } catch (error) {
    console.error("🔥 Error removing item from cart:", error);
    res.status(500).json({ message: "Server error" });
  }
};