import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { User, MapPin, Phone } from 'lucide-react';
import useAuthStore from '../../store/authStore';
import useOrderStore from '../../store/orderStore';
import useCartStore from '../../store/cartStore';
import { ShippingAddress, PaymentMethod } from '../../types';
import AuthModal from '../Auth/AuthModal';
import { generateReceipt } from '../../utils/generateReceipt';

interface LocationSuggestion {
  formatted: string;
  geometry: {
    lat: number;
    lng: number;
  };
}

interface CheckoutFormProps {
  onSuccess: (orderId: string) => void;
  onShippingCostChange: (cost: number) => void;
}

const SHIPPING_BASE_RATE = 1500; // Base rate in XAF
const SHIPPING_PER_KM = 100; // Additional cost per km in XAF
const STORE_LOCATION = { lat: 4.0511, lng: 9.7679 }; // Douala coordinates

const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

const calculateShippingCost = (distance: number) => {
  return Math.round(SHIPPING_BASE_RATE + (distance * SHIPPING_PER_KM));
};

const CheckoutForm: React.FC<CheckoutFormProps> = ({ onSuccess, onShippingCostChange }) => {
  const { t } = useTranslation();
  const { user, isAuthenticated } = useAuthStore();
  const { createOrder } = useOrderStore();
  const { items, getOrderSummary } = useCartStore();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [locationSuggestions, setLocationSuggestions] = useState<LocationSuggestion[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<LocationSuggestion | null>(null);
  const [shippingCost, setShippingCost] = useState(SHIPPING_BASE_RATE);
  const [selectedPayment, setSelectedPayment] = useState<'MTN_MOBILE_MONEY' | 'ORANGE_MONEY' | null>(null);
  const searchTimeout = useRef<NodeJS.Timeout>();
  
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    phoneNumber: user?.phoneNumber || '',
    location: '',
    mobileMoneyNumber: '',
    saveInfo: false
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (name === 'location') {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }
      searchTimeout.current = setTimeout(() => {
        fetchLocationSuggestions(value);
      }, 300);
    }
  };

  const fetchLocationSuggestions = async (query: string) => {
    if (!query) {
      setLocationSuggestions([]);
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(query + ', Cameroon')}&key=2b58d910f6324a3fb9ad59a15177fe09&limit=5`
      );
      const data = await response.json();
      
      if (data.results) {
        setLocationSuggestions(data.results.map((result: any) => ({
          formatted: result.formatted,
          geometry: result.geometry
        })));
      }
    } catch (error) {
      console.error('Error fetching locations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLocationSelect = (location: LocationSuggestion) => {
    setSelectedLocation(location);
    setFormData(prev => ({ ...prev, location: location.formatted }));
    setLocationSuggestions([]);

    // Calculate shipping cost
    const distance = calculateDistance(
      STORE_LOCATION.lat,
      STORE_LOCATION.lng,
      location.geometry.lat,
      location.geometry.lng
    );
    const cost = calculateShippingCost(distance);
    setShippingCost(cost);
    onShippingCostChange(cost);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedPayment || !selectedLocation) return;

    const shippingAddress: Omit<ShippingAddress, 'id' | 'userId'> = {
      fullName: formData.fullName,
      location: formData.location,
      coordinates: selectedLocation.geometry,
      isDefault: false
    };

    const paymentMethod: Omit<PaymentMethod, 'id' | 'userId'> = {
      type: selectedPayment,
      mobileNumber: formData.mobileMoneyNumber,
      isDefault: false
    };

    const order = await createOrder({
      userId: user?.id,
      shippingAddress: shippingAddress as ShippingAddress,
      paymentMethod: paymentMethod as PaymentMethod,
      guestEmail: !isAuthenticated ? formData.email : undefined,
      guestPhone: !isAuthenticated ? formData.phoneNumber : undefined
    });

    if (order) {
      // Generate receipt
      generateReceipt(order);
      onSuccess(order.id);
    }
  };

  const formVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0 }
  };

  const stepVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { scale: 1, opacity: 1 }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="flex justify-between mb-8">
        {[1, 2, 3].map((number) => (
          <motion.div
            key={number}
            className={`flex items-center ${
              step >= number ? 'text-green-600' : 'text-gray-400'
            }`}
            variants={stepVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: number * 0.2 }}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
              step >= number ? 'border-green-600 bg-green-50' : 'border-gray-300'
            }`}>
              {number === 1 && <User size={16} />}
              {number === 2 && <MapPin size={16} />}
              {number === 3 && <Phone size={16} />}
            </div>
            <span className="ml-2 text-sm font-medium">
              {number === 1 && t('Personal Info')}
              {number === 2 && t('Location')}
              {number === 3 && t('Payment')}
            </span>
            {number < 3 && (
              <div className="w-12 h-0.5 mx-2 bg-gray-200" />
            )}
          </motion.div>
        ))}
      </div>

      <motion.form
        onSubmit={handleSubmit}
        className="space-y-6"
        variants={formVariants}
        initial="hidden"
        animate="visible"
      >
        {step === 1 && (
          <motion.div
            className="space-y-4"
            variants={formVariants}
            initial="hidden"
            animate="visible"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t('Full Name')}
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t('Email')}
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t('Phone Number')}
              </label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                required
                placeholder="e.g., 677123456"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              />
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            className="space-y-4"
            variants={formVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700">
                {t('Your Location (Town or Neighborhood)')}
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                required
                placeholder={t('Start typing your location...')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              />
              
              {/* Location suggestions dropdown */}
              <AnimatePresence>
                {locationSuggestions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute z-10 w-full mt-1 bg-white shadow-lg rounded-md overflow-hidden"
                  >
                    {locationSuggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => handleLocationSelect(suggestion)}
                        className="w-full text-left px-4 py-2 hover:bg-green-50 focus:bg-green-50 focus:outline-none"
                      >
                        {suggestion.formatted}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {selectedLocation && (
              <div className="mt-4 p-4 bg-green-50 rounded-md">
                <p className="text-sm text-green-700">
                  {t('Location found! Shipping cost:')} {shippingCost} XAF
                </p>
              </div>
            )}
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            className="space-y-6"
            variants={formVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setSelectedPayment('MTN_MOBILE_MONEY')}
                className={`p-4 border rounded-lg flex flex-col items-center ${
                  selectedPayment === 'MTN_MOBILE_MONEY'
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-300'
                }`}
              >
                <img
                  src="/mtn-logo.png"
                  alt="MTN Mobile Money"
                  className="w-16 h-16 object-contain mb-2"
                />
                <span className="text-sm font-medium">MTN Mobile Money</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedPayment('ORANGE_MONEY')}
                className={`p-4 border rounded-lg flex flex-col items-center ${
                  selectedPayment === 'ORANGE_MONEY'
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-300'
                }`}
              >
                <img
                  src="/orange-logo.png"
                  alt="Orange Money"
                  className="w-16 h-16 object-contain mb-2"
                />
                <span className="text-sm font-medium">Orange Money</span>
              </button>
            </div>

            {selectedPayment && (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {t('Enter your Mobile Money number')}
                </label>
                <input
                  type="tel"
                  name="mobileMoneyNumber"
                  value={formData.mobileMoneyNumber}
                  onChange={handleInputChange}
                  required
                  placeholder={selectedPayment === 'MTN_MOBILE_MONEY' ? '677123456' : '695123456'}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                />
              </div>
            )}
          </motion.div>
        )}

        <div className="flex justify-between mt-8">
          {step > 1 && (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              {t('Previous')}
            </button>
          )}
          {step < 3 ? (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              disabled={step === 2 && !selectedLocation}
              className="ml-auto px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? t('Loading...') : t('Next')}
            </button>
          ) : (
            <button
              type="submit"
              disabled={!selectedPayment || !selectedLocation}
              className="ml-auto px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t('Confirm Payment')}
            </button>
          )}
        </div>
      </motion.form>

      {!isAuthenticated && formData.saveInfo && (
        <div className="mt-6 p-4 bg-green-50 rounded-md">
          <p className="text-sm text-green-700">
            {t('Want to save your information? ')}
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="font-medium underline"
            >
              {t('Create an account')}
            </button>
          </p>
        </div>
      )}

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={() => {
          setIsAuthModalOpen(false);
          setFormData(prev => ({ ...prev, saveInfo: false }));
        }}
        mode="checkout"
      />
    </div>
  );
};

export default CheckoutForm; 