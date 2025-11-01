const dataParser = require('../utils/dataParser');
const path = require('path');
const fs = require('fs').promises;

// @desc    Get market prices with options
// @param   {Object} options - Filtering and sorting options
// @return  {Object} Market data with prices and metadata
const getMarketPrices = async (options = {}) => {
  try {
    const { lang = 'en', limit, category, sortBy, sortOrder } = options;
    
    const htmlPath = path.join(__dirname, '../../tarkari-pwa', `${lang}.html`);
    const htmlContent = await fs.readFile(htmlPath, 'utf8');
    
    let data = dataParser.parseHTMLData(htmlContent, lang);
    
    // Apply filters
    if (category) {
      data.prices = data.prices.filter(product => 
        product.category.toLowerCase() === category.toLowerCase()
      );
    }
    
    // Apply sorting
    if (sortBy) {
      data.prices = dataParser.sortProducts(data.prices, sortBy, sortOrder, lang);
    }
    
    // Apply limit
    if (limit) {
      data.prices = data.prices.slice(0, limit);
    }
    
    return {
      ...data,
      lang,
      filters: { category, sortBy, sortOrder }
    };
  } catch (error) {
    console.error('Market Service Error:', error);
    throw new Error(`Failed to fetch market data: ${error.message}`);
  }
};

// @desc    Get retail prices only
// @param   {Object} options - Options for retail data
// @return  {Object} Retail prices data
const getRetailPrices = async (options = {}) => {
  const data = await getMarketPrices(options);
  
  // For retail, we focus on avg price (retail price)
  const retailPrices = data.prices.map(product => ({
    id: product.id,
    name: product.name,
    price: product.avg,
    unit: product.unit,
    category: product.category
  }));
  
  return {
    prices: retailPrices,
    lastUpdated: data.lastUpdated
  };
};

// @desc    Get wholesale prices only
// @param   {Object} options - Options for wholesale data
// @return  {Object} Wholesale prices data
const getWholesalePrices = async (options = {}) => {
  const data = await getMarketPrices(options);
  
  // For wholesale, we focus on min price (typically wholesale)
  const wholesalePrices = data.prices.map(product => ({
    id: product.id,
    name: product.name,
    price: product.min,
    unit: product.unit,
    category: product.category
  }));
  
  return {
    prices: wholesalePrices,
    lastUpdated: data.lastUpdated
  };
};

// @desc    Get available categories
// @return  {Array} List of categories
const getCategories = async () => {
  try {
    const data = await getMarketPrices();
    const categories = [...new Set(data.prices.map(product => product.category))];
    return categories;
  } catch (error) {
    throw new Error(`Failed to fetch categories: ${error.message}`);
  }
};

// @desc    Search products by name
// @param   {Object} options - Search options
// @return  {Object} Search results
const searchProducts = async (options = {}) => {
  try {
    const { query, lang = 'en', limit } = options;
    
    const data = await getMarketPrices({ lang });
    
    const searchResults = data.prices.filter(product =>
      product.name.toLowerCase().includes(query.toLowerCase())
    );
    
    if (limit) {
      searchResults = searchResults.slice(0, limit);
    }
    
    return {
      prices: searchResults,
      lastUpdated: data.lastUpdated
    };
  } catch (error) {
    throw new Error(`Search failed: ${error.message}`);
  }
};

module.exports = {
  getMarketPrices,
  getRetailPrices,
  getWholesalePrices,
  getCategories,
  searchProducts
};