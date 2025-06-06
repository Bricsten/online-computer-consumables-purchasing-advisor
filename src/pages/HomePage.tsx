import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { User, LogOut } from 'lucide-react';
import Layout from '../components/Layout/Layout';
import ProductCard from '../components/UI/ProductCard';
import RecommendationChatbot from '../components/Chat/RecommendationChatbot';
import useProductStore from '../store/productStore';
import useUserAuthStore from '../store/userAuthStore';
import SignUpModal from '../components/Auth/SignUpModal';
import SignInModal from '../components/Auth/SignInModal';
import ReviewsSection from '../components/Reviews/ReviewsSection';
import { Product } from '../types';
import toast from 'react-hot-toast';

const HomePage: React.FC = () => {
  const { t } = useTranslation();
  const { products, fetchProducts } = useProductStore();
  const { isAuthenticated, signOut, user } = useUserAuthStore();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success(t('Successfully signed out'));
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error(t('Failed to sign out'));
    }
  };

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
      <section className="relative min-h-screen flex items-center justify-center">
        {/* Background Image */}
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: 'url("/hero wallpaper.jpg")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            filter: 'brightness(0.5)'
          }}
        />

        <div className="container mx-auto px-4 z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.h1 
              className="text-6xl md:text-7xl font-bold mb-6 text-white"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              TechSupplies
              <br />
              <span className="text-yellow-400">Cameroon</span>
            </motion.h1>
            <motion.p 
              className="text-xl md:text-2xl mb-12 text-gray-200"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Your trusted source for quality computer consumables in Cameroon. 
              Find the best printers, cartridges, toners, and accessories at competitive prices.
            </motion.p>
            <motion.div 
              className="flex justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              {isAuthenticated ? (
                <div className="flex justify-center space-x-4">
                  <Link
                    to="/profile"
                    className="flex items-center justify-center bg-white hover:bg-yellow-100 text-gray-800 font-bold py-4 px-10 rounded-lg shadow-xl transition-all hover:shadow-2xl transform hover:-translate-y-1"
                  >
                    <User className="w-5 h-5 mr-2" />
                    {t('nav.profile')}
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center justify-center bg-white hover:bg-yellow-100 text-gray-800 font-bold py-4 px-10 rounded-lg shadow-xl transition-all hover:shadow-2xl transform hover:-translate-y-1"
                  >
                    <LogOut className="w-5 h-5 mr-2" />
                    {t('auth.signOut')}
                  </button>
                </div>
              ) : (
                <Link
                  to="/auth"
                  className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-12 rounded-lg shadow-xl transition-all hover:shadow-2xl transform hover:-translate-y-1 inline-block text-lg"
                >
                  {t('Get Started')}
                </Link>
              )}
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 1,
            delay: 1,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        >
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2"></div>
          </div>
        </motion.div>
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

      {/* Reviews Section */}
      <ReviewsSection />

      {/* Auth Modals */}
      <SignUpModal
        isOpen={isSignUpModalOpen}
        onClose={() => setIsSignUpModalOpen(false)}
        onSuccess={() => {
          setIsSignUpModalOpen(false);
          setIsSignInModalOpen(true);
        }}
        onSignInClick={() => {
          setIsSignUpModalOpen(false);
          setIsSignInModalOpen(true);
        }}
      />

      <SignInModal
        isOpen={isSignInModalOpen}
        onClose={() => setIsSignInModalOpen(false)}
        onSuccess={() => {
          setIsSignInModalOpen(false);
        }}
        onSignUpClick={() => {
          setIsSignInModalOpen(false);
          setIsSignUpModalOpen(true);
        }}
      />
    </Layout>
  );
};

export default HomePage;