const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

exports.sendVerificationEmail = async (email, token) => {
  const verificationUrl = `${process.env.BASE_URL}/verify-email/${token}`;
  
  await transporter.sendMail({
    to: email,
    subject: 'Verify Your Email',
    html: `Click <a href="${verificationUrl}">here</a> to verify your email address.`
  });
};

exports.sendPasswordResetEmail = async (email, token) => {
  const resetUrl = `${process.env.BASE_URL}/reset-password/${token}`;
  
  await transporter.sendMail({
    to: email,
    subject: 'Password Reset Request',
    html: `Click <a href="${resetUrl}">here</a> to reset your password.`
  });
};