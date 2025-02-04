// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Login route
router.post('/login', authController.login); // Make sure authController.login exists

// Registration route
router.post('/signup', authController.signup);

// Verification routes
router.post('/resend-verification', authController.resendVerification);
router.get('/verify-email/:token', authController.verifyEmail);

// Password reset routes
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password/:token', authController.resetPassword);

module.exports = router;