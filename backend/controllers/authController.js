const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { sendVerificationEmail, sendPasswordResetEmail } = require('../utils/email');

// Generate JWT token
const generateToken = (userId, role) => {
    return jwt.sign({ userId, role }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// ✅ Signup (Ensures Password is Hashed Correctly)
exports.signup = async (req, res) => {
    const { username, email, password, confirmPassword, phone, role } = req.body;

    if (!username || !email || !password || !confirmPassword) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    if (password !== confirmPassword) {
        return res.status(400).json({ message: 'Passwords do not match' });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        console.log("🔑 Raw Password Before Hashing:", password);

        const newUser = new User({
            username,
            email,
            password,
            phone,
            role: role || 'Customer',
            isVerified: false
        });

        const verificationToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });

        newUser.verificationToken = verificationToken;
        newUser.verificationExpires = Date.now() + 3600000;
        await newUser.save();

        await sendVerificationEmail(email, verificationToken);
        res.status(201).json({ message: 'Signup successful. Please check your email for verification.' });

    } catch (error) {
        console.error('🔥 Signup error:', error);
        res.status(500).json({ message: 'Registration failed. Please try again.' });
    }
};

// ✅ Login (Debugging Password Hashing & Role Issues)
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            console.log("❌ User not found:", email);
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        console.log("✅ User found:", user.email);
        console.log("🔐 Stored Hashed Password:", user.password);
        console.log("🔑 Entered Password:", password);

        // ✅ Compare entered password with stored hash
        const isMatch = await bcrypt.compare(password, user.password);

        console.log("🔍 Password Match Result:", isMatch);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        if (!user.isVerified) {
            return res.status(403).json({ 
                message: 'Please verify your email address', 
                unverified: true, 
                email: user.email 
            });
        }

        console.log("✅ Role sent from backend:", user.role);

        const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ token, role: user.role });

    } catch (error) {
        console.error('🔥 Login error:', error);
        res.status(500).json({ message: 'Login failed. Please try again.' });
    }
};

// ✅ Verify Email
exports.verifyEmail = async (req, res) => {
    try {
        const { token } = req.params;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findOneAndUpdate(
            { email: decoded.email, verificationToken: token, verificationExpires: { $gt: Date.now() } },
            { isVerified: true, verificationToken: undefined, verificationExpires: undefined },
            { new: true }
        );

        if (!user) return res.status(400).json({ message: 'Invalid or expired verification token' });

        res.json({ message: 'Email verified successfully' });
    } catch (error) {
        console.error('Email verification error:', error);
        res.status(400).json({ message: 'Invalid or expired verification token' });
    }
};

// ✅ Resend Verification Email
exports.resendVerification = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) return res.status(200).json({ message: 'If the email exists, a verification email has been sent' });
        if (user.isVerified) return res.status(400).json({ message: 'Email is already verified' });

        const verificationToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });

        user.verificationToken = verificationToken;
        user.verificationExpires = Date.now() + 3600000;
        await user.save();

        await sendVerificationEmail(email, verificationToken);
        res.json({ message: 'Verification email resent successfully' });
    } catch (error) {
        console.error('Resend verification error:', error);
        res.status(500).json({ message: 'Failed to resend verification email' });
    }
};

// ✅ Forgot Password
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) return res.json({ message: 'If the email exists, a password reset link has been sent' });

        const resetToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 3600000;
        await user.save();

        await sendPasswordResetEmail(email, resetToken);
        res.json({ message: 'Password reset link sent successfully' });
    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({ message: 'Failed to process password reset request' });
    }
};

// ✅ Reset Password
exports.resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findOne({ _id: decoded.userId, resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } });

        if (!user) return res.status(400).json({ message: 'Invalid or expired reset token' });

        user.password = await bcrypt.hash(password, 10);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.json({ message: 'Password reset successfully' });
    } catch (error) {
        console.error('Password reset error:', error);
        res.status(400).json({ message: 'Invalid or expired reset token' });
    }
};

// ✅ Validate Token
exports.validateToken = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) return res.status(401).json({ valid: false });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        res.status(200).json({ valid: true, role: decoded.role });
    } catch (err) {
        res.status(401).json({ valid: false });
    }
};