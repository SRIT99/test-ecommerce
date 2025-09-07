import { useEffect } from "react";
import Aos from "aos";
import Hero from "../components/Hero";
import FeatureCard from "../components/FeatureCard";
import ProductCard from "../components/ProductCard";
import { Link } from "react-router-dom";
const HomePage = () => {

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
      image: 'https://imgs.search.brave.com/BjiRQ48OxjMy8r993C_RwsoMkQblecv2ZsZ4gX6fV14/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzAwLzY5LzI4LzI3/LzM2MF9GXzY5Mjgy/NzY5X25uR1g3U2lk/QUZRczhTd1VnbVpG/eDVabHo2c1hSa2w0/LmpwZw'
    },
    {
      name: 'Fresh Cauliflower',
      price: 'NPR 40/piece',
      location: 'Pokhara, Gandaki',
      seller: 'Sita Devi',
      image: 'https://imgs.search.brave.com/751g8YVh4K4KZzKGvF3RAXmK91f9x_lcYP9y1lQVGao/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvNjQx/MTQ3NTQ4L3Bob3Rv/L2ZyZXNoLWNhdWxp/Zmxvd2VyLmpwZz9z/PTYxMng2MTImdz0w/Jms9MjAmYz1NcmpP/NG91U1VYWVFPWGJM/QzB2MUdJU2d5VldL/c0Jwb3YzVGJLZGcz/VUZrPQ'
    },
    {
      name: 'Organic Potatoes',
      price: 'NPR 45/kg',
      location: 'Kathmandu, Bagmati',
      seller: 'Gopal Parajuli',
      image: 'https://imgs.search.brave.com/JXv4nhX8kl8WoXpvkexjh6oWsUVS_jWi9D31gLx5V2U/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvNDc2/MzY4MTM5L3Bob3Rv/L3doaXRlLXBvdGF0/b2VzLmpwZz9zPTYx/Mng2MTImdz0wJms9/MjAmYz03T0JyZDFU/dWl4TUpVYTZLTW5J/SV9RYWVScFdVZVF6/RG5UeHpMV04ta00w/PQ'
    },
    {
      name: 'Fresh Strawberries',
      price: 'NPR 250/kg',
      location: 'Ilam, Province 1',
      seller: 'Mina Rai',
      image: 'https://imgs.search.brave.com/Tr5puwY3ARPViRKpt7BEwj28Ic9a0QBwZCk4ESEIpAA/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvNDg3/MDUxMDYyL3Bob3Rv/L3N0cmF3YmVycmll/cy5qcGc_cz02MTJ4/NjEyJnc9MCZrPTIw/JmM9VUdqd0RpcHV4/ZGxlbE9kOEJpbEN3/dVc1VV9YWF9SUTB6/bUxZQXZXM2VEVT0'
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
    <div className="container w-full h-full dark:bg-gradient-to-br dark:from-green-800 dark:to-blue-500">
      <Hero />

      <div>
        {/* Hero Section */}
        <section className="relative bg-white dark:bg-slate-800 text-black dark:text-white py-20 rounded-lg mb-8">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Connecting Farmers Directly to Buyers</h2>
            <p className="text-xl max-w-2xl mx-auto mb-8">DOKO is a smart agro-based marketplace that eliminates middlemen, ensures fair prices, and brings transparency to agricultural trade in Nepal.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/register">
                <button className="bg-blue-600 hover:bg-blue-800 text-white py-3 px-6 rounded-lg transition-colors">
                  I'm a Farmer
                </button>
              </Link>
              <Link to="/register">
                <button className="bg-amber-500 hover:bg-amber-600 text-white py-3 px-6 rounded-lg transition-colors">
                  I'm a Buyer
                </button>
              </Link>
              <Link to="/about">
                <button className="border-2 border-white hover:bg-white hover:text-slate-900 text-white py-3 px-6 rounded-lg transition-colors">
                  Learn More
                </button>
              </Link>
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
              <Link to="/products">
                <button className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white py-3 px-8 rounded-lg transition-colors">
                  View All Products
                </button>
              </Link>
            </div>
          </div>
        </section>
        {/* Merchant Section */}
        <section className="w-full py-16 bg-grey-200 to-blue-50 dark:from-green-900 dark:to-blue-900 mt-8 rounded-lg">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-green-800 dark:text-green-200">
              Become a DOKO Merchant
            </h2>
            <p className="text-xl max-w-2xl mx-auto mb-8 text-slate-700 dark:text-slate-300">
              Join our platform as a merchant and reach thousands of buyers looking for fresh, local produce. Enjoy easy product listing, order management, and secure payments.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/merchant">
                <button className="bg-orange-500 hover:bg-orange-600 text-white py-3 px-8 rounded-lg transition-colors font-semibold">
                  Register as Merchant
                </button>
              </Link>
              <Link to="/about">
                <button className="border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white py-3 px-8 rounded-lg transition-colors font-semibold">
                  Learn More
                </button>
              </Link>
            </div>
          </div>
        </section>

      </div>

    </div>
  );
}
export default HomePage;
