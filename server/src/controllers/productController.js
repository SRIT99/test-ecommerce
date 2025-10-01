const Product = require('../models/Product');

exports.create = async (req, res) => {
  try {
    // Accept all relevant fields from frontend
    const {
      name,
      price,
      basePrice,
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

    // Use price or basePrice (for compatibility)
    const finalPrice = price || basePrice;

    // Create product with all fields
    const product = await Product.create({
      name: name.trim(),
      price: finalPrice,
      basePrice: finalPrice, // Set both for compatibility
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

exports.listPublic = async (req, res) => {
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