import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Filter } from 'lucide-react';
import { motion } from 'framer-motion';
import Layout from '../components/Layout/Layout';
import ProductCard from '../components/UI/ProductCard';
import FilterSidebar from '../components/UI/FilterSidebar';
import { Product } from '../types';
import useProductStore from '../store/productStore';
import { getTranslatedValue } from '../utils/format';

const ProductsPage: React.FC = () => {
  const { t } = useTranslation();
  const { products, fetchProducts } = useProductStore();
  const [searchParams] = useSearchParams();
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<{
    category?: string;
    brand?: string;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
  }>({});

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    setCategories(Array.from(new Set(products.map(p => getTranslatedValue(p.category)))).filter(Boolean));
    setBrands(Array.from(new Set(products.map(p => p.brand))).filter(Boolean));
  }, [products]);

  useEffect(() => {
    const categoryParam = searchParams.get('category');
    const brandParam = searchParams.get('brand');
    const searchParam = searchParams.get('search');
    const minPriceParam = searchParams.get('minPrice');
    const maxPriceParam = searchParams.get('maxPrice');

    const newFilters = {
      category: categoryParam || undefined,
      brand: brandParam || undefined,
      search: searchParam || undefined,
      minPrice: minPriceParam ? Number(minPriceParam) : undefined,
      maxPrice: maxPriceParam ? Number(maxPriceParam) : undefined
    };
    setActiveFilters(newFilters);
    applyFilters(newFilters);
  }, [searchParams, products]);

  const applyFilters = (filters: {
    category?: string;
    brand?: string;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
  }) => {
    let filtered = [...products];

    if (filters.category) {
      filtered = filtered.filter(product => getTranslatedValue(product.category) === filters.category);
    }

    if (filters.brand) {
      filtered = filtered.filter(product => product.brand === filters.brand);
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(product =>
        getTranslatedValue(product.name).toLowerCase().includes(searchLower) ||
        getTranslatedValue(product.description).toLowerCase().includes(searchLower) ||
        getTranslatedValue(product.category).toLowerCase().includes(searchLower) ||
        product.brand.toLowerCase().includes(searchLower)
      );
    }

    if (filters.minPrice !== undefined) {
      filtered = filtered.filter(product => product.price >= filters.minPrice!);
    }

    if (filters.maxPrice !== undefined) {
      filtered = filtered.filter(product => product.price <= filters.maxPrice!);
    }

    setFilteredProducts(filtered);
  };

  const handleFilterChange = (filters: {
    category?: string;
    brand?: string;
    minPrice?: number;
    maxPrice?: number;
  }) => {
    const newFilters = { ...activeFilters, ...filters };
    
    // Remove undefined filters
    Object.keys(newFilters).forEach(key => {
      if (newFilters[key as keyof typeof newFilters] === undefined) {
        delete newFilters[key as keyof typeof newFilters];
      }
    });
    
    // Update URL params
    const params = new URLSearchParams();
    if (newFilters.category) params.set('category', newFilters.category);
    if (newFilters.brand) params.set('brand', newFilters.brand);
    if (newFilters.search) params.set('search', newFilters.search);
    if (newFilters.minPrice) params.set('minPrice', newFilters.minPrice.toString());
    if (newFilters.maxPrice) params.set('maxPrice', newFilters.maxPrice.toString());
    
    window.history.pushState({}, '', `${window.location.pathname}?${params.toString()}`);
    
    setActiveFilters(newFilters);
    applyFilters(newFilters);
    setIsFilterSidebarOpen(false);
  };

  const getActiveFilterCount = () => {
    return Object.values(activeFilters).filter(value => value !== undefined).length;
  };

  const clearAllFilters = () => {
    window.history.pushState({}, '', window.location.pathname);
    setActiveFilters({});
    applyFilters({});
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold">{t('products.title')}</h1>
            <button
              onClick={() => setIsFilterSidebarOpen(true)}
              className="lg:hidden flex items-center text-gray-600 hover:text-gray-900"
            >
              <Filter className="h-5 w-5 mr-1" />
              {t('products.filter')}
            </button>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 pb-12">
            <div className="lg:w-80 flex-shrink-0">
              <FilterSidebar
                isOpen={isFilterSidebarOpen}
                onClose={() => setIsFilterSidebarOpen(false)}
                categories={categories}
                brands={brands}
                activeFilters={activeFilters}
              />
            </div>

            <div className="flex-1">
              {filteredProducts.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">{t('products.noProducts')}</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredProducts.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductsPage;