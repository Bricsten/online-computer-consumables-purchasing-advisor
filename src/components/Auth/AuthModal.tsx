import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import useAuthStore from '../../store/authStore';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  mode?: 'checkout' | 'normal';
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess, mode = 'normal' }) => {
  const { t } = useTranslation();
  const { login, register, isLoading, error } = useAuthStore();
  const [isLoginView, setIsLoginView] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = isLoginView
      ? await login(formData.email, formData.password)
      : await register(formData.email, formData.password, formData.fullName);

    if (success) {
      onSuccess();
      onClose();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const modalVariants = {
    hidden: {
      opacity: 0,
      scale: 0.95,
      y: -20
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.2
      }
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      y: -20,
      transition: {
        duration: 0.2
      }
    }
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  const formVariants = {
    hidden: {
      x: isLoginView ? -400 : 400,
      opacity: 0
    },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30
      }
    },
    exit: {
      x: isLoginView ? 400 : -400,
      opacity: 0
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
          />
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md relative">
              <button
                onClick={onClose}
                className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>

              <div className="p-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={isLoginView ? 'login' : 'register'}
                    variants={formVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    <h2 className="text-2xl font-bold mb-6 text-center">
                      {isLoginView ? t('Sign In') : t('Create Account')}
                    </h2>

                    {error && (
                      <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                        {error}
                      </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                      {!isLoginView && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            {t('Full Name')}
                          </label>
                          <input
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                          />
                        </div>
                      )}

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {t('Email')}
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {t('Password')}
                        </label>
                        <input
                          type="password"
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isLoading
                          ? t('Please wait...')
                          : isLoginView
                          ? t('Sign In')
                          : t('Create Account')}
                      </button>
                    </form>

                    <div className="mt-4 text-center">
                      <button
                        onClick={() => setIsLoginView(!isLoginView)}
                        className="text-sm text-green-600 hover:text-green-800"
                      >
                        {isLoginView
                          ? t('Need an account? Sign up')
                          : t('Already have an account? Sign in')}
                      </button>
                    </div>

                    {mode === 'checkout' && (
                      <div className="mt-4 text-center">
                        <button
                          onClick={onClose}
                          className="text-sm text-gray-600 hover:text-gray-800"
                        >
                          {t('Continue as guest')}
                        </button>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AuthModal; 