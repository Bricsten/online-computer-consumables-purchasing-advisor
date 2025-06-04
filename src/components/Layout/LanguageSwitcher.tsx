import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, ChevronDown, ChevronUp } from 'lucide-react';

const LanguageSwitcher: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  
  const changeLanguage = (language: string) => {
    i18n.changeLanguage(language);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button 
        className="flex items-center space-x-1 hover:text-yellow-300 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Globe className="h-5 w-5" />
        <span className="hidden sm:inline">{t('general.language')}</span>
        {isOpen ? (
          <ChevronUp className="h-4 w-4" />
        ) : (
          <ChevronDown className="h-4 w-4" />
        )}
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg py-1 text-black z-50 animate-fadeIn">
          <button 
            className={`block px-4 py-2 text-sm w-full text-left hover:bg-gray-100 ${i18n.language === 'en' ? 'font-bold' : ''}`}
            onClick={() => changeLanguage('en')}
          >
            English
          </button>
          <button 
            className={`block px-4 py-2 text-sm w-full text-left hover:bg-gray-100 ${i18n.language === 'fr' ? 'font-bold' : ''}`}
            onClick={() => changeLanguage('fr')}
          >
            Français
          </button>
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;