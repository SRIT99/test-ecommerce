import image1 from '../assets/hero.jpg';
import { Link } from 'react-router-dom';
export default function Hero() {
    return (
        <section className="bg-gradient-to-r from-green-100 to-green-200 py-20">
            <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center">

                {/* Text Content */}
                <div className="flex-1 text-center md:text-left">
                    <h2 className="text-5xl font-bold text-green-800 leading-tight">
                        Fresh Agro Products <br /> Delivered to Your Doorstep
                    </h2>
                    <p className="mt-4 text-lg text-gray-700">
                        Shop directly from local farmers and support sustainable living.
                    </p>
                    <Link to ="/products">
                        <button className="mt-6 px-6 py-3 bg-green-600 text-white text-lg font-medium rounded-lg shadow hover:bg-green-700 transition">
                            Start Shopping
                        </button>
                    </Link>
                </div>

                {/* Image */}
                <div className="flex-1 mt-10 md:mt-0">
                    <img
                        src={image1}
                        alt="imageoftea"
                        className="rounded-2xl shadow-lg"
                    />
                </div>
            </div>
        </section>
    );
}
