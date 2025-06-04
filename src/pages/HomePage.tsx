import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import Layout from '../components/Layout/Layout';
import ProductCard from '../components/UI/ProductCard';
import RecommendationChatbot from '../components/Chat/RecommendationChatbot';
import useProductStore from '../store/productStore';
import { Product } from '../types';

const HomePage: React.FC = () => {
  const { t } = useTranslation();
  const { products, fetchProducts } = useProductStore();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [brands, setBrands] = useState<string[]>([]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    setFeaturedProducts(products.slice(0, 4));
    setCategories(Array.from(new Set(products.map(p => typeof p.category === 'string' ? p.category : p.category?.en || ''))).filter(Boolean));
    setBrands(Array.from(new Set(products.map(p => p.brand))).filter(Boolean));
  }, [products]);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-700 to-green-900 text-white py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {t('home.welcome')}
            </h1>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              {t('home.tagline')}
            </p>
            <Link
              to="/products"
              className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-8 rounded-lg shadow-lg transition-colors inline-block"
            >
              {t('home.viewAll')}
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">{t('home.featuredProducts')}</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          
          <div className="text-center mt-10">
            <Link
              to="/products"
              className="inline-block border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white font-medium py-2 px-6 rounded-lg transition-colors"
            >
              {t('home.viewAll')}
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">{t('home.categories')}</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map(category => (
              <Link 
                key={category}
                to={`/products?category=${category}`} 
                className="group"
              >
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  className="bg-white rounded-lg shadow-md overflow-hidden h-48 relative group"
                >
                  <div className="absolute inset-0 bg-black opacity-40 group-hover:opacity-30 transition-opacity"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <h3 className="text-white text-2xl font-bold">{category}</h3>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Recommendation Chatbot */}
      <section className="py-12 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4 text-center">Need Help Choosing?</h2>
          <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
            Our AI assistant can help you find the perfect computer consumables based on your needs.
          </p>
          
          <RecommendationChatbot />
        </div>
      </section>

      {/* Top Brands */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">{t('home.topBrands')}</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {brands.map(brand => (
              <Link 
                key={brand}
                to={`/products?brand=${brand}`}
              >
                <motion.div
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow"
                >
                  <h3 className="text-xl font-semibold">{brand}</h3>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default HomePage;