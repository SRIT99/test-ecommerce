const crypto = require('crypto');
const nodemailer = require('nodemailer');

// Generate random string
const generateRandomString = (length = 32) => {
  return crypto.randomBytes(length).toString('hex');
};

// Generate OTP (One-Time Password)
const generateOTP = (length = 6) => {
  const digits = '0123456789';
  let OTP = '';
  for (let i = 0; i < length; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }
  return OTP;
};

// Format currency
const formatCurrency = (amount, currency = 'NPR') => {
  return new Intl.NumberFormat('ne-NP', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

// Format date
const formatDate = (date, format = 'en-US') => {
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  return new Intl.DateTimeFormat(format, options).format(new Date(date));
};

// Calculate distance between two points (in km)
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c; // Distance in km
  return distance;
};

const deg2rad = (deg) => {
  return deg * (Math.PI/180);
};

// Validate email format
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate phone number (Nepali format)
const isValidPhone = (phone) => {
  const phoneRegex = /^(\+?977)?[9][6-9]\d{8}$/;
  return phoneRegex.test(phone);
};

// Sanitize input to prevent XSS
const sanitizeInput = (input) => {
  if (typeof input === 'string') {
    return input
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  }
  return input;
};

// Deep clone object
const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

// Debounce function
const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Throttle function
const throttle = (func, limit) => {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Pagination helper
const getPagination = (page, limit) => {
  const pageInt = parseInt(page) || 1;
  const limitInt = parseInt(limit) || 10;
  const skip = (pageInt - 1) * limitInt;
  
  return {
    page: pageInt,
    limit: limitInt,
    skip
  };
};

// Generate slug from text
const generateSlug = (text) => {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
};

// Email transporter configuration
const createTransporter = () => {
  return nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// Send email
const sendEmail = async (to, subject, html) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      html
    };
    
    const result = await transporter.sendMail(mailOptions);
    return result;
  } catch (error) {
    throw new Error(`Email sending failed: ${error.message}`);
  }
};

// Send OTP email
const sendOTPEmail = async (email, otp) => {
  const subject = 'Your DOKO Verification Code';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2D3748;">DOKO Marketplace</h2>
      <p>Your verification code is:</p>
      <div style="background: #F7FAFC; padding: 20px; text-align: center; margin: 20px 0;">
        <h1 style="color: #2D3748; margin: 0; font-size: 32px; letter-spacing: 5px;">${otp}</h1>
      </div>
      <p>This code will expire in 10 minutes.</p>
      <p style="color: #718096; font-size: 14px;">If you didn't request this code, please ignore this email.</p>
    </div>
  `;
  
  return sendEmail(email, subject, html);
};

// Send order confirmation email
const sendOrderConfirmationEmail = async (email, order) => {
  const subject = `Your DOKO Order #${order.orderId} Confirmation`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2D3748;">Order Confirmation</h2>
      <p>Thank you for your order! Your order has been confirmed and is being processed.</p>
      
      <div style="background: #F7FAFC; padding: 20px; margin: 20px 0;">
        <h3 style="color: #2D3748;">Order Details</h3>
        <p><strong>Order ID:</strong> ${order.orderId}</p>
        <p><strong>Total Amount:</strong> ${formatCurrency(order.totalAmount)}</p>
        <p><strong>Estimated Delivery:</strong> ${formatDate(order.estimatedDelivery)}</p>
      </div>
      
      <p>We'll notify you when your order ships.</p>
    </div>
  `;
  
  return sendEmail(email, subject, html);
};

// Calculate average rating
const calculateAverageRating = (ratings) => {
  if (!ratings || ratings.length === 0) return 0;
  
  const sum = ratings.reduce((total, rating) => total + rating, 0);
  return (sum / ratings.length).toFixed(1);
};

// Generate order summary
const generateOrderSummary = (products) => {
  return products.map(product => ({
    name: product.name,
    quantity: product.quantity,
    price: product.price,
    total: product.quantity * product.price
  }));
};

module.exports = {
  generateRandomString,
  generateOTP,
  formatCurrency,
  formatDate,
  calculateDistance,
  isValidEmail,
  isValidPhone,
  sanitizeInput,
  deepClone,
  debounce,
  throttle,
  getPagination,
  generateSlug,
  sendEmail,
  sendOTPEmail,
  sendOrderConfirmationEmail,
  calculateAverageRating,
  generateOrderSummary
};