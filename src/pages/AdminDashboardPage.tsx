import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, BarChart3, Package, FileText, X } from 'lucide-react';
import toast from 'react-hot-toast';
import Layout from '../components/Layout/Layout';
import useProductStore from '../store/productStore';
import useAdminAuthStore from '../store/adminAuthStore';
import { Product, NewProduct, BilingualText } from '../types';
import { supabase } from '../lib/supabase';
import { PlusCircle, Save } from 'lucide-react';

const AdminDashboardPage: React.FC = () => {
  const { t } = useTranslation();
  const { logout } = useAdminAuthStore();
  const { products, isLoading, error, fetchProducts, addProduct, updateProduct, deleteProduct } = useProductStore();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newProduct, setNewProduct] = useState<NewProduct>({
    name: { en: '', fr: '' },
    description: { en: '', fr: '' },
    price: 0,
    category: { en: '', fr: '' },
    brand: '',
    instock: 0,
    imageurl: '',
    specifications: {},
    features: []
  });

  const handleAddProduct = async () => {
    try {
      const timestamp = new Date().toISOString();
      const productToAdd: Product = {
        ...newProduct,
        id: crypto.randomUUID(),
        rating: 0,
        reviews: [],
        createdat: timestamp,
        updatedat: timestamp
      };

      const { data, error } = await supabase
        .from('products')
        .insert([productToAdd])
        .select()
        .single();

      if (error) throw error;

      addProduct(data as Product);
      setIsAddingNew(false);
      setNewProduct({
        name: { en: '', fr: '' },
        description: { en: '', fr: '' },
      price: 0,
        category: { en: '', fr: '' },
      brand: '',
      instock: 0,
      imageurl: '',
        specifications: {},
        features: []
      });
      toast.success('Product added successfully');
    } catch (error) {
      console.error('Error adding product:', error);
      toast.error('Failed to add product');
    }
  };

  const handleUpdateProduct = async (product: Product) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({
          ...product,
          updatedat: new Date().toISOString()
        })
        .eq('id', product.id);

      if (error) throw error;

      updateProduct(product.id, product);
      setCurrentProduct(null);
      toast.success('Product updated successfully');
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Failed to update product');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;

      deleteProduct(id);
      toast.success('Product deleted successfully');
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-100 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500 mx-auto"></div>
              <p className="mt-4 text-xl text-gray-600">Loading...</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-100 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center text-red-600">
              <p className="text-xl">Error loading products: {error}</p>
              <button
                onClick={() => fetchProducts()}
                className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  const handleInputChange = (
    field: keyof NewProduct,
    value: string | number,
    language?: 'en' | 'fr'
  ) => {
    setNewProduct(prev => {
      if (language && typeof value === 'string') {
        const bilingualField = prev[field] as BilingualText;
        return {
          ...prev,
          [field]: {
            ...bilingualField,
            [language]: value
          }
        };
      }
      return {
        ...prev,
        [field]: value
      };
    });
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">{t('admin.dashboard')}</h1>
            <button
              onClick={logout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
            >
              {t('nav.logout')}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-green-100 rounded-lg p-6">
              <div className="flex justify-between">
                <div>
                  <p className="text-green-800 text-sm">Total Products</p>
                  <p className="text-3xl font-bold text-green-900">{products.length}</p>
                </div>
                <Package className="h-10 w-10 text-green-500" />
              </div>
            </div>

            <div className="bg-blue-100 rounded-lg p-6">
              <div className="flex justify-between">
                <div>
                  <p className="text-blue-800 text-sm">Categories</p>
                  <p className="text-3xl font-bold text-blue-900">
                    {new Set(products.map(p => p.category.en)).size}
                  </p>
                </div>
                <BarChart3 className="h-10 w-10 text-blue-500" />
              </div>
            </div>

            <div className="bg-yellow-100 rounded-lg p-6">
              <div className="flex justify-between">
                <div>
                  <p className="text-yellow-800 text-sm">Brands</p>
                  <p className="text-3xl font-bold text-yellow-900">
                    {new Set(products.map(p => p.brand)).size}
                  </p>
                </div>
                <FileText className="h-10 w-10 text-yellow-500" />
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">{t('admin.products')}</h2>
            <button
              onClick={() => setIsAddingNew(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              {t('admin.addProduct')}
            </button>
          </div>

          {isAddingNew && (
            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
              <h2 className="text-xl font-semibold mb-4">{t('Add New Product')}</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('Name (English)')}
                  </label>
                  <input
                    type="text"
                    value={newProduct.name.en}
                    onChange={e => handleInputChange('name', e.target.value, 'en')}
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('Name (French)')}
                  </label>
                  <input
                    type="text"
                    value={newProduct.name.fr}
                    onChange={e => handleInputChange('name', e.target.value, 'fr')}
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('Price')}
                  </label>
                  <input
                    type="number"
                    value={newProduct.price}
                    onChange={e => handleInputChange('price', parseFloat(e.target.value))}
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('Brand')}
                  </label>
                  <input
                    type="text"
                    value={newProduct.brand}
                    onChange={e => handleInputChange('brand', e.target.value)}
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
              </div>
              <div className="mt-4 flex justify-end space-x-3">
                <button
                  onClick={() => setIsAddingNew(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  {t('Cancel')}
                </button>
                <button
                  onClick={handleAddProduct}
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  <Save className="w-5 h-5 mr-2" />
                  {t('Save Product')}
                </button>
              </div>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 text-left">Image</th>
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">Category</th>
                  <th className="px-4 py-2 text-left">Brand</th>
                  <th className="px-4 py-2 text-right">Price</th>
                  <th className="px-4 py-2 text-center">Stock</th>
                  <th className="px-4 py-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <motion.tr
                    key={product.id}
                    className="border-b hover:bg-gray-50"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <td className="px-4 py-3">
                      <img
                        src={product.imageurl}
                        alt={product.name.en}
                        className="h-12 w-12 object-cover rounded"
                      />
                    </td>
                    <td className="px-4 py-3 font-medium">{product.name.en}</td>
                    <td className="px-4 py-3">{product.category.en}</td>
                    <td className="px-4 py-3">{product.brand}</td>
                    <td className="px-4 py-3 text-right">
                      {new Intl.NumberFormat('fr-CM', {
                        style: 'currency',
                        currency: 'XAF',
                        minimumFractionDigits: 0
                      }).format(product.price)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        product.instock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {product.instock > 0 ? product.instock : 'Out of stock'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex justify-center space-x-2">
                        <button
                          onClick={() => setCurrentProduct(product)}
                          className="p-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
                          title={t('admin.editProduct')}
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="p-1 bg-red-100 text-red-600 rounded hover:bg-red-200"
                          title={t('admin.deleteProduct')}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}

                {products.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                      No products found. Add a product to get started.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboardPage;