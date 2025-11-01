// src/components/admin/UserManagement.js
import React, { useState, useEffect } from 'react';
import { userService, adminService } from '../../services/adminService';
import AdminSidebar from './AdminSidebar';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        userType: 'all',
        search: '',
        page: 1,
        limit: 10
    });
    const [pagination, setPagination] = useState({});

    useEffect(() => {
        fetchUsers();
    }, [filters]);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            setError(null);
            console.log('📡 Fetching users with filters:', filters);

            const data = await userService.getUsers(filters);
            console.log('✅ Users API response:', data);

            // Handle different response structures
            const usersList = data.users || data.data || data || [];
            console.log('👥 Processed users list:', usersList);

            setUsers(usersList);
            setPagination({
                totalPages: data.totalPages || data.pagination?.totalPages || 1,
                currentPage: data.currentPage || data.pagination?.currentPage || 1,
                total: data.total || data.pagination?.total || usersList.length
            });
        } catch (error) {
            console.error('❌ Failed to fetch users:', error);
            setError(error.response?.data?.message || error.message || 'Failed to fetch users');
            setUsers([]);
        } finally {
            setLoading(false);
        }
    };

    // Calculate stats - FIXED: Check both role and userType properties
    const stats = {
        total: users.length,
        sellers: users.filter(user =>
            user.role === 'seller' || user.userType === 'seller' || user.role === 'farmer'
        ).length,
        buyers: users.filter(user =>
            user.role === 'buyer' || user.userType === 'buyer'
        ).length,
        admins: users.filter(user =>
            user.role === 'admin' || user.userType === 'admin' || user.role === 'superadmin'
        ).length
    };

    const handleVerifyUser = async (userId) => {
        try {
            console.log('🔐 Verifying user:', userId);
            await adminService.verifyUser(userId);
            alert('User verified successfully!');
            fetchUsers();
        } catch (error) {
            console.error('❌ Failed to verify user:', error);
            alert(error.response?.data?.message || 'Failed to verify user');
        }
    };

    const handleSuspendUser = async (userId) => {
        try {
            console.log('⏸️ Suspending user:', userId);
            await adminService.suspendUser(userId);
            alert('User suspended successfully!');
            fetchUsers();
        } catch (error) {
            console.error('❌ Failed to suspend user:', error);
            alert(error.response?.data?.message || 'Failed to suspend user');
        }
    };

    const handleActivateUser = async (userId) => {
        try {
            console.log('▶️ Activating user:', userId);
            await adminService.activateUser(userId);
            alert('User activated successfully!');
            fetchUsers();
        } catch (error) {
            console.error('❌ Failed to activate user:', error);
            alert(error.response?.data?.message || 'Failed to activate user');
        }
    };

    const UserCard = ({ user }) => (
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {user.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900">{user.name || 'Unknown User'}</h3>
                        <p className="text-gray-600 text-sm">{user.email}</p>
                        <div className="flex items-center space-x-2 mt-1">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${user.role === 'seller' || user.userType === 'seller' ? 'bg-green-100 text-green-800' :
                                    user.role === 'buyer' || user.userType === 'buyer' ? 'bg-blue-100 text-blue-800' :
                                        user.role === 'admin' || user.userType === 'admin' ? 'bg-purple-100 text-purple-800' :
                                            'bg-gray-100 text-gray-800'
                                }`}>
                                {user.role || user.userType || 'user'}
                            </span>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${user.isVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                {user.isVerified ? 'Verified' : 'Pending'}
                            </span>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                }`}>
                                {user.isActive ? 'Active' : 'Inactive'}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    {(user.role === 'seller' || user.userType === 'seller') && !user.isVerified && (
                        <button
                            onClick={() => handleVerifyUser(user._id)}
                            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium text-sm"
                        >
                            Verify Seller
                        </button>
                    )}
                    {user.isActive ? (
                        <button
                            onClick={() => handleSuspendUser(user._id)}
                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium text-sm"
                        >
                            Suspend
                        </button>
                    ) : (
                        <button
                            onClick={() => handleActivateUser(user._id)}
                            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium text-sm"
                        >
                            Activate
                        </button>
                    )}
                </div>
            </div>
            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                <div>
                    <span className="font-medium">Joined:</span>
                    <p>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}</p>
                </div>
                <div>
                    <span className="font-medium">Location:</span>
                    <p>{user.location || 'Not specified'}</p>
                </div>
                <div>
                    <span className="font-medium">Phone:</span>
                    <p>{user.phone || 'Not provided'}</p>
                </div>
                <div>
                    <span className="font-medium">User ID:</span>
                    <p className="text-xs font-mono">{user._id ? user._id.substring(0, 8) + '...' : 'N/A'}</p>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <AdminSidebar />
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-3">
                        <div className="space-y-6">
                            {/* Header */}
                            <div className="flex justify-between items-center">
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
                                    <p className="text-gray-600">Manage platform users and permissions</p>
                                </div>
                                <button
                                    onClick={fetchUsers}
                                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
                                >
                                    Refresh
                                </button>
                            </div>

                            {/* Error Message */}
                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                                    <strong>Error: </strong>{error}
                                </div>
                            )}

                            {/* Stats Grid - 2 columns */}
                            <div className="grid grid-cols-2 gap-6">
                                <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-600">Total Users</p>
                                            <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                                        </div>
                                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                            <span className="text-2xl">👥</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-600">Sellers</p>
                                            <p className="text-3xl font-bold text-green-600">{stats.sellers}</p>
                                        </div>
                                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                            <span className="text-2xl">🏪</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-600">Buyers</p>
                                            <p className="text-3xl font-bold text-blue-600">{stats.buyers}</p>
                                        </div>
                                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                            <span className="text-2xl">🛒</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-600">Admins</p>
                                            <p className="text-3xl font-bold text-purple-600">{stats.admins}</p>
                                        </div>
                                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                            <span className="text-2xl">👨‍💼</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Filters */}
                            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">User Type</label>
                                        <select
                                            value={filters.userType}
                                            onChange={(e) => setFilters(prev => ({ ...prev, userType: e.target.value, page: 1 }))}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="all">All Users</option>
                                            <option value="buyer">Buyers</option>
                                            <option value="seller">Sellers</option>
                                            <option value="admin">Admins</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                                        <input
                                            type="text"
                                            placeholder="Search by name or email..."
                                            value={filters.search}
                                            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value, page: 1 }))}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Results per page</label>
                                        <select
                                            value={filters.limit}
                                            onChange={(e) => setFilters(prev => ({ ...prev, limit: parseInt(e.target.value), page: 1 }))}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="5">5</option>
                                            <option value="10">10</option>
                                            <option value="20">20</option>
                                            <option value="50">50</option>
                                        </select>
                                    </div>
                                    <div className="flex items-end">
                                        <button
                                            onClick={fetchUsers}
                                            className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
                                        >
                                            Apply Filters
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Users Grid */}
                            {loading ? (
                                <div className="grid grid-cols-1 gap-6">
                                    {[...Array(5)].map((_, i) => (
                                        <div key={i} className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 animate-pulse">
                                            <div className="flex items-center space-x-4">
                                                <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                                                <div className="space-y-2 flex-1">
                                                    <div className="h-4 bg-gray-300 rounded w-32"></div>
                                                    <div className="h-3 bg-gray-300 rounded w-24"></div>
                                                    <div className="flex space-x-2">
                                                        <div className="h-6 bg-gray-300 rounded w-16"></div>
                                                        <div className="h-6 bg-gray-300 rounded w-16"></div>
                                                    </div>
                                                </div>
                                                <div className="h-8 bg-gray-300 rounded w-20"></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 gap-6">
                                        {users.map(user => (
                                            <UserCard key={user._id} user={user} />
                                        ))}
                                    </div>

                                    {/* Pagination */}
                                    {pagination.totalPages > 1 && (
                                        <div className="flex justify-center space-x-2">
                                            <button
                                                onClick={() => setFilters(prev => ({ ...prev, page: prev.page - 1 }))}
                                                disabled={filters.page <= 1}
                                                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                Previous
                                            </button>

                                            {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                                                const page = i + 1;
                                                return (
                                                    <button
                                                        key={page}
                                                        onClick={() => setFilters(prev => ({ ...prev, page }))}
                                                        className={`px-4 py-2 rounded-lg font-medium ${page === pagination.currentPage
                                                                ? 'bg-blue-500 text-white'
                                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                            }`}
                                                    >
                                                        {page}
                                                    </button>
                                                );
                                            })}

                                            <button
                                                onClick={() => setFilters(prev => ({ ...prev, page: prev.page + 1 }))}
                                                disabled={filters.page >= pagination.totalPages}
                                                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                Next
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}

                            {!loading && users.length === 0 && !error && (
                                <div className="text-center py-12 bg-white rounded-2xl shadow-lg border border-gray-100">
                                    <div className="text-6xl mb-4">👥</div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No users found</h3>
                                    <p className="text-gray-600">Try adjusting your search filters or check if there are any users in the system.</p>
                                    <button
                                        onClick={fetchUsers}
                                        className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                                    >
                                        Refresh
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserManagement;