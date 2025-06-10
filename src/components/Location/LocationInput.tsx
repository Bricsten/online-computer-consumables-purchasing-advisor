import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Search } from 'lucide-react';
import debounce from 'lodash/debounce';

interface LocationInputProps {
  onSelect: (location: {
    address: string;
    city: string;
    coordinates: { lat: number; lng: number };
    shippingCost: number;
  }) => void;
  placeholder?: string;
  className?: string;
}

interface LocationSuggestion {
  formatted: string;
  geometry: {
    lat: number;
    lng: number;
  };
  components: {
    city?: string;
    state?: string;
    country?: string;
  };
}

const OPENCAGE_API_KEY = '2b58d910f6324a3fb9ad59a15177fe09';
const FIXED_RATES: Record<string, number> = {
  'Buea': 1000,
  'Limbe': 1000,
  'Douala': 2500,
};

const LocationInput: React.FC<LocationInputProps> = ({
  onSelect,
  placeholder = 'Enter location',
  className = ''
}) => {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const calculateShippingCost = (city: string, distance: number): number => {
    // Check for fixed rates first
    const fixedRate = FIXED_RATES[city];
    if (fixedRate) return fixedRate;

    // Calculate based on distance
    const baseRate = 1000;
    const ratePerKm = 10;
    const calculatedCost = baseRate + (distance * ratePerKm);

    // Ensure cost stays within bounds (1000-5000 XAF)
    return Math.min(Math.max(calculatedCost, 1000), 5000);
  };

  const fetchSuggestions = async (input: string) => {
    if (!input.trim()) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
          input + ' Cameroon'
        )}&key=${OPENCAGE_API_KEY}&countrycode=cm&limit=5`
      );
      const data = await response.json();
      
      if (data.results) {
        setSuggestions(data.results);
      }
    } catch (error) {
      console.error('Error fetching location suggestions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const debouncedFetch = debounce(fetchSuggestions, 300);

  useEffect(() => {
    debouncedFetch(query);
    return () => {
      debouncedFetch.cancel();
    };
  }, [query]);

  const handleSuggestionClick = (suggestion: LocationSuggestion) => {
    const city = suggestion.components.city || suggestion.components.state || '';
    const distance = Math.random() * 300; // Simulated distance in km
    const shippingCost = calculateShippingCost(city, distance);

    onSelect({
      address: suggestion.formatted,
      city,
      coordinates: suggestion.geometry,
      shippingCost
    });

    setQuery(suggestion.formatted);
    setShowSuggestions(false);
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setShowSuggestions(true)}
          placeholder={placeholder}
          className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
      </div>

      {showSuggestions && (suggestions.length > 0 || isLoading) && (
        <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg">
          {isLoading ? (
            <div className="px-4 py-2 text-sm text-gray-500">{t('Loading...')}</div>
          ) : (
            <ul className="max-h-60 overflow-auto">
              {suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                >
                  {suggestion.formatted}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default LocationInput; 