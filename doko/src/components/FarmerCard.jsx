import React from 'react';
import { Link } from 'react-router-dom';

const FarmerCard = ({ farmer }) => {
  const initials = farmer.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      <div className="p-6 flex items-center space-x-4">
        <div className="w-14 h-14 rounded-full bg-primary-light flex items-center justify-center text-white font-bold text-xl">
          {initials}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
            {farmer.name}
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {farmer.region}
          </p>
          {farmer.verified && (
            <span className="inline-block mt-1 text-xs bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-300 px-2 py-1 rounded">
              Verified Farmer
            </span>
          )}
        </div>
      </div>

      <div className="px-6 pb-6">
        <p className="text-slate-700 dark:text-slate-300 mb-2">
          🧺 {farmer.productsListed} products listed
        </p>
        <Link to={`/farmer/${farmer.id}`}>
          <button className="w-full bg-primary dark:bg-primary-light hover:bg-dark dark:hover:bg-dark text-white py-2 rounded transition-colors">
            View Profile
          </button>
        </Link>
      </div>
    </div>
  );
};

export default FarmerCard;
