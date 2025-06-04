import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { X, ShoppingCart } from 'lucide-react';
import Layout from '../components/Layout/Layout';
import useCompareStore from '../store/compareStore';
import useCartStore from '../store/cartStore';
import { formatCurrency, getTranslatedValue } from '../utils/format';
import toast from 'react-hot-toast';

const ComparePage: React.FC = () => {
  const { t } = useTranslation();
  const { products, removeProduct, clearAll } = useCompareStore();
  const addToCart = useCartStore(state => state.addItem);

  const handleAddToCart = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      addToCart(product, 1);
      toast.success(`${getTranslatedValue(product.name)} added to cart!`);
    }
  };

  if (products.length === 0) {
  return (
    <Layout>
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">{t('compare.title')}</h1>
            <p className="text-gray-600 mb-8">{t('compare.noProducts')}</p>
            <Link
              to="/products"
              className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition-colors"
            >
              {t('compare.addMore')}
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">{t('compare.title')}</h1>
          <div className="flex items-center space-x-4">
                  <Link
                    to="/products"
              className="text-green-600 hover:text-green-800"
                  >
                    {t('compare.addMore')}
                  </Link>
            {products.length > 0 && (
              <button
                onClick={clearAll}
                className="text-red-500 hover:text-red-700"
              >
                {t('compare.clearAll')}
              </button>
            )}
          </div>
            </div>

        <div className="bg-white rounded-lg shadow overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                <th className="p-4 border-b border-r bg-gray-50 w-40"></th>
                    {products.map(product => (
                      <th key={product.id} className="p-4 border-b min-w-[250px]">
                        <div className="relative">
                          <button
                            onClick={() => removeProduct(product.id)}
                        className="absolute -top-2 -right-2 text-gray-400 hover:text-red-500"
                          >
                        <X className="h-5 w-5" />
                          </button>
                            <img
                              src={product.imageurl}
                        alt={getTranslatedValue(product.name)}
                        className="w-32 h-32 mx-auto object-contain mb-4"
                            />
                      <h3 className="font-medium text-lg mb-2">
                        {getTranslatedValue(product.name)}
                      </h3>
                      <div className="text-xl font-bold text-green-700 mb-4">
                          {formatCurrency(product.price)}
                        </div>
                        <button
                          onClick={() => handleAddToCart(product.id)}
                          disabled={product.instock <= 0}
                        className={`flex items-center justify-center w-full py-2 px-4 rounded ${
                            product.instock > 0
                              ? 'bg-green-600 text-white hover:bg-green-700'
                              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          }`}
                        >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        {t('products.addToCart')}
                        </button>
                    </div>
                  </th>
                    ))}
                  </tr>
            </thead>
            <tbody>
                  <tr>
                    <td className="p-4 border-b border-r font-medium bg-gray-50">
                      {t('products.brand')}
                    </td>
                    {products.map(product => (
                      <td key={product.id} className="p-4 border-b text-center">
                        {product.brand}
                      </td>
                    ))}
                  </tr>

                  <tr>
                    <td className="p-4 border-b border-r font-medium bg-gray-50">
                      {t('products.category')}
                    </td>
                    {products.map(product => (
                      <td key={product.id} className="p-4 border-b text-center">
                    {getTranslatedValue(product.category)}
                      </td>
                    ))}
                  </tr>

                  <tr>
                    <td className="p-4 border-b border-r font-medium bg-gray-50">
                      {t('productDetail.availability')}
                    </td>
                    {products.map(product => (
                      <td key={product.id} className="p-4 border-b text-center">
                        {product.instock > 0 ? (
                          <span className="text-green-600">
                            {t('productDetail.inStock')} ({product.instock})
                          </span>
                        ) : (
                          <span className="text-red-500">
                            {t('productDetail.outOfStock')}
                          </span>
                        )}
                      </td>
                    ))}
                  </tr>

                  <tr>
                    <td className="p-4 border-b border-r font-medium bg-gray-50">
                  {t('productDetail.description')}
                    </td>
                    {products.map(product => (
                  <td key={product.id} className="p-4 border-b">
                    {getTranslatedValue(product.description)}
                      </td>
                    ))}
                  </tr>

                  <tr>
                    <td className="p-4 border-b border-r font-medium bg-gray-50">
                  {t('productDetail.features')}
                    </td>
                    {products.map(product => (
                      <td key={product.id} className="p-4 border-b">
                    <ul className="list-disc pl-5">
                          {product.features.map((feature, index) => (
                        <li key={index}>{getTranslatedValue(feature)}</li>
                          ))}
                        </ul>
                      </td>
                    ))}
                  </tr>

                  <tr>
                      <td className="p-4 border-b border-r font-medium bg-gray-50">
                  {t('productDetail.specifications')}
                      </td>
                      {products.map(product => (
                  <td key={product.id} className="p-4 border-b">
                    <dl className="space-y-2">
                      {Object.entries(product.specifications).map(([key, value]) => (
                        <div key={key}>
                          <dt className="font-medium">{key}</dt>
                          <dd className="text-gray-600">{getTranslatedValue(value)}</dd>
                        </div>
                      ))}
                    </dl>
                        </td>
                      ))}
                    </tr>
                </tbody>
              </table>
            </div>
      </div>
    </Layout>
  );
};

export default ComparePage;