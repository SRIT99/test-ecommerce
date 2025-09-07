const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const auth = require('../middleware/auth');
const roles = require('../middleware/roles');

// Public route for listing products
router.get('/api/products', productController.listPublic);

// Protected route for creating products
router.post('/api/products', auth.protect, roles.allow('seller'), productController.create);

module.exports = router;