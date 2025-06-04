import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react';

interface FilterSidebarProps {
  categories: string[];
  brands: string[];
  isOpen: boolean;
  onClose: () => void;
  activeFilters: {
    category?: string;
    brand?: string;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
  };
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  categories,
  brands,
  isOpen,
  onClose,
  activeFilters
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const handleFilterChange = (type: string, value: string | number | undefined) => {
    const newParams = new URLSearchParams(searchParams);
    
    if (value) {
      newParams.set(type, value.toString());
    } else {
      newParams.delete(type);
    }
    
    navigate(`/products?${newParams.toString()}`);
  };

  const clearAllFilters = () => {
    navigate('/products');
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky lg:top-24 lg:max-h-[calc(100vh-12rem)] right-0 lg:right-auto h-full w-80 bg-white shadow-lg z-[90] transform transition-transform duration-300 lg:transform-none overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 ${
          isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
        }`}
        style={{
          height: 'auto',
          maxHeight: 'calc(100vh - 6rem)',
          marginBottom: '2rem'
        }}
      >
        <div className="p-4 pb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">{t('products.filter')}</h2>
            <button
              onClick={onClose}
              className="lg:hidden text-gray-500 hover:text-gray-700"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Search */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('products.search')}
            </label>
            <input
              type="text"
              value={activeFilters.search || ''}
              onChange={(e) => handleFilterChange('search', e.target.value || undefined)}
              placeholder={t('products.search')}
              className="w-full border rounded-md px-3 py-2"
            />
          </div>

          {/* Category Filter */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('products.category')}
            </label>
            <select
              value={activeFilters.category || ''}
              onChange={(e) => handleFilterChange('category', e.target.value || undefined)}
              className="w-full border rounded-md px-3 py-2"
            >
              <option value="">{t('products.all')}</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Brand Filter */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('products.brand')}
            </label>
            <select
              value={activeFilters.brand || ''}
              onChange={(e) => handleFilterChange('brand', e.target.value || undefined)}
              className="w-full border rounded-md px-3 py-2"
            >
              <option value="">{t('products.all')}</option>
              {brands.map(brand => (
                <option key={brand} value={brand}>
                  {brand}
                </option>
              ))}
            </select>
          </div>

          {/* Price Range */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('products.price')}
            </label>
            <div className="flex space-x-4">
              <input
                type="number"
                value={activeFilters.minPrice || ''}
                onChange={(e) => handleFilterChange('minPrice', e.target.value ? Number(e.target.value) : undefined)}
                placeholder="Min"
                className="w-1/2 border rounded-md px-3 py-2"
              />
              <input
                type="number"
                value={activeFilters.maxPrice || ''}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value ? Number(e.target.value) : undefined)}
                placeholder="Max"
                className="w-1/2 border rounded-md px-3 py-2"
              />
            </div>
          </div>

          {/* Clear Filters */}
          {(activeFilters.category || activeFilters.brand || activeFilters.search || activeFilters.minPrice || activeFilters.maxPrice) && (
            <button
              onClick={clearAllFilters}
              className="w-full bg-red-100 text-red-600 py-2 rounded-md hover:bg-red-200 transition-colors"
            >
              {t('products.clearFilters')}
            </button>
          )}
        </div>
      </aside>
    </>
  );
};

export default FilterSidebar;