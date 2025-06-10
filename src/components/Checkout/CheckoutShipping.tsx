import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ShippingLocationInput from '../Shipping/ShippingLocationInput';

interface CheckoutShippingProps {
  onComplete: (shippingDetails: {
    address: string;
    city: string;
    coordinates: { lat: number; lng: number };
    shippingCost: number;
  }) => void;
}

export const CheckoutShipping: React.FC<CheckoutShippingProps> = ({ onComplete }) => {
  const { t } = useTranslation();
  const [shippingDetails, setShippingDetails] = useState<{
    address: string;
    city: string;
    coordinates: { lat: number; lng: number };
    shippingCost: number;
  } | null>(null);

  const handleLocationSelect = (location: {
    address: string;
    city: string;
    coordinates: { lat: number; lng: number };
    shippingCost: number;
  }) => {
    setShippingDetails(location);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">{t('checkout.shippingAddress')}</h2>
        <ShippingLocationInput onLocationSelect={handleLocationSelect} />
      </div>

      {shippingDetails && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-medium mb-2">{t('checkout.shippingDetails')}</h3>
          <div className="space-y-2 text-sm">
            <p><span className="font-medium">{t('checkout.address')}:</span> {shippingDetails.address}</p>
            <p><span className="font-medium">{t('checkout.city')}:</span> {shippingDetails.city}</p>
            <p className="text-lg font-semibold text-green-600">
              {t('checkout.shippingCost')}: {new Intl.NumberFormat('fr-CM', {
                style: 'currency',
                currency: 'XAF',
                minimumFractionDigits: 0
              }).format(shippingDetails.shippingCost)}
            </p>
          </div>

          <button
            onClick={() => onComplete(shippingDetails)}
            className="mt-4 w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors"
          >
            {t('checkout.confirmAddress')}
          </button>
        </div>
      )}
    </div>
  );
};

export default CheckoutShipping; 