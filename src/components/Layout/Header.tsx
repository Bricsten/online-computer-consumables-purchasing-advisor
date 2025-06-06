import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  ShoppingCart, Menu, X, Search, Globe, BarChart3
} from 'lucide-react';
import useCartStore from '../../store/cartStore';
import LanguageSwitcher from './LanguageSwitcher';

const Header: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const cartCount = useCartStore(state => state.getCartCount());
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);
    };

    if (isHomePage) {
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    } else {
      setIsScrolled(true);
    }
  }, [isHomePage]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/products?search=${searchQuery}`);
    setSearchQuery('');
  };

  const headerClasses = `fixed w-full top-0 z-[100] transition-all duration-300 ${
    !isHomePage || isScrolled ? 'bg-green-700 shadow-md' : 'bg-transparent'
  }`;

  return (
    <header className={headerClasses}>
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <BarChart3 className="h-8 w-8 text-white" />
            <span className="text-xl font-bold text-white">{t('general.appName')}</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-white hover:text-yellow-300 transition-colors">
              {t('nav.home')}
            </Link>
            <Link to="/products" className="text-white hover:text-yellow-300 transition-colors">
              {t('nav.products')}
            </Link>
            <Link to="/compare" className="text-white hover:text-yellow-300 transition-colors">
              {t('nav.compare')}
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <form onSubmit={handleSearch} className="hidden md:flex items-center relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('products.search')}
                className="py-1 px-3 pr-8 rounded-full text-black text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 w-40 lg:w-64"
              />
              <button 
                type="submit" 
                className="absolute right-2 text-gray-500 hover:text-gray-700"
              >
                <Search className="h-4 w-4" />
              </button>
            </form>

            <div className="relative hidden md:block">
              <LanguageSwitcher />
            </div>

            <Link to="/cart" className="relative">
              <ShoppingCart className="h-6 w-6 text-white hover:text-yellow-300 transition-colors" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                  {cartCount}
                </span>
              )}
            </Link>

            <button 
              className="md:hidden focus:outline-none text-white" 
              onClick={toggleMenu}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-green-800 py-4 px-4 absolute w-full animate-fadeIn">
          <nav className="flex flex-col space-y-4">
            <Link 
              to="/" 
              className="text-white hover:text-yellow-300 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              {t('nav.home')}
            </Link>
            <Link 
              to="/products" 
              className="text-white hover:text-yellow-300 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              {t('nav.products')}
            </Link>
            <Link 
              to="/compare" 
              className="text-white hover:text-yellow-300 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              {t('nav.compare')}
            </Link>
            
            <form 
              onSubmit={(e) => {
                handleSearch(e);
                setIsMenuOpen(false);
              }} 
              className="flex items-center relative"
            >
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('products.search')}
                className="py-1 px-3 pr-8 rounded-full text-black text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 w-full"
              />
              <button 
                type="submit" 
                className="absolute right-2 text-gray-500 hover:text-gray-700"
              >
                <Search className="h-4 w-4" />
              </button>
            </form>

            <div className="py-2">
              <LanguageSwitcher />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;