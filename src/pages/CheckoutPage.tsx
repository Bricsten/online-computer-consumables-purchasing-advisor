import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ShoppingBag, CreditCard } from 'lucide-react';
import Layout from '../components/Layout/Layout';
import useCartStore from '../store/cartStore';
import useUserAuthStore from '../store/userAuthStore';
import useOrderStore from '../store/orderStore';
import useReviewModalStore from '../store/reviewModalStore';
import { downloadReceipt } from '../utils/generateReceipt';
import toast from 'react-hot-toast';

const CheckoutPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { items, getOrderSummary, clearCart } = useCartStore();
  const { user } = useUserAuthStore();
  const { createOrder } = useOrderStore();
  const { openModal } = useReviewModalStore();
  const [selectedPayment, setSelectedPayment] = useState<'mtn' | 'orange'>('mtn');
  const [mobileNumber, setMobileNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Get order summary details
  const { subtotal, shipping, total } = getOrderSummary();

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

  const handlePaymentConfirm = async () => {
    if (!mobileNumber) {
      toast.error(t('Please enter your mobile money number'));
      return;
    }

    setIsProcessing(true);
    try {
      // Create order object
      const orderData = {
        user_id: user?.id,
        items: items.map(item => ({
          id: item.product.id,
          name: item.product.name.en,
          quantity: item.quantity,
          price: item.product.price
        })),
        total,
        subtotal,
        shipping,
        payment_method: selectedPayment === 'mtn' ? 'MTN Mobile Money' : 'Orange Money',
        shipping_address: user?.user_metadata?.address || '',
        created_at: new Date().toISOString()
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
      if (user) {
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

        {/* Payment Method */}
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('Enter your Mobile Money number')}
              </label>
              <input
                type="tel"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="6XX XXX XXX"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between">
          <button
            onClick={() => navigate('/cart')}
            className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            {t('Back to Cart')}
          </button>
          <button
            onClick={handlePaymentConfirm}
            disabled={isProcessing}
            className={`px-8 py-3 bg-green-500 text-white rounded-lg transform transition-all ${
              isProcessing
                ? 'opacity-75 cursor-not-allowed'
                : 'hover:bg-green-600 hover:-translate-y-0.5 hover:shadow-lg'
            }`}
          >
            {isProcessing ? t('Processing...') : t('Confirm Payment')}
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default CheckoutPage;