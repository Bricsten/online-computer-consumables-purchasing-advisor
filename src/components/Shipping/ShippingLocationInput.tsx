import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import axios from 'axios';
import { OPENCAGE_API_KEY, STORE_LOCATION } from '../../config/api-keys';
import { flatRateZones, DEFAULT_SHIPPING_COST, calculateDistance } from '../../config/shipping';

interface ShippingLocationInputProps {
  onLocationSelect: (location: {
    address: string;
    city: string;
    coordinates: { lat: number; lng: number };
    shippingCost: number;
  }) => void;
}

interface OpenCageResult {
  formatted: string;
  geometry: {
    lat: number;
    lng: number;
  };
  components: {
    city?: string;
    town?: string;
    state?: string;
    village?: string;
  };
}

export const ShippingLocationInput: React.FC<ShippingLocationInputProps> = ({ onLocationSelect }) => {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState<OpenCageResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const calculateShippingCost = (result: OpenCageResult): number => {
    const city = result.components.city || 
                result.components.town || 
                result.components.state || 
                result.components.village;

    if (city && flatRateZones[city]) {
      return flatRateZones[city];
    }

    // Calculate distance-based cost if not in flat rate zones
    const distance = calculateDistance(
      STORE_LOCATION.lat,
      STORE_LOCATION.lng,
      result.geometry.lat,
      result.geometry.lng
    );

    // Base rate + per km charge
    const shippingCost = Math.round(1000 + (distance * 100));
    // Ensure cost is between 1000 and 5000 XAF
    return Math.min(Math.max(shippingCost, 1000), 5000);
  };

  const handleInput = async (value: string) => {
    setInputValue(value);
    if (!value.trim()) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.get(
        `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(value)}&countrycode=cm&key=${OPENCAGE_API_KEY}&limit=5`
      );

      if (response.data.results) {
        setSuggestions(response.data.results);
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectPlace = (result: OpenCageResult) => {
    const city = result.components.city || 
                result.components.town || 
                result.components.state || 
                result.components.village || 
                '';

    const shippingCost = calculateShippingCost(result);

    onLocationSelect({
      address: result.formatted,
      city,
      coordinates: {
        lat: result.geometry.lat,
        lng: result.geometry.lng,
      },
      shippingCost,
    });

    setInputValue(result.formatted);
    setSuggestions([]);
  };

  return (
    <div className="relative w-full">
      <div className="relative">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => handleInput(e.target.value)}
          placeholder="Enter your shipping address..."
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        {isLoading && (
          <div className="absolute right-3 top-2.5">
            <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
          </div>
        )}
      </div>

      {suggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg border">
          {suggestions.map((result, index) => (
            <button
              key={index}
              onClick={() => handleSelectPlace(result)}
              className="w-full px-4 py-2 text-left hover:bg-gray-100 focus:outline-none focus:bg-gray-100 first:rounded-t-lg last:rounded-b-lg"
            >
              <p className="text-sm text-gray-900">{result.formatted}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ShippingLocationInput; 