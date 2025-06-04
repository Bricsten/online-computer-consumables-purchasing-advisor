import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  ShoppingCart, ChevronLeft, Star, BarChart3, CheckCircle, XCircle 
} from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import Layout from '../components/Layout/Layout';
import ProductCard from '../components/UI/ProductCard';
import { Product } from '../types';
import useCartStore from '../store/cartStore';
import useCompareStore from '../store/compareStore';
import useProductStore from '../store/productStore';
import { formatCurrency, formatDate, getTranslatedValue } from '../utils/format';

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { products } = useProductStore();
  const addToCart = useCartStore(state => state.addItem);
  const { addProduct, isInCompare, canAddMore } = useCompareStore();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [isImageZoomed, setIsImageZoomed] = useState(false);

  useEffect(() => {
    if (id) {
      const foundProduct = products.find(p => p.id === id);
      
      if (foundProduct) {
        setProduct(foundProduct);
        
        // Find related products (same category, excluding current product)
        const related = products
          .filter(p => getTranslatedValue(p.category) === getTranslatedValue(foundProduct.category) && p.id !== id)
          .slice(0, 4);
        
        setRelatedProducts(related);
      } else {
        navigate('/products');
        toast.error('Product not found');
      }
    }
  }, [id, products, navigate]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      toast.success(`${getTranslatedValue(product.name)} added to cart!`);
    }
  };

  const handleAddToCompare = () => {
    if (!product) return;
    
    if (isInCompare(product.id)) {
      toast.error('Product is already in compare list!');
      return;
    }
    
    if (!canAddMore()) {
      toast.error(t('compare.maxProducts'));
      return;
    }
    
    addProduct(product);
    toast.success(`${getTranslatedValue(product.name)} added to comparison!`);
  };

  if (!product) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <p className="text-xl">{t('general.loading')}</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link
            to="/products"
            className="inline-flex items-center text-green-600 hover:text-green-800"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            {t('products.title')}
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
            {/* Product Image */}
            <div className="relative">
              <motion.div
                className={`relative cursor-zoom-in overflow-hidden rounded-lg ${
                  isImageZoomed ? 'h-[500px]' : 'h-[400px]'
                }`}
                onClick={() => setIsImageZoomed(!isImageZoomed)}
              >
                <img
                  src={product.imageurl}
                  alt={getTranslatedValue(product.name)}
                  className={`w-full h-full object-contain transition-transform duration-300 ${
                    isImageZoomed ? 'scale-150' : 'scale-100'
                  }`}
                />
              </motion.div>
              
              {product.instock <= 0 && (
                <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {t('products.outOfStock')}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-4">{getTranslatedValue(product.name)}</h1>
              
              <div className="flex items-center mb-4">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(product.rating)
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="ml-2 text-gray-600">
                  ({product.reviews.length} reviews)
                </span>
              </div>
              
              <div className="mb-6">
                <span className="text-3xl font-bold text-green-700">
                  {formatCurrency(product.price)}
                </span>
              </div>
              
              <div className="mb-6">
                <div className="flex items-center mb-2">
                  <span className="font-medium mr-2">{t('productDetail.availability')}:</span>
                  {product.instock > 0 ? (
                    <span className="text-green-600 flex items-center">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      {t('productDetail.inStock')} ({product.instock})
                    </span>
                  ) : (
                    <span className="text-red-500 flex items-center">
                      <XCircle className="h-4 w-4 mr-1" />
                      {t('productDetail.outOfStock')}
                    </span>
                  )}
                </div>
                
                <div className="flex items-center mb-2">
                  <span className="font-medium mr-2">{t('products.brand')}:</span>
                  <span>{product.brand}</span>
                </div>
                
                <div className="flex items-center">
                  <span className="font-medium mr-2">{t('products.category')}:</span>
                  <span>{getTranslatedValue(product.category)}</span>
                </div>
              </div>
              
              {product.instock > 0 && (
                <div className="flex items-center space-x-4 mb-6">
                  <span className="font-medium">{t('productDetail.quantity')}:</span>
                  <div className="flex border rounded-md">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-1 border-r hover:bg-gray-100"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min="1"
                      max={product.instock}
                      value={quantity}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                      className="w-12 text-center"
                    />
                    <button
                      onClick={() => setQuantity(Math.min(product.instock, quantity + 1))}
                      className="px-3 py-1 border-l hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}
              
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                <button
                  onClick={handleAddToCart}
                  disabled={product.instock <= 0}
                  className={`flex items-center justify-center px-6 py-3 rounded-md transition-colors ${
                    product.instock > 0
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  {t('productDetail.addToCart')}
                </button>
                
                <button
                  onClick={handleAddToCompare}
                  className={`flex items-center justify-center px-6 py-3 rounded-md transition-colors ${
                    isInCompare(product.id)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  <BarChart3 className="h-5 w-5 mr-2" />
                  {t('productDetail.addToCompare')}
                </button>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-t">
            <div className="flex border-b">
              <button
                className={`px-6 py-3 font-medium ${
                  activeTab === 'description'
                    ? 'border-b-2 border-green-600 text-green-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                onClick={() => setActiveTab('description')}
              >
                Description
              </button>
              <button
                className={`px-6 py-3 font-medium ${
                  activeTab === 'specifications'
                    ? 'border-b-2 border-green-600 text-green-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                onClick={() => setActiveTab('specifications')}
              >
                {t('productDetail.specifications')}
              </button>
              <button
                className={`px-6 py-3 font-medium ${
                  activeTab === 'reviews'
                    ? 'border-b-2 border-green-600 text-green-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                onClick={() => setActiveTab('reviews')}
              >
                {t('productDetail.reviews')} ({product.reviews.length})
              </button>
            </div>
            
            <div className="p-6">
              {activeTab === 'description' && (
                <div>
                  <p className="text-gray-700 leading-relaxed">{getTranslatedValue(product.description)}</p>
                  
                  <h3 className="font-bold text-lg mt-6 mb-3">{t('productDetail.features')}</h3>
                  <ul className="list-disc pl-5 space-y-2">
                    {product.features.map((feature, index) => (
                      <li key={index} className="text-gray-700">{getTranslatedValue(feature)}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {activeTab === 'specifications' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="border-b pb-2">
                      <span className="font-medium">{key}: </span>
                      <span className="text-gray-700">{getTranslatedValue(value)}</span>
                    </div>
                  ))}
                </div>
              )}
              
              {activeTab === 'reviews' && (
                <div>
                  {product.reviews.length === 0 ? (
                    <p className="text-gray-500">No reviews yet.</p>
                  ) : (
                    <div className="space-y-6">
                      {product.reviews.map((review) => (
                        <div key={review.id} className="border-b pb-4">
                          <div className="flex justify-between mb-2">
                            <span className="font-medium">{review.userName}</span>
                            <span className="text-gray-500 text-sm">
                              {formatDate(review.date)}
                            </span>
                          </div>
                          <div className="flex mb-2">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < review.rating
                                    ? 'text-yellow-400 fill-yellow-400'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <p className="text-gray-700">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">{t('productDetail.relatedProducts')}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ProductDetailPage;