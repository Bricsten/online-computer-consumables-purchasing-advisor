export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('fr-CM', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString('fr-CM', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const getTranslatedValue = (obj: any, defaultValue: string = ''): string => {
  if (typeof obj === 'string') return obj;
  if (obj && typeof obj === 'object' && (obj.en || obj.fr)) {
    // Assuming 'en' is the default language, but you might want to get this from i18n.language
    return obj.en || obj.fr || defaultValue;
  }
  return defaultValue;
};