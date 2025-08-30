import React from 'react'

const ProductCard = ({ product }) => {
      const initials = product.seller.split(' ').map(name => name[0]).join('');

  return (
     <div className="bg-white dark:bg-slate-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="h-48 overflow-hidden">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
              <p className="text-primary dark:text-primary-light font-bold text-xl mb-2">{product.price}</p>
              <div className="flex items-center text-slate-600 dark:text-slate-400 mb-3">
                <i className="fas fa-map-marker-alt mr-2"></i>
                <span>{product.location}</span>
              </div>
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 rounded-full bg-primary-light flex items-center justify-center text-white font-bold mr-2">
                  {initials}
                </div>
                <span className="text-sm">{product.seller}</span>
              </div>
              <button className="w-full bg-primary dark:bg-primary-light hover:bg-dark dark:hover:bg-dark text-white py-2 rounded transition-colors">
                View Details
              </button>
            </div>
          </div>

  )
}

export default ProductCard;