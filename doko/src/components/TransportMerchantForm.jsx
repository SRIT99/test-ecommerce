import React, { useState } from 'react';

const TransportMerchantForm = () => {
  const [formData, setFormData] = useState({
    companyName: '',
    contactPerson: '',
    phone: '',
    email: '',
    vehicleType: '',
    capacity: '',
    region: '',
    message: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Replace with actual API call
    console.log('Submitted:', formData);
    alert('Thank you for applying! We’ll be in touch soon.');
    setFormData({
      companyName: '',
      contactPerson: '',
      phone: '',
      email: '',
      vehicleType: '',
      capacity: '',
      region: '',
      message: '',
    });
  };

  return (
    <div className="min-h-screen bg-light dark:bg-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white dark:bg-slate-800 p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-primary dark:text-primary-light mb-6 text-center">
          Become a Transportation Merchant
        </h2>
        <p className="text-center text-slate-600 dark:text-slate-400 mb-8">
          Partner with DOKO to deliver fresh produce across Nepal. Let’s move agriculture forward together.
        </p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              type="text"
              name="companyName"
              placeholder="Company Name"
              value={formData.companyName}
              onChange={handleChange}
              required
              className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
            />
            <input
              type="text"
              name="contactPerson"
              placeholder="Contact Person"
              value={formData.contactPerson}
              onChange={handleChange}
              required
              className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              required
              className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
            />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
              className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <select
              name="vehicleType"
              value={formData.vehicleType}
              onChange={handleChange}
              required
              className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
            >
              <option value="">Select Vehicle Type</option>
              <option value="pickup">Pickup</option>
              <option value="truck">Truck</option>
              <option value="van">Van</option>
              <option value="tractor">Tractor</option>
            </select>

            <input
              type="text"
              name="capacity"
              placeholder="Capacity (kg)"
              value={formData.capacity}
              onChange={handleChange}
              required
              className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
            />
          </div>

          <input
            type="text"
            name="region"
            placeholder="Operating Region (e.g., Kosi Zone)"
            value={formData.region}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
          />

          <textarea
            name="message"
            placeholder="Tell us more about your service..."
            value={formData.message}
            onChange={handleChange}
            rows="4"
            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
          ></textarea>

          <button
            type="submit"
            className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 bg-primary hover:bg-dark text-white font-semibold rounded transition-colors"
          >
            Submit Application
          </button>
        </form>
      </div>
    </div>
  );
};

export default TransportMerchantForm;
