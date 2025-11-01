// src/components/admin/PriceSync.js (Updated)
import React, { useState, useEffect } from 'react';
import { userService } from '../../services/adminService';
import { marketService } from '../../services/marketService';

const PriceSync = () => {
    const [syncLoading, setSyncLoading] = useState(false);
    const [lastSync, setLastSync] = useState(null);
    const [marketPrices, setMarketPrices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMarketPrices();
    }, []);

    const fetchMarketPrices = async () => {
        try {
            setLoading(true);
            const data = await marketService.getMarketPrices({ limit: 10 });
            setMarketPrices(data.prices || []);
        } catch (error) {
            console.error('Failed to fetch market prices:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSyncPrices = async () => {
        try {
            setSyncLoading(true);
            const result = await userService.syncPrices();
            setLastSync(result);

            // Refresh market prices after sync
            await fetchMarketPrices();
        } catch (error) {
            console.error('Failed to sync prices:', error);
        } finally {
            setSyncLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Price Synchronization</h1>
                    <p className="text-gray-600">Sync prices from Kalimati Market</p>
                </div>
            </div>

            {/* Sync Card */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                <div className="text-center">
                    <div className="text-6xl mb-4">🥦</div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Kalimati Market Sync</h2>
                    <p className="text-gray-600 mb-6">
                        Synchronize product prices with real-time data from Kalimati Fruit and Vegetable Market
                    </p>

                    <button
                        onClick={handleSyncPrices}
                        disabled={syncLoading}
                        className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg hover:shadow-green-200 disabled:opacity-50 transition-all duration-200 transform hover:scale-105"
                    >
                        {syncLoading ? (
                            <div className="flex items-center justify-center space-x-2">
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                <span>Syncing from Kalimati...</span>
                            </div>
                        ) : (
                            'Sync Kalimati Prices Now'
                        )}
                    </button>

                    {lastSync && (
                        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                            <h3 className="font-semibold text-blue-900 mb-2">
                                {lastSync.success ? '✅ Sync Successful' : '❌ Sync Failed'}
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                <div>
                                    <span className="text-blue-700">Products Updated:</span>
                                    <p className="font-semibold">{lastSync.productsUpdated || 0}</p>
                                </div>
                                <div>
                                    <span className="text-blue-700">Last Sync:</span>
                                    <p className="font-semibold">
                                        {new Date(lastSync.timestamp).toLocaleString()}
                                    </p>
                                </div>
                                <div>
                                    <span className="text-blue-700">Status:</span>
                                    <p className={`font-semibold ${lastSync.success ? 'text-green-600' : 'text-red-600'}`}>
                                        {lastSync.success ? 'Success' : 'Failed'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Live Market Preview */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-900">Live Kalimati Prices</h3>
                    <button
                        onClick={fetchMarketPrices}
                        className="text-green-600 hover:text-green-700 font-medium text-sm"
                    >
                        Refresh
                    </button>
                </div>

                {loading ? (
                    <div className="space-y-3">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg animate-pulse">
                                <div className="h-4 bg-gray-300 rounded w-32"></div>
                                <div className="h-4 bg-gray-300 rounded w-16"></div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                        {marketPrices.map((product, index) => (
                            <div key={index} className="bg-green-50 rounded-lg p-4 border border-green-200">
                                <h4 className="font-semibold text-gray-900 text-sm mb-1">{product.productName}</h4>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-gray-600">{product.unit}</span>
                                    <span className="font-bold text-green-600">₹{product.retailPrice}</span>
                                </div>
                                {product.wholesalePrice && (
                                    <div className="text-xs text-gray-500 mt-1">
                                        Wholesale: ₹{product.wholesalePrice}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PriceSync;