import React, { useState, useMemo } from 'react';
import { useProducts } from '../hooks/useProducts';
import ProductCard from '../components/common/ProductCard';

const Products = () => {
    const [filters, setFilters] = useState({
        category: '',
        search: '',
        sort: 'name'
    });

    // Create stable filters object to prevent unnecessary re-renders
    const stableFilters = useMemo(() => filters, [filters]);

    const { products, loading, error } = useProducts(stableFilters);

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Our Products</h1>
                    <p className="text-gray-600">Fresh agricultural produce directly from farmers</p>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {/* Search */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={filters.search}
                                onChange={(e) => handleFilterChange('search', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500"
                            />
                        </div>

                        {/* Category */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                            <select
                                value={filters.category}
                                onChange={(e) => handleFilterChange('category', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500"
                            >
                                <option value="">All Categories</option>
                                <option value="vegetable">Vegetables</option>
                                <option value="fruit">Fruits</option>
                                <option value="grain">Grains</option>
                                <option value="dairy">Dairy</option>
                            </select>
                        </div>

                        {/* Sort */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Sort by</label>
                            <select
                                value={filters.sort}
                                onChange={(e) => handleFilterChange('sort', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500"
                            >
                                <option value="name">Name</option>
                                <option value="price">Price: Low to High</option>
                                <option value="-price">Price: High to Low</option>
                                <option value="createdAt">Newest</option>
                            </select>
                        </div>

                        {/* Reset */}
                        <div className="flex items-end">
                            <button
                                onClick={() => setFilters({ category: '', search: '', sort: 'name' })}
                                className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Reset Filters
                            </button>
                        </div>
                    </div>
                </div>

                {/* Products Grid */}
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4">
                        {error}
                    </div>
                )}

                {loading ? (
                    <div className="grid md:grid-cols-4 gap-6">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="bg-white rounded-lg shadow-md p-4 animate-pulse">
                                <div className="h-48 bg-gray-300 rounded mb-4"></div>
                                <div className="h-4 bg-gray-300 rounded mb-2"></div>
                                <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
                                <div className="h-10 bg-gray-300 rounded"></div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <>
                        <div className="flex justify-between items-center mb-4">
                            <p className="text-gray-600">
                                Showing {products.length} products
                            </p>
                        </div>

                        {products.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="text-6xl mb-4">🌱</div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
                                <p className="text-gray-600">Try adjusting your search filters</p>
                            </div>
                        ) : (
                            <div className="grid md:grid-cols-4 gap-6">
                                {products.map((product) => (
                                    <ProductCard key={product._id} product={product} />
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Products;