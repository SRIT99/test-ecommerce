// Add review model (src/models/Review.js)
const reviewSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: String,
  images: [String]
}, { timestamps: true });

// Add to productController.js
exports.addReview = async (req, res) => {
  try {
    const { productId } = req.params;
    const { rating, comment, images } = req.body;
    
    // Check if buyer purchased this product
    const hasPurchased = await Order.exists({
      user: req.user._id,
      'items.product': productId,
      status: 'Delivered'
    });
    
    if (!hasPurchased) {
      return res.status(403).json({ error: 'You can only review purchased products' });
    }
    
    const review = await Review.create({
      product: productId,
      buyer: req.user._id,
      rating,
      comment,
      images
    });
    
    // Update product average rating
    await updateProductRating(productId);
    
    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add review' });
  }
};