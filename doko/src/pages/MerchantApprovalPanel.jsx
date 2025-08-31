import React, { useState, useEffect } from 'react';

const MerchantApprovalPanel = () => {
  const [merchants, setMerchants] = useState([]);

  useEffect(() => {
    // Simulate fetching merchant applications from backend
    setMerchants([
      {
        id: 'm001',
        companyName: 'Green Wheels Logistics',
        contactPerson: 'Ramesh Thapa',
        phone: '9801234567',
        email: 'ramesh@greenwheels.com',
        vehicleType: 'Pickup',
        capacity: '1200 kg',
        region: 'Koshi Zone',
        status: 'pending',
      },
      {
        id: 'm002',
        companyName: 'Agro Express',
        contactPerson: 'Sita Karki',
        phone: '9812345678',
        email: 'sita@agroexpress.com',
        vehicleType: 'Truck',
        capacity: '3000 kg',
        region: 'Bagmati Zone',
        status: 'pending',
      },
    ]);
  }, []);

  const handleApproval = (id, decision) => {
    setMerchants((prev) =>
      prev.map((merchant) =>
        merchant.id === id ? { ...merchant, status: decision } : merchant
      )
    );
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-primary dark:text-primary-light mb-6">
        Merchant Approval Panel
      </h2>
      {merchants.length === 0 ? (
        <p className="text-slate-600 dark:text-slate-400">No pending applications.</p>
      ) : (
        <div className="space-y-6">
          {merchants.map((merchant) => (
            <div
              key={merchant.id}
              className="border border-slate-200 dark:border-slate-700 p-4 rounded-lg"
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
                  {merchant.companyName}
                </h3>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    merchant.status === 'approved'
                      ? 'bg-primary-light text-white'
                      : merchant.status === 'rejected'
                      ? 'bg-red-500 text-white'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-100'
                  }`}
                >
                  {merchant.status.charAt(0).toUpperCase() + merchant.status.slice(1)}
                </span>
              </div>
              <p className="text-slate-600 dark:text-slate-400 mb-1">
                <strong>Contact:</strong> {merchant.contactPerson} ({merchant.phone})
              </p>
              <p className="text-slate-600 dark:text-slate-400 mb-1">
                <strong>Email:</strong> {merchant.email}
              </p>
              <p className="text-slate-600 dark:text-slate-400 mb-1">
                <strong>Vehicle:</strong> {merchant.vehicleType} ({merchant.capacity})
              </p>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                <strong>Region:</strong> {merchant.region}
              </p>

              {merchant.status === 'pending' && (
                <div className="flex space-x-4">
                  <button
                    onClick={() => handleApproval(merchant.id, 'approved')}
                    className="bg-primary hover:bg-dark text-white px-4 py-2 rounded transition-colors"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleApproval(merchant.id, 'rejected')}
                    className="bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MerchantApprovalPanel;
