import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth'; // Fixed import
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading, userType } = useAuth();
    const location = useLocation();

    console.log('🔐 ProtectedRoute Debug:');
    console.log(' - isAuthenticated:', isAuthenticated);
    console.log(' - loading:', loading);
    console.log(' - user:', userType);
    console.log(' - requested path:', location.pathname);

    // if (loading) {
    //     return (
    //         <div className="min-h-screen flex items-center justify-center">
    //             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
    //         </div>
    //     );
    // }

    // if (loading) {
    //     return (
    //         <div className="min-h-screen flex items-center justify-center">
    //             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
    //         </div>
    //     );
    // }

    // if (!isAuthenticated) {
    //     // Redirect to login page with return url
    //     return <Navigate to="/login" state={{ from: location }} replace />;
    // }

    return children;
};

export default ProtectedRoute;