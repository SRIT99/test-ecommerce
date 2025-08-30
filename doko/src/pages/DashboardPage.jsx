import React from 'react'

const DashboardPage = ({ setCurrentPage, setCurrentUser }) => {
    const getDashboardContent = () => {
        switch (currentUser.type) {
            case 'buyer':

                return (
                    <div>
                        <h2 className="text-2xl font-bold mb-6">Buyer Dashboard</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md">
                                <div className="text-primary text-3xl mb-2">
                                    <i className="fas fa-shopping-cart"></i>
                                </div>
                                <h3 className="text-xl font-semibold mb-2">12</h3>
                                <p className="text-slate-600 dark:text-slate-400">Orders Placed</p>
                            </div>
                            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md">
                                <div className="text-primary text-3xl mb-2">
                                    <i className="fas fa-heart"></i>
                                </div>
                                <h3 className="text-xl font-semibold mb-2">8</h3>
                                <p className="text-slate-600 dark:text-slate-400">Wishlisted Items</p>
                            </div>
                            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md">
                                <div className="text-primary text-3xl mb-2">
                                    <i className="fas fa-star"></i>
                                </div>
                                <h3 className="text-xl font-semibold mb-2">15</h3>
                                <p className="text-slate-600 dark:text-slate-400">Reviews Given</p>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md">
                            <h3 className="text-xl font-semibold mb-4">Recent Orders</h3>
                            <p className="text-slate-600 dark:text-slate-400">You haven't placed any orders yet.</p>
                            <button
                                className="mt-4 bg-primary hover:bg-dark text-white py-2 px-4 rounded transition-colors"
                                onClick={() => setCurrentPage('products')}
                            >
                                Browse Products
                            </button>
                        </div>
                    </div>
                );
            case 'seller':
                return (
                    <div>
                        <h2 className="text-2xl font-bold mb-6">Seller Dashboard</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md">
                                <div className="text-primary text-3xl mb-2">
                                    <i className="fas fa-box"></i>
                                </div>
                                <h3 className="text-xl font-semibold mb-2">24</h3>
                                <p className="text-slate-600 dark:text-slate-400">Products Listed</p>
                            </div>
                            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md">
                                <div className="text-primary text-3xl mb-2">
                                    <i className="fas fa-shopping-cart"></i>
                                </div>
                                <h3 className="text-xl font-semibold mb-2">18</h3>
                                <p className="text-slate-600 dark:text-slate-400">Orders Received</p>
                            </div>
                            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md">
                                <div className="text-primary text-3xl mb-2">
                                    <i className="fas fa-money-bill-wave"></i>
                                </div>
                                <h3 className="text-xl font-semibold mb-2">NPR 42,500</h3>
                                <p className="text-slate-600 dark:text-slate-400">Total Earnings</p>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md">
                            <h3 className="text-xl font-semibold mb-4">Recent Orders</h3>
                            <p className="text-slate-600 dark:text-slate-400">You have 3 pending orders to fulfill.</p>
                            <button className="mt-4 bg-primary hover:bg-dark text-white py-2 px-4 rounded transition-colors">
                                View Orders
                            </button>
                        </div>
                    </div>
                );
            case 'admin':
                return (
                    <div>
                        <h2 className="text-2xl font-bold mb-6">Admin Dashboard</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md">
                                <div className="text-primary text-3xl mb-2">
                                    <i className="fas fa-users"></i>
                                </div>
                                <h3 className="text-xl font-semibold mb-2">542</h3>
                                <p className="text-slate-600 dark:text-slate-400">Total Users</p>
                            </div>
                            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md">
                                <div className="text-primary text-3xl mb-2">
                                    <i className="fas fa-store"></i>
                                </div>
                                <h3 className="text-xl font-semibold mb-2">127</h3>
                                <p className="text-slate-600 dark:text-slate-400">Active Sellers</p>
                            </div>
                            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md">
                                <div className="text-primary text-3xl mb-2">
                                    <i className="fas fa-chart-line"></i>
                                </div>
                                <h3 className="text-xl font-semibold mb-2">NPR 2.4L</h3>
                                <p className="text-slate-600 dark:text-slate-400">Platform Revenue</p>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md">
                            <h3 className="text-xl font-semibold mb-4">System Overview</h3>
                            <p className="text-slate-600 dark:text-slate-400">Everything is running smoothly. No issues reported.</p>
                            <button className="mt-4 bg-primary hover:bg-dark text-white py-2 px-4 rounded transition-colors">
                                View Reports
                            </button>
                        </div>
                    </div>
                );
            default:
                return <div>Invalid user type</div>;
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                    Welcome back, {currentUser.name}!
                </h1>
                <p className="text-slate-600 dark:text-slate-400">
                    {currentUser.type === 'buyer' && 'Browse fresh products from local farmers'}
                    {currentUser.type === 'seller' && 'Manage your products and orders'}
                    {currentUser.type === 'admin' && 'Monitor platform activity and manage users'}
                </p>
            </div>

            {getDashboardContent()}
        </div>


    );
};

export default DashboardPage;