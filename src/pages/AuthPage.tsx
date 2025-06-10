import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import useUserAuthStore from '../store/userAuthStore';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import { User, Mail, Lock, Phone, ArrowLeft } from 'lucide-react';

const AuthPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isSignIn, setIsSignIn] = useState(searchParams.get('mode') !== 'signup');
  const [loading, setLoading] = useState(false);
  const { signIn, setUser } = useUserAuthStore();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    phoneNumber: '',
  });

  useEffect(() => {
    // Update mode when URL changes
    setIsSignIn(searchParams.get('mode') !== 'signup');
  }, [searchParams]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);    try {
      if (isSignIn) {
        // Sign In
        const { data, error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (error) throw error;
        
        if (data.user) {
          setUser(data.user);
          toast.success(t('Successfully signed in'));
          navigate('/');
        }
      } else {
        // Sign Up - validate required fields
        if (!formData.email || !formData.password || !formData.fullName) {
          throw new Error('Please fill in all required fields');
        }

        // Validate phone number format if provided
        if (formData.phoneNumber) {
          const phoneRegex = /^[0-9]{9}$/;  // Expects 9 digits for Cameroon phone numbers
          if (!phoneRegex.test(formData.phoneNumber)) {
            throw new Error('Please enter a valid 9-digit phone number or leave it empty');
          }
        }        // Sign Up
        const { data, error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              full_name: formData.fullName,
              phone_number: formData.phoneNumber || null
            }
          }
        });

        if (error) throw error;
        
        if (data.user) {
          // Insert user data into the users table
          const { error: userError } = await supabase
            .from('users')
            .insert([
              {
                id: data.user.id,
                email: formData.email,
                full_name: formData.fullName,
                phone_number: formData.phoneNumber || null,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              }
            ]);

          if (userError) throw userError;
          
          toast.success(t('Registration successful! Please check your email to verify your account.'));
          navigate('/auth?mode=signin');
        }
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      toast.error(error.message || t('An error occurred'));
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    navigate(`/auth?mode=${isSignIn ? 'signup' : 'signin'}`);
  };

  const formVariants = {
    enter: {
      x: isSignIn ? -1000 : 1000,
      opacity: 0
    },
    center: {
      x: 0,
      opacity: 1
    },
    exit: {
      x: isSignIn ? 1000 : -1000,
      opacity: 0
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-green-700 to-green-900 flex items-center justify-center p-4">
      <button
        onClick={() => navigate('/')}
        className="absolute top-4 left-4 text-white hover:text-green-200 flex items-center gap-2"
      >
        <ArrowLeft size={20} />
        {t('Back to Home')}
      </button>

      <div className="w-full max-w-md">
        <AnimatePresence mode="wait">
          <motion.div
            key={isSignIn ? 'signin' : 'signup'}
            initial="enter"
            animate="center"
            exit="exit"
            variants={formVariants}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="bg-white rounded-lg shadow-xl p-8"
          >
            <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
              {isSignIn ? t('Welcome Back') : t('Create Account')}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {!isSignIn && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('Full Name')} <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type="text"
                        name="fullName"
                        required
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        placeholder={t('Enter your full name')}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('Phone Number')} <span className="text-gray-400">(Optional)</span>
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type="tel"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        placeholder={t('Enter your phone number (optional)')}
                      />
                    </div>
                    <p className="mt-1 text-sm text-gray-500">Format: 9 digits, numbers only</p>
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('Email')}
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder={t('Enter your email')}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('Password')}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="password"
                    name="password"
                    required
                    minLength={6}
                    value={formData.password}
                    onChange={handleInputChange}
                    className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder={t('Enter your password')}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors disabled:opacity-50"
              >
                {loading ? t('Please wait...') : (isSignIn ? t('Sign In') : t('Create Account'))}
              </button>

              <div className="text-center mt-4">
                <button
                  type="button"
                  onClick={toggleMode}
                  className="text-green-600 hover:text-green-700 text-sm font-medium"
                >
                  {isSignIn ? t('Need an account? Sign Up') : t('Already have an account? Sign In')}
                </button>
              </div>
            </form>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AuthPage; 