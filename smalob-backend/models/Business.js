const mongoose = require('mongoose');

const BusinessSchema = new mongoose.Schema({
  name: String,
  category: String,
  description: String,
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Business', BusinessSchema);