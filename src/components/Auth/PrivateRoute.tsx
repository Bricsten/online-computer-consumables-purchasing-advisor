import React from 'react';
import { Navigate } from 'react-router-dom';
import useAdminAuthStore from '../../store/adminAuthStore';

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAdminAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;