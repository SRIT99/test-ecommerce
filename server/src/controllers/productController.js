const Product = require('../models/Product');

exports.create = async (req, res) => {
  try {
    // Accept all relevant fields from frontend
    const {
      name,
      price,
      unit,
      category,
      description,
      imageUrl,
      region,
      stockQty
    } = req.body;

    console.log('Product creation request:', req.body);
    console.log('User:', req.user._id, req.user.name);

    // Block unverified sellers
    if (req.user.userType === 'seller' && !req.user.isVerified) {
      return res.status(403).json({ error: 'Seller not verified by admin' });
    }

    // Validate required fields
    if (!name || !price) {
      return res.status(400).json({ error: 'Missing required fields: name and price' });
    }

    // Create product with all fields
    const product = await Product.create({
      name: name.trim(),
      price: price,
      unit: unit || 'kg',
      category: category || 'vegetable',
      description: description || '',
      imageUrl: imageUrl || '',
      region: region || req.user.location || '',
      stockQty: stockQty || 0,
      sellerId: req.user._id,
      sellerName: req.user.name,
      lastPriceSyncAt: new Date()
    });

    console.log('Product created successfully:', product._id);
    res.status(201).json(product);

  } catch (error) {
    console.error('Product creation error:', error);
    res.status(500).json({ error: 'Failed to create product: ' + error.message });
  }
};

exports.listProduct = async (req, res) => {
  try {
    const products = await Product.find({ isActive: true })
      .populate('sellerId', 'name location')
      .select('-__v')
      .sort({ createdAt: -1 });
    
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};

exports.getProduct = async (req, res) => {
  try {
    const { id } = req.params;
    
    const product = await Product.findOne({ 
      _id: id, 
      isActive: true 
    }).populate('sellerId', 'name email phone location bio farmName');

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    // Ensure seller cannot change certain fields
    delete updateData.sellerId;
    delete updateData.sellerName;

    const product = await Product.findOneAndUpdate(
      { _id: id, sellerId: req.user._id },
      updateData,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ error: 'Product not found or access denied' });
    }

    res.json(product);
  } catch (error) {
    console.error('Product update error:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
};
// search and filter products for buyers
exports.searchProducts = async (req, res) => {
  try {
    const { 
      search, 
      category, 
      minPrice, 
      maxPrice, 
      region, 
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 12
    } = req.query;

    let filter = { isActive: true };
    
    // Text search
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Filters
    if (category) filter.category = category;
    if (region) filter.region = region;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };
    const skip = (page - 1) * limit;

    const products = await Product.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .select('-__v');

    const total = await Product.countDocuments(filter);

    res.json({
      products,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Search failed' });
  }
};
// src/controllers/productController.js
// Get product by ID with seller details
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('sellerId', 'name email phone location isVerified createdAt')
      .select('-__v');
    
    if (!product) {
      return res.status(404).json({ 
        success: false,
        error: 'Product not found' 
      });
    }

    // Get similar products
    const similarProducts = await Product.find({
      category: product.category,
      isActive: true,
      _id: { $ne: product._id }
    })
    .limit(4)
    .populate('sellerId', 'name location')
    .select('name price imageUrl category region averageRating');

    res.json({
      success: true,
      product,
      similarProducts
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch product' 
    });
  }
};

exports.searchProducts = async (req, res) => {
  try {
    const { 
      search, 
      category, 
      minPrice, 
      maxPrice, 
      region, 
      sortBy = 'createdAt',
      sortOrder = 'desc',  // 👈 User can pass 'asc' or 'desc'
      page = 1,
      limit = 12
    } = req.query;

    // Build filter object
    let filter = { isActive: true };
    
    // Text search across name, description, category
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } }
      ];
    }

    // Category & region filters
    if (category && category !== 'all') filter.category = category;
    if (region && region !== 'all') filter.region = region;

    // Price range filter
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    // ✅ Dynamic sorting
    // Convert sortOrder ('asc' / 'desc') to MongoDB format (1 or -1)
    const sortDirection = sortOrder === 'asc' ? 1 : -1;
    const sort = { [sortBy]: sortDirection };

    // Pagination
    const skip = (page - 1) * limit;

    // Fetch products
    const products = await Product.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('sellerId', 'name location isVerified')
      .select('-__v');

    const total = await Product.countDocuments(filter);

    // Fetch available filters
    const categories = await Product.distinct('category', { isActive: true });
    const regions = await Product.distinct('region', { isActive: true });

    const minPriceValue = await Product.findOne({ isActive: true }).sort({ price: 1 }).select('price');
    const maxPriceValue = await Product.findOne({ isActive: true }).sort({ price: -1 }).select('price');

    res.json({
      success: true,
      products,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      },
      filters: {
        categories,
        regions,
        priceRange: {
          min: minPriceValue?.price || 0,
          max: maxPriceValue?.price || 0
        }
      }
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to search products' 
    });
  }
};
