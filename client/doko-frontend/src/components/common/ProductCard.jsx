import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { ShoppingCart, Check } from 'lucide-react';

const ProductCard = ({ product }) => {
    const { addToCart, items } = useCart();
    const [isAdding, setIsAdding] = useState(false);
    const [added, setAdded] = useState(false);

    const isInCart = items.some(item => item.product._id === product._id);

    const handleAddToCart = async () => {
        if (isInCart) return;

        setIsAdding(true);

        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 500));

        addToCart(product, 1);
        setAdded(true);
        setIsAdding(false);

        // Reset added state after 2 seconds
        setTimeout(() => setAdded(false), 2000);
    };

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
                    <span className="text-2xl font-bold text-green-600">NPR {product.price}</span>
                    <span className="text-sm text-gray-500">per {product.unit}</span>
                </div>

                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>

                <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                    <span>By {product.sellerName}</span>
                    <span>{product.region}</span>
                </div>

                <button
                    onClick={handleAddToCart}
                    disabled={product.stockQty === 0 || isAdding || added || isInCart}
                    className={`w-full flex items-center justify-center space-x-2 py-2 rounded-lg transition-colors ${product.stockQty === 0
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : added || isInCart
                                ? 'bg-green-600 text-white cursor-default'
                                : 'bg-green-500 text-white hover:bg-green-600'
                        }`}
                >
                    {isAdding ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>Adding...</span>
                        </>
                    ) : added || isInCart ? (
                        <>
                            <Check className="w-4 h-4" />
                            <span>Added to Cart</span>
                        </>
                    ) : (
                        <>
                            <ShoppingCart className="w-4 h-4" />
                            <span>Add to Cart</span>
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default ProductCard;