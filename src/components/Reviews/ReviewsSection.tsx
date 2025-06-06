import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import useReviewStore from '../../store/reviewStore';
import { useTranslation } from 'react-i18next';

const ReviewsSection: React.FC = () => {
  const { t } = useTranslation();
  const { reviews, fetchReviews, isLoading } = useReviewStore();

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, index) => (
      <Star
        key={index}
        className={`w-5 h-5 ${
          index < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            {t('What Our Customers Say')}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-600 max-w-2xl mx-auto"
          >
            {t('Discover what customers love about our products and service')}
          </motion.p>
        </div>

        {isLoading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {reviews.slice(0, 6).map((review, index) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg p-6 relative"
              >
                <Quote className="absolute text-green-100 w-12 h-12 -top-2 -left-2" />
                <div className="flex items-center mb-4">
                  <div className="flex-shrink-0">
                    {review.user_avatar ? (
                      <img
                        src={review.user_avatar}
                        alt={review.username}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                        <span className="text-green-600 text-xl font-semibold">
                          {review.username[0].toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="ml-4">
                    <h3 className="font-semibold text-lg">{review.username}</h3>
                    <div className="flex space-x-1 mt-1">
                      {renderStars(review.rating)}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 line-clamp-4">{review.comment}</p>
                <div className="mt-4 text-sm text-gray-400">
                  {new Date(review.created_at).toLocaleDateString()}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ReviewsSection; 