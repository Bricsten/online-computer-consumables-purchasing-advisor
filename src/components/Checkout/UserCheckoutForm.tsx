import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import LocationInput from '../Location/LocationInput';
import { User } from '../../types';
import { toast } from 'react-hot-toast';

interface UserCheckoutFormProps {
  user: User | null;
  onSubmit: (data: {
    fullName: string;
    email: string;
    phoneNumber: string;
    address: string;
    shippingCost: number;
  }) => void;
}

const UserCheckoutForm: React.FC<UserCheckoutFormProps> = ({ user, onSubmit }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    phoneNumber: user?.phoneNumber || '',
    address: '',
    shippingCost: 0
  });

  // Update form data when user data changes
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        fullName: user.fullName || prev.fullName,
        email: user.email || prev.email,
        phoneNumber: user.phoneNumber || prev.phoneNumber
      }));
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLocationSelect = (location: {
    address: string;
    city: string;
    coordinates: { lat: number; lng: number };
    shippingCost: number;
  }) => {
    setFormData(prev => ({
      ...prev,
      address: location.address,
      shippingCost: location.shippingCost
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.address) {
      toast.error(t('Please enter your shipping address'));
      return;
    }
    onSubmit(formData);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-6">{t('Checkout Information')}</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
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
            placeholder={t('Enter your full name')}
          />
        </div>

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
            placeholder={t('Enter your email')}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('Phone Number')}
          </label>
          <input
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
            placeholder={t('Enter your phone number')}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('Shipping Address')}
          </label>
          <LocationInput
            onSelect={handleLocationSelect}
            placeholder={t('Enter your shipping address')}
            className="w-full"
          />
          {formData.shippingCost > 0 && (
            <p className="mt-2 text-sm text-gray-600">
              {t('Shipping Cost')}: {formData.shippingCost.toLocaleString()} XAF
            </p>
          )}
        </div>

        <motion.button
          type="submit"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
        >
          {t('Continue to Payment')}
        </motion.button>
      </form>
    </div>
  );
};

export default UserCheckoutForm; 