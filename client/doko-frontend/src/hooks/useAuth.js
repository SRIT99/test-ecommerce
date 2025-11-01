import { useContext } from 'react';
import AuthContext from '../contexts/AuthContext';

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  // Add role checking methods
  const isAdmin = () => {
    return context.user?.userType === 'admin' || context.user?.userType === 'superadmin';
  };

  const isSuperAdmin = () => {
    return context.user?.userType === 'superadmin';
  };
  // const isSeller = () => {
  //   return context.user?.userType === 'seller';
  // };
  // const isBuyer = () => {
  //   return context.user?.userType === 'buyer';
  // };

  return {
    ...context,
    isAdmin,
    isSuperAdmin,
    // isSeller,
    // isBuyer
  };
};
