import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import AdminLoginModal from '../components/Auth/AdminLoginModal';
import useAdminAuthStore from '../store/adminAuthStore';

const AdminLoginPage: React.FC = () => {
  const { t } = useTranslation();
  const { isAuthenticated } = useAdminAuthStore();
  const [showLogin, setShowLogin] = useState(true);
    
  if (isAuthenticated) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          {t('Admin Portal')}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          {t('Access the administrative dashboard')}
              </p>
            </div>
            
      <AdminLoginModal
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
        onSuccess={() => setShowLogin(false)}
                  />
                </div>
  );
};

export default AdminLoginPage;