const nodemailer = require('nodemailer');

// Create transporter
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// 📨 **Send Verification Email**
const sendVerificationEmail = async (email, token) => {
  const verificationUrl = `${process.env.CLIENT_URL}/verify-email/${token}`;

  await transporter.sendMail({
    from: `"SMaLoB Support" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Verify Your Email - SMaLoB',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border-radius: 8px; background: #fff; border: 1px solid #ddd; box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);">
        <div style="text-align: center;">
          <img src="https://yourdomain.com/logo.png" alt="SMaLoB Logo" style="max-width: 120px; margin-bottom: 20px;" />
          <h2 style="color: #FF5A4E;">Welcome to SMaLoB!</h2>
          <p style="color: #333;">Thank you for signing up. Please verify your email address to activate your account.</p>
        </div>
        <div style="text-align: center; margin: 20px 0;">
          <a href="${verificationUrl}" 
             style="display: inline-block; padding: 12px 24px; font-size: 16px; font-weight: bold; color: #fff; background: #FF5A4E; text-decoration: none; border-radius: 5px;">
            Verify My Email
          </a>
        </div>
        <p style="color: #666; text-align: center;">This link will expire in 1 hour. If you did not sign up, please ignore this email.</p>
        <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">
        <p style="text-align: center; font-size: 14px; color: #888;">Need help? Contact us at <a href="mailto:support@smalob.com" style="color: #FF5A4E;">support@smalob.com</a></p>
      </div>
    `
  });
};

// 🔒 **Send Password Reset Email**
const sendPasswordResetEmail = async (email, token) => {
  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${token}`;

  try {
      await transporter.sendMail({
          from: `"SMaLoB Support" <${process.env.EMAIL_USER}>`,
          to: email,
          subject: 'Reset Your Password - SMaLoB',
          html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border-radius: 8px; background: #fff; border: 1px solid #ddd; box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);">
                <div style="text-align: center;">
                  <img src="https://yourdomain.com/logo.png" alt="SMaLoB Logo" style="max-width: 120px; margin-bottom: 20px;" />
                  <h2 style="color: #FF5A4E;">Reset Your Password</h2>
                  <p style="color: #333;">Forgot your password? No worries! Click the button below to set a new one.</p>
                </div>
                <div style="text-align: center; margin: 20px 0;">
                  <a href="${resetUrl}" 
                     style="display: inline-block; padding: 12px 24px; font-size: 16px; font-weight: bold; color: #fff; background: #FF5A4E; text-decoration: none; border-radius: 5px;">
                    Reset Password
                  </a>
                </div>
                <p style="color: #666; text-align: center;">This link will expire in 1 hour. If you did not request this, please ignore this email.</p>
                <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">
                <p style="text-align: center; font-size: 14px; color: #888;">Need help? Contact us at <a href="mailto:support@smalob.com" style="color: #FF5A4E;">support@smalob.com</a></p>
              </div>
          `
      });

      console.log("✅ Password reset email sent to:", email);
  } catch (error) {
      console.error("❌ Error sending password reset email:", error);
  }
};

module.exports = { sendVerificationEmail, sendPasswordResetEmail };