import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const LiveMarketFeed = () => {
    const [marketData, setMarketData] = useState({ retail: [] });
    const [prevData, setPrevData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterCrop, setFilterCrop] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [lastUpdated, setLastUpdated] = useState(null);

    const fetchData = async () => {
        try {
            const res = await fetch('http://localhost:5000/');
            const data = await res.json();

            // Add trend indicators
            const updatedRetail = data.retail.map((item, idx) => {
                const prev = prevData[idx];
                let trend = 'stable';
                if (prev) {
                    if (item.price > prev.price) trend = 'up';
                    else if (item.price < prev.price) trend = 'down';
                }
                return { ...item, trend };
            });

            setMarketData({ retail: updatedRetail });
            setPrevData(data.retail);
            setLastUpdated(new Date());
            setLoading(false);
        } catch {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData(); // initial load
        const interval = setInterval(fetchData, 60000); // auto-refresh every 60s
        return () => clearInterval(interval);
    }, []);

    const filteredRetail = marketData.retail.filter(item =>
        item.name.toLowerCase().includes(filterCrop.toLowerCase()) &&
        (!maxPrice || item.price <= maxPrice)
    );

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">🌾 Live Market Prices</h2>
            <div className="mb-2 text-right text-xs text-slate-500 dark:text-slate-400">
                Last updated: {lastUpdated ? lastUpdated.toLocaleTimeString() : '...'}
            </div>
            {/* Filters */}
            <div className="mb-6 flex flex-col sm:flex-row gap-4">
                <input
                    type="text"
                    placeholder="Filter by crop name"
                    value={filterCrop}
                    onChange={(e) => setFilterCrop(e.target.value)}
                    className="px-4 py-2 border rounded dark:bg-slate-700 dark:text-white"
                />
                <input
                    type="number"
                    placeholder="Max price (NPR)"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="px-4 py-2 border rounded dark:bg-slate-700 dark:text-white"
                />
            </div>
            {/* Swipeable Cards */}
            <div className="overflow-x-auto whitespace-nowrap flex gap-4 pb-4">
                {loading ? (
                    <p>Loading market data...</p>
                ) : filteredRetail.length === 0 ? (
                    <p>No crops match your filters.</p>
                ) : (
                    filteredRetail.map((item, idx) => (
                        <div key={idx} className="min-w-[250px] bg-white dark:bg-slate-800 p-4 rounded-lg shadow">
                            <h3 className="text-lg font-semibold">{item.name}</h3>
                            <p className="text-primary font-bold text-xl flex items-center gap-2">
                                NPR {item.price}
                                {item.trend === 'up' && <span className="text-green-500">↑</span>}
                                {item.trend === 'down' && <span className="text-red-500">↓</span>}
                                {item.trend === 'stable' && <span className="text-slate-400">→</span>}
                            </p>
                        </div>
                    ))
                )}
            </div>
            <Link
                to="/live-market"
                className="text-primary hover:text-primary-light font-medium"
            >
                🌾 Live Market
            </Link>
        </div>
    );
};

export default LiveMarketFeed;