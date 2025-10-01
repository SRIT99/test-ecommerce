import React, { useState } from 'react';
import { adminService } from '../../services/adminService';

const AdminManagement = () => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('admin');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleInviteAdmin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      await adminService.inviteAdmin({ email, role });
      setMessage(`Invitation sent successfully to ${email}`);
      setEmail('');
    } catch (error) {
      setMessage(error.response?.data?.error || 'Failed to send invitation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Add New Admin</h2>
      
      <form onSubmit={handleInviteAdmin} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500"
            placeholder="Enter email address"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Role
          </label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500"
          >
            <option value="admin">Administrator</option>
            <option value="moderator">Moderator</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? 'Sending Invitation...' : 'Send Invitation'}
        </button>
      </form>

      {message && (
        <div className={`mt-4 p-3 rounded-lg ${
          message.includes('successfully') 
            ? 'bg-green-50 text-green-700 border border-green-200'
            : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {message}
        </div>
      )}

      <div className="mt-6">
        <h3 className="font-semibold mb-2">Current Admins</h3>
        {/* List of current admins would go here */}
      </div>
    </div>
  );
};

export default AdminManagement;