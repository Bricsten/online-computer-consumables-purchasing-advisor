import React from 'react';
import { MessageCircle } from 'lucide-react';

const WhatsAppButton: React.FC = () => {
  const openWhatsApp = () => {
    window.open('https://wa.me/237600000000', '_blank');
  };

  return (
    <button
      onClick={openWhatsApp}
      className="fixed bottom-6 left-6 bg-green-500 text-white rounded-full p-3 shadow-lg hover:bg-green-600 transition-transform hover:scale-110 z-[60]"
      aria-label="Contact via WhatsApp"
    >
      <MessageCircle className="h-6 w-6" />
    </button>
  );
};

export default WhatsAppButton;