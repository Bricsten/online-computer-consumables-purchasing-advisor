import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ShoppingCart, BarChart3, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import { Product } from '../../types';
import useCartStore from '../../store/cartStore';
import useCompareStore from '../../store/compareStore';
import toast from 'react-hot-toast';
import { formatCurrency, getTranslatedValue } from '../../utils/format';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { t } = useTranslation();
  const addToCart = useCartStore(state => state.addItem);
  const { addProduct, isInCompare, canAddMore } = useCompareStore();

  const handleAddToCart = () => {
    addToCart(product, 1);
    toast.success(`${getTranslatedValue(product.name)} added to cart!`);
  };

  const handleAddToCompare = () => {
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
    >
      <Link to={`/products/${product.id}`} className="block">
        <div className="relative h-48 overflow-hidden">
          <img
            src={product.imageurl}
            alt={getTranslatedValue(product.name)}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
          {product.instock <= 0 && (
            <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
              {t('products.outOfStock')}
            </div>
          )}
        </div>
        
        <div className="p-4">
          <h3 className="text-lg font-semibold line-clamp-2 h-14">{getTranslatedValue(product.name)}</h3>
          
          <div className="flex items-center mt-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <span key={i} className={i < Math.floor(product.rating) ? "text-yellow-400" : "text-gray-300"}>
                  ★
                </span>
              ))}
            </div>
            <span className="text-sm text-gray-500 ml-2">
              ({product.reviews.length})
            </span>
          </div>
          
          <div className="mt-3">
            <span className="text-xl font-bold text-green-700">
              {formatCurrency(product.price)}
            </span>
          </div>
          
          <div className="mt-4 flex justify-between items-center">
            <button
              onClick={(e) => {
                e.preventDefault();
                handleAddToCart();
              }}
              className="flex items-center text-sm text-green-600 hover:text-green-800"
              disabled={product.instock <= 0}
            >
              <ShoppingCart className="h-4 w-4 mr-1" />
              {t('products.addToCart')}
            </button>
            
            <button
              onClick={(e) => {
                e.preventDefault();
                handleAddToCompare();
              }}
              className="flex items-center text-sm text-blue-600 hover:text-blue-800"
            >
              <BarChart3 className="h-4 w-4 mr-1" />
              {t('products.addToCompare')}
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;