// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import HomePage from '../pages/HomePage';

// export default function AppRoutes() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<HomePage />} />
//       </Routes>
//     </Router>
//   );
// }
import React from 'react'
import Header from '../components/Header';
import { Outlet } from 'react-router-dom';
import Footer from '../components/Footer';

const Layout = () => {
  return (
   <div className="flex flex-col min-h-screen">
  <Header />
  
  <main className="flex-grow">
    <Outlet />
  </main>
  
  <Footer />
</div>

  )
}

export default Layout;