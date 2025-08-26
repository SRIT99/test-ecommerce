const nodemailer = require('nodemailer');
const { formatCurrency, formatDate } = require('./helpers');

// Create email transporter
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },
    tls: {
      rejectUnauthorized: false
    }
  });
};

// Verify email configuration
const verifyEmailConfig = async () => {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    console.log('Email server is ready to send messages');
    return true;
  } catch (error) {
    console.error('Email configuration error:', error);
    return false;
  }
};

// Send email function
const sendEmail = async (emailOptions) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: {
        name: process.env.EMAIL_FROM_NAME || 'DOKO Marketplace',
        address: process.env.EMAIL_USER
      },
      ...emailOptions
    };
    
    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', result.messageId);
    return result;
  } catch (error) {
    console.error('Email sending failed:', error);
    throw new Error(`Email sending failed: ${error.message}`);
  }
};

// Send OTP email
const sendOTPEmail = async (email, otp, name = 'User') => {
  const subject = 'Your DOKO Verification Code';
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #4CAF50; color: white; padding: 20px; text-align: center; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 5px; }
        .otp-code { 
          background: #4CAF50; 
          color: white; 
          padding: 15px; 
          font-size: 32px; 
          font-weight: bold; 
          text-align: center; 
          letter-spacing: 5px;
          margin: 20px 0;
          border-radius: 5px;
        }
        .footer { 
          text-align: center; 
          margin-top: 20px; 
          color: #666; 
          font-size: 12px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>DOKO Marketplace</h1>
        </div>
        <div class="content">
          <h2>Hello ${name},</h2>
          <p>Your verification code for DOKO Marketplace is:</p>
          <div class="otp-code">${otp}</div>
          <p>This code will expire in 10 minutes. Please do not share it with anyone.</p>
          <p>If you didn't request this code, please ignore this email.</p>
        </div>
        <div class="footer">
          <p>&copy; 2024 DOKO Marketplace. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
  
  return sendEmail({
    to: email,
    subject,
    html
  });
};

// Send order confirmation email
const sendOrderConfirmationEmail = async (email, order, user) => {
  const subject = `Your DOKO Order #${order.orderId} Confirmation`;
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #4CAF50; color: white; padding: 20px; text-align: center; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 5px; }
        .order-details { margin: 20px 0; }
        .product-item { padding: 10px; border-bottom: 1px solid #ddd; }
        .total { font-weight: bold; font-size: 18px; margin-top: 20px; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Order Confirmation</h1>
        </div>
        <div class="content">
          <h2>Thank you for your order, ${user.name}!</h2>
          <p>Your order has been confirmed and is being processed.</p>
          
          <div class="order-details">
            <h3>Order Details</h3>
            <p><strong>Order ID:</strong> ${order.orderId}</p>
            <p><strong>Order Date:</strong> ${formatDate(order.createdAt)}</p>
            <p><strong>Total Amount:</strong> ${formatCurrency(order.totalAmount)}</p>
            <p><strong>Estimated Delivery:</strong> ${formatDate(order.estimatedDelivery)}</p>
          </div>
          
          <p>We'll notify you when your order ships. You can track your order status from your dashboard.</p>
          
          <p>Thank you for shopping with DOKO Marketplace!</p>
        </div>
        <div class="footer">
          <p>&copy; 2024 DOKO Marketplace. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
  
  return sendEmail({
    to: email,
    subject,
    html
  });
};

// Send payment confirmation email
const sendPaymentConfirmationEmail = async (email, transaction, user) => {
  const subject = `Payment Confirmation for Order #${transaction.order.orderId}`;
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #4CAF50; color: white; padding: 20px; text-align: center; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 5px; }
        .payment-details { margin: 20px 0; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Payment Confirmation</h1>
        </div>
        <div class="content">
          <h2>Hello ${user.name},</h2>
          <p>Your payment has been successfully processed.</p>
          
          <div class="payment-details">
            <h3>Payment Details</h3>
            <p><strong>Transaction ID:</strong> ${transaction.transactionId}</p>
            <p><strong>Amount:</strong> ${formatCurrency(transaction.amount)}</p>
            <p><strong>Payment Method:</strong> ${transaction.paymentMethod}</p>
            <p><strong>Payment Date:</strong> ${formatDate(transaction.updatedAt)}</p>
            <p><strong>Status:</strong> Completed</p>
          </div>
          
          <p>Thank you for your payment. Your order is now being processed.</p>
        </div>
        <div class="footer">
          <p>&copy; 2024 DOKO Marketplace. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
  
  return sendEmail({
    to: email,
    subject,
    html
  });
};

// Send order status update email
const sendOrderStatusEmail = async (email, order, user, status) => {
  const statusMessages = {
    confirmed: 'has been confirmed',
    processing: 'is being processed',
    shipped: 'has been shipped',
    delivered: 'has been delivered',
    cancelled: 'has been cancelled'
  };
  
  const subject = `Order #${order.orderId} ${statusMessages[status]}`;
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #4CAF50; color: white; padding: 20px; text-align: center; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 5px; }
        .status-update { margin: 20px 0; padding: 15px; background: #e8f5e8; border-radius: 5px; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Order Update</h1>
        </div>
        <div class="content">
          <h2>Hello ${user.name},</h2>
          
          <div class="status-update">
            <h3>Your order #${order.orderId} ${statusMessages[status]}.</h3>
            ${status === 'shipped' ? `<p>Estimated delivery: ${formatDate(order.estimatedDelivery)}</p>` : ''}
            ${status === 'delivered' ? `<p>Delivered on: ${formatDate(order.actualDelivery)}</p>` : ''}
          </div>
          
          <p>You can view your order details and track its progress from your dashboard.</p>
          
          ${status === 'delivered' ? `
          <p>We hope you enjoy your products! Please consider leaving a review to help other customers.</p>
          ` : ''}
        </div>
        <div class="footer">
          <p>&copy; 2024 DOKO Marketplace. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
  
  return sendEmail({
    to: email,
    subject,
    html
  });
};

// Send password reset email
const sendPasswordResetEmail = async (email, resetToken, user) => {
  const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;
  const subject = 'Password Reset Request - DOKO Marketplace';
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #4CAF50; color: white; padding: 20px; text-align: center; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 5px; }
        .reset-button { 
          display: inline-block; 
          padding: 12px 24px; 
          background: #4CAF50; 
          color: white; 
          text-decoration: none; 
          border-radius: 5px; 
          margin: 20px 0; 
        }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Password Reset</h1>
        </div>
        <div class="content">
          <h2>Hello ${user.name},</h2>
          <p>You requested to reset your password for your DOKO Marketplace account.</p>
          
          <p>Click the button below to reset your password:</p>
          
          <a href="${resetUrl}" class="reset-button">Reset Password</a>
          
          <p>This link will expire in 10 minutes. If you didn't request a password reset, please ignore this email.</p>
          
          <p>Alternatively, you can copy and paste this link in your browser:</p>
          <p>${resetUrl}</p>
        </div>
        <div class="footer">
          <p>&copy; 2024 DOKO Marketplace. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
  
  return sendEmail({
    to: email,
    subject,
    html
  });
};

// Send welcome email to new users
const sendWelcomeEmail = async (email, user) => {
  const subject = 'Welcome to DOKO Marketplace!';
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #4CAF50; color: white; padding: 20px; text-align: center; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 5px; }
        .welcome-features { margin: 20px 0; }
        .feature { margin: 10px 0; padding: 10px; background: #e8f5e8; border-radius: 3px; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Welcome to DOKO Marketplace!</h1>
        </div>
        <div class="content">
          <h2>Hello ${user.name},</h2>
          <p>Thank you for joining DOKO Marketplace - Nepal's premier agricultural marketplace!</p>
          
          <div class="welcome-features">
            <h3>What you can do:</h3>
            <div class="feature">
              <strong>🏪 Buy Fresh Produce</strong> - Connect directly with local farmers
            </div>
            <div class="feature">
              <strong>👨‍🌾 Sell Your Products</strong> - Reach customers across Nepal
            </div>
            <div class="feature">
              <strong>🚚 Fast Delivery</strong> - Reliable transportation network
            </div>
            <div class="feature">
              <strong>💳 Secure Payments</strong> - Multiple payment options
            </div>
          </div>
          
          <p>Get started by browsing products or setting up your seller profile!</p>
          
          <p>Happy trading!<br>The DOKO Team</p>
        </div>
        <div class="footer">
          <p>&copy; 2024 DOKO Marketplace. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
  
  return sendEmail({
    to: email,
    subject,
    html
  });
};

// Send admin notification email
const sendAdminNotification = async (subject, message, type = 'info') => {
  const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_USER;
  
  if (!adminEmail) {
    console.warn('Admin email not configured');
    return null;
  }
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { 
          background: ${type === 'error' ? '#f44336' : type === 'warning' ? '#ff9800' : '#4CAF50'}; 
          color: white; 
          padding: 20px; 
          text-align: center; 
        }
        .content { background: #f9f9f9; padding: 30px; border-radius: 5px; }
        .notification { margin: 20px 0; padding: 15px; background: #fff; border-radius: 5px; border-left: 4px solid #4CAF50; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Admin Notification</h1>
        </div>
        <div class="content">
          <h2>${subject}</h2>
          
          <div class="notification">
            <p>${message}</p>
            <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
            <p><strong>Type:</strong> ${type.toUpperCase()}</p>
          </div>
          
          <p>This is an automated notification from the DOKO Marketplace system.</p>
        </div>
        <div class="footer">
          <p>&copy; 2024 DOKO Marketplace. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
  
  return sendEmail({
    to: adminEmail,
    subject: `[ADMIN] ${subject}`,
    html
  });
};

module.exports = {
  sendEmail,
  sendOTPEmail,
  sendOrderConfirmationEmail,
  sendPaymentConfirmationEmail,
  sendOrderStatusEmail,
  sendPasswordResetEmail,
  sendWelcomeEmail,
  sendAdminNotification,
  verifyEmailConfig
};