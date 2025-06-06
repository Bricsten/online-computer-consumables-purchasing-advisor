import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Star, MessageSquare } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import useUserAuthStore from '../../store/userAuthStore';
import toast from 'react-hot-toast';

interface Review {
  id: string;
  user_id: string;
  product_id: string;
  rating: number;
  comment: string;
  created_at: string;
  user: {
    full_name: string;
  };
}

interface ProductReviewsProps {
  productId: string;
}

const ProductReviews: React.FC<ProductReviewsProps> = ({ productId }) => {
  const { t } = useTranslation();
  const { user, isAuthenticated } = useUserAuthStore();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: '',
  });

  useEffect(() => {
    loadReviews();
  }, [productId]);

  const loadReviews = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('reviews')
        .select('*, user:users(full_name)')
        .eq('product_id', productId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReviews(data || []);
    } catch (error) {
      console.error('Error loading reviews:', error);
      toast.error(t('Failed to load reviews'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error(t('Please sign in to leave a review'));
      return;
    }

    try {
      const { error } = await supabase
        .from('reviews')
        .insert([
          {
            product_id: productId,
            user_id: user?.id,
            rating: newReview.rating,
            comment: newReview.comment,
            created_at: new Date().toISOString(),
          },
        ]);

      if (error) throw error;

      toast.success(t('Review submitted successfully'));
      setNewReview({ rating: 5, comment: '' });
      setShowReviewForm(false);
      loadReviews();
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error(t('Failed to submit review'));
    }
  };

  const averageRating = reviews.length > 0
    ? (reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length).toFixed(1)
    : '0.0';

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">{t('Customer Reviews')}</h2>
        {isAuthenticated && !showReviewForm && (
          <button
            onClick={() => setShowReviewForm(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
          >
            {t('Write a Review')}
          </button>
        )}
      </div>

      <div className="mb-8">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            {[...Array(5)].map((_, index) => (
              <Star
                key={index}
                size={24}
                className={index < Math.round(Number(averageRating))
                  ? 'text-yellow-400 fill-current'
                  : 'text-gray-300'
                }
              />
            ))}
          </div>
          <span className="text-2xl font-bold text-gray-900">{averageRating}</span>
          <span className="text-gray-500">
            {t('Based on {{count}} reviews', { count: reviews.length })}
          </span>
        </div>
      </div>

      {showReviewForm && (
        <form onSubmit={handleSubmitReview} className="mb-8 bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-4">{t('Write Your Review')}</h3>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('Rating')}
            </label>
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  type="button"
                  onClick={() => setNewReview({ ...newReview, rating })}
                  className="focus:outline-none"
                >
                  <Star
                    size={24}
                    className={rating <= newReview.rating
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                    }
                  />
                </button>
              ))}
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('Comment')}
            </label>
            <textarea
              value={newReview.comment}
              onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
              required
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
            />
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => setShowReviewForm(false)}
              className="text-gray-600 hover:text-gray-800"
            >
              {t('Cancel')}
            </button>
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
            >
              {t('Submit Review')}
            </button>
          </div>
        </form>
      )}

      <div className="space-y-6">
        {reviews.length === 0 ? (
          <div className="text-center py-8">
            <MessageSquare size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">{t('No reviews yet. Be the first to review this product!')}</p>
          </div>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="border-b pb-6">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="font-medium text-gray-900">{review.user.full_name}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(review.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center">
                  {[...Array(5)].map((_, index) => (
                    <Star
                      key={index}
                      size={16}
                      className={index < review.rating
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                      }
                    />
                  ))}
                </div>
              </div>
              <p className="text-gray-600">{review.comment}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProductReviews; 