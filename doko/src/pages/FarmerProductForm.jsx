import React, { useState } from 'react';

const FarmerProductForm = () => {
  const [form, setForm] = useState({
    name: '',
    price: '',
    unit: 'kg',
    category: 'vegetable',
    description: '',
    imageUrl: '',
    region: '',
    stockQty: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token'); // Get auth token
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...form,
          price: Number(form.price),
          stockQty: Number(form.stockQty)
        })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to add product');
      }

      setSuccess(true);
      setForm({
        name: '',
        price: '',
        unit: 'kg',
        category: 'vegetable',
        description: '',
        imageUrl: '',
        region: '',
        stockQty: ''
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-light dark:bg-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white dark:bg-slate-800 p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-primary dark:text-primary-light mb-6 text-center">
          List Your Farm Product
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="text-red-500">{error}</p>}
          {success && <p className="text-green-500">Product added successfully!</p>}

          <div>
            <label className="block text-slate-700 dark:text-slate-300 mb-1">Product Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Product Name"
              required
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
            />
          </div>

          <div className="flex gap-4">
            <div className="w-full">
              <label className="block text-slate-700 dark:text-slate-300 mb-1">Price (NPR)</label>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                placeholder="Price"
                required
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
              />
            </div>
            <div className="w-full">
              <label className="block text-slate-700 dark:text-slate-300 mb-1">Unit</label>
              <select
                name="unit"
                value={form.unit}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
              >
                <option value="kg">Kg</option>
                <option value="piece">Piece</option>
                <option value="bundle">Bundle</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 mb-1">Category</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
            >
              <option value="vegetable">Vegetable</option>
              <option value="fruit">Fruit</option>
              <option value="grain">Grain</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 mb-1">Region</label>
            <input
              type="text"
              name="region"
              value={form.region}
              onChange={handleChange}
              placeholder="Region"
              required
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
            />
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 mb-1">Stock Quantity</label>
            <input
              type="number"
              name="stockQty"
              value={form.stockQty}
              onChange={handleChange}
              placeholder="Stock Quantity"
              required
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
            />
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 mb-1">Image URL</label>
            <input
              type="text"
              name="imageUrl"
              value={form.imageUrl}
              onChange={handleChange}
              placeholder="Image URL"
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
            />
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 mb-1">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Product Description"
              rows="4"
              required
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-6 bg-primary hover:bg-dark text-white font-semibold rounded transition-colors"
          >
            {loading ? 'Adding Product...' : 'Add Product'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default FarmerProductForm;
