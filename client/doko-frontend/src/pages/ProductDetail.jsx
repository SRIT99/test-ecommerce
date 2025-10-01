import React from 'react';
import { useParams, Link } from 'react-router-dom';

const ProductDetail = () => {
    const { id } = useParams();

    // This would normally fetch product data by ID
    // For now, we'll show a placeholder
    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-lg shadow-md p-8">
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">🛒</div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Detail Page</h2>
                        <p className="text-gray-600 mb-4">Product ID: {id}</p>
                        <p className="text-gray-600 mb-8">This page will show detailed product information, images, seller details, and purchase options.</p>
                        <Link
                            to="/products"
                            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                        >
                            Back to Products
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;