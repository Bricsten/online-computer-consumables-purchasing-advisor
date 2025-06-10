import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';
import Layout from '../components/Layout/Layout';
import GuestCheckoutForm from '../components/Checkout/GuestCheckoutForm';
import UserCheckoutForm from '../components/Checkout/UserCheckoutForm';
import useCartStore from '../store/cartStore';
import useUserAuthStore from '../store/userAuthStore';
import useOrderStore from '../store/orderStore';
import useReviewModalStore from '../store/reviewModalStore';
import { downloadReceipt } from '../utils/generateReceipt';
import toast from 'react-hot-toast';

interface CheckoutData {
  fullName: string;
  email: string;
  phoneNumber: string;
  address: string;
  shippingCost: number;
}

const CheckoutPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { items, getOrderSummary, clearCart } = useCartStore();
  const { user, isAuthenticated } = useUserAuthStore();
  const { createOrder } = useOrderStore();
  const { openModal } = useReviewModalStore();
  const [selectedPayment, setSelectedPayment] = useState<'mtn' | 'orange'>('mtn');
  const [mobileNumber, setMobileNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [checkoutData, setCheckoutData] = useState<CheckoutData | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  
  // Get order summary details
  const { subtotal } = getOrderSummary();
  const shipping = checkoutData?.shippingCost || 0;
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <ShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
          <h2 className="mt-2 text-lg font-medium text-gray-900">
            {t('Your cart is empty')}
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            {t('Start adding some items to your cart')}
          </p>
          <div className="mt-6">
            <button
              onClick={() => navigate('/products')}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              {t('Continue Shopping')}
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  const handleCheckoutSubmit = (data: CheckoutData) => {
    setCheckoutData(data);
    setShowPayment(true);
  };

  const handlePaymentConfirm = async () => {
    if (!mobileNumber) {
      toast.error(t('Please enter your mobile money number'));
      return;
    }

    if (!checkoutData) {
      toast.error(t('Please complete checkout details first'));
      return;
    }
    
    setIsProcessing(true);
    try {
      // Create order object
      const orderData = {
        userId: user?.id,
        items: items.map(item => ({
          id: item.product.id,
          name: item.product.name.en,
          quantity: item.quantity,
          price: item.product.price
        })),
        total,
        subtotal,
        shipping,
        shippingAddress: checkoutData.address,
        paymentMethod: selectedPayment === 'mtn' ? 'MTN Mobile Money' : 'Orange Money',
        paymentNumber: mobileNumber,
        guestInfo: !isAuthenticated ? {
          full_name: checkoutData.fullName,
          email: checkoutData.email,
          phone_number: checkoutData.phoneNumber
        } : undefined
      };

      // Create order in database
      const order = await createOrder(orderData);

      // Generate and download receipt
      downloadReceipt(order);
      
      // Clear cart
      clearCart();
      
      // Show success message
      toast.success(t('Payment successful! Your order has been confirmed.'));

      // If user is authenticated, show review modal after a delay
      if (isAuthenticated) {
        setTimeout(() => {
          openModal();
        }, 1500);
      }

      // Redirect to order confirmation page
      navigate('/order-confirmation');
    } catch (error) {
      console.error('Error processing payment:', error);
      toast.error(t('Error processing payment. Please try again.'));
    } finally {
      setIsProcessing(false);
    }
  };
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">{t('Checkout')}</h1>

        {/* Order Summary */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">{t('Order Summary')}</h2>
          <div className="space-y-4">
            {items.map(item => (
              <div key={item.product.id} className="flex items-center justify-between">
                <div className="flex items-center">
                  <img
                    src={item.product.imageurl}
                    alt={item.product.name.en}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="ml-4">
                    <h3 className="font-medium">{item.product.name.en}</h3>
                    <p className="text-gray-500">Quantity: {item.quantity}</p>
                  </div>
                </div>
                <p className="font-medium">{item.product.price.toLocaleString()} XAF</p>
              </div>
            ))}

            <div className="border-t pt-4">
              <div className="flex justify-between mb-2">
                <span>{t('Subtotal')}</span>
                <span>{subtotal.toLocaleString()} XAF</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>{t('Shipping')}</span>
                <span>{shipping.toLocaleString()} XAF</span>
              </div>
              <div className="flex justify-between font-bold">
                <span>{t('Total')}</span>
                <span>{total.toLocaleString()} XAF</span>
              </div>
            </div>
          </div>
        </div>
                  
        {/* Checkout Form or Payment Method */}
        {!showPayment ? (
          isAuthenticated ? (
            <UserCheckoutForm user={user} onSubmit={handleCheckoutSubmit} />
          ) : (
            <GuestCheckoutForm onSubmit={handleCheckoutSubmit} />
          )
        ) : (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">{t('Payment Method')}</h2>
            <div className="space-y-4">
              <div className="flex space-x-4">
                <button
                  onClick={() => setSelectedPayment('mtn')}
                  className={`flex-1 p-4 border rounded-lg ${
                    selectedPayment === 'mtn'
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200'
                  }`}
                >
                  <img src="/mtn-logo.png" alt="MTN Mobile Money" className="h-8 mx-auto" />
                </button>
                <button
                  onClick={() => setSelectedPayment('orange')}
                  className={`flex-1 p-4 border rounded-lg ${
                    selectedPayment === 'orange'
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200'
                  }`}
                >
                  <img src="/orange-logo.png" alt="Orange Money" className="h-8 mx-auto" />
                </button>
              </div>
            
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('Mobile Money Number')}
                </label>
                <input
                  type="tel"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  pattern="^(6|2)[0-9]{8}$"
                  className="w-full px-4 py-2 border rounded-md focus:ring-green-500 focus:border-green-500"
                  placeholder="6XX XXX XXX"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  {t('Enter your MTN or Orange Money number')}
                </p>
              </div>

              <motion.button
                onClick={handlePaymentConfirm}
                disabled={isProcessing}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full py-3 px-4 rounded-md text-white transition-colors ${
                  isProcessing
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                {isProcessing ? t('Processing...') : t('Confirm Payment')}
              </motion.button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CheckoutPage;