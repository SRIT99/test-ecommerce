// test-email.js
require('dotenv').config();
const { sendEmail } = require('./services/emailService');

async function testEmail() {
  try {
    console.log('🧪 Testing email configuration...');
    
    await sendEmail({
      to: 'surajworkspace12@gmail.com', // Send to yourself for testing
      subject: 'DOKO - Email Configuration Test',
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h2 style="color: #059669;">Email Test Successful! 🎉</h2>
          <p>Your DOKO email configuration is working correctly.</p>
          <p>You can now send password reset emails to your users.</p>
        </div>
      `
    });
    
    console.log('✅ Email test completed successfully!');
  } catch (error) {
    console.error('❌ Email test failed:', error.message);
  }
}

testEmail();