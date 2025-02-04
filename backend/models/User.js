const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['Admin', 'Vendor', 'Customer'], 
    default: 'Customer'
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationToken: String,
  verificationExpires: Date,
  resetPasswordToken: String,
  resetPasswordExpires: Date
});

// ✅ Ensure password is hashed only once before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next(); // ✅ Prevent double hashing

  console.log("🔑 Raw Password Before Hashing:", this.password);
  this.password = await bcrypt.hash(this.password, 10);
  console.log("🔐 Hashed Password Before Saving:", this.password);

  next();
});

module.exports = mongoose.model('User', userSchema);