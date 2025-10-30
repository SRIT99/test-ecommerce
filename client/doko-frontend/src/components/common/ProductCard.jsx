import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../hooks/useAuth';
import { ShoppingCart, Check, User } from 'lucide-react';

const ProductCard = ({ product }) => {
    const { addToCart, items } = useCart();
    const { user } = useAuth();
    const [isAdding, setIsAdding] = useState(false);
    const [added, setAdded] = useState(false);

    const isInCart = items.some(item => item.product._id === product._id);

    // Check if this is the user's own product
    const isOwnProduct = user && product.sellerId === user._id;

    const handleAddToCart = async () => {
        // Prevent adding own products
        if (isOwnProduct) return;

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

    // Determine button state and styling
    const getButtonState = () => {
        if (isOwnProduct) {
            return {
                disabled: true,
                className: 'bg-gray-300 text-gray-500 cursor-not-allowed',
                content: (
                    <>
                        <User className="w-4 h-4" />
                        <span>Your Product</span>
                    </>
                )
            };
        }

        if (product.stockQty === 0) {
            return {
                disabled: true,
                className: 'bg-gray-300 text-gray-500 cursor-not-allowed',
                content: (
                    <>
                        <span>Out of Stock</span>
                    </>
                )
            };
        }

        if (isAdding) {
            return {
                disabled: true,
                className: 'bg-green-500 text-white cursor-wait',
                content: (
                    <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Adding...</span>
                    </>
                )
            };
        }

        if (added || isInCart) {
            return {
                disabled: true,
                className: 'bg-green-600 text-white cursor-default',
                content: (
                    <>
                        <Check className="w-4 h-4" />
                        <span>Added to Cart</span>
                    </>
                )
            };
        }

        return {
            disabled: false,
            className: 'bg-green-500 text-white hover:bg-green-600',
            content: (
                <>
                    <ShoppingCart className="w-4 h-4" />
                    <span>Add to Cart</span>
                </>
            )
        };
    };

    const buttonState = getButtonState();

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <Link to={`/products/${product._id}`}>
                <div className="relative h-48 bg-gray-200">
                    <img
                        src={product.imageUrl || '/api/placeholder/300/200'}
                        alt={product.name}
                        className="w-full h-full object-cover"
                    />

                    {/* Show "Your Product" badge for own products */}
                    {isOwnProduct && (
                        <div className="absolute top-2 left-2">
                            <span className="bg-blue-500 text-white px-2 py-1 rounded text-xs font-medium">
                                Your Product
                            </span>
                        </div>
                    )}

                    {/* Show "Out of Stock" overlay */}
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

                {/* Stock information */}
                <div className="mb-3">
                    <div className="flex justify-between text-xs text-gray-500">
                        <span>Stock:</span>
                        <span className={product.stockQty < 10 ? 'text-red-500 font-medium' : ''}>
                            {product.stockQty} {product.unit}{product.stockQty !== 1 ? 's' : ''} available
                        </span>
                    </div>
                    {product.stockQty < 10 && product.stockQty > 0 && (
                        <div className="mt-1 text-xs text-orange-500 font-medium">
                            Low stock!
                        </div>
                    )}
                </div>

                <button
                    onClick={handleAddToCart}
                    disabled={buttonState.disabled}
                    className={`w-full flex items-center justify-center space-x-2 py-2 rounded-lg transition-colors ${buttonState.className}`}
                >
                    {buttonState.content}
                </button>

                {/* Tooltip for own products */}
                {isOwnProduct && (
                    <div className="mt-2 text-xs text-gray-500 text-center">
                        You cannot purchase your own products
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductCard;