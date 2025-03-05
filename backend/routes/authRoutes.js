const express = require("express");
const router = express.Router();
const { authenticate } = require("../middleware/authMiddleware");
const authController = require("../controllers/authController");

// Ensure these functions are correctly imported
if (!authController.getProfile || !authController.login || !authController.signup) {
    console.error("❌ Missing authController functions. Check your imports!");
}

// Define routes correctly
router.get("/profile", authenticate, authController.getProfile);
router.post("/login", authController.login);
router.post("/signup", authController.signup);
router.post("/resend-verification", authController.resendVerification);
router.get("/verify-email/:token", authController.verifyEmail);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password/:token", authController.resetPassword);

module.exports = router;