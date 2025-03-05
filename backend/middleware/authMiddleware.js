const jwt = require("jsonwebtoken");

exports.authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    console.error("❌ No token found in request headers");
    return res.status(401).json({ message: "Unauthorized - No Token" });
  }

  try {
    console.log("🔑 Received Token:", token);

    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;

    console.log("✅ Decoded Token:", verified); // Should contain userId & role
    next();
  } catch (err) {
    console.error("🔥 Token verification failed:", err.message);
    return res.status(403).json({ message: "Invalid token" });
  }
};

// ✅ Role-based Authorization Middleware
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      console.warn("🚫 Unauthorized Access - Required Role:", roles);
      return res.status(403).json({ message: "Unauthorized" });
    }
    next();
  };
};