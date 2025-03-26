const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  items: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
    },
  ],

  totalPrice: { type: Number, required: true },

  customerInfo: {
    fullName: { type: String },
    email: { type: String },
    phone: { type: String },
    address: { type: String },
    postalCode: { type: String },
  },

  status: {
    type: String,
    enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
    default: "Pending",
  },

  

  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Order", orderSchema);