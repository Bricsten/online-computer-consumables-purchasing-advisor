import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import './i18n/i18n';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import ComparePage from './pages/ComparePage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import NotFoundPage from './pages/NotFoundPage';
import PrivateRoute from './components/Auth/PrivateRoute';
import useProductStore from './store/productStore';

function App() {
  const { products } = useProductStore();

  useEffect(() => {
    console.log('App initialized with', products.length, 'products');
  }, [products.length]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />
        <Route path="/compare" element={<ComparePage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/login" element={<AdminLoginPage />} />
        <Route path="/admin" element={
          <PrivateRoute>
            <AdminDashboardPage />
          </PrivateRoute>
        } />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;