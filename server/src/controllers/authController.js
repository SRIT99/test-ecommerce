const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/env');
const User = require('../models/User');

exports.signup = async (req, res) => {
  try {
    const { name, email, password, phone, location, userType } = req.body;
    
    console.log('Signup request received:', { name, email, phone, location, userType });
    
    // Validation
    if (!name || !email || !password || !phone || !location) {
      return res.status(400).json({ error: 'Missing required fields' });
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