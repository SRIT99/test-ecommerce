import react, { useState, useEffect } from "react";
import Aos from "aos";
import Hero from "../components/Hero";
import FeatureCard from "../components/FeatureCard";
import ProductCard from "../components/ProductCard";

const HomePage = ({ setCurrentPage }) => {
  const [orderPopup, setOrderPopup] = useState(false);

  const handleOrderPopup = () => {
    setOrderPopup(!orderPopup);
  };
  useEffect(() => {
    Aos.init({
      offset: 100,
      duration: 800,
      easing: "ease-in-sine",
      delay: 100,
    });
    Aos.refresh();
  }, []);
  const products = [
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
    }
  ];

  const features = [
    {
      icon: 'fas fa-handshake',
      title: 'Direct Connection',
      description: 'Farmers and buyers connect directly without middlemen, ensuring fair prices for both parties.'
    },
    {
      icon: 'fas fa-chart-line',
      title: 'Real-Time Pricing',
      description: 'Access live market prices and demand trends to make informed decisions.'
    },
    {
      icon: 'fas fa-mobile-alt',
      title: 'Mobile Friendly',
      description: 'Works on all devices, even with low internet connectivity in rural areas.'
    },
    {
      icon: 'fas fa-shield-alt',
      title: 'Secure Payments',
      description: 'Integrated with eSewa, Khalti, and cash-on-delivery options for secure transactions.'
    }
  ];


  return (
    <div className="container w-full h-full">
      <Hero />

      <div>
        {/* Hero Section */}
        <section className="relative bg-[linear-gradient(rgba(0,0,0,0.6),rgba(0,0,0,0.6)),url('https://images.unsplash.com/photo-1625246335525-8f57a4fb1bc0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80')] bg-cover bg-center text-white py-20 rounded-lg mb-8">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Connecting Farmers Directly to Buyers</h2>
            <p className="text-xl max-w-2xl mx-auto mb-8">DOKO is a smart agro-based marketplace that eliminates middlemen, ensures fair prices, and brings transparency to agricultural trade in Nepal.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                className="bg-primary hover:bg-dark text-white py-3 px-6 rounded-lg transition-colors"
                onClick={() => setCurrentPage('register')}
              >
                I'm a Farmer
              </button>
              <button
                className="bg-secondary hover:bg-amber-600 text-white py-3 px-6 rounded-lg transition-colors"
                onClick={() => setCurrentPage('register')}
              >
                I'm a Buyer
              </button>
              <button
                className="border-2 border-white hover:bg-white hover:text-slate-900 text-white py-3 px-6 rounded-lg transition-colors"
                onClick={() => setCurrentPage('about')}
              >
                Learn More
              </button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 text-slate-800 dark:text-slate-200">Why Choose DOKO?</h2>
              <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">Our platform is designed specifically for the needs of Nepali farmers and buyers</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <FeatureCard
                  key={index}
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Products Section */}
        <section className="py-12 bg-slate-100 dark:bg-slate-800 rounded-lg">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 text-slate-800 dark:text-slate-200">Fresh Products</h2>
              <p className="text-xl text-slate-600 dark:text-slate-400">Direct from farmers across Nepal</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product, index) => (
                <ProductCard key={index} product={product} />
              ))}
            </div>

            <div className="text-center mt-12">
              <button className="border-2 border-primary dark:border-primary-light text-primary dark:text-primary-light hover:bg-primary dark:hover:bg-primary-light hover:text-white py-3 px-8 rounded-lg transition-colors"
                onClick={() => setCurrentPage('products')}
              >
                View All Products
              </button>
            </div>
          </div>
        </section>
      </div>

    </div>
  );
}
export default HomePage;
