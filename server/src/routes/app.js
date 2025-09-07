const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const productRoutes = require('./productRoutes');
const orderRoutes = require('./orderRoutes');
const paymentRoutes = require('./paymentRoutes');
const vehicleRoutes = require('./vehicleRoutes');
const adminRoutes = require('./adminRoutes');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/payments', paymentRoutes);
app.use('/vehicles', vehicleRoutes);
app.use('/admin', adminRoutes);


app.get('/health', (_, res) => res.json({ ok: true }));

module.exports = app;
