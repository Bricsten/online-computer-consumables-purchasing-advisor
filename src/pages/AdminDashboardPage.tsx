import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, BarChart3, Package, FileText, X } from 'lucide-react';
import toast from 'react-hot-toast';
import Layout from '../components/Layout/Layout';
import useProductStore from '../store/productStore';
import useAuthStore from '../store/authStore';
import { Product } from '../types';

const AdminDashboardPage: React.FC = () => {
  const { t } = useTranslation();
  const { logout } = useAuthStore();
  const { products, fetchProducts, addProduct, updateProduct, deleteProduct } = useProductStore();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    category: '',
    brand: '',
    instock: 0,
    imageurl: '',
    features: [''],
    specifications: {} as Record<string, string>
  });

  // For specifications dynamic form
  const [specKeys, setSpecKeys] = useState(['']);
  const [specValues, setSpecValues] = useState(['']);

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: 0,
      category: '',
      brand: '',
      instock: 0,
      imageurl: '',
      features: [''],
      specifications: {}
    });
    setSpecKeys(['']);
    setSpecValues(['']);
  };

  const getString = (val: any) => {
    if (typeof val === 'string') return val;
    if (val && typeof val.en === 'string') return val.en;
    return '';
  };

  const handleOpenEditModal = (product: Product) => {
    setCurrentProduct(product);
    setFormData({
      name: getString(product.name),
      description: getString(product.description),
      price: product.price,
      category: getString(product.category),
      brand: product.brand,
      instock: product.instock,
      imageurl: product.imageurl,
      features: product.features.map(f => typeof f === 'string' ? f : f.en || ''),
      specifications: Object.fromEntries(Object.entries(product.specifications).map(([k, v]) => [k, typeof v === 'string' ? v : v.en || '']))
    });

    // Convert specifications object to arrays for form
    const keys = Object.keys(product.specifications);
    const values = keys.map(key => typeof product.specifications[key] === 'string' ? product.specifications[key] : product.specifications[key]?.en || '');
    setSpecKeys(keys.length > 0 ? keys : ['']);
    setSpecValues(values.length > 0 ? values : ['']);
    setIsEditModalOpen(true);
  };

  const handleOpenDeleteModal = (product: Product) => {
    setCurrentProduct(product);
    setIsDeleteModalOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'price' || name === 'instock') {
      setFormData({
        ...formData,
        [name]: Number(value)
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData({
      ...formData,
      features: newFeatures
    });
  };

  const addFeatureField = () => {
    setFormData({
      ...formData,
      features: [...formData.features, '']
    });
  };

  const removeFeatureField = (index: number) => {
    if (formData.features.length > 1) {
      const newFeatures = formData.features.filter((_, i) => i !== index);
      setFormData({
        ...formData,
        features: newFeatures
      });
    }
  };

  const handleSpecKeyChange = (index: number, value: string) => {
    const newSpecKeys = [...specKeys];
    newSpecKeys[index] = value;
    setSpecKeys(newSpecKeys);
  };

  const handleSpecValueChange = (index: number, value: string) => {
    const newSpecValues = [...specValues];
    newSpecValues[index] = value;
    setSpecValues(newSpecValues);
  };

  const addSpecField = () => {
    setSpecKeys([...specKeys, '']);
    setSpecValues([...specValues, '']);
  };

  const removeSpecField = (index: number) => {
    if (specKeys.length > 1) {
      const newSpecKeys = specKeys.filter((_, i) => i !== index);
      const newSpecValues = specValues.filter((_, i) => i !== index);
      setSpecKeys(newSpecKeys);
      setSpecValues(newSpecValues);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name || !formData.description || formData.price <= 0) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Combine spec keys and values into an object
    const specifications: { [key: string]: { en: string; fr: string } } = {};
    specKeys.forEach((key, index) => {
      if (key && specValues[index]) {
        specifications[key] = { en: specValues[index], fr: specValues[index] };
      }
    });
    const features = formData.features.filter(f => f.trim() !== '').map(f => ({ en: f, fr: f }));
    if (isEditModalOpen && currentProduct) {
      // Update existing product
      updateProduct(currentProduct.id, {
        ...formData,
        name: { en: formData.name, fr: formData.name },
        description: { en: formData.description, fr: formData.description },
        category: { en: formData.category, fr: formData.category },
        specifications,
        features,
      });
      toast.success(`${formData.name} updated successfully!`);
      setIsEditModalOpen(false);
    } else {
      // Add new product
      const newProduct: Omit<Product, 'id' | 'createdat' | 'updatedat' | 'rating' | 'reviews'> & {
        rating: number;
        reviews: [];
      } = {
        ...formData,
        name: { en: formData.name, fr: formData.name },
        description: { en: formData.description, fr: formData.description },
        category: { en: formData.category, fr: formData.category },
        specifications,
        features,
        rating: 0,
        reviews: []
      };

      addProduct({
        ...newProduct,
        id: Date.now().toString(),
        createdat: new Date().toISOString(),
        updatedat: new Date().toISOString(),
      } as Product);
      toast.success(`${formData.name} added successfully!`);
      setIsAddModalOpen(false);
    }
    
    resetForm();
  };

  const handleDelete = () => {
    if (currentProduct) {
      deleteProduct(currentProduct.id);
      toast.success(`${currentProduct.name} deleted successfully!`);
      setIsDeleteModalOpen(false);
      setCurrentProduct(null);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

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
                    {new Set(products.map(p => typeof p.category === 'string' ? p.category : p.category?.en || '')).size}
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
              onClick={() => {
                resetForm();
                setIsAddModalOpen(true);
              }}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              {t('admin.addProduct')}
            </button>
          </div>

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
                        alt={getString(product.name)}
                        className="h-12 w-12 object-cover rounded"
                      />
                    </td>
                    <td className="px-4 py-3 font-medium">{getString(product.name)}</td>
                    <td className="px-4 py-3">{getString(product.category)}</td>
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
                          onClick={() => handleOpenEditModal(product)}
                          className="p-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
                          title={t('admin.editProduct')}
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleOpenDeleteModal(product)}
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

      {/* Add Product Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center px-6 py-4 border-b">
              <h2 className="text-xl font-semibold">{t('admin.addProduct')}</h2>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product Name*
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Image URL*
                  </label>
                  <input
                    type="url"
                    name="imageurl"
                    value={formData.imageurl}
                    onChange={handleInputChange}
                    className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category*
                  </label>
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Brand*
                  </label>
                  <input
                    type="text"
                    name="brand"
                    value={formData.brand}
                    onChange={handleInputChange}
                    className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price (XAF)*
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    min="0"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Stock Quantity*
                  </label>
                  <input
                    type="number"
                    name="instock"
                    value={formData.instock}
                    onChange={handleInputChange}
                    className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    min="0"
                    required
                  />
                </div>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description*
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  rows={3}
                  required
                ></textarea>
              </div>
              
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Features
                  </label>
                  <button
                    type="button"
                    onClick={addFeatureField}
                    className="text-sm text-green-600 hover:text-green-800"
                  >
                    + Add Feature
                  </button>
                </div>
                
                {formData.features.map((feature, index) => (
                  <div key={index} className="flex items-center mb-2">
                    <input
                      type="text"
                      value={feature}
                      onChange={(e) => handleFeatureChange(index, e.target.value)}
                      className="flex-grow border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder={`Feature ${index + 1}`}
                    />
                    <button
                      type="button"
                      onClick={() => removeFeatureField(index)}
                      className="ml-2 text-red-500 hover:text-red-700"
                      title="Remove"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                ))}
              </div>
              
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Specifications
                  </label>
                  <button
                    type="button"
                    onClick={addSpecField}
                    className="text-sm text-green-600 hover:text-green-800"
                  >
                    + Add Specification
                  </button>
                </div>
                
                {specKeys.map((key, index) => (
                  <div key={index} className="grid grid-cols-2 gap-2 mb-2">
                    <input
                      type="text"
                      value={key}
                      onChange={(e) => handleSpecKeyChange(index, e.target.value)}
                      className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Specification name"
                    />
                    <div className="flex items-center">
                      <input
                        type="text"
                        value={specValues[index]}
                        onChange={(e) => handleSpecValueChange(index, e.target.value)}
                        className="flex-grow border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="Value"
                      />
                      <button
                        type="button"
                        onClick={() => removeSpecField(index)}
                        className="ml-2 text-red-500 hover:text-red-700"
                        title="Remove"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
                >
                  {t('admin.cancel')}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  {t('admin.save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {isEditModalOpen && currentProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center px-6 py-4 border-b">
              <h2 className="text-xl font-semibold">{t('admin.editProduct')}</h2>
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product Name*
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Image URL*
                  </label>
                  <input
                    type="url"
                    name="imageurl"
                    value={formData.imageurl}
                    onChange={handleInputChange}
                    className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category*
                  </label>
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Brand*
                  </label>
                  <input
                    type="text"
                    name="brand"
                    value={formData.brand}
                    onChange={handleInputChange}
                    className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price (XAF)*
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    min="0"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Stock Quantity*
                  </label>
                  <input
                    type="number"
                    name="instock"
                    value={formData.instock}
                    onChange={handleInputChange}
                    className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    min="0"
                    required
                  />
                </div>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description*
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  rows={3}
                  required
                ></textarea>
              </div>
              
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Features
                  </label>
                  <button
                    type="button"
                    onClick={addFeatureField}
                    className="text-sm text-green-600 hover:text-green-800"
                  >
                    + Add Feature
                  </button>
                </div>
                
                {formData.features.map((feature, index) => (
                  <div key={index} className="flex items-center mb-2">
                    <input
                      type="text"
                      value={feature}
                      onChange={(e) => handleFeatureChange(index, e.target.value)}
                      className="flex-grow border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder={`Feature ${index + 1}`}
                    />
                    <button
                      type="button"
                      onClick={() => removeFeatureField(index)}
                      className="ml-2 text-red-500 hover:text-red-700"
                      title="Remove"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                ))}
              </div>
              
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Specifications
                  </label>
                  <button
                    type="button"
                    onClick={addSpecField}
                    className="text-sm text-green-600 hover:text-green-800"
                  >
                    + Add Specification
                  </button>
                </div>
                
                {specKeys.map((key, index) => (
                  <div key={index} className="grid grid-cols-2 gap-2 mb-2">
                    <input
                      type="text"
                      value={key}
                      onChange={(e) => handleSpecKeyChange(index, e.target.value)}
                      className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Specification name"
                    />
                    <div className="flex items-center">
                      <input
                        type="text"
                        value={specValues[index]}
                        onChange={(e) => handleSpecValueChange(index, e.target.value)}
                        className="flex-grow border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="Value"
                      />
                      <button
                        type="button"
                        onClick={() => removeSpecField(index)}
                        className="ml-2 text-red-500 hover:text-red-700"
                        title="Remove"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
                >
                  {t('admin.cancel')}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  {t('admin.save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && currentProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {t('admin.confirmDelete')}
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                Are you sure you want to delete <span className="font-medium">{getString(currentProduct.name)}</span>? 
                This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
                >
                  {t('admin.cancel')}
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  {t('admin.deleteProduct')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default AdminDashboardPage;