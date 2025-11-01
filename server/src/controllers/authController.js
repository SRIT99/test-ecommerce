// controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { jwtSecret, clientURL } = require('../config/env');
const User = require('../models/User');
const PasswordReset = require('../models/PasswordReset');
const { sendEmail } = require('../services/emailService');

exports.signup = async (req, res) => {
  try {
    const { name, email, password, phone, location, userType } = req.body;
    
    console.log('Signup request received:', { name, email, phone, location, userType });
    
    // Validation
    if (!name || !email || !password || !phone || !location) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Enhanced email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Check if user already exists
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(409).json({ error: 'Email already in use' });
    }

    // Hash password
    const hash = await bcrypt.hash(password, 10);
    
    // Create user
    const user = await User.create({ 
      name, 
      email, 
      password: hash, 
      phone, 
      location, 
      userType: userType || 'buyer' 
    });

    console.log('User created successfully:', user._id);

    // Generate token
    const token = jwt.sign(
      { id: user._id, role: user.userType },
      jwtSecret, 
      { expiresIn: '7d' }
    );

    res.status(201).json({ 
      token,
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email, 
        role: user.userType 
      } 
    });

  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Internal server error during signup' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    console.log('Login attempt for:', email);

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user._id, role: user.userType },
      jwtSecret, 
      { expiresIn: '7d' }
    );

    console.log('Login successful for:', email);

    res.json({ 
      token, 
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email, 
        role: user.userType 
      } 
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error during login' });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    console.log('🔐 Forgot password request for:', email);

    // Validation
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Please provide a valid email address' });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      // Return success for security (don't reveal if email exists)
      console.log('📭 User not found, but returning success for security');
      return res.json({ 
        success: true,
        message: 'If an account with that email exists, a password reset link has been sent.' 
      });
    }

    console.log('👤 User found:', user.name);

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');

    // Set token expiry (1 hour)
    const resetTokenExpiry = Date.now() + 60 * 60 * 1000;

    // Save reset token to database
    await PasswordReset.findOneAndUpdate(
      { email },
      { 
        email,
        token: resetTokenHash,
        expiresAt: new Date(resetTokenExpiry)
      },
      { upsert: true, new: true }
    );

    // Create reset URL
    const clientURL = process.env.FRONTEND_URL || 'http://localhost:5173';
    const resetURL = `${clientURL}/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`;

    console.log('🔗 Reset URL generated');

    // Email content
    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { text-align: center; background: #059669; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
          .button { display: inline-block; background: #059669; color: white; padding: 12px 30px; 
                   text-decoration: none; border-radius: 6px; font-weight: bold; }
          .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb; 
                   color: #6b7280; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>DOKO</h1>
            <p>Agricultural Marketplace</p>
          </div>
          <div class="content">
            <h2>Password Reset Request</h2>
            <p>Hello <strong>${user.name}</strong>,</p>
            <p>You recently requested to reset your password for your DOKO account. Click the button below to reset it:</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetURL}" class="button">Reset Your Password</a>
            </div>
            
            <p style="color: #6b7280; font-size: 14px;">
              <strong>This link will expire in 1 hour.</strong><br>
              If you didn't request this reset, please ignore this email. Your password will remain unchanged.
            </p>
            
            <div class="footer">
              <p>If you're having trouble clicking the button, copy and paste this URL into your browser:</p>
              <p><a href="${resetURL}" style="color: #059669; word-break: break-all;">${resetURL}</a></p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    // Send email
    try {
      console.log('📧 Sending reset email...');
      await sendEmail({
        to: email,
        subject: 'Reset Your DOKO Password',
        html: emailHtml
      });

      console.log('✅ Password reset email sent successfully to:', email);

      res.json({ 
        success: true,
        message: 'If an account with that email exists, a password reset link has been sent.' 
      });

    } catch (emailError) {
      console.error('❌ Email sending failed:', emailError.message);
      
      // Still provide the reset token in development for testing
      if (process.env.NODE_ENV !== 'production') {
        console.log('🔐 [DEV MODE] Reset token for testing:', resetToken);
        console.log('🔐 [DEV MODE] Reset URL:', resetURL);
        
        return res.json({ 
          success: false,
          error: 'Email service temporarily unavailable. Please try again later.',
          dev_info: {
            message: 'In production, this would send an actual email',
            reset_token: resetToken,
            reset_url: resetURL
          }
        });
      }
      
      return res.status(500).json({ 
        error: 'Failed to send reset email. Please try again later.' 
      });
    }

  } catch (error) {
    console.error('❌ Forgot password error:', error);
    res.status(500).json({ 
      error: 'An unexpected error occurred. Please try again.' 
    });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token, email, newPassword } = req.body;

    console.log('🔐 Reset password request for:', email);

    // Validation
    if (!token || !email || !newPassword) {
      return res.status(400).json({ error: 'Token, email, and new password are required' });
    }

    // Password strength validation
    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    // Hash the token to compare with stored hash
    const resetTokenHash = crypto.createHash('sha256').update(token).digest('hex');

    // Find the reset token
    const resetRequest = await PasswordReset.findOne({
      email,
      token: resetTokenHash,
      expiresAt: { $gt: new Date() }
    });

    if (!resetRequest) {
      return res.status(400).json({ 
        error: 'Invalid or expired reset token. Please request a new password reset.' 
      });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if new password is same as old password
    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      return res.status(400).json({ 
        error: 'New password cannot be the same as your current password' 
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user password
    user.password = hashedPassword;
    await user.save();

    // Delete used reset token
    await PasswordReset.deleteOne({ email });

    // Send confirmation email
    try {
      await sendEmail({
        to: email,
        subject: 'DOKO - Password Reset Successful',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #059669;">Password Reset Successful</h2>
            <p>Hello ${user.name},</p>
            <p>Your DOKO account password has been successfully reset.</p>
            <p>If you did not make this change, please contact our support team immediately.</p>
            <br>
            <p>Best regards,<br>The DOKO Team</p>
          </div>
        `
      });
    } catch (emailError) {
      console.error('Confirmation email failed:', emailError);
      // Don't fail the reset if email fails
    }

    console.log('✅ Password reset successful for:', email);

    res.json({ 
      success: true,
      message: 'Password reset successfully. You can now login with your new password.' 
    });

  } catch (error) {
    console.error('❌ Reset password error:', error);
    res.status(500).json({ error: 'Internal server error during password reset' });
  }
};

exports.validateResetToken = async (req, res) => {
  try {
    const { token, email } = req.body;

    console.log('🔐 Validating reset token for:', email);

    // Validation
    if (!token || !email) {
      return res.status(400).json({ 
        success: false,
        error: 'Token and email are required' 
      });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        success: false,
        error: 'Please provide a valid email address' 
      });
    }

    // Hash the token to compare with stored hash
    const resetTokenHash = crypto.createHash('sha256').update(token).digest('hex');

    // Find the reset token
    const resetRequest = await PasswordReset.findOne({
      email: email.toLowerCase().trim(),
      token: resetTokenHash,
      expiresAt: { $gt: new Date() }
    });

    if (!resetRequest) {
      console.log('❌ Invalid or expired token for:', email);
      return res.status(400).json({ 
        success: false,
        error: 'Invalid or expired reset token. Please request a new password reset.' 
      });
    }

    // Check if token expires soon (less than 5 minutes)
    const expiresIn = resetRequest.expiresAt - new Date();
    const expiresSoon = expiresIn < 5 * 60 * 1000; // 5 minutes

    console.log('✅ Token validated successfully for:', email);
    
    res.json({ 
      success: true,
      valid: true,
      message: 'Token is valid',
      expiresSoon: expiresSoon,
      expiresAt: resetRequest.expiresAt
    });

  } catch (error) {
    console.error('❌ Validate token error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Internal server error during token validation' 
    });
  }
};