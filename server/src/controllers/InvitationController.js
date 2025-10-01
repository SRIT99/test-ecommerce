const crypto = require('crypto');
const Invitation = require('../models/Invitation');
const User = require('../models/User');
const { sendEmail } = require('../services/emailService'); // You'll need to implement this

exports.createInvitation = async (req, res) => {
  try {
    const { email, role = 'admin' } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists with this email' });
    }

    // Check if invitation already exists and is valid
    const existingInvitation = await Invitation.findOne({ 
      email, 
      used: false,
      expiresAt: { $gt: new Date() }
    });
    
    if (existingInvitation) {
      return res.status(400).json({ error: 'Active invitation already exists for this email' });
    }

    // Create invitation token
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    const invitation = await Invitation.create({
      email,
      role,
      token,
      expiresAt,
      invitedBy: req.user._id
    });

    // Send invitation email (implement this based on your email service)
    await sendInvitationEmail(email, token, role);

    res.status(201).json({ 
      message: 'Invitation sent successfully',
      invitation: { email, role, expiresAt }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create invitation' });
  }
};

exports.acceptInvitation = async (req, res) => {
  try {
    const { token } = req.params;
    const { name, password, phone, location } = req.body;

    const invitation = await Invitation.findOne({ 
      token, 
      used: false,
      expiresAt: { $gt: new Date() }
    });

    if (!invitation) {
      return res.status(400).json({ error: 'Invalid or expired invitation' });
    }

    // Create the user
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email: invitation.email,
      password: hashedPassword,
      phone,
      location,
      userType: invitation.role,
      isVerified: true
    });

    // Mark invitation as used
    invitation.used = true;
    await invitation.save();

    res.status(201).json({ 
      message: 'Account created successfully',
      user: { id: user._id, email: user.email, role: user.userType }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to accept invitation' });
  }
};