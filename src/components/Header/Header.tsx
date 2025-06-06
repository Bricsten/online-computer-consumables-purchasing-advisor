import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ShoppingCart, User, LogOut } from 'lucide-react';
import useUserAuthStore from '../../store/userAuthStore';
import SignUpModal from '../Auth/SignUpModal';
import SignInModal from '../Auth/SignInModal';
import toast from 'react-hot-toast';

const Header: React.FC = () => {
  const { t } = useTranslation();
  const { user, isAuthenticated, signOut } = useUserAuthStore();
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);

  useEffect(() => {
    console.log('Auth State:', { isAuthenticated, user });
  }, [isAuthenticated, user]);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success(t('Successfully signed out'));
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error(t('Failed to sign out'));
    }
  };

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-green-600">
            Bolt
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-600 hover:text-green-600">
              {t('Home')}
            </Link>
            <Link to="/products" className="text-gray-600 hover:text-green-600">
              {t('Products')}
            </Link>
          </nav>

          <div className="flex items-center space-x-6">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/profile" 
                  className="flex items-center text-gray-600 hover:text-green-600"
                >
                  <User size={24} className="mr-2" />
                  <span className="text-sm hidden md:inline">{user?.email}</span>
                </Link>
                <button
                  onClick={handleSignOut}
                  className="flex items-center text-gray-600 hover:text-green-600"
                  title={t('Sign Out')}
                >
                  <LogOut size={24} />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setIsSignInModalOpen(true)}
                  className="flex items-center text-gray-600 hover:text-green-600"
                >
                  <User size={24} />
                  <span className="ml-2 hidden md:inline">{t('Sign In')}</span>
                </button>
                <button
                  onClick={() => setIsSignUpModalOpen(true)}
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                >
                  {t('Sign Up')}
                </button>
              </div>
            )}

            <Link to="/cart" className="text-gray-600 hover:text-green-600">
              <ShoppingCart size={24} />
            </Link>
          </div>
        </div>
      </div>

      <SignUpModal
        isOpen={isSignUpModalOpen}
        onClose={() => setIsSignUpModalOpen(false)}
        onSuccess={() => {
          setIsSignUpModalOpen(false);
          setIsSignInModalOpen(true);
        }}
        onSignInClick={() => {
          setIsSignUpModalOpen(false);
          setIsSignInModalOpen(true);
        }}
      />

      <SignInModal
        isOpen={isSignInModalOpen}
        onClose={() => setIsSignInModalOpen(false)}
        onSuccess={() => {
          setIsSignInModalOpen(false);
          toast.success(t('Successfully signed in'));
        }}
        onSignUpClick={() => {
          setIsSignInModalOpen(false);
          setIsSignUpModalOpen(true);
        }}
      />
    </header>
  );
};

export default Header; 