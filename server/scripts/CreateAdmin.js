const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../src/models/User');

async function createAdminUser(email, name = 'DOKO Administrator') {
  try {
    await mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost:27017/doko');
    console.log('✅ Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email });
    if (existingAdmin) {
      console.log(`⚠️ Admin user already exists with email: ${email}`);
      console.log(`   Role: ${existingAdmin.userType}`);
      return;
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash('tempadmin123', 12);
    
    const adminUser = new User({
      name: name,
      email: email,
      password: hashedPassword,
      phone: '9800000000',
      location: 'Dharan, Nepal',
      userType: 'admin',
      isVerified: true
    });

    await adminUser.save();
    console.log('✅ Admin user created successfully!');
    console.log(`📧 Email: ${email}`);
    console.log('🔑 Password: tempadmin123');
    console.log('⚠️  User must change password on first login');

  } catch (error) {
    console.error('❌ Error creating admin:', error.message);
  } finally {
    await mongoose.disconnect();
  }
}

// Get email from command line argument or use default
const userEmail = process.argv[2] || 'admin@doko.com';
const userName = process.argv[3] || 'DOKO Administrator';

createAdminUser(userEmail, userName);