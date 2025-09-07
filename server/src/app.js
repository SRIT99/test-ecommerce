const express = require('express');
const connectToDatabase = require('./database/db');
const productRoutes = require('./routes/productRoutes');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Mount routes
app.use('/api/products', productRoutes);

// Connect to database
connectToDatabase();

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;