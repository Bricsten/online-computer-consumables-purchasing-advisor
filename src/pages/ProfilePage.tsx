import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Tab } from '@headlessui/react';
import { User, Package, Star, Edit2, ChevronLeft, Home } from 'lucide-react';
import useUserAuthStore from '../store/userAuthStore';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import Layout from '../components/Layout/Layout';

interface UserProfile {
  full_name: string;
  email: string;
  phone_number: string;
}

interface Order {
  id: string;
  created_at: string;
  status: string;
  total_amount: number;
  items: Array<{
    product_name: string;
    quantity: number;
    price: number;
  }>;
}

interface Review {
  id: string;
  product_id: string;
  product_name: string;
  rating: number;
  comment: string;
  created_at: string;
}

const ProfilePage: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useUserAuthStore();
  const [activeTab, setActiveTab] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    full_name: '',
    email: '',
    phone_number: '',
  });
  const [orders, setOrders] = useState<Order[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user]);

  const loadUserData = async () => {
    try {
      setIsLoading(true);
      
      // Load user profile
      const { data: profileData, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (profileError) throw profileError;
      if (profileData) {
        setProfile({
          full_name: profileData.full_name,
          email: profileData.email,
          phone_number: profileData.phone_number || '',
        });
      }

      // Load orders
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .select('*, order_items(*)')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (orderError) throw orderError;
      if (orderData) {
        setOrders(orderData);
      }

      // Load reviews
      const { data: reviewData, error: reviewError } = await supabase
        .from('reviews')
        .select('*, products(name)')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (reviewError) throw reviewError;
      if (reviewData) {
        setReviews(reviewData);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      toast.error(t('Failed to load user data'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('users')
        .update({
          full_name: profile.full_name,
          phone_number: profile.phone_number,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user?.id);

      if (error) throw error;

      toast.success(t('Profile updated successfully'));
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(t('Failed to update profile'));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Back to Home Button */}
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center text-green-600 hover:text-green-700 font-medium"
          >
            <ChevronLeft className="h-5 w-5 mr-1" />
            <Home className="h-5 w-5 mr-1" />
            {t('Back to Home')}
          </Link>
        </div>

        {/* Profile Header */}
        <div className="bg-gradient-to-r from-green-700 to-green-900 text-white rounded-lg p-8 mb-8 shadow-lg">
          <h1 className="text-3xl font-bold mb-2">{profile.full_name}</h1>
          <p className="text-green-100">{profile.email}</p>
        </div>

        <Tab.Group selectedIndex={activeTab} onChange={setActiveTab}>
          <Tab.List className="flex space-x-1 rounded-xl bg-green-100 p-1 mb-8">
            <Tab
              className={({ selected }) =>
                `w-full rounded-lg py-3 px-4 text-sm font-medium leading-5
                ${selected
                  ? 'bg-white text-green-700 shadow'
                  : 'text-green-700 hover:bg-white/[0.12] hover:text-green-800'
                } flex items-center justify-center space-x-2`
              }
            >
              <User className="h-5 w-5" />
              <span>{t('Profile')}</span>
            </Tab>
            <Tab
              className={({ selected }) =>
                `w-full rounded-lg py-3 px-4 text-sm font-medium leading-5
                ${selected
                  ? 'bg-white text-green-700 shadow'
                  : 'text-green-700 hover:bg-white/[0.12] hover:text-green-800'
                } flex items-center justify-center space-x-2`
              }
            >
              <Package className="h-5 w-5" />
              <span>{t('Orders')}</span>
            </Tab>
            <Tab
              className={({ selected }) =>
                `w-full rounded-lg py-3 px-4 text-sm font-medium leading-5
                ${selected
                  ? 'bg-white text-green-700 shadow'
                  : 'text-green-700 hover:bg-white/[0.12] hover:text-green-800'
                } flex items-center justify-center space-x-2`
              }
            >
              <Star className="h-5 w-5" />
              <span>{t('Reviews')}</span>
            </Tab>
          </Tab.List>

          <Tab.Panels className="mt-4">
            <Tab.Panel>
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">{t('Profile Information')}</h2>
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="flex items-center text-green-600 hover:text-green-700 transition-colors"
                  >
                    <Edit2 size={20} className="mr-2" />
                    {isEditing ? t('Cancel') : t('Edit')}
                  </button>
                </div>

                <form onSubmit={handleProfileUpdate} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('Full Name')}
                    </label>
                    <input
                      type="text"
                      name="full_name"
                      value={profile.full_name}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 disabled:bg-gray-50 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('Email')}
                    </label>
                    <input
                      type="email"
                      value={profile.email}
                      disabled
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('Phone Number')}
                    </label>
                    <input
                      type="tel"
                      name="phone_number"
                      value={profile.phone_number}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 disabled:bg-gray-50 transition-colors"
                    />
                  </div>

                  {isEditing && (
                    <div className="pt-4">
                      <button
                        type="submit"
                        className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
                      >
                        {t('Save Changes')}
                      </button>
                    </div>
                  )}
                </form>
              </div>
            </Tab.Panel>

            <Tab.Panel>
              <div className="bg-white rounded-lg shadow-lg">
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">{t('Order History')}</h2>
                  {orders.length === 0 ? (
                    <div className="text-center py-12">
                      <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">{t('No orders found')}</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {orders.map((order) => (
                        <div key={order.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <p className="font-medium text-gray-900">
                                {t('Order')} #{order.id}
                              </p>
                              <p className="text-sm text-gray-500">
                                {new Date(order.created_at).toLocaleDateString()}
                              </p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                              order.status === 'completed' ? 'bg-green-100 text-green-800' :
                              order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {t(order.status)}
                            </span>
                          </div>
                          
                          <div className="space-y-2">
                            {order.items.map((item, index) => (
                              <div key={index} className="flex justify-between text-sm">
                                <span className="text-gray-600">
                                  {item.quantity}x {item.product_name}
                                </span>
                                <span className="text-gray-900 font-medium">
                                  {new Intl.NumberFormat('fr-CM', {
                                    style: 'currency',
                                    currency: 'XAF',
                                    minimumFractionDigits: 0
                                  }).format(item.price * item.quantity)}
                                </span>
                              </div>
                            ))}
                          </div>
                          <div className="mt-4 pt-4 border-t border-gray-200">
                            <div className="flex justify-between font-medium">
                              <span>{t('Total')}</span>
                              <span className="text-green-600">
                                {new Intl.NumberFormat('fr-CM', {
                                  style: 'currency',
                                  currency: 'XAF',
                                  minimumFractionDigits: 0
                                }).format(order.total_amount)}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </Tab.Panel>

            <Tab.Panel>
              <div className="bg-white rounded-lg shadow-lg">
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">{t('My Reviews')}</h2>
                  {reviews.length === 0 ? (
                    <div className="text-center py-12">
                      <Star className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">{t('No reviews yet')}</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {reviews.map((review) => (
                        <div key={review.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                          <div className="flex justify-between items-start mb-4">
                            <h3 className="font-medium text-gray-900">{review.product_name}</h3>
                            <div className="flex items-center">
                              {[...Array(5)].map((_, index) => (
                                <Star
                                  key={index}
                                  size={16}
                                  className={index < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-gray-600 text-sm mb-2">{review.comment}</p>
                          <p className="text-gray-400 text-xs">
                            {new Date(review.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </Layout>
  );
};

export default ProfilePage; 