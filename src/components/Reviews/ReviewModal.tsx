import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, X } from 'lucide-react';
import useReviewStore from '../../store/reviewStore';
import useUserAuthStore from '../../store/userAuthStore';
import { useTranslation } from 'react-i18next';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ReviewModal: React.FC<ReviewModalProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const { user } = useUserAuthStore();
  const { addReview } = useReviewStore();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [hoveredStar, setHoveredStar] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);
    try {
      await addReview({
        user_id: user.id,
        username: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Anonymous',
        user_avatar: user.user_metadata?.avatar_url,
        rating,
        comment
      });
      onClose();
    } catch (error) {
      console.error('Error submitting review:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 relative"
          >
            <button
              onClick={onClose}
              className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>

            <h2 className="text-2xl font-bold text-center mb-6">
              {t('How was your experience?')}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex justify-center space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHoveredStar(star)}
                    onMouseLeave={() => setHoveredStar(0)}
                    onClick={() => setRating(star)}
                    className="focus:outline-none transform transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        star <= (hoveredStar || rating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>

              <div>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder={t('Share your thoughts...')}
                  className="w-full h-32 p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                  required
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  {t('Skip')}
                </button>
                <button
                  type="submit"
                  disabled={!rating || !comment || isSubmitting}
                  className={`px-6 py-2 bg-green-500 text-white rounded-lg transform transition-all ${
                    isSubmitting ? 'opacity-75' : 'hover:bg-green-600 hover:-translate-y-0.5'
                  }`}
                >
                  {isSubmitting ? t('Submitting...') : t('Submit Review')}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ReviewModal; 