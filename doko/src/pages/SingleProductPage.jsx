import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const SingleProductPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const handleAddToCart = () => {
    // Replace with actual cart logic
    alert(`Added ${quantity} ${product.unit} of ${product.name} to cart`);
  };

  if (loading) {
    return <div className="text-center py-20 text-slate-500">Loading product...</div>;
  }

  if (!product) {
    return <div className="text-center py-20 text-red-500">Product not found.</div>;
  }

  return (
    <div className="min-h-screen bg-light dark:bg-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto bg-white dark:bg-slate-800 p-8 rounded-lg shadow-lg grid grid-cols-1 md:grid-cols-2 gap-10">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="rounded-lg w-full h-80 object-cover shadow-md"
        />
        <div>
          <h1 className="text-3xl font-bold text-primary dark:text-primary-light mb-4">
            {product.name}
          </h1>
          <p className="text-slate-700 dark:text-slate-300 mb-2">
            <strong>Category:</strong> {product.category}
          </p>
          <p className="text-slate-700 dark:text-slate-300 mb-4">
            <strong>Seller:</strong> {product.sellerName} ({product.region})
          </p>
          <p className="text-lg text-slate-600 dark:text-slate-400 mb-6">
            {product.description}
          </p>
          <div className="mb-6">
            <p className="text-xl font-semibold text-secondary mb-2">
              NPR {product.price} / {product.unit}
            </p>
            <label className="block text-sm text-slate-700 dark:text-slate-300 mb-1">
              Quantity
            </label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-24 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
            />
          </div>
          <div className="flex space-x-4">
            <button
              onClick={handleAddToCart}
              className="bg-primary hover:bg-dark text-white px-6 py-3 rounded-lg transition-colors"
            >
              Add to Cart
            </button>
            <button className="bg-secondary hover:bg-primary-light text-white px-6 py-3 rounded-lg transition-colors">
              Buy Now
            </button>
          </div>
        </div>
        {/* Reviews Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">Customer Reviews</h2>

          {/* Average Rating */}
          <div className="mb-6">
            <p className="text-lg text-slate-700 dark:text-slate-300">
              ⭐ {product.averageRating || 0} / 5 ({product.reviews ? product.reviews.length : 0} reviews)
            </p>
          </div>

          {/* Individual Reviews */}
          <div className="space-y-6">
            {(product.reviews && product.reviews.length > 0) ? (
              product.reviews.map((review, index) => (
                <div key={index} className="border-b border-slate-200 dark:border-slate-700 pb-4">
                  <p className="font-semibold text-slate-800 dark:text-slate-100">{review.name}</p>
                  <p className="text-yellow-500">{"⭐".repeat(review.rating)}</p>
                  <p className="text-slate-600 dark:text-slate-300">{review.comment}</p>
                </div>
              ))
            ) : (
              <p className="text-slate-500">No reviews yet.</p>
            )}
          </div>

          {/* Review Form */}
          <div className="mt-10">
            <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-2">Leave a Review</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              // Submit logic here
              alert('Review submitted!');
            }}>
              <input
                type="text"
                placeholder="Your name"
                className="w-full mb-2 px-4 py-2 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                required
              />
              <select
                className="w-full mb-2 px-4 py-2 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                required
              >
                <option value="">Rating</option>
                {[1, 2, 3, 4, 5].map((r) => (
                  <option key={r} value={r}>{r} Star{r > 1 ? 's' : ''}</option>
                ))}
              </select>
              <textarea
                placeholder="Your review"
                className="w-full mb-4 px-4 py-2 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                rows="4"
                required
              />
              <button
                type="submit"
                className="bg-primary hover:bg-dark text-white px-6 py-2 rounded-lg"
              >
                Submit Review
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SingleProductPage;
