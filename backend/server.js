require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const http = require('http');
const { Server } = require("socket.io");
const setupWebSocket = require('./WebSocket');


// Import Routes
const authRoutes = require('./routes/authRoutes');
const vendorRoutes = require("./routes/vendorRoutes");
const adminRoutes = require("./routes/adminRoutes");
const orderRoutes = require("./routes/orderRoutes"); 
const wishlistRoutes = require("./routes/wishlistRoutes");
const checkoutRoutes = require("./routes/checkoutRoutes");
const uploadRoutes = require("./routes/uploadRoutes");

const { authenticate } = require('./middleware/authMiddleware');

const app = express();
const path = require('path');
const PORT = process.env.PORT || 3001; // Default to 3001 if PORT is undefined
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`🔗 User Connected: ${socket.id}`);

  socket.on("disconnect", () => {
    console.log("❌ User Disconnected");
  });
});
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// Middleware
app.use(cors({ origin: process.env.BASE_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Cache Control Middleware
app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
});

// Database Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.error('❌ MongoDB Connection Error:', err));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/customers', require('./routes/customerRoutes'));
app.use('/api/vendors', vendorRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/products', require("./routes/productRoutes"));
app.use("/api/cart", require("./routes/cartRoutes"));
app.use('/api/orders', orderRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/checkout', checkoutRoutes);
app.use("/api/vendors", require("./routes/vendorRoutes"));
app.use('/api/upload', uploadRoutes);

app._router.stack.forEach((r) => {
  if (r.route && r.route.path) {
    console.log(`✅ Registered Route: ${r.route.path}`);
  }
});

app.get('/api/data', (req, res) => res.json({ message: 'Hello from API' }));

// Protected Route Example
app.get('/api/protected', authenticate, (req, res) => {
  res.json({ message: 'Protected route accessed successfully', user: req.user });
});

// Health Check Endpoint
app.get('/health', (req, res) => res.status(200).json({ status: 'OK' }));

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('🔥 Server Error:', err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

// 404 Not Found Handler
app.use((req, res) => res.status(404).json({ message: 'Route not found' }));

// Start Server
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));