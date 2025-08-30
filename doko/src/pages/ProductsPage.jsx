import React from 'react'
import { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
const ProductsPage = () => {
      const [products, setProducts] = useState([]);
        
        useEffect(() => {
          // Simulate API call to fetch products
          const fetchedProducts = [
            {
              name: 'Organic Tomatoes',
              price: 'NPR 60/kg',
              location: 'Dharan, Koshi',
              seller: 'Ram Shrestha',
              image: 'https://images.unsplash.com/photo-1561136594-7f68413baa99?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
            },
            {
              name: 'Fresh Cauliflower',
              price: 'NPR 40/piece',
              location: 'Pokhara, Gandaki',
              seller: 'Sita Devi',
              image: 'https://images.unsplash.com/photo-1601056639636-ecd50c53e2c9?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
            },
            {
              name: 'Organic Potatoes',
              price: 'NPR 45/kg',
              location: 'Kathmandu, Bagmati',
              seller: 'Gopal Parajuli',
              image: 'https://images.unsplash.com/photo-1591768575198-88dac53fbd0a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
            },
     {
              name: 'Fresh Strawberries',
              price: 'NPR 250/kg',
              location: 'Ilam, Province 1',
              seller: 'Mina Rai',
              image: 'https://images.unsplash.com/photo-1598030304671-5aa1d6f13fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
            },
            {
              name: 'Fresh Cabbage',
              price: 'NPR 35/piece',
              location: 'Chitwan, Bagmati',
              seller: 'Hari Prasad',
              image: 'https://images.unsplash.com/photo-1561136594-7f68413baa99?ixlib=rb-4.0.3&auto:format&fit=crop&w=600&q=80'
            },
            {
              name: 'Organic Carrots',
              price: 'NPR 55/kg',
              location: 'Mustang, Gandaki',
              seller: 'Laxmi Gurung',
              image: 'https://images.unsplash.com/photo-1591768575198-88dac53fbd0a?ixlib=rb-4.0.3&auto:format&fit=crop&w=600&q=80'
            },
            {
              name: 'Fresh Bell Peppers',
              price: 'NPR 120/kg',
              location: 'Kavre, Bagmati',
              seller: 'Bimala Shrestha',
              image: 'https://images.unsplash.com/photo-1561136594-7f68413baa99?ixlib=rb-4.0.3&auto:format&fit=crop&w=600&q=80'
            },
 {
              name: 'Organic Spinach',
              price: 'NPR 40/bunch',
              location: 'Lalitpur, Bagmati',
              seller: 'Sunita Maharjan',
              image: 'https://images.unsplash.com/photo-1601056639636-ecd50c53e2c9?ixlib=rb-4.0.3&auto:format&fit=crop&w=600&q=80'
            }
          ];
          
          setProducts(fetchedProducts);
        }, []);

  return (
    <div className="container mx-auto px-4 py-8 dark:bg-gradient-to-br dark:from-green-800 dark:to-blue-500">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 text-slate-800 dark:text-slate-200">All Products</h2>
              <p className="text-xl text-slate-600 dark:text-slate-400">Browse fresh agricultural products from farmers across Nepal</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product, index) => (
                <ProductCard key={index} product={product} />
              ))}
            </div>
          </div>

  );
};

export default ProductsPage;