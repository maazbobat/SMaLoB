const Order = require("../models/Order");
const Product = require("../models/Product");
const { io } = require("../server"); // Import Socket.io for real-time updates

// ✅ Place a New Order
exports.placeOrder = async (req, res) => {
  try {
    const { items } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No items in order" });
    }

    let totalPrice = 0;
    const orderItems = [];

    for (let item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ message: `Product not found: ${item.product}` });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({ message: `Not enough stock for ${product.name}` });
      }

      orderItems.push({
        product: product._id,
        quantity: item.quantity,
        price: product.price * item.quantity
      });

      totalPrice += product.price * item.quantity;

      // Reduce stock
      product.stock -= item.quantity;
      await product.save();
    }

    const order = new Order({
      customer: req.user.userId,
      items: orderItems,
      totalPrice,
      status: "Pending",
    });

    await order.save();
    io.emit("orderUpdated", order); // Notify clients in real-time

    res.status(201).json({ message: "✅ Order placed successfully", order });
  } catch (error) {
    console.error("🔥 Error placing order:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Update Order Status
exports.updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );

    io.emit("orderUpdated", order); // Notify clients in real-time
    res.json(order);
  } catch (error) {
    console.error("🔥 Error updating order:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Get All Orders for a Customer
exports.getCustomerOrders = async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.user.userId }).populate("items.product");
    res.json(orders);
  } catch (error) {
    console.error("🔥 Error fetching orders:", error);
    res.status(500).json({ message: "Server error" });
  }
};