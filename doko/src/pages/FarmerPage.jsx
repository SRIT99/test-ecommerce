// import React from 'react';

// const FarmerPage = () => {
//   return (
//     <div className="container mx-auto px-4 py-12 text-center">
//       
//       <p className="text-xl text-slate-700 dark:text-slate-300 mb-8">

//       </p>
//       {/* You can add a list or grid of farmer profiles here */}
//       <div className="mt-8">
//         <p className="text-lg text-slate-600 dark:text-slate-400">(Farmer profiles coming soon...)</p>
//       </div>
//     </div>
//   );
// };

// export default FarmerPage;

import { useState, useEffect } from 'react';
import FarmerCard from '../components/FarmerCard';
import { Dessert } from 'lucide-react';
const ProductsPage = () => {
      const [farmers, setFarmers] = useState([]);
        
        useEffect(() => {
          // Simulate API call to fetch products
          const fetchedFarmers = [
            {
              name: 'Ram Bahadur',
              location: 'Dharan, Koshi',
              image: 'https://images.unsplash.com/photo-1561136594-7f68413baa99?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
              description : 'Experienced farmer specializing in organic vegetables.',
              products: ['Tomatoes', 'Chili Peppers']
            },
            {
              name: 'Sita Devi',
              location: 'Pokhara, Gandaki',
              image: 'https://images.unsplash.com/photo-1601056639636-ecd50c53e2c9?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
              description : 'Passionate about sustainable farming and fresh produce.',
              products: ['Lettuce', 'Cucumbers']
            }
          ];
//             {
//               name: 'Organic Potatoes',
//               price: 'NPR 45/kg',
//               location: 'Kathmandu, Bagmati',
//               seller: 'Gopal Parajuli',
//               image: 'https://images.unsplash.com/photo-1591768575198-88dac53fbd0a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
//             },
//      {
//               name: 'Fresh Strawberries',
//               price: 'NPR 250/kg',
//               location: 'Ilam, Province 1',
//               seller: 'Mina Rai',
//               image: 'https://images.unsplash.com/photo-1598030304671-5aa1d6f13fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
//             },
//             {
//               name: 'Fresh Cabbage',
//               price: 'NPR 35/piece',
//               location: 'Chitwan, Bagmati',
//               seller: 'Hari Prasad',
//               image: 'https://images.unsplash.com/photo-1561136594-7f68413baa99?ixlib=rb-4.0.3&auto:format&fit=crop&w=600&q=80'
//             },
//             {
//               name: 'Organic Carrots',
//               price: 'NPR 55/kg',
//               location: 'Mustang, Gandaki',
//               seller: 'Laxmi Gurung',
//               image: 'https://images.unsplash.com/photo-1591768575198-88dac53fbd0a?ixlib=rb-4.0.3&auto:format&fit=crop&w=600&q=80'
//             },
//             {
//               name: 'Fresh Bell Peppers',
//               price: 'NPR 120/kg',
//               location: 'Kavre, Bagmati',
//               seller: 'Bimala Shrestha',
//               image: 'https://images.unsplash.com/photo-1561136594-7f68413baa99?ixlib=rb-4.0.3&auto:format&fit=crop&w=600&q=80'
//             },
//  {
//               name: 'Organic Spinach',
//               price: 'NPR 40/bunch',
//               location: 'Lalitpur, Bagmati',
//               seller: 'Sunita Maharjan',
//               image: 'https://images.unsplash.com/photo-1601056639636-ecd50c53e2c9?ixlib=rb-4.0.3&auto:format&fit=crop&w=600&q=80'
//             }
//           ];
          
          setProducts(fetchedFarmers);
        }, []);

  return (
    <div className="container mx-auto px-4 py-8 dark:bg-gradient-to-br dark:from-green-800 dark:to-blue-500">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold mb-6 text-green-700 dark:text-green-200">Meet Our Farmers</h1>
              Connecting you directly to the hardworking farmers of Nepal. Discover their stories and products!
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {farmers.map((farmer, index) => (
                <FarmerCard key={index} farmer={farmer} />
              ))}
            </div>
          </div>
  );
}

export default ProductsPage;
