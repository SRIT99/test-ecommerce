
// import { Outlet } from "react-router-dom";
// //import Navbar from "../components/Navbar";
// import Header from "../components/Header";
// //import Footer from "../components/Footer";
// function Layout() {
//   return (
//     <div className="bg-white dark:bg-gray-900 dark:text-white duration-200">
//       <Header />
//       <Outlet />
//     {/*<Footer />*/}
//     </div>
//   );
// }

// export default Layout;
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from '../pages/HomePage';

export default function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
    </Router>
  );
}
