import React, { useEffect, useState, useRef } from 'react';

function LiveMarket() {
    const [marketData, setMarketData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [filterCrop, setFilterCrop] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [lastUpdated, setLastUpdated] = useState(null);
    const prevDataRef = useRef(null);

    // Helper to add trend info
    const addTrend = (current, previous) => {
        if (!previous) return current.map(item => ({ ...item, trend: 'stable' }));
        return current.map(item => {
            const prevItem = previous.find(p => p.name === item.name);
            let trend = 'stable';
            if (prevItem) {
                if (item.price > prevItem.price) trend = 'up';
                else if (item.price < prevItem.price) trend = 'down';
            }
            return { ...item, trend };
        });
    };

    useEffect(() => {
        const fetchData = () => {
            fetch('/api/market')
                .then(res => res.json())
                .then(data => {
                    // Add trend info
                    const retailWithTrend = addTrend(data.retail, prevDataRef.current?.retail);
                    const wholesaleWithTrend = addTrend(data.wholesale, prevDataRef.current?.wholesale);
                    setMarketData({
                        ...data,
                        retail: retailWithTrend,
                        wholesale: wholesaleWithTrend,
                    });
                    prevDataRef.current = data;
                    setLastUpdated(new Date());
                    setLoading(false);
                })
                .catch(() => setLoading(false));
        };

        fetchData(); // initial load
        const interval = setInterval(fetchData, 60000); // refresh every 60s

        return () => clearInterval(interval); // cleanup
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-light dark:bg-slate-900">
                <p className="text-slate-600 dark:text-slate-300 text-lg">Loading market rates...</p>
            </div>
        );
    }

    if (!marketData) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-light dark:bg-slate-900">
                <p className="text-red-600 dark:text-red-400 text-lg">No data available.</p>
            </div>
        );
    }

    // Filter logic
    const filterFn = item =>
        item.name.toLowerCase().includes(filterCrop.toLowerCase()) &&
        (!maxPrice || item.price <= maxPrice);

    const filteredRetail = marketData.retail.filter(filterFn);
    const filteredWholesale = marketData.wholesale.filter(filterFn);

    return (
        <div className="min-h-screen bg-light dark:bg-slate-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                <h1 className="text-3xl font-bold text-primary dark:text-primary-light mb-8 text-center">
                    🌾 Kalimati Live Market Rates
                </h1>
                <div className="mb-4 text-right text-xs text-slate-500 dark:text-slate-400">
                    Last updated: {lastUpdated ? lastUpdated.toLocaleTimeString() : '...'}
                </div>
                {/* Filters */}
                <div className="mb-6 flex flex-col sm:flex-row gap-4">
                    <input
                        type="text"
                        placeholder="Filter by crop name"
                        value={filterCrop}
                        onChange={e => setFilterCrop(e.target.value)}
                        className="px-4 py-2 border rounded dark:bg-slate-700 dark:text-white"
                    />
                    <input
                        type="number"
                        placeholder="Max price (NPR)"
                        value={maxPrice}
                        onChange={e => setMaxPrice(e.target.value)}
                        className="px-4 py-2 border rounded dark:bg-slate-700 dark:text-white"
                    />
                </div>
                {/* Retail Section */}
                <section className="mb-12">
                    <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-100 mb-4">
                        🛒 Retail Rates
                    </h2>
                    <div className="overflow-x-auto whitespace-nowrap flex gap-4 pb-4">
                        {filteredRetail.map((item, idx) => (
                            <div
                                key={idx}
                                className="min-w-[250px] bg-white dark:bg-slate-800 p-4 rounded-lg shadow hover:shadow-lg transition-shadow"
                            >
                                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-1">
                                    {item.name}
                                </h3>
                                <p className="text-primary dark:text-primary-light font-bold text-xl flex items-center gap-2">
                                    NPR {item.price}
                                    {item.trend === 'up' && <span className="text-green-500">↑</span>}
                                    {item.trend === 'down' && <span className="text-red-500">↓</span>}
                                    {item.trend === 'stable' && <span className="text-slate-400">→</span>}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>
                {/* Wholesale Section */}
                <section>
                    <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-100 mb-4">
                        🏬 Wholesale Rates
                    </h2>
                    <div className="overflow-x-auto whitespace-nowrap flex gap-4 pb-4">
                        {filteredWholesale.map((item, idx) => (
                            <div
                                key={idx}
                                className="min-w-[250px] bg-white dark:bg-slate-800 p-4 rounded-lg shadow hover:shadow-lg transition-shadow"
                            >
                                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-1">
                                    {item.name}
                                </h3>
                                <p className="text-secondary font-bold text-xl flex items-center gap-2">
                                    NPR {item.price}
                                    {item.trend === 'up' && <span className="text-green-500">↑</span>}
                                    {item.trend === 'down' && <span className="text-red-500">↓</span>}
                                    {item.trend === 'stable' && <span className="text-slate-400">→</span>}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}

export default LiveMarket;
