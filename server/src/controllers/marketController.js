const marketService = require('../services/marketService');

// @desc    Get market prices with filtering
// @route   GET /api/market/prices
// @access  Public
const getMarketPrices = async (req, res) => {
  try {
    const { 
      lang = 'en', 
      limit, 
      category,
      sortBy = 'name',
      sortOrder = 'asc'
    } = req.query;

    const options = {
      lang,
      limit: limit ? parseInt(limit) : undefined,
      category,
      sortBy,
      sortOrder
    };

    const result = await marketService.getMarketPrices(options);
    
    res.json({
      success: true,
      data: result.prices,
      metadata: {
        total: result.prices.length,
        subtitle: result.subtitle,
        date: result.date,
        lastUpdated: result.lastUpdated,
        lang: result.lang
      }
    });
  } catch (error) {
    console.error('Market Controller Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch market prices',
      error: error.message
    });
  }
};

// @desc    Get retail prices only
// @route   GET /api/market/retail
// @access  Public
const getRetailPrices = async (req, res) => {
  try {
    const { lang = 'en', limit } = req.query;
    
    const result = await marketService.getRetailPrices({ 
      lang, 
      limit: limit ? parseInt(limit) : undefined 
    });
    
    res.json({
      success: true,
      data: result.prices,
      metadata: {
        total: result.prices.length,
        lastUpdated: result.lastUpdated
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch retail prices',
      error: error.message
    });
  }
};

// @desc    Get wholesale prices only
// @route   GET /api/market/wholesale
// @access  Public
const getWholesalePrices = async (req, res) => {
  try {
    const { lang = 'en', limit } = req.query;
    
    const result = await marketService.getWholesalePrices({ 
      lang, 
      limit: limit ? parseInt(limit) : undefined 
    });
    
    res.json({
      success: true,
      data: result.prices,
      metadata: {
        total: result.prices.length,
        lastUpdated: result.lastUpdated
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch wholesale prices',
      error: error.message
    });
  }
};

// @desc    Get available categories
// @route   GET /api/market/categories
// @access  Public
const getCategories = async (req, res) => {
  try {
    const categories = await marketService.getCategories();
    
    res.json({
      success: true,
      data: categories,
      count: categories.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch categories',
      error: error.message
    });
  }
};

// @desc    Search products by name
// @route   GET /api/market/search
// @access  Public
const searchProducts = async (req, res) => {
  try {
    const { q, lang = 'en', limit } = req.query;
    
    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    const result = await marketService.searchProducts({
      query: q,
      lang,
      limit: limit ? parseInt(limit) : undefined
    });
    
    res.json({
      success: true,
      data: result.prices,
      metadata: {
        total: result.prices.length,
        query: q,
        lastUpdated: result.lastUpdated
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Search failed',
      error: error.message
    });
  }
};

module.exports = {
  getMarketPrices,
  getRetailPrices,
  getWholesalePrices,
  getCategories,
  searchProducts
};