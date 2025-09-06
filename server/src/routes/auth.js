//user registration
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');

// @route POST /api/auth/register
router.post('/register', async (req, res) => {
    const { name, email, password, userType, phone, location } = req.body;

    // Basic validation
    if (!name || !email || !password || !phone || !location) {
        return res.status(400).json({ 
            msg: 'Please fill in all fields' 
        });
    }

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) 
            return res.status(400).json({ 
                msg: 'User already exists' 
            });

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            userType,
            phone,
            location
        });

        await newUser.save();
        res.status(201).json({ msg: 'User registered successfully', user: { name, email, userType } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error' });
    }
});



/**
 * @route POST /api/auth/login
 * @desc  Login user and return JWT
 */
router.post("/login", async (req, res) => {
  try {
    const { email, password} = req.body;
    console.log(email, password);

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid email or password" });

    
    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid email or password" });
    const role = user.userType; // Assuming userType is either 'admin' or 'user'
    console.log(role);
    // Create JWT token
    const token = jwt.sign(
      { id: user._id},
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Send response
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: role
      }
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});



module.exports = router;