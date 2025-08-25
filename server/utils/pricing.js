const axios = require('axios');
const Product = require('../models/Product');

// External data sources for market prices
const MARKET_DATA_SOURCES = {
  smartKrishi: {
    url: 'https://api.smartkrishi.com/market-prices',
    apiKey: process.env.SMART_KRISHI_API_KEY
  },
  governmentData: {
    url: 'https://data.gov.np/api/agriculture/prices',
    apiKey: process.env.GOVERNMENT_DATA_API_KEY
  }
};

// Base prices for common agricultural products (NPR per kg)
const BASE_PRICES = {
  vegetables: {
    tomato: 50,
    potato: 40,
    onion: 45,
    cauliflower: 60,
    cabbage: 35,
    spinach: 70,
    carrot: 55,
    radish: 40,
    brinjal: 60,
    cucumber: 45,
    pumpkin: 40,
    bitter_gourd: 80,
    lady_finger: 70,
    green_beans: 65
  },
  fruits: {
    apple: 150,
    banana: 40,
    orange: 80,
    mango: 100,
    papaya: 45,
    pineapple: 60,
    watermelon: 30,
    guava: 70,
    lemon: 50,
    pomegranate: 200
  },
  grains: {
    rice: 80,
    wheat: 70,
    maize: 50,
    millet: 90,
    barley: 65
  },
  spices: {
    turmeric: 300,
    ginger: 200,
    garlic: 150,
    chili: 250,
    cumin: 400,
    coriander: 350
  },
  dairy: {
    milk: 70,
    cheese: 500,
    yogurt: 80,
    butter: 600
  }
};

// Seasonal multipliers (month-based)
const SEASONAL_MULTIPLIERS = {
  // Vegetables
  tomato: [1.5, 1.8, 2.0, 1.7, 1.3, 1.0, 0.8, 0.7, 0.8, 1.0, 1.3, 1.6], // Jan-Dec
  potato: [1.2, 1.1, 1.0, 0.9, 0.8, 0.7, 0.8, 0.9, 1.0, 1.1, 1.2, 1.3],
  // Add more products as needed
};

// Get current market price from external API
const getMarketPriceFromAPI = async (productName, category) => {
  try {
    // Try Smart Krishi API first
    try {
      const response = await axios.get(MARKET_DATA_SOURCES.smartKrishi.url, {
        params: {
          product: productName,
          category: category
        },
        headers: {
          'Authorization': `Bearer ${MARKET_DATA_SOURCES.smartKrishi.apiKey}`
        },
        timeout: 5000
      });
      
      if (response.data && response.data.price) {
        return response.data.price;
      }
    } catch (error) {
      console.warn('Smart Krishi API failed:', error.message);
    }
    
    // Fallback to government data API
    try {
      const response = await axios.get(MARKET_DATA_SOURCES.governmentData.url, {
        params: {
          commodity: productName
        },
        headers: {
          'API-Key': MARKET_DATA_SOURCES.governmentData.apiKey
        },
        timeout: 5000
      });
      
      if (response.data && response.data.average_price) {
        return response.data.average_price;
      }
    } catch (error) {
      console.warn('Government data API failed:', error.message);
    }
    
    return null;
  } catch (error) {
    console.error('Market price API error:', error.message);
    return null;
  }
};

// Calculate seasonal multiplier
const getSeasonalMultiplier = (productName) => {
  const currentMonth = new Date().getMonth(); // 0-11
  const multiplier = SEASONAL_MULTIPLIERS[productName] || SEASONAL_MULTIPLIERS['default'];
  return multiplier ? multiplier[currentMonth] : 1.0;
};

// Get suggested price for a product
const getSuggestedPrice = async (productName, category, quality = 'standard') => {
  try {
    // Try to get current market price from API
    const marketPrice = await getMarketPriceFromAPI(productName, category);
    
    let basePrice;
    
    if (marketPrice) {
      basePrice = marketPrice;
    } else {
      // Fallback to base prices
      const categoryPrices = BASE_PRICES[category] || BASE_PRICES.vegetables;
      basePrice = categoryPrices[productName] || categoryPrices[Object.keys(categoryPrices)[0]];
    }
    
    // Apply seasonal multiplier
    const seasonalMultiplier = getSeasonalMultiplier(productName);
    let price = basePrice * seasonalMultiplier;
    
    // Apply quality multiplier
    const qualityMultipliers = {
      premium: 1.5,
      standard: 1.0,
      economy: 0.8
    };
    price *= qualityMultipliers[quality] || 1.0;
    
    // Add small random variation (±5%)
    const variation = 0.95 + (Math.random() * 0.1);
    price *= variation;
    
    // Round to nearest 5 rupees
    price = Math.round(price / 5) * 5;
    
    return Math.max(price, 10); // Minimum price 10 NPR
  } catch (error) {
    console.error('Price calculation error:', error);
    
    // Fallback price
    const categoryPrices = BASE_PRICES[category] || BASE_PRICES.vegetables;
    return categoryPrices[productName] || 50;
  }
};

// Calculate price based on supply and demand
const calculateDynamicPrice = (basePrice, supply, demand, competition = 1) => {
  // Simple supply-demand algorithm
  const supplyDemandRatio = demand / Math.max(supply, 1);
  const competitionFactor = 1 / Math.max(competition, 1);
  
  let price = basePrice * supplyDemandRatio * competitionFactor;
  
  // Apply minimum and maximum bounds
  price = Math.max(price, basePrice * 0.5); // Minimum 50% of base price
  price = Math.min(price, basePrice * 2.0); // Maximum 200% of base price
  
  return Math.round(price);
};

// Get price trends for a product
const getPriceTrends = async (productName, days = 30) => {
  try {
    // Get historical prices from database
    const historicalData = await Product.aggregate([
      {
        $match: {
          name: new RegExp(productName, 'i'),
          createdAt: { $gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000) }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' }
          },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
    ]);
    
    return historicalData;
  } catch (error) {
    console.error('Price trends error:', error);
    return [];
  }
};

// Compare prices with competitors
const compareWithCompetitors = async (productName, category, userPrice) => {
  try {
    const competitors = await Product.find({
      name: new RegExp(productName, 'i'),
      category: category,
      isAvailable: true
    }).select('price farmer location').populate('farmer', 'name rating');
    
    if (competitors.length === 0) {
      return {
        averagePrice: userPrice,
        minPrice: userPrice,
        maxPrice: userPrice,
        competitorCount: 0,
        position: 'only'
      };
    }
    
    const prices = competitors.map(p => p.price);
    const averagePrice = prices.reduce((sum, price) => sum + price, 0) / prices.length;
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    
    let position = 'average';
    if (userPrice < minPrice) position = 'lowest';
    else if (userPrice > maxPrice) position = 'highest';
    else if (userPrice < averagePrice) position = 'below_average';
    else if (userPrice > averagePrice) position = 'above_average';
    
    return {
      averagePrice: Math.round(averagePrice),
      minPrice,
      maxPrice,
      competitorCount: competitors.length,
      position,
      competitors: competitors.slice(0, 5) // Top 5 competitors
    };
  } catch (error) {
    console.error('Price comparison error:', error);
    return null;
  }
};

// Calculate bulk discount
const calculateBulkDiscount = (quantity, basePrice) => {
  const discountTiers = [
    { min: 100, discount: 0.15 }, // 15% discount for 100+ units
    { min: 50, discount: 0.10 },  // 10% discount for 50+ units
    { min: 20, discount: 0.05 },  // 5% discount for 20+ units
    { min: 0, discount: 0 }       // No discount
  ];
  
  const tier = discountTiers.find(t => quantity >= t.min);
  const discount = basePrice * tier.discount;
  const finalPrice = basePrice - discount;
  
  return {
    originalPrice: basePrice * quantity,
    discountedPrice: finalPrice * quantity,
    discountAmount: discount * quantity,
    discountPercentage: tier.discount * 100
  };
};

module.exports = {
  getSuggestedPrice,
  calculateDynamicPrice,
  getPriceTrends,
  compareWithCompetitors,
  calculateBulkDiscount,
  BASE_PRICES,
  SEASONAL_MULTIPLIERS
};