// src/components/HeaderMarketPrices.js
import React, { useState, useEffect } from 'react';
import { marketService } from '../../services/marketService';

const HeaderMarketPrices = () => {
    const [prices, setPrices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isExpanded, setIsExpanded] = useState(false);
    const [lastUpdated, setLastUpdated] = useState(null);
    const [error, setError] = useState(null);

    // Fallback mock data
    const mockPrices = [
        { id: 1, productName: "Tomato", retailPrice: "45.00", wholesalePrice: "35.00", unit: "kg", category: "vegetables" },
        { id: 2, productName: "Potato", retailPrice: "30.00", wholesalePrice: "25.00", unit: "kg", category: "vegetables" },
        { id: 3, productName: "Onion", retailPrice: "40.00", wholesalePrice: "32.00", unit: "kg", category: "vegetables" },
        { id: 4, productName: "Carrot", retailPrice: "60.00", wholesalePrice: "48.00", unit: "kg", category: "vegetables" },
        { id: 5, productName: "Cabbage", retailPrice: "35.00", wholesalePrice: "28.00", unit: "kg", category: "vegetables" },
        { id: 6, productName: "Apple", retailPrice: "120.00", wholesalePrice: "95.00", unit: "kg", category: "fruits" },
        { id: 7, productName: "Banana", retailPrice: "50.00", wholesalePrice: "38.00", unit: "dozen", category: "fruits" },
        { id: 8, productName: "Cauliflower", retailPrice: "25.00", wholesalePrice: "18.00", unit: "piece", category: "vegetables" }
    ];

    useEffect(() => {
        fetchMarketPrices();
        const interval = setInterval(fetchMarketPrices, 5 * 60 * 1000); // 5 minutes
        return () => clearInterval(interval);
    }, []);

    const fetchMarketPrices = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await marketService.getMarketPrices({ limit: 8 });

            if (data.success && data.prices && data.prices.length > 0) {
                setPrices(data.prices);
                setLastUpdated(data.lastUpdated);
            } else {
                console.warn('No data from API, using mock data');
                setPrices(mockPrices);
                setLastUpdated(new Date().toISOString());
            }
        } catch (error) {
            console.error('Failed to fetch market prices:', error);
            setError('Live data unavailable - showing demo data');
            setPrices(mockPrices);
            setLastUpdated(new Date().toISOString());
        } finally {
            setLoading(false);
        }
    };

    const getTrendIcon = (product) => {
        const wholesale = parseFloat(product.wholesalePrice);
        const retail = parseFloat(product.retailPrice);

        if (!wholesale || isNaN(wholesale) || isNaN(retail) || wholesale === retail) return '→';
        return wholesale < retail ? '↗' : '↘';
    };

    const getTrendColor = (product) => {
        const wholesale = parseFloat(product.wholesalePrice);
        const retail = parseFloat(product.retailPrice);

        if (!wholesale || isNaN(wholesale) || isNaN(retail) || wholesale === retail) return 'text-gray-400';
        return wholesale < retail ? 'text-green-400' : 'text-red-400';
    };

    const formatTime = (dateString) => {
        return new Date(dateString).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading && prices.length === 0) {
        return (
            <div className="bg-green-600 text-white px-4 py-2">
                <div className="flex items-center justify-between max-w-7xl mx-auto">
                    <div className="flex items-center space-x-2">
                        <div className="animate-pulse bg-green-500 h-4 w-4 rounded"></div>
                        <span className="text-sm">Loading market prices...</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-green-700 text-white relative">

            {/* Compact Header View */}
            <div
                className="px-4 py-2 cursor-pointer hover:bg-green-800 transition-colors"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex items-center justify-between max-w-7xl mx-auto">
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                            <span className="text-green-200">📊</span>
                            <span className="text-sm font-medium">Live Market Prices</span>
                        </div>
                        <div className="hidden md:flex items-center space-x-4 text-xs">
                            {prices.slice(0, 4).map((product, index) => (
                                <div key={product.id || index} className="flex items-center space-x-1">
                                    <span className="text-green-200">{product.productName}</span>
                                    <span className="font-semibold">₹{product.retailPrice}</span>
                                    <span className={`text-xs ${getTrendColor(product)}`}>
                                        {getTrendIcon(product)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="flex items-center space-x-2 text-xs">
                        <span className="text-green-200">
                            Updated: {lastUpdated ? formatTime(lastUpdated) : formatTime(new Date())}
                        </span>
                        <span className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                            ▼
                        </span>
                    </div>
                </div>
            </div>

            {/* Expanded Detailed View */}
            {isExpanded && (
                <div className="bg-green-800 border-t border-green-600">
                    <div className="max-w-7xl mx-auto px-4 py-4">


                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {prices.map((product, index) => (
                                <div key={product.id || index} className="bg-green-900/50 rounded-lg p-3 hover:bg-green-900/70 transition-colors">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h4 className="font-semibold text-sm">{product.productName}</h4>
                                            <p className="text-green-300 text-xs">{product.unit}</p>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-bold text-lg">₹{product.retailPrice}</div>
                                            {product.wholesalePrice && (
                                                <div className="text-green-300 text-xs">
                                                    Wholesale: ₹{product.wholesalePrice}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="text-green-300 capitalize">{product.category}</span>
                                        <span className={`font-medium ${getTrendColor(product)}`}>
                                            {getTrendIcon(product)} Market
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-4 flex justify-between items-center text-xs text-green-300">
                            <span>Data source: Kalimati Fruit and Vegetable Market</span>
                            <div className="flex items-center space-x-4">
                                {lastUpdated && (
                                    <span>Last update: {formatTime(lastUpdated)}</span>
                                )}
                                <button
                                    onClick={fetchMarketPrices}
                                    disabled={loading}
                                    className="flex items-center space-x-1 hover:text-white transition-colors disabled:opacity-50"
                                >
                                    <span className={loading ? 'animate-spin' : ''}>🔄</span>
                                    <span>{loading ? 'Refreshing...' : 'Refresh'}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HeaderMarketPrices;