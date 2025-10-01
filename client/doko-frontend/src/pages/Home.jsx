import React from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import ProductCard from '../components/common/ProductCard';

const Home = () => {
    const { products, loading } = useProducts({ limit: 8 });

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-green-50 to-emerald-100 py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-5xl font-bold text-gray-900 mb-6">
                            Welcome to <span className="text-green-600">DOKO</span>
                        </h1>
                        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                            Nepal's Smart Agro-based Marketplace connecting farmers directly with buyers.
                            Fresh produce, fair prices, and a sustainable future for agriculture.
                        </p>
                        <div className="space-x-4">
                            <Link
                                to="/products"
                                className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
                            >
                                Shop Fresh Produce
                            </Link>
                            <Link
                                to="/signup?type=farmer"
                                className="border border-green-600 text-green-600 px-8 py-3 rounded-lg hover:bg-green-50 transition-colors font-medium"
                            >
                                Sell Your Products
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900">Why Choose DOKO?</h2>
                        <p className="text-gray-600 mt-4">Transforming agriculture through technology</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="text-center p-6">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl">🌱</span>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Direct Farmer Connection</h3>
                            <p className="text-gray-600">Buy directly from verified farmers, eliminating middlemen and ensuring fair prices.</p>
                        </div>

                        <div className="text-center p-6">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl">💰</span>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Best Prices</h3>
                            <p className="text-gray-600">Real-time market prices and transparent pricing for both buyers and sellers.</p>
                        </div>

                        <div className="text-center p-6">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl">🚚</span>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
                            <p className="text-gray-600">Efficient logistics network ensuring fresh produce reaches you quickly.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Products */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-3xl font-bold text-gray-900">Fresh Produce</h2>
                        <Link to="/products" className="text-green-600 hover:text-green-700 font-medium">
                            View All →
                        </Link>
                    </div>

                    {loading ? (
                        <div className="grid md:grid-cols-4 gap-6">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="bg-white rounded-lg shadow-md p-4 animate-pulse">
                                    <div className="h-48 bg-gray-300 rounded mb-4"></div>
                                    <div className="h-4 bg-gray-300 rounded mb-2"></div>
                                    <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-4 gap-6">
                            {products.map((product) => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default Home;