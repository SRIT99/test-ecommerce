import React from "react";
import logo from "../assets/doko_logo.png";
const Navbar = () => {
  return (
   

<nav class="bg-white dark:bg-gray-900 fixed w-full z-20 top-0 start-0 border-b border-gray-200 dark:border-gray-600">
  <div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
  <a href="/" class="flex items-center space-x-3 rtl:space-x-reverse">
      <img src={logo} class="h-8" alt="DOko Logo"/>
      <span class="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Doko-An Agro Based Marketplace</span>
  </a>
  <div class="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
      <button type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Sign Up {"->"} </button>
      <button data-collapse-toggle="navbar-sticky" type="button" class="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-sticky" aria-expanded="false">
        <span class="sr-only">Open main menu</span>
        <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h15M1 7h15M1 13h15"/>
        </svg>
    </button>
  </div>
  <div class="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-sticky">
    <ul class="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
      <li>
        <a href="#" class="block py-2 px-3 text-white bg-blue-700 rounded-sm md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500" aria-current="page">Home</a>
      </li>
      <li>
        <a href="#" class="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">About</a>
      </li>
      <li>
        <a href="#" class="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">Services</a>
      </li>
      <li>
        <a href="#" class="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">Contact</a>
      </li>
    </ul>
  </div>
  </div>
</nav>

  );
};

export default Navbar;
// import React from "react";
// import { FiShoppingBag } from "react-icons/fi";
// import { IoMdSearch } from "react-icons/io";
// import { FaRegUser } from "react-icons/fa";

// const Navbar = () => {
//   return (
//     <header className="w-full border-b">
//       {/* Top Bar */}
//       <div className="bg-[#0B1221] text-white text-sm px-6 py-2 flex justify-between items-center">
//         {/* Left - Currency */}
//         <div className="flex items-center gap-1 cursor-pointer">
//           <span>Doko</span>
//           <svg
//             className="w-3 h-3"
//             fill="none"
//             stroke="currentColor"
//             viewBox="0 0 24 24"
//           >
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
//           </svg>
//         </div>

//         {/* Right - Account Links */}
//         <div className="flex items-center gap-6">
//           <button className="hover:underline">Sign in</button>
//           <button className="hover:underline font-semibold">
//             Create an account
//           </button>
//         </div>
//       </div>

//       {/* Main Navbar */}
//       <div className="bg-white px-6 py-4 flex justify-between items-center">
//         {/* Logo */}
//         <div className="flex items-center gap-2">
//           <FiShoppingBag size={28} className="text-indigo-600" />
//         </div>

//         {/* Center Nav Links */}
//         <nav className="hidden md:flex gap-8 text-sm font-medium text-gray-700">
//           <a href="#" className="hover:text-indigo-600">Women</a>
//           <a href="#" className="hover:text-indigo-600">Men</a>
//           <a href="#" className="hover:text-indigo-600">Company</a>
//           <a href="#" className="hover:text-indigo-600">Stores</a>
//         </nav>

//         {/* Right Section */}
//         <div className="flex items-center gap-6 text-sm font-medium text-gray-700">
//           {/* Search */}
//           <button className="flex items-center gap-1 hover:text-indigo-600">
//             <IoMdSearch size={18} />
//             <span className="hidden sm:inline">Search</span>
//           </button>

//           {/* Help */}
//           <a href="#" className="hover:text-indigo-600">Help</a>

//           {/* Cart */}
//           <button className="flex items-center gap-2 hover:text-indigo-600">
//             <FiShoppingBag size={20} />
//             <span>0</span>
//           </button>
//         </div>
//       </div>
//     </header>
//   );
// };

// export default Navbar;
