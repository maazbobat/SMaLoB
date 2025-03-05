const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { sendVerificationEmail, sendPasswordResetEmail } = require('../utils/email');
const Vendor = require('../models/Vendor');

// Generate JWT token
const generateToken = (user) => {
    return jwt.sign(
        { userId: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );
};

exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });

        res.json(user);
    } catch (error) {
        console.error("🔥 Error fetching profile:", error);
        res.status(500).json({ message: "Server error" });
    }
};


// ✅ Signup (Ensures Password is Hashed Correctly)
exports.signup = async (req, res) => {
    try {
        const { username, name, email, password, confirmPassword, phone, role } = req.body;

        if (!username || !name || !email || !password || !confirmPassword) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ message: 'Passwords do not match' });
        }

        // Check if the user or vendor already exists
        const existingUser = await User.findOne({ email });
        const existingVendor = await Vendor.findOne({ email });

        if (existingUser || existingVendor) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        let newUser;

        if (role === "Vendor") {
            newUser = new Vendor({
                username,
                name,
                email,
                password,
                phone,
                role,
                isVerified: false
            });
        } else {
            newUser = new User({
                username,
                email,
                password,
                phone,
                role: role || 'Customer',
                isVerified: false
            });
        }

        // Generate verification token
        const verificationToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "1h" });

        newUser.verificationToken = verificationToken;
        newUser.verificationExpires = Date.now() + 3600000;
        await newUser.save();

        // Send verification email
        await sendVerificationEmail(email, verificationToken);

        res.status(201).json({ message: 'Signup successful. Please check your email for verification.' });

    } catch (error) {
        console.error("🔥 Signup Error:", error); // ✅ Log the actual error
        res.status(500).json({ message: 'Registration failed. Please try again.', error: error.message });
    }
};

// ✅ Login (Debugging Password Hashing & Role Issues)
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log("📩 Received login request for:", email);

        // ✅ Try finding the user in both collections
        let account = await User.findOne({ email }).select("+password") ||
                      await Vendor.findOne({ email }).select("+password");

        if (!account) {
            console.warn("❌ No user/vendor found with email:", email);
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // ✅ Check if the password is correct
        const isMatch = await bcrypt.compare(password, account.password);
        if (!isMatch) {
            console.warn("❌ Incorrect password for:", email);
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // ✅ Ensure the account is verified
        if (!account.isVerified) {
            console.warn("⚠️ Email not verified:", email);
            return res.status(403).json({ message: "Verify your email first" });
        }

        // ✅ Generate JWT Token
        const token = jwt.sign(
            { userId: account._id, role: account.role },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        console.log("✅ Login successful for:", email);
        res.json({ token, role: account.role, name: account.username || account.name });

    } catch (error) {
        console.error("🔥 Login error:", error);
        res.status(500).json({ message: "Login failed. Please try again." });
    }
};

// ✅ Verify Email
exports.verifyEmail = async (req, res) => {
    try {
        const { token } = req.params;

        if (!token) return res.status(400).json({ message: "Token is required" });

        // ✅ Decode the JWT token
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            console.error("❌ Token verification failed:", err.message);
            return res.status(400).json({ message: "Invalid or expired verification token" });
        }

        // ✅ Try finding the user or vendor by email
        let account = await User.findOne({ email: decoded.email }) || 
                      await Vendor.findOne({ email: decoded.email });

        if (!account) {
            console.error("❌ User/Vendor not found with email:", decoded.email);
            return res.status(404).json({ message: "User not found" });
        }

        // ✅ Check if already verified
        if (account.isVerified) {
            return res.status(400).json({ message: "Email is already verified" });
        }

        // ✅ Verify and save changes
        account.isVerified = true;
        account.verificationToken = undefined;
        account.verificationExpires = undefined;
        await account.save();

        console.log("✅ Email verified successfully for:", decoded.email);
        res.json({ message: "Email verified successfully. You can now log in." });

    } catch (error) {
        console.error("🔥 Email verification error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// ✅ Resend Verification Email
exports.resendVerification = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) return res.status(200).json({ message: "If the email exists, a verification email has been sent" });
        if (user.isVerified) return res.status(400).json({ message: "Email is already verified" });

        // ✅ Generate new verification token
        const verificationToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "1h" });

        user.verificationToken = verificationToken;
        user.verificationExpires = Date.now() + 3600000; // 1 hour expiration
        await user.save();

        // ✅ Send new verification email
        await sendVerificationEmail(email, verificationToken);
        res.json({ message: "Verification email resent successfully" });
    } catch (error) {
        console.error("❌ Resend verification error:", error);
        res.status(500).json({ message: "Failed to resend verification email" });
    }
};

// ✅ Forgot Password
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.json({ message: 'If the email exists, a password reset link has been sent' });
        }

        // Generate a secure token
        const resetToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Save token to database
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour expiration
        await user.save();

        // Send password reset email
        await sendPasswordResetEmail(user.email, resetToken);

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

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({ _id: decoded.userId, resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired reset token' });
        }

        // Hash new password
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