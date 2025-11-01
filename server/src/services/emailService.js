// utils/emailService.js
const nodemailer = require('nodemailer');

// Create transporter with your Google SMTP configuration
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.MAIL_HOST || 'smtp.gmail.com',
    port: process.env.MAIL_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.MAIL_USER || 'surajworkspace12@gmail.com',
      pass: process.env.MAIL_PASS || 'uhgb fzij egai kyas'
    }
  });
};

exports.sendEmail = async ({ to, subject, html }) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.MAIL_FROM || '"DOKO" <noreply@doko.com>',
      to,
      subject,
      html,
      text: html.replace(/<[^>]*>/g, '') // Plain text fallback
    };

    console.log('📧 Attempting to send email to:', to);
    console.log('📧 Using SMTP:', process.env.MAIL_HOST);
    console.log('📧 From:', process.env.MAIL_FROM);

    const info = await transporter.sendMail(mailOptions);

    console.log('✅ Email sent successfully!');
    console.log('✅ Message ID:', info.messageId);
    console.log('✅ Accepted recipients:', info.accepted);

    return info;

  } catch (error) {
    console.error('❌ Email sending failed:', error);
    
    // More detailed error logging
    if (error.code === 'EAUTH') {
      console.error('❌ Authentication failed. Check your email credentials.');
      console.error('❌ Make sure you\'re using an App Password, not your regular Gmail password.');
    } else if (error.code === 'ECONNECTION') {
      console.error('❌ Connection failed. Check your SMTP settings.');
    } else {
      console.error('❌ Error details:', error.message);
    }
    
    throw new Error(`Failed to send email: ${error.message}`);
  }
};