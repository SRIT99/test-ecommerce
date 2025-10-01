const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path:process.env.MONGO_URI }); // Adjust path if needed

const User = require('../src/models/User');

async function createSuperAdmin() {
  try {
    console.log('🔗 Attempting to connect to MongoDB...');
    console.log('📡 Using connection URL:', process.env.MONGO_URI);
    
    if (!process.env.MONGO_URI) {
      console.error('❌ MONGO_URL not found in .env file');
      return;
    }

    // Connection options
    const connectionOptions = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000, // 10 seconds
    };

    await mongoose.connect(process.env.MONGO_URI, connectionOptions);
    console.log('✅ Connected to MongoDB successfully!');

    // Check if super admin already exists with your email
    const existingSuperAdmin = await User.findOne({ 
      $or: [
        { userType: 'superadmin' },
        { email: 'rautsuraj0803018@gmail.com' } // Replace with your actual email
      ] 
    });
    
    if (existingSuperAdmin) {
      console.log('⚠️ Super admin already exists:');
      console.log(`   Email: ${existingSuperAdmin.email}`);
      console.log(`   Role: ${existingSuperAdmin.userType}`);
      return;
    }

    // Create super admin user with YOUR email
    const hashedPassword = await bcrypt.hash('secured', 12);
    
    const superAdmin = new User({
      name: 'DOKO Super Administrator',
      email: 'rautsuraj0803018@gmail.com', // Your email here
      password: hashedPassword,
      phone: '9800000000',
      location: 'Dharan, Nepal',
      userType: 'superadmin',
      isVerified: true
    });

    await superAdmin.save();
    console.log('✅ Super admin created successfully!');
    console.log('📧 Email: rautsuraj0803018@gmail.com'); // Your email here
    console.log('🔑 Password: secured');
    console.log('⚠️  IMPORTANT: Change this password after first login!');

  } catch (error) {
    console.error('❌ Error creating super admin:');
    console.error('   Message:', error.message);
    
    if (error.name === 'MongoServerSelectionError') {
      console.error('\n💡 SOLUTIONS:');
      console.error('   1. Start MongoDB locally:');
      console.error('      Windows: net start MongoDB');
      console.error('      Mac: brew services start mongodb-community');
      console.error('      Linux: sudo systemctl start mongod');
      console.error('\n   2. Use MongoDB Atlas (cloud):');
      console.error('      - Create account at https://cloud.mongodb.com');
      console.error('      - Get connection string');
      console.error('      - Update MONGO_URL in .env file');
    }
    
    if (error.message.includes('ENOENT')) {
      console.error('\n💡 MongoDB might not be installed.');
      console.error('   Download from: https://www.mongodb.com/try/download/community');
    }
  } finally {
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
      console.log('📡 MongoDB connection closed');
    }
  }
}

// Run the script
createSuperAdmin();