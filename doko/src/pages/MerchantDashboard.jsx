import React from 'react';

const MerchantDashboard = ({ merchant }) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-6">
        Welcome, {merchant.companyName}
      </h1>
      <p className="text-slate-600 dark:text-slate-400 mb-8">
        Manage your transportation services and track your delivery performance.
      </p>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md">
          <div className="text-primary text-3xl mb-2">
            <i className="fas fa-truck"></i>
          </div>
          <h3 className="text-xl font-semibold mb-2">128</h3>
          <p className="text-slate-600 dark:text-slate-400">Total Deliveries</p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md">
          <div className="text-primary text-3xl mb-2">
            <i className="fas fa-route"></i>
          </div>
          <h3 className="text-xl font-semibold mb-2">5</h3>
          <p className="text-slate-600 dark:text-slate-400">Active Routes</p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md">
          <div className="text-primary text-3xl mb-2">
            <i className="fas fa-money-bill-wave"></i>
          </div>
          <h3 className="text-xl font-semibold mb-2">NPR 74,200</h3>
          <p className="text-slate-600 dark:text-slate-400">Monthly Earnings</p>
        </div>
      </div>

      {/* Recent Deliveries */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md mb-10">
        <h2 className="text-xl font-semibold mb-4 text-primary">Recent Deliveries</h2>
        <table className="w-full text-left">
          <thead>
            <tr className="text-slate-700 dark:text-slate-300">
              <th className="pb-2">Date</th>
              <th className="pb-2">Destination</th>
              <th className="pb-2">Status</th>
              <th className="pb-2">Payment</th>
            </tr>
          </thead>
          <tbody className="text-slate-600 dark:text-slate-400">
            <tr>
              <td className="py-2">Aug 28</td>
              <td>Biratnagar</td>
              <td>Delivered</td>
              <td>NPR 1,200</td>
            </tr>
            <tr>
              <td className="py-2">Aug 27</td>
              <td>Itahari</td>
              <td>In Transit</td>
              <td>NPR 950</td>
            </tr>
            <tr>
              <td className="py-2">Aug 26</td>
              <td>Dharan</td>
              <td>Delivered</td>
              <td>NPR 1,500</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Vehicle Info */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md mb-10">
        <h2 className="text-xl font-semibold mb-4 text-primary">Your Vehicle</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-2">
          <strong>Type:</strong> Pickup
        </p>
        <p className="text-slate-600 dark:text-slate-400 mb-2">
          <strong>Capacity:</strong> 1200 kg
        </p>
        <p className="text-slate-600 dark:text-slate-400">
          <strong>Status:</strong> Available
        </p>
      </div>

      {/* CTA */}
      <div className="text-center">
        <button className="bg-secondary hover:bg-primary text-white font-semibold py-3 px-6 rounded-lg transition-colors">
          Accept New Delivery
        </button>
      </div>
    </div>
  );
};

export default MerchantDashboard;
