import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import './i18n/i18n';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import ComparePage from './pages/ComparePage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';
import AuthPage from './pages/AuthPage';
import PrivateRoute from './components/Auth/PrivateRoute';
import useProductStore from './store/productStore';
import useAdminAuthStore from './store/adminAuthStore';
import useUserAuthStore from './store/userAuthStore';

function App() {
  const { products } = useProductStore();
  const { isAuthenticated: isAdminAuthenticated } = useAdminAuthStore();
  const { isAuthenticated: isUserAuthenticated } = useUserAuthStore();

  useEffect(() => {
    console.log('App initialized with', products.length, 'products');
  }, [products.length]);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<HomePage />} />
        <Route 
          path="/auth" 
          element={
            isUserAuthenticated ? <Navigate to="/profile" replace /> : <AuthPage />
          }
        />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />
        <Route path="/compare" element={<ComparePage />} />
        <Route path="/cart" element={<CartPage />} />
        
        {/* Protected routes */}
        <Route
          path="/checkout"
          element={<CheckoutPage />}
        />
        <Route
          path="/order-confirmation/:id"
          element={
            <PrivateRoute>
              <OrderConfirmationPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <ProfilePage />
            </PrivateRoute>
          }
        />
        
        {/* Admin routes */}
        <Route 
          path="/admin/login" 
          element={
            isAdminAuthenticated ? <Navigate to="/admin/dashboard" replace /> : <AdminLoginPage />
          } 
        />
        <Route
          path="/admin/dashboard"
          element={
            <PrivateRoute>
              <AdminDashboardPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/*"
          element={
            <PrivateRoute>
              <AdminDashboardPage />
            </PrivateRoute>
          }
        />

        {/* Catch all route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;