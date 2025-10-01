import React, { useState } from 'react';
import { adminService } from '../../services/adminService';

const PriceSync = () => {
    const [syncing, setSyncing] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    const handleSyncPrices = async () => {
        try {
            setSyncing(true);
            setError(null);
            const response = await adminService.syncPrices();
            setResult(response);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to sync prices');
        } finally {
            setSyncing(false);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Price Synchronization</h2>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <p className="text-yellow-800">
                    This will sync current market prices for all products from external sources.
                    Prices are automatically synced daily at 6 AM.
                </p>
            </div>

            <button
                onClick={handleSyncPrices}
                disabled={syncing}
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center space-x-2"
            >
                {syncing ? (
                    <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Syncing Prices...</span>
                    </>
                ) : (
                    <>
                        <span>💰</span>
                        <span>Sync Prices Now</span>
                    </>
                )}
            </button>

            {result && (
                <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-green-800 font-medium">Sync completed successfully!</p>
                    <p className="text-green-700">Updated {result.updated || 0} products</p>
                </div>
            )}

            {error && (
                <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-800">{error}</p>
                </div>
            )}

            <div className="mt-6 grid md:grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">Last Sync</h3>
                    <p className="text-gray-600">6:00 AM Today</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">Products Count</h3>
                    <p className="text-gray-600">24 products</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">Next Sync</h3>
                    <p className="text-gray-600">6:00 AM Tomorrow</p>
                </div>
            </div>
        </div>
    );
};

export default PriceSync;