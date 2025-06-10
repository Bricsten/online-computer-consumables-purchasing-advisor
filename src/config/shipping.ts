export const flatRateZones: Record<string, number> = {
  "Buea": 1000,
  "Limbe": 1000,
  "Mutengene": 1000,
  "Tiko": 1500,
  "Kumba": 2000,
  "Douala": 2500,
  "Yaoundé": 3000,
  "Bamenda": 3500,
  "Garoua": 4000,
  "Maroua": 4500,
  "Ngaoundéré": 4500
};

export const DEFAULT_SHIPPING_COST = 5000;

export const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}; 