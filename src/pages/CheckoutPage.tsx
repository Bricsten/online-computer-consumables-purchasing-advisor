import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { 
  ChevronLeft, Phone, MapPin, User, Home, Calculator, Check, CreditCard
} from 'lucide-react';
import toast from 'react-hot-toast';
import Layout from '../components/Layout/Layout';
import useCartStore from '../store/cartStore';
import { ShippingInfo } from '../types';
import { formatCurrency } from '../utils/format';

const CheckoutPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { 
    items, 
    getOrderSummary,
    calculateShippingCost,
    setShippingInfo,
    clearCart
  } = useCartStore();
  
  const [formData, setFormData] = useState<ShippingInfo>({
    name: '',
    address: '',
    city: 'Buea',
    phoneNumber: '',
  });

  const cities = [
    'Buea',
    'Limbe',
    'Douala',
    'Kumba',
    'Yaoundé',
    'Bamenda',
    'Garoua',
    'Maroua',
    'Ngaoundéré',
    'Ebolowa',
    'Kribi'
  ];
  
  const [paymentMethod, setPaymentMethod] = useState<'mtn' | 'orange'>('mtn');
  const [shippingCost, setShippingCost] = useState<number>(1100); // Default for Buea
  const [isPlacingOrder, setIsPlacingOrder] = useState<boolean>(false);
  const [orderPlaced, setOrderPlaced] = useState<boolean>(false);
  const [orderNumber, setOrderNumber] = useState<string>('');
  
  const { subtotal } = getOrderSummary();

  // Redirect to products if cart is empty
  useEffect(() => {
    if (items.length === 0 && !orderPlaced) {
      navigate('/products');
      toast.error('Your cart is empty');
    }
  }, [items.length, navigate, orderPlaced]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'city') {
      const cost = calculateShippingCost(value);
      setShippingCost(cost);
      
      if (cost === 0) {
        toast.error('Sorry, we currently do not have distance data for your location, so we can\'t calculate the shipping cost automatically.');
      } else {
        const message = value === 'Buea' 
          ? `Shipping to Buea is ${formatCurrency(cost)}.`
          : `Shipping to ${value} is ${formatCurrency(cost)}. Your total will be ${formatCurrency(subtotal + cost)}.`;
        toast.success(message);
      }
    }
    
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.address || !formData.city || !formData.phoneNumber) {
      toast.error('Please fill all required fields');
      return;
    }
    
    setIsPlacingOrder(true);
    
    // Simulate order processing
    setTimeout(() => {
      // Save shipping info to store
      setShippingInfo(formData);
      
      // Generate random order number
      const randomOrderNumber = `ORD-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 1000)}`;
      setOrderNumber(randomOrderNumber);
      
      setIsPlacingOrder(false);
      setOrderPlaced(true);
      
      // Clear cart after successful order
      clearCart();
      
      toast.success('Order placed successfully!');
    }, 2000);
  };
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link
            to="/cart"
            className="inline-flex items-center text-green-600 hover:text-green-800"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            {t('cart.title')}
          </Link>
        </div>

        <h1 className="text-3xl font-bold mb-8">{t('checkout.title')}</h1>

        {orderPlaced ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-lg shadow-md p-8 text-center"
          >
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="h-10 w-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold mb-4">Order Placed Successfully!</h2>
            <p className="text-gray-600 mb-6">
              Thank you for your order. Your order number is <span className="font-bold">{orderNumber}</span>.
            </p>
            <p className="text-gray-600 mb-8">
              Please complete your payment using your selected payment method ({paymentMethod === 'mtn' ? 'MTN Mobile Money' : 'Orange Money'}). 
              You will receive a confirmation once your payment is processed.
            </p>
            <Link
              to="/products"
              className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition-colors inline-block"
            >
              Continue Shopping
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-3">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <form onSubmit={handleSubmit}>
                  <div className="p-6 border-b">
                    <h2 className="text-xl font-semibold mb-4">{t('checkout.shippingInfo')}</h2>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-gray-700 text-sm font-medium mb-1">
                          {t('checkout.name')}*
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <User className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="pl-10 w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                            required
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-gray-700 text-sm font-medium mb-1">
                          {t('checkout.address')}*
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Home className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            className="pl-10 w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                            required
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-gray-700 text-sm font-medium mb-1">
                          {t('checkout.city')}*
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <MapPin className="h-5 w-5 text-gray-400" />
                          </div>
                          <select
                            name="city"
                            value={formData.city}
                            onChange={handleInputChange}
                            className="pl-10 w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                            required
                          >
                            {cities.map(city => (
                              <option key={city} value={city}>
                                {city}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-gray-700 text-sm font-medium mb-1">
                          {t('checkout.phoneNumber')}*
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Phone className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="tel"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleInputChange}
                            className="pl-10 w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6 border-b">
                    <h2 className="text-xl font-semibold mb-4">{t('checkout.paymentMethod')}</h2>
                    
                    <div className="space-y-3">
                      <div className="relative">
                        <input
                          id="mtn"
                          type="radio"
                          name="paymentMethod"
                          checked={paymentMethod === 'mtn'}
                          onChange={() => setPaymentMethod('mtn')}
                          className="hidden peer"
                        />
                        <label
                          htmlFor="mtn"
                          className="flex items-center p-4 border rounded-md cursor-pointer peer-checked:border-green-500 peer-checked:bg-green-50"
                        >
                          <div className="w-6 h-6 border-2 border-gray-300 rounded-full flex items-center justify-center peer-checked:border-green-500 mr-3">
                            {paymentMethod === 'mtn' && <div className="w-3 h-3 bg-green-500 rounded-full"></div>}
                          </div>
                          <div>
                            <p className="font-medium">{t('checkout.mtnMomo')}</p>
                            <p className="text-sm text-gray-500">Send payment to: 6XXXXXXXX</p>
                          </div>
                        </label>
                      </div>
                      
                      <div className="relative">
                        <input
                          id="orange"
                          type="radio"
                          name="paymentMethod"
                          checked={paymentMethod === 'orange'}
                          onChange={() => setPaymentMethod('orange')}
                          className="hidden peer"
                        />
                        <label
                          htmlFor="orange"
                          className="flex items-center p-4 border rounded-md cursor-pointer peer-checked:border-green-500 peer-checked:bg-green-50"
                        >
                          <div className="w-6 h-6 border-2 border-gray-300 rounded-full flex items-center justify-center peer-checked:border-green-500 mr-3">
                            {paymentMethod === 'orange' && <div className="w-3 h-3 bg-green-500 rounded-full"></div>}
                          </div>
                          <div>
                            <p className="font-medium">{t('checkout.orangeMoney')}</p>
                            <p className="text-sm text-gray-500">Send payment to: 6XXXXXXXX</p>
                          </div>
                        </label>
                      </div>
                    </div>
                    
                    <div className="mt-4 p-4 bg-blue-50 rounded-md">
                      <p className="text-sm text-blue-800">
                        {t('checkout.paymentInstructions')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <button
                      type="submit"
                      disabled={isPlacingOrder}
                      className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${
                        isPlacingOrder ? 'opacity-70 cursor-not-allowed' : ''
                      }`}
                    >
                      {isPlacingOrder ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing...
                        </>
                      ) : (
                        <>
                          <CreditCard className="h-5 w-5 mr-2" />
                          {t('checkout.placeOrder')}
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
            
            <div className="lg:col-span-2">
              <motion.div 
                className="bg-white rounded-lg shadow-md p-6 sticky top-24"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <h2 className="text-xl font-semibold mb-6">{t('checkout.orderSummary')}</h2>
                
                <div className="divide-y">
                  {items.map((item) => (
                    <div key={item.product.id} className="py-4 flex">
                      <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                        <img
                          src={item.product.imageurl}
                          alt={typeof item.product.name === 'string' ? item.product.name : item.product.name?.en || ''}
                          className="h-full w-full object-contain"
                        />
                      </div>
                      <div className="ml-4 flex flex-1 flex-col">
                        <div>
                          <div className="flex justify-between text-base font-medium text-gray-900">
                            <h3 className="line-clamp-2">
                              {typeof item.product.name === 'string' ? item.product.name : item.product.name?.en || ''}
                            </h3>
                            <p className="ml-4">
                              {formatCurrency(item.product.price * item.quantity)}
                            </p>
                          </div>
                          <p className="mt-1 text-sm text-gray-500">
                            {item.product.brand}
                          </p>
                        </div>
                        <div className="flex flex-1 items-end justify-between text-sm">
                          <p className="text-gray-500">
                            Qty {item.quantity}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <div className="flex justify-between text-base font-medium text-gray-900 mb-2">
                    <p>{t('checkout.subtotal')}</p>
                    <p>{formatCurrency(subtotal)}</p>
                  </div>
                  
                  <div className="flex justify-between text-base font-medium text-gray-900 mb-2">
                    <p>{t('checkout.shipping')}</p>
                    <p>{formatCurrency(shippingCost)}</p>
                  </div>
                  
                  <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t mt-2">
                    <p>{t('checkout.total')}</p>
                    <p>{formatCurrency(subtotal + shippingCost)}</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CheckoutPage;