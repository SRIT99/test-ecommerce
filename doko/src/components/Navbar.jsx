import { ShoppingCart } from "lucide-react";

export default function Navbar() {
    return (
        <nav className="bg-white shadow-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                {/* Logo */}
                <h1 className="text-2xl font-bold text-green-700">DokoShop</h1>

                {/* Links */}
                <ul className="hidden md:flex gap-8 font-medium text-gray-700">
                    <li><a href="/" className="hover:text-green-600">Home</a></li>
                    <li><a href="/shop" className="hover:text-green-600">Shop</a></li>
                    <li><a href="/about" className="hover:text-green-600">About</a></li>
                    <li><a href="/contact" className="hover:text-green-600">Contact</a></li>
                </ul>

                {/* Cart Button */}
                <button className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700 transition">
                    <ShoppingCart size={20} />
                    <span>Cart</span>
                </button>
            </div>
        </nav>
    );
}
