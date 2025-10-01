import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <Link to={`/products/${product._id}`}>
                <div className="relative h-48 bg-gray-200">
                    <img
                        src={product.imageUrl || '/api/placeholder/300/200'}
                        alt={product.name}
                        className="w-full h-full object-cover"
                    />
                    {product.stockQty === 0 && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                            <span className="text-white font-bold bg-red-500 px-2 py-1 rounded">Out of Stock</span>
                        </div>
                    )}
                </div>
            </Link>

            <div className="p-4">
                <Link to={`/products/${product._id}`}>
                    <h3 className="font-semibold text-lg mb-2 hover:text-green-600 transition-colors">
                        {product.name}
                    </h3>
                </Link>

                <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl font-bold text-green-600">₹{product.price}</span>
                    <span className="text-sm text-gray-500">per {product.unit}</span>
                </div>

                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>

                <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>By {product.sellerName}</span>
                    <span>{product.region}</span>
                </div>

                <button className="w-full mt-3 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed">
                    Add to Cart
                </button>
            </div>
        </div>
    );
};

export default ProductCard;