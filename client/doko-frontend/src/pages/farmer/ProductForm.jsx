import React, { useState, useEffect } from 'react';
import { productService } from '../../services/productService';
import { useAuth } from '../../hooks/useAuth';

const ProductForm = ({ productId, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        unit: 'kg',
        category: 'vegetable',
        description: '',
        imageUrl: '',
        region: '',
        stockQty: 0
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { user } = useAuth();

    const isEdit = Boolean(productId);

    useEffect(() => {
        if (isEdit && productId) {
            fetchProduct();
        }
    }, [isEdit, productId]);

    const fetchProduct = async () => {
        try {
            const product = await productService.getProduct(productId);
            setFormData({
                name: product.name || '',
                price: product.price || '',
                unit: product.unit || 'kg',
                category: product.category || 'vegetable',
                description: product.description || '',
                imageUrl: product.imageUrl || '',
                region: product.region || user?.location || '',
                stockQty: product.stockQty || 0
            });
        } catch (err) {
            setError('Failed to load product');
        }
    };

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'number' ? parseFloat(value) : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (isEdit) {
                await productService.updateProduct(productId, formData);
            } else {
                await productService.createProduct(formData);
            }
            onSave();
        } catch (err) {
            setError(err.response?.data?.error || `Failed to ${isEdit ? 'update' : 'create'} product`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-green-100/50">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900">
                            {isEdit ? 'Add Product' : 'Add New Product'}
                        </h2>
                        <p className="text-gray-600 mt-2">
                            {isEdit ? 'Update your product details' : 'Add a new product to your farm catalog'}
                        </p>
                    </div>
                    <button
                        onClick={onCancel}
                        className="text-gray-500 hover:text-gray-700 transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Basic Information */}
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Product Name *
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                                    placeholder="e.g., Organic Tomatoes"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Category *
                                </label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                >
                                    <option value="vegetable">Vegetables</option>
                                    <option value="fruit">Fruits</option>
                                    <option value="grain">Grains</option>
                                    <option value="dairy">Dairy</option>
                                    <option value="spice">Spices</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Price (₹) *
                                </label>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    required
                                    min="0"
                                    step="0.01"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                    placeholder="0.00"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Unit *
                                </label>
                                <select
                                    name="unit"
                                    value={formData.unit}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                >
                                    <option value="kg">Kilogram (kg)</option>
                                    <option value="g">Gram (g)</option>
                                    <option value="piece">Piece</option>
                                    <option value="bunch">Bunch</option>
                                    <option value="dozen">Dozen</option>
                                    <option value="packet">Packet</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Inventory & Location */}
                    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-xl border border-blue-200">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Inventory & Location</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Stock Quantity *
                                </label>
                                <input
                                    type="number"
                                    name="stockQty"
                                    value={formData.stockQty}
                                    onChange={handleChange}
                                    required
                                    min="0"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                    placeholder="0"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Region *
                                </label>
                                <input
                                    type="text"
                                    name="region"
                                    value={formData.region}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                    placeholder="e.g., Dharan, Koshi Province"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Description & Media */}
                    <div className="bg-gradient-to-r from-purple-50 to-violet-50 p-6 rounded-xl border border-purple-200">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Description & Media</h3>

                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Description
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={4}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                placeholder="Describe your product (quality, freshness, growing methods, etc.)"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Image URL
                            </label>
                            <input
                                type="url"
                                name="imageUrl"
                                value={formData.imageUrl}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                placeholder="https://example.com/your-product-image.jpg"
                            />
                            <p className="text-sm text-gray-500 mt-2">
                                Provide a direct link to your product image
                            </p>
                        </div>
                    </div>

                    {/* Form Actions */}
                    <div className="flex space-x-4 pt-6">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white py-4 rounded-xl font-semibold hover:shadow-lg hover:shadow-green-200 disabled:opacity-50 transition-all duration-200 transform hover:scale-105"
                        >
                            {loading ? (
                                <div className="flex items-center justify-center space-x-2">
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                    <span>{isEdit ? 'Updating...' : 'Creating...'}</span>
                                </div>
                            ) : (
                                isEdit ? 'Update Product' : 'Create Product'
                            )}
                        </button>

                        <button
                            type="button"
                            onClick={onCancel}
                            className="flex-1 bg-gray-500 text-white py-4 rounded-xl font-semibold hover:bg-gray-600 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProductForm;