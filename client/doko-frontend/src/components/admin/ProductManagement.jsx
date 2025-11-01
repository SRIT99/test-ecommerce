// src/components/admin/ProductManagement.js
import React, { useState, useEffect } from 'react';
import { productService } from '../../services/productService';
import AdminSidebar from './AdminSidebar';

const ProductManagement = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        category: 'all',
        search: '',
        status: 'all',
        page: 1,
        limit: 12
    });
    const [stats, setStats] = useState({
        total: 0,
        active: 0,
        inactive: 0,
        lowStock: 0
    });

    useEffect(() => {
        fetchProducts();
    }, [filters]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            setError(null);
            console.log('📦 Fetching products with filters:', filters);

            const data = await productService.getProducts(filters);
            console.log('✅ Products API response:', data);

            const productsList = data.products || data.data || data || [];
            setProducts(productsList);

            // Calculate stats
            setStats({
                total: productsList.length,
                active: productsList.filter(p => p.isActive).length,
                inactive: productsList.filter(p => !p.isActive).length,
                lowStock: productsList.filter(p => p.stockQty < 10).length
            });
        } catch (error) {
            console.error('❌ Failed to fetch products:', error);
            setError(error.response?.data?.message || error.message || 'Failed to fetch products');
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteProduct = async (productId) => {
        if (!window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) return;

        try {
            console.log('🗑️ Deleting product:', productId);
            const response = await productService.deleteProduct(productId);
            console.log('✅ Delete response:', response);

            if (response.success) {
                alert('Product deleted successfully!');
                fetchProducts(); // Refresh the list
            } else {
                throw new Error(response.message || 'Failed to delete product');
            }
        } catch (error) {
            console.error('❌ Failed to delete product:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Failed to delete product. Please try again.';
            alert(`Delete failed: ${errorMessage}`);
        }
    };

    const handleFeaturedToggle = async (productId, currentFeatured) => {
        try {
            console.log('⭐ Toggling featured status:', productId, !currentFeatured);
            const response = await productService.updateProduct(productId, { isFeatured: !currentFeatured });

            if (response.success) {
                alert(`Product ${!currentFeatured ? 'featured' : 'unfeatured'} successfully!`);
                fetchProducts();
            } else {
                throw new Error(response.message || 'Failed to update featured status');
            }
        } catch (error) {
            console.error('❌ Failed to update featured status:', error);
            alert(error.response?.data?.message || 'Failed to update featured status');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <AdminSidebar />
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-3">
                        <div className="space-y-6">
                            {/* Header */}
                            <div className="flex justify-between items-center">
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900">Product Management</h1>
                                    <p className="text-gray-600">Manage all products on the platform</p>
                                </div>
                                <button
                                    onClick={fetchProducts}
                                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
                                >
                                    Refresh
                                </button>
                            </div>

                            {/* Error Message */}
                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                                    <strong>Error: </strong>{error}
                                </div>
                            )}

                            {/* Stats Grid - 2 columns */}
                            <div className="grid grid-cols-2 gap-6">
                                <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-600">Total Products</p>
                                            <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                                        </div>
                                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                            <span className="text-2xl">📦</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-600">Active</p>
                                            <p className="text-3xl font-bold text-green-600">{stats.active}</p>
                                        </div>
                                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                            <span className="text-2xl">✅</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-600">Inactive</p>
                                            <p className="text-3xl font-bold text-yellow-600">{stats.inactive}</p>
                                        </div>
                                        <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                                            <span className="text-2xl">⏸️</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-600">Low Stock</p>
                                            <p className="text-3xl font-bold text-red-600">{stats.lowStock}</p>
                                        </div>
                                        <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                                            <span className="text-2xl">📉</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Filters */}
                            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                                        <select
                                            value={filters.category}
                                            onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value, page: 1 }))}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="all">All Categories</option>
                                            <option value="vegetable">Vegetables</option>
                                            <option value="fruit">Fruits</option>
                                            <option value="grain">Grains</option>
                                            <option value="dairy">Dairy</option>
                                            <option value="meat">Meat</option>
                                            <option value="spices">Spices</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                                        <input
                                            type="text"
                                            placeholder="Search products..."
                                            value={filters.search}
                                            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value, page: 1 }))}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                                        <select
                                            value={filters.status}
                                            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value, page: 1 }))}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="all">All Status</option>
                                            <option value="active">Active</option>
                                            <option value="inactive">Inactive</option>
                                        </select>
                                    </div>
                                    <div className="flex items-end">
                                        <button
                                            onClick={fetchProducts}
                                            className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
                                        >
                                            Apply Filters
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Products Grid */}
                            {loading ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {[...Array(6)].map((_, i) => (
                                        <div key={i} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 animate-pulse">
                                            <div className="h-48 bg-gray-300 rounded-xl mb-4"></div>
                                            <div className="h-4 bg-gray-300 rounded mb-2"></div>
                                            <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
                                            <div className="h-10 bg-gray-300 rounded"></div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {products.map(product => (
                                        <div key={product._id} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                                            {/* Product Image */}
                                            <div className="relative h-48 bg-gray-200 rounded-xl mb-4 overflow-hidden">
                                                <img
                                                    src={product.imageUrl || product.images?.[0] || '/api/placeholder/300/200'}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        e.target.src = '/api/placeholder/300/200';
                                                    }}
                                                />
                                                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-sm font-semibold text-gray-900">
                                                    {product.stockQty || 0} in stock
                                                </div>
                                                {product.isFeatured && (
                                                    <div className="absolute top-3 left-3 bg-yellow-500 text-white px-2 py-1 rounded-lg text-xs font-semibold">
                                                        Featured
                                                    </div>
                                                )}
                                            </div>

                                            {/* Product Info */}
                                            <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-1">{product.name}</h3>
                                            <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>

                                            {/* Price and Unit */}
                                            <div className="flex items-center justify-between mb-4">
                                                <span className="text-2xl font-bold text-green-600">₹{product.price}</span>
                                                <span className="text-sm text-gray-500">per {product.unit}</span>
                                            </div>

                                            {/* Status and Seller */}
                                            <div className="flex items-center justify-between mb-4">
                                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${product.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                    }`}>
                                                    {product.isActive ? 'Active' : 'Inactive'}
                                                </span>
                                                <span className="text-sm text-gray-600">
                                                    By {product.sellerId?.name || product.seller?.name || 'Unknown Seller'}
                                                </span>
                                            </div>

                                            {/* Category and Stock */}
                                            <div className="flex items-center justify-between mb-4 text-sm text-gray-600">
                                                <span className="capitalize">{product.category}</span>
                                                <span className={product.stockQty < 10 ? 'text-red-500 font-semibold' : 'text-green-500'}>
                                                    {product.stockQty < 10 ? 'Low Stock' : 'In Stock'}
                                                </span>
                                            </div>

                                            {/* Action Buttons - REMOVED DEACTIVATE BUTTON */}
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => handleFeaturedToggle(product._id, product.isFeatured)}
                                                    className={`flex-1 py-2 rounded-lg font-medium transition-colors ${product.isFeatured
                                                            ? 'bg-purple-500 text-white hover:bg-purple-600'
                                                            : 'bg-gray-500 text-white hover:bg-gray-600'
                                                        }`}
                                                >
                                                    {product.isFeatured ? 'Unfeature' : 'Feature'}
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteProduct(product._id)}
                                                    className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-colors font-medium"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {!loading && products.length === 0 && !error && (
                                <div className="text-center py-12 bg-white rounded-2xl shadow-lg border border-gray-100">
                                    <div className="text-6xl mb-4">🛒</div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
                                    <p className="text-gray-600">Try adjusting your search filters or check if there are products in the system.</p>
                                    <button
                                        onClick={fetchProducts}
                                        className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                                    >
                                        Refresh
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductManagement;