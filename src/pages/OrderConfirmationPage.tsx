import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { CheckCircle, Package, ArrowRight } from 'lucide-react';
import Layout from '../components/Layout/Layout';
import useOrderStore from '../store/orderStore';
import { Order } from '../types';
import { formatCurrency, formatDate } from '../utils/format';

const OrderConfirmationPage: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getOrderById } = useOrderStore();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      if (id) {
        const orderData = await getOrderById(id);
        if (orderData) {
          setOrder(orderData);
        } else {
          navigate('/');
        }
      }
    };

    fetchOrder();
  }, [id, getOrderById, navigate]);

  if (!order) {
    return null;
  }

  const getPaymentMethodDisplay = () => {
    if (order.paymentMethod.type === 'MTN_MOBILE_MONEY') {
      return (
        <div className="flex items-center">
          <img src="/mtn-logo.png" alt="MTN" className="w-6 h-6 mr-2" />
          <span>MTN Mobile Money</span>
        </div>
      );
    }
    return (
      <div className="flex items-center">
        <img src="/orange-logo.png" alt="Orange" className="w-6 h-6 mr-2" />
        <span>Orange Money</span>
      </div>
    );
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t('Thank you for your order!')}
          </h1>
          <p className="text-lg text-gray-600">
            {t('Order')} #{order.id}
          </p>
        </motion.div>

        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-medium text-gray-900">
                  {t('Order Details')}
                </h2>
                <p className="text-sm text-gray-500">
                  {t('Placed on')} {formatDate(order.createdAt)}
                </p>
              </div>
              <div className="flex items-center">
                <Package className="w-5 h-5 text-gray-400 mr-2" />
                <span className="text-sm font-medium text-gray-900">
                  {order.status}
                </span>
              </div>
            </div>

            <div className="border-t border-gray-200 py-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {t('Items')}
              </h3>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      <img
                        src={item.product.imageurl}
                        alt={item.product.name.en}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="ml-4">
                        <h4 className="text-sm font-medium text-gray-900">
                          {item.product.name.en}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {t('Quantity')}: {item.quantity}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm font-medium text-gray-900">
                      {formatCurrency(item.product.price * item.quantity)} XAF
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-gray-200 py-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {t('Delivery Location')}
              </h3>
              <p className="text-sm text-gray-500">
                {order.shippingAddress.fullName}
                <br />
                {order.shippingAddress.location}
              </p>
            </div>

            <div className="border-t border-gray-200 py-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {t('Payment Method')}
              </h3>
              <div className="text-sm text-gray-500">
                {getPaymentMethodDisplay()}
                <p className="mt-1">{t('Mobile Money Number')}: {order.paymentMethod.mobileNumber}</p>
              </div>
            </div>

            <div className="border-t border-gray-200 py-6">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">{t('Subtotal')}</span>
                <span className="text-gray-900">
                  {formatCurrency(
                    order.items.reduce(
                      (sum, item) => sum + item.product.price * item.quantity,
                      0
                    )
                  )} XAF
                </span>
              </div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">{t('Shipping')}</span>
                <span className="text-gray-900">
                  {formatCurrency(order.totalAmount * 0.1)} XAF
                </span>
              </div>
              <div className="flex justify-between text-base font-medium mt-4 pt-4 border-t">
                <span className="text-gray-900">{t('Total')}</span>
                <span className="text-gray-900">
                  {formatCurrency(order.totalAmount)} XAF
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => navigate('/products')}
            className="inline-flex items-center text-green-600 hover:text-green-800"
          >
            {t('Continue Shopping')}
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default OrderConfirmationPage; 