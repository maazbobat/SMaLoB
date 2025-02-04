// server/utils/email.js
const nodemailer = require('nodemailer');


// Create transporter
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });

// Verification email template
const sendVerificationEmail = async (email, token) => {
    const verificationUrl = `${process.env.CLIENT_URL}/verify-email/${token}`;

  await transporter.sendMail({
    from: `"SMaLoB Support" <${process.env.EMAIL_FROM}>`,
    to: email,
    subject: 'Verify Your Email Address',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #FF5A4E;">Welcome to SMaLoB!</h2>
        <p>Please click the button below to verify your email address:</p>
        <a href="${process.env.CLIENT_URL}/verify-email/${token}" 
           style="display: inline-block; padding: 12px 24px; 
                  background-color: #FF5A4E; color: white; 
                  text-decoration: none; border-radius: 4px;">
          Verify Email
        </a>
        <p style="margin-top: 20px; color: #666;">
          This link will expire in 1 hour.<br>
          If you didn't request this, please ignore this email.
        </p>
      </div>
    `
  });
};

// Password reset email template
const sendPasswordResetEmail = async (email, token) => {
  // Similar structure to verification email
};

module.exports = { sendVerificationEmail, sendPasswordResetEmail };