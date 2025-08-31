import React from 'react';

const FarmerPage = () => {
  return (
    <div className="container mx-auto px-4 py-12 text-center">
      <h1 className="text-4xl font-bold mb-6 text-green-700 dark:text-green-200">Meet Our Farmers</h1>
      <p className="text-xl text-slate-700 dark:text-slate-300 mb-8">
        Connecting you directly to the hardworking farmers of Nepal. Discover their stories and products!
      </p>
      {/* You can add a list or grid of farmer profiles here */}
      <div className="mt-8">
        <p className="text-lg text-slate-600 dark:text-slate-400">(Farmer profiles coming soon...)</p>
      </div>
    </div>
  );
};

export default FarmerPage;
