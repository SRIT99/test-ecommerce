// src/components/farmer/FarmerProfile.js
import React, { useState, useEffect } from 'react';
import { farmerService } from '../../services/farmerService';
import { useAuth } from '../../hooks/useAuth';

const FarmerProfile = () => {
    const { user, updateUser } = useAuth();
    const [profile, setProfile] = useState({
        name: '',
        email: '',
        phone: '',
        location: '',
        bio: '',
        farmName: '',
        farmSize: '',
        farmingType: '',
        yearsFarming: '',
        certifications: []
    });
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (user) {
            setProfile({
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
                location: user.location || '',
                bio: user.bio || '',
                farmName: user.farmName || '',
                farmSize: user.farmSize || '',
                farmingType: user.farmingType || '',
                yearsFarming: user.yearsFarming || '',
                certifications: user.certifications || []
            });
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCertificationAdd = () => {
        setProfile(prev => ({
            ...prev,
            certifications: [...prev.certifications, '']
        }));
    };

    const handleCertificationChange = (index, value) => {
        setProfile(prev => ({
            ...prev,
            certifications: prev.certifications.map((cert, i) => i === index ? value : cert)
        }));
    };

    const handleCertificationRemove = (index) => {
        setProfile(prev => ({
            ...prev,
            certifications: prev.certifications.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        setMessage('');

        try {
            const updatedUser = await farmerService.updateProfile(profile);
            updateUser(updatedUser);
            setMessage('Profile updated successfully!');

            // Clear message after 3 seconds
            setTimeout(() => setMessage(''), 3000);
        } catch (err) {
            setError('Failed to update profile. Please try again.');
            console.error('Profile update error:', err);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Farm Profile</h1>
                <p className="text-gray-600">Manage your farm information and personal details</p>
            </div>

            {message && (
                <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg mb-6">
                    {message}
                </div>
            )}

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Profile Form */}
                <div className="lg:col-span-2">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Personal Information */}
                        <div className="bg-white rounded-2xl p-6 shadow-lg border border-green-100/50">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Full Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={profile.name}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={profile.email}
                                        onChange={handleChange}
                                        disabled
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Phone Number *
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={profile.phone}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                        placeholder="+977 98XXXXXX"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Location *
                                    </label>
                                    <input
                                        type="text"
                                        name="location"
                                        value={profile.location}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                        placeholder="City, Province"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Farm Information */}
                        <div className="bg-white rounded-2xl p-6 shadow-lg border border-green-100/50">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Farm Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Farm Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="farmName"
                                        value={profile.farmName}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                        placeholder="e.g., Green Valley Organic Farm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Farm Size
                                    </label>
                                    <input
                                        type="text"
                                        name="farmSize"
                                        value={profile.farmSize}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                        placeholder="e.g., 5 hectares"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Farming Type
                                    </label>
                                    <select
                                        name="farmingType"
                                        value={profile.farmingType}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                    >
                                        <option value="">Select farming type</option>
                                        <option value="organic">Organic Farming</option>
                                        <option value="traditional">Traditional Farming</option>
                                        <option value="hydroponic">Hydroponic</option>
                                        <option value="greenhouse">Greenhouse</option>
                                        <option value="mixed">Mixed Farming</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Years Farming
                                    </label>
                                    <input
                                        type="number"
                                        name="yearsFarming"
                                        value={profile.yearsFarming}
                                        onChange={handleChange}
                                        min="0"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                        placeholder="e.g., 5"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Bio & Certifications */}
                        <div className="bg-white rounded-2xl p-6 shadow-lg border border-green-100/50">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">About & Certifications</h3>

                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Farm Bio
                                </label>
                                <textarea
                                    name="bio"
                                    value={profile.bio}
                                    onChange={handleChange}
                                    rows={4}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                    placeholder="Tell customers about your farm, farming practices, and what makes your products special..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Certifications
                                </label>
                                <div className="space-y-3">
                                    {profile.certifications.map((cert, index) => (
                                        <div key={index} className="flex space-x-2">
                                            <input
                                                type="text"
                                                value={cert}
                                                onChange={(e) => handleCertificationChange(index, e.target.value)}
                                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                                placeholder="e.g., Organic Certified, ISO 22000"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => handleCertificationRemove(index)}
                                                className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={handleCertificationAdd}
                                        className="px-4 py-2 border border-dashed border-gray-300 text-gray-600 rounded-lg hover:border-green-500 hover:text-green-600 transition-colors"
                                    >
                                        + Add Certification
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-end space-x-4">
                            <button
                                type="button"
                                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={saving}
                                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                            >
                                {saving ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Sidebar - Profile Summary */}
                <div className="space-y-6">
                    {/* Profile Status */}
                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-green-100/50">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Status</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Verification</span>
                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${user?.isVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                    }`}>
                                    {user?.isVerified ? 'Verified' : 'Pending'}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Member Since</span>
                                <span className="text-sm font-medium text-gray-900">
                                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Profile Completion</span>
                                <span className="text-sm font-medium text-green-600">85%</span>
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-green-100/50">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Farm Stats</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Active Products</span>
                                <span className="font-semibold text-gray-900">12</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Total Orders</span>
                                <span className="font-semibold text-gray-900">45</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Customer Rating</span>
                                <span className="font-semibold text-amber-600">4.8 ★</span>
                            </div>
                        </div>
                    </div>

                    {/* Tips */}
                    <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
                        <h3 className="text-lg font-semibold text-blue-900 mb-2">💡 Profile Tips</h3>
                        <ul className="text-sm text-blue-700 space-y-2">
                            <li>• Complete all fields for better customer trust</li>
                            <li>• Add certifications to stand out</li>
                            <li>• Upload farm photos in your bio</li>
                            <li>• Keep your contact information updated</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FarmerProfile;