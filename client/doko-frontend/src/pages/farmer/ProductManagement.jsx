// src/components/farmer/ProductManagement.js
import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { farmerService } from '../../services/farmerService';
import { useAuth } from '../../hooks/useAuth';
import ProductForm from './ProductForm';

const ProductManagement = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const action = searchParams.get('action');
    const editId = searchParams.get('id');

    useEffect(() => {
        if (!action) {
            fetchProducts();
        }
    }, [action]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            setError('');

            // Use farmerService to get farmer-specific products
            const data = await farmerService.getProducts();

            // Handle different response formats
            if (data && data.products) {
                // If response has products array
                setProducts(Array.isArray(data.products) ? data.products : []);
            } else if (Array.isArray(data)) {
                // If response is directly an array
                setProducts(data);
            } else {
                console.error('Unexpected products response format:', data);
                setProducts([]);
                setError('Unexpected data format received');
            }
        } catch (err) {
            console.error('Failed to load products:', err);
            setError('Failed to load products. Please try again.');
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveProduct = () => {
        navigate('/farmer/dashboard/products');
        fetchProducts(); // Refresh the product list
    };

    const handleCancel = () => {
        navigate('/farmer/dashboard/products');
    };

    const handleDeleteProduct = async (productId) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;

        try {
            await farmerService.deleteProduct(productId);
            // Remove from local state
            setProducts(products.filter(p => p._id !== productId));
        } catch (err) {
            console.error('Failed to delete product:', err);
            setError('Failed to delete product');
        }
    };

    // Show product form if action is add/edit
    if (action === 'add' || action === 'edit') {
        return (
            <ProductForm
                productId={editId}
                onSave={handleSaveProduct}
                onCancel={handleCancel}
            />
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Product Management</h1>
                    <p className="text-gray-600">Manage your farm products and inventory</p>
                </div>
                <Link
                    to="?action=add"
                    className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg hover:shadow-green-200 transition-all duration-200 transform hover:scale-105"
                >
                    + Add New Product
                </Link>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                    {error}
                </div>
            )}

            {/* Products Grid */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="bg-white rounded-2xl p-6 shadow-lg border border-green-100/50 animate-pulse">
                            <div className="h-48 bg-gray-300 rounded-xl mb-4"></div>
                            <div className="h-4 bg-gray-300 rounded mb-2"></div>
                            <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
                            <div className="h-10 bg-gray-300 rounded"></div>
                        </div>
                    ))}
                </div>
            ) : (
                <>
                    {products.length === 0 ? (
                        <div className="text-center py-12 bg-white rounded-2xl shadow-lg border border-green-100/50">
                            <div className="text-6xl mb-4">🌱</div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">No products yet</h3>
                            <p className="text-gray-600 mb-6">Start by adding your first product to sell</p>
                            <Link
                                to="?action=add"
                                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
                            >
                                Add Your First Product
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {products.map((product) => (
                                <div key={product._id} className="bg-white rounded-2xl p-6 shadow-lg border border-green-100/50 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                                    <div className="relative h-48 bg-gray-200 rounded-xl mb-4 overflow-hidden">
                                        <img
                                            src={product.imageUrl || '/api/placeholder/300/200'}
                                            alt={product.name}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-sm font-semibold text-gray-900">
                                            {product.stockQty || 0} in stock
                                        </div>
                                    </div>

                                    <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-1">{product.name}</h3>
                                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>

                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-2xl font-bold text-green-600">₹{product.price}</span>
                                        <span className="text-sm text-gray-500">per {product.unit}</span>
                                    </div>

                                    <div className="flex space-x-2">
                                        <Link
                                            to={`?action=edit&id=${product._id}`}
                                            className="flex-1 bg-blue-500 text-white text-center py-2 rounded-lg hover:bg-blue-600 transition-colors font-medium"
                                        >
                                            Edit
                                        </Link>
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
                </>
            )}
        </div>
    );
};

export default ProductManagement;