const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: String,
  price: Number,
  business: { type: mongoose.Schema.Types.ObjectId, ref: 'Business' }
});

module.exports = mongoose.model('Product', ProductSchema);