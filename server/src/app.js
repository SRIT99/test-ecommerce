const express = require('express');
const cors = require('cors'); // ✅ FIX: cors not cons
const bodyParser = require('body-parser');
const connectToDatabase = require('./database/db');
const path = require('path');
// Import all routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const vehicleRoutes = require('./routes/vehicleRoutes');
const adminRoutes = require('./routes/adminRoutes');
const farmerRoutes = require('./routes/farmerRoutes');
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// Test routes
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'DOKO Server is running!',
    timestamp: new Date().toISOString()
  });
});

app.get('/test', (req, res) => {
  res.json({ 
    message: 'Test endpoint is working!',
    endpoints: [
      'GET /health',
      'GET /test',
      'POST /auth/signup',
      'POST /auth/login',
      'GET /products',
      'GET /users/me',

    ]
  });
});

// Mount all routes
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/payments', paymentRoutes);
app.use('/vehicles', vehicleRoutes);
app.use('/admin', adminRoutes);
app.use('/farmer', farmerRoutes);

// Connect to database (but don't start server here)
connectToDatabase();

// ✅ REMOVE app.listen() - server.js handles this
module.exports = app;