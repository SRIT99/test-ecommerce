const express = require('express');
const marketController = require('../controllers/marketController');

const router = express.Router();

// @desc    Get market prices with filtering and pagination
// @route   GET /api/market/prices
// @access  Public
router.get('/prices', marketController.getMarketPrices);

// @desc    Get retail prices only
// @route   GET /api/market/retail
// @access  Public
router.get('/retail', marketController.getRetailPrices);

// @desc    Get wholesale prices only
// @route   GET /api/market/wholesale
// @access  Public
router.get('/wholesale', marketController.getWholesalePrices);

// @desc    Get available categories
// @route   GET /api/market/categories
// @access  Public
router.get('/categories', marketController.getCategories);

// @desc    Search products by name
// @route   GET /api/market/search
// @access  Public
router.get('/search', marketController.searchProducts);

module.exports = router;