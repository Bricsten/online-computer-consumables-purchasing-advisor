import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Trash2, ShoppingBag } from 'lucide-react';
import Layout from '../components/Layout/Layout';
import useCartStore from '../store/cartStore';
import { formatCurrency, getTranslatedValue } from '../utils/format';

const CartPage: React.FC = () => {
  const { t } = useTranslation();
  const { items, removeItem, updateQuantity, clearCart } = useCartStore();

  const subtotal = items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  
  if (items.length === 0) {
  return (
    <Layout>
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <h1 className="text-2xl font-bold mb-4">{t('cart.empty')}</h1>
            <Link
              to="/products"
              className="inline-block bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition-colors"
            >
              {t('cart.continueShopping')}
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-8">{t('cart.title')}</h1>
        
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
            <ul className="space-y-4">
                  {items.map((item) => (
                    <motion.li 
                      key={item.product.id}
                  initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="flex flex-col sm:flex-row items-center bg-white p-4 rounded-lg shadow"
                    >
                      <div className="flex flex-col sm:flex-row items-center">
                        <div className="sm:w-24 h-24 flex-shrink-0 mb-4 sm:mb-0">
                          <img
                            src={item.product.imageurl}
                        alt={getTranslatedValue(item.product.name)}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        
                        <div className="flex-grow sm:ml-6">
                          <Link
                            to={`/products/${item.product.id}`}
                            className="text-lg font-medium hover:text-green-600"
                          >
                        {getTranslatedValue(item.product.name)}
                          </Link>
                          
                          <div className="text-gray-500 mb-2">
                            {item.product.brand}
                          </div>
                          
                      <div className="text-green-700 font-bold">
                        {formatCurrency(item.product.price)}
                      </div>
                    </div>
                            </div>
                            
                  <div className="flex items-center mt-4 sm:mt-0">
                    <div className="flex items-center mr-6">
                      <label className="mr-2">{t('cart.quantity')}:</label>
                      <input
                        type="number"
                        min="1"
                        max={item.product.instock}
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item.product.id, Math.min(item.product.instock, Math.max(1, parseInt(e.target.value) || 1)))}
                        className="w-16 text-center border rounded p-1"
                      />
                              </div>
                              
                              <button
                                onClick={() => removeItem(item.product.id)}
                      className="text-red-500 hover:text-red-700"
                      title={t('cart.remove')}
                              >
                                <Trash2 className="h-5 w-5" />
                              </button>
                      </div>
                    </motion.li>
                  ))}
                </ul>
            </div>
            
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-bold mb-4">{t('cart.orderSummary')}</h2>
                
              <div className="border-t pt-4">
                <div className="flex justify-between mb-2">
                    <span>{t('cart.subtotal')}</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  
                <div className="border-t pt-4 mt-4">
                  <div className="flex justify-between text-xl font-bold">
                    <span>{t('cart.total')}</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                </div>
                  </div>
                  
              <div className="mt-6 space-y-4">
                  <Link
                    to="/checkout"
                  className="block w-full bg-green-600 text-white text-center px-6 py-3 rounded-md hover:bg-green-700 transition-colors"
                  >
                    {t('cart.checkout')}
                  </Link>
                
                <button
                  onClick={clearCart}
                  className="block w-full border border-red-500 text-red-500 text-center px-6 py-3 rounded-md hover:bg-red-50 transition-colors"
                >
                  {t('cart.clearAll')}
                </button>
                </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CartPage;