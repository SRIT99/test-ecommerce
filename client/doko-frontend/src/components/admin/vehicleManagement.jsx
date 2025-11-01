// src/components/admin/VehicleManagement.js
import React, { useState, useEffect } from 'react';
import { userService } from '../../services/adminService';

const VehicleManagement = () => {
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        type: '',
        capacity: '',
        licensePlate: '',
        driverName: '',
        driverContact: '',
        status: 'available'
    });

    useEffect(() => {
        fetchVehicles();
    }, []);

    const fetchVehicles = async () => {
        try {
            setLoading(true);
            const data = await userService.getVehicles();
            setVehicles(data.vehicles || []);
        } catch (error) {
            console.error('Failed to fetch vehicles:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await userService.createVehicle(formData);
            setShowForm(false);
            setFormData({
                type: '',
                capacity: '',
                licensePlate: '',
                driverName: '',
                driverContact: '',
                status: 'available'
            });
            fetchVehicles(); // Refresh the list
        } catch (error) {
            console.error('Failed to create vehicle:', error);
        }
    };

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Vehicle Management</h1>
                    <p className="text-gray-600">Manage delivery vehicles and drivers</p>
                </div>
                <button
                    onClick={() => setShowForm(true)}
                    className="bg-blue-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-600 transition-colors"
                >
                    + Add Vehicle
                </button>
            </div>

            {/* Add Vehicle Form */}
            {showForm && (
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Add New Vehicle</h3>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Type</label>
                            <select
                                name="type"
                                value={formData.type}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Select Type</option>
                                <option value="truck">Truck</option>
                                <option value="van">Van</option>
                                <option value="pickup">Pickup</option>
                                <option value="motorcycle">Motorcycle</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Capacity (kg)</label>
                            <input
                                type="number"
                                name="capacity"
                                value={formData.capacity}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="e.g., 1000"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">License Plate</label>
                            <input
                                type="text"
                                name="licensePlate"
                                value={formData.licensePlate}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="e.g., BA 1 PA 1234"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Driver Name</label>
                            <input
                                type="text"
                                name="driverName"
                                value={formData.driverName}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="e.g., Ram Bahadur"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Driver Contact</label>
                            <input
                                type="tel"
                                name="driverContact"
                                value={formData.driverContact}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="e.g., 98XXXXXXXX"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="available">Available</option>
                                <option value="maintenance">Maintenance</option>
                                <option value="busy">Busy</option>
                            </select>
                        </div>
                        <div className="md:col-span-2 flex space-x-4">
                            <button
                                type="submit"
                                className="flex-1 bg-green-500 text-white py-3 rounded-xl font-semibold hover:bg-green-600 transition-colors"
                            >
                                Add Vehicle
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowForm(false)}
                                className="flex-1 bg-gray-500 text-white py-3 rounded-xl font-semibold hover:bg-gray-600 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Vehicles Grid */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 animate-pulse">
                            <div className="h-4 bg-gray-300 rounded w-1/2 mb-4"></div>
                            <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
                            <div className="h-4 bg-gray-300 rounded w-2/3 mb-4"></div>
                            <div className="h-10 bg-gray-300 rounded"></div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {vehicles.map(vehicle => (
                        <div key={vehicle._id} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-bold text-lg text-gray-900">{vehicle.type}</h3>
                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${vehicle.status === 'available' ? 'bg-green-100 text-green-800' :
                                        vehicle.status === 'busy' ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-red-100 text-red-800'
                                    }`}>
                                    {vehicle.status}
                                </span>
                            </div>

                            <div className="space-y-3 mb-4">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">License Plate:</span>
                                    <span className="font-semibold text-gray-900">{vehicle.licensePlate}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Capacity:</span>
                                    <span className="font-semibold text-gray-900">{vehicle.capacity} kg</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Driver:</span>
                                    <span className="font-semibold text-gray-900">{vehicle.driverName}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Contact:</span>
                                    <span className="font-semibold text-gray-900">{vehicle.driverContact}</span>
                                </div>
                            </div>

                            <div className="flex space-x-2">
                                <button className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors font-medium">
                                    Edit
                                </button>
                                <button className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-colors font-medium">
                                    Remove
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {!loading && vehicles.length === 0 && (
                <div className="text-center py-12 bg-white rounded-2xl shadow-lg border border-gray-100">
                    <div className="text-6xl mb-4">🚚</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No vehicles added</h3>
                    <p className="text-gray-600">Add your first vehicle to start managing deliveries</p>
                </div>
            )}
        </div>
    );
};

export default VehicleManagement;