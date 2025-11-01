// src/components/profiles/Profile.js
import React, { useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const { user, loading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && user) {
            // Redirect based on user role
            switch (user.role) {
                case 'farmer':
                case 'seller':
                    navigate('/farmer-profile', { replace: true });
                    break;
                case 'admin':
                    navigate('/admin-profile', { replace: true });
                    break;
                case 'buyer':
                default:
                    navigate('/buyer-profile', { replace: true });
                    break;
            }
        }
    }, [user, loading, navigate]);

    // Show loading while checking auth and redirecting
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 flex items-center justify-center">
            <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Redirecting to your profile...</p>
                <p className="text-sm text-gray-500 mt-2">
                    Taking you to your personalized dashboard
                </p>
            </div>
        </div>
    );
};

export default Profile;