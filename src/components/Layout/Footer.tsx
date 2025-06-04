import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { BarChart3, Mail, Phone, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <footer className="bg-gray-800 text-white pt-10 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <BarChart3 className="h-8 w-8" />
              <span className="text-xl font-bold">{t('general.appName')}</span>
            </Link>
            <p className="text-gray-300 text-sm">
              Your trusted advisor for computer consumables in Cameroon. 
              We provide high-quality products at competitive prices.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('footer.about')}</h3>
            <ul className="space-y-2 text-gray-300">
              <li>
                <Link to="/about" className="hover:text-yellow-300 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-yellow-300 transition-colors">
                  Our Products
                </Link>
              </li>
              <li>
                <Link to="/compare" className="hover:text-yellow-300 transition-colors">
                  Compare Products
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('footer.contact')}</h3>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-start space-x-2">
                <MapPin className="h-5 w-5 mt-0.5 text-yellow-400" />
                <span>123 Tech Street, Buea, Cameroon</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="h-5 w-5 text-yellow-400" />
                <span>+237 6XX XXX XXX</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="h-5 w-5 text-yellow-400" />
                <span>info@techsupplies.cm</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-gray-300">
              <li>
                <Link to="/terms" className="hover:text-yellow-300 transition-colors">
                  {t('footer.terms')}
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-yellow-300 transition-colors">
                  {t('footer.privacy')}
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400 text-sm">
          {t('footer.copyright')}
        </div>
      </div>
    </footer>
  );
};

export default Footer;