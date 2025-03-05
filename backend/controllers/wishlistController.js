const Wishlist = require("../models/Wishlist");

// ✅ Get Customer Wishlist
exports.getWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user.userId }).populate("items.product");
    res.json(wishlist || { items: [] });
  } catch (error) {
    console.error("🔥 Error fetching wishlist:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Add to Wishlist
exports.addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    let wishlist = await Wishlist.findOne({ user: req.user.userId });

    if (!wishlist) {
      wishlist = new Wishlist({ user: req.user.userId, items: [] });
    }

    if (!wishlist.items.some((item) => item.product.toString() === productId)) {
      wishlist.items.push({ product: productId });
    }

    await wishlist.save();
    res.json({ message: "Item added to wishlist", wishlist });
  } catch (error) {
    console.error("🔥 Error adding to wishlist:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Remove from Wishlist
exports.removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;
    const wishlist = await Wishlist.findOneAndUpdate(
      { user: req.user.userId },
      { $pull: { items: { product: productId } } },
      { new: true }
    );

    res.json({ message: "Item removed from wishlist", wishlist });
  } catch (error) {
    console.error("🔥 Error removing from wishlist:", error);
    res.status(500).json({ message: "Server error" });
  }
};