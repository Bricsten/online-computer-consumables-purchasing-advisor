import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Home } from 'lucide-react';
import Layout from '../components/Layout/Layout';

const NotFoundPage: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-9xl font-bold text-green-700">404</h1>
          <h2 className="text-2xl font-semibold mt-4 mb-6">{t('general.notFound')}</h2>
          <p className="text-gray-600 max-w-md mx-auto mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <Link
            to="/"
            className="inline-flex items-center bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition-colors"
          >
            <Home className="h-5 w-5 mr-2" />
            {t('general.backToHome')}
          </Link>
        </motion.div>
      </div>
    </Layout>
  );
};

export default NotFoundPage;