import React, { useState } from 'react';
import { useAdminData } from '../../hooks/useAdmin';
import { adminService } from '../../services/adminService';

const UserManagement = () => {
    const { data: users, loading, error, refetch } = useAdminData('users');
    const [verifying, setVerifying] = useState(null);

    const handleVerifyUser = async (userId) => {
        try {
            setVerifying(userId);
            await adminService.verifyUser(userId);
            await refetch();
        } catch (error) {
            console.error('Failed to verify user:', error);
        } finally {
            setVerifying(null);
        }
    };

    const getRoleBadge = (userType) => {
        const badges = {
            admin: 'bg-red-100 text-red-800',
            seller: 'bg-blue-100 text-blue-800',
            buyer: 'bg-gray-100 text-gray-800'
        };
        return badges[userType] || 'bg-gray-100 text-gray-800';
    };

    if (loading) return <div className="text-center py-8">Loading users...</div>;
    if (error) return <div className="text-red-600 py-4">{error}</div>;

    return (
        <div className="bg-white rounded-lg shadow-md">
            <div className="p-6 border-b">
                <h2 className="text-xl font-semibold">User Management</h2>
                <p className="text-gray-600">Manage platform users and verify sellers</p>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {users.map((user) => (
                            <tr key={user._id} className="hover:bg-gray-50">
                                <td className="px-6 py-4">
                                    <div>
                                        <div className="font-medium text-gray-900">{user.name}</div>
                                        <div className="text-gray-500">{user.email}</div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleBadge(user.userType)}`}>
                                        {user.userType}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    {user.isVerified ? (
                                        <span className="inline-flex px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">
                                            Verified
                                        </span>
                                    ) : (
                                        <span className="inline-flex px-2 py-1 text-xs font-semibold text-yellow-800 bg-yellow-100 rounded-full">
                                            Pending
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-900">{user.location}</td>
                                <td className="px-6 py-4">
                                    {user.userType === 'seller' && !user.isVerified && (
                                        <button
                                            onClick={() => handleVerifyUser(user._id)}
                                            disabled={verifying === user._id}
                                            className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 disabled:opacity-50"
                                        >
                                            {verifying === user._id ? 'Verifying...' : 'Verify'}
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserManagement;