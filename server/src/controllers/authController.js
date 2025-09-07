const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/env');
const User = require('../models/User');

exports.signup = async (req, res) => {
  const { name, email, password, phone, location, userType } = req.body;
  if (!name || !email || !password || !phone || !location) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  const exists = await User.findOne({ email });
  if (exists) return res.status(409).json({ error: 'Email already in use' });
  const hash = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hash, phone, location, userType });
  res.status(201).json({ id: user._id, email: user.email, role: user.userType });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
  const token = jwt.sign({ id: user._id, role: user.userType }, jwtSecret, { expiresIn: '7d' });
  res.json({ token, user: { id: user._id, name: user.name, role: user.userType } });
};
