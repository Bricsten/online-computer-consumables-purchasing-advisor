import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Edit2, Trash2, Package, Users, Star,
  Search, Filter, RefreshCw, UserPlus, X, ChevronDown
} from 'lucide-react';
import toast from 'react-hot-toast';
import Layout from '../components/Layout/Layout';
import useProductStore from '../store/productStore';
import useAdminAuthStore from '../store/adminAuthStore';
import { Product, NewProduct, BilingualText } from '../types';
import { supabase } from '../lib/supabase';
import { PlusCircle, Save } from 'lucide-react';

// Types for the new features
interface DashboardUser {
  id: string;
  email: string;
  full_name: string;
  phone_number: string | null;
  created_at: string;
}

interface Review {
  id: string;
  user_id: string;
  product_id: string;
  rating: number;
  comment: string;
  created_at: string;
  user: {
    full_name: string;
    email: string;
  };
  product: {
    name: { en: string };
  };
}

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
}

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

interface UserModalProps {
  user: DashboardUser | null;
  onClose: () => void;
  onSave: () => void;
}

const AdminDashboardPage: React.FC = () => {
  const { t } = useTranslation();
  const { logout } = useAdminAuthStore();
  const { products, fetchProducts, addProduct, updateProduct, deleteProduct } = useProductStore();
  
  // State for different sections
  const [activeTab, setActiveTab] = useState<'users' | 'products' | 'reviews'>('users');
  const [users, setUsers] = useState<DashboardUser[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<DashboardUser | null>(null);
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

  // Fetch all necessary data
  useEffect(() => {
    fetchDashboardData();
  }, [activeTab]);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      // Fetch users
      if (activeTab === 'users') {
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .order('created_at', { ascending: false });

        if (userError) throw userError;
        setUsers(userData);
      }

      // Fetch reviews
      if (activeTab === 'reviews') {
        const { data: reviewData, error: reviewError } = await supabase
          .from('reviews')
          .select(`
            *,
            user:users(full_name, email),
            product:products(name)
          `)
          .order('created_at', { ascending: false });

        if (reviewError) throw reviewError;
        setReviews(reviewData);
      }

      // Fetch products if needed
      if (activeTab === 'products') {
      await fetchProducts();
      }
    } catch (error: any) {
      toast.error('Error fetching data: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // CRUD Operations for Users
  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', userId);

      if (error) throw error;
      toast.success('User deleted successfully');
      fetchDashboardData();
    } catch (error: any) {
      toast.error('Error deleting user: ' + error.message);
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm('Are you sure you want to delete this review?')) return;

    try {
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', reviewId);

      if (error) throw error;
      toast.success('Review deleted successfully');
      fetchDashboardData();
    } catch (error: any) {
      toast.error('Error deleting review: ' + error.message);
    }
  };

  // Filter Data
  const filteredUsers = users.filter(user =>
    user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredReviews = reviews.filter(review =>
    review.user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    review.comment.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Render Functions
  const renderUsers = () => (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="p-4 flex items-center justify-between border-b">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            onClick={() => setShowUserModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            <UserPlus className="w-5 h-5" />
            <span>Add User</span>
          </button>
        </div>
        <button
          onClick={fetchDashboardData}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Phone
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Joined
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredUsers.map((user) => (
              <motion.tr
                key={user.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-medium text-gray-900">{user.full_name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                  {user.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                  {user.phone_number || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                  {new Date(user.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => {
                        setSelectedUser(user);
                        setShowUserModal(true);
                      }}
                      className="text-green-600 hover:text-green-900"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderReviews = () => (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="p-4 flex items-center justify-between border-b">
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search reviews..."
            className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button
          onClick={fetchDashboardData}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rating
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Comment
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredReviews.map((review) => (
              <motion.tr
                key={review.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-medium text-gray-900">{review.user.full_name}</div>
                  <div className="text-sm text-gray-500">{review.user.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {review.product.name.en}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-yellow-400">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="ml-1">{review.rating}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900 max-w-md truncate">
                    {review.comment}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(review.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleDeleteReview(review.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

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
      <div className="min-h-screen bg-gray-100">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
              <button
                onClick={logout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Logout
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="bg-white rounded-lg shadow-md p-4 mb-8">
            <div className="flex space-x-4">
              <TabButton
                active={activeTab === 'users'}
                onClick={() => setActiveTab('users')}
                icon={<Users className="w-5 h-5" />}
                label="Users"
              />
              <TabButton
                active={activeTab === 'products'}
                onClick={() => setActiveTab('products')}
                icon={<Package className="w-5 h-5" />}
                label="Products"
              />
              <TabButton
                active={activeTab === 'reviews'}
                onClick={() => setActiveTab('reviews')}
                icon={<Star className="w-5 h-5" />}
                label="Reviews"
              />
            </div>
          </div>

          {/* Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              {isLoading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500" />
                </div>
              ) : (
                <>
                  {activeTab === 'users' && renderUsers()}
                  {activeTab === 'reviews' && renderReviews()}
                  {activeTab === 'products' && (
                    <div className="bg-white rounded-lg shadow-md p-6">
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
                                      className="p-1 bg-green-100 text-green-600 rounded hover:bg-green-200"
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
                  )}
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* User Modal */}
      {showUserModal && (
        <UserModal
          user={selectedUser}
          onClose={() => {
            setShowUserModal(false);
            setSelectedUser(null);
          }}
          onSave={fetchDashboardData}
        />
      )}
    </Layout>
  );
};

// Component: Tab Button
const TabButton: React.FC<TabButtonProps> = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
      active
        ? 'bg-green-500 text-white'
        : 'text-gray-600 hover:bg-gray-100'
    }`}
  >
    {icon}
    <span>{label}</span>
  </button>
);

// Component: User Modal
const UserModal: React.FC<UserModalProps> = ({ user, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    full_name: user?.full_name || '',
    email: user?.email || '',
    phone_number: user?.phone_number || ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (user) {
        // Update existing user
        const { error } = await supabase
          .from('users')
          .update(formData)
          .eq('id', user.id);
        if (error) throw error;
      } else {
        // Create new user
        const { error } = await supabase
          .from('users')
          .insert([formData]);
        if (error) throw error;
      }
      toast.success(`User ${user ? 'updated' : 'created'} successfully`);
      onSave();
      onClose();
    } catch (error: any) {
      toast.error('Error saving user: ' + error.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-lg p-6 max-w-md w-full"
      >
        <h2 className="text-xl font-bold mb-4">
          {user ? 'Edit User' : 'Add New User'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              value={formData.full_name}
              onChange={(e) =>
                setFormData({ ...formData, full_name: e.target.value })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <input
              type="tel"
              value={formData.phone_number}
              onChange={(e) =>
                setFormData({ ...formData, phone_number: e.target.value })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            />
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
            >
              {user ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default AdminDashboardPage;