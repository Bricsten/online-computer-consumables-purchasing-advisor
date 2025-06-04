import { Product } from '../types';

export const products: Product[] = [
  {
    id: '1',
    name: 'HP 67XL Black Ink Cartridge',
    description: 'High-yield ink cartridge for HP printers. Compatible with HP DeskJet and HP ENVY series.',
    price: 22500,
    category: 'Ink Cartridges',
    brand: 'HP',
    inStock: 15,
    imageUrl: 'https://images.pexels.com/photos/4792733/pexels-photo-4792733.jpeg',
    specifications: {
      type: 'Ink Cartridge',
      color: 'Black',
      compatibility: 'HP DeskJet, HP ENVY',
      yield: '400 pages',
      dimensions: '11.5 x 3.6 x 2.3 cm',
      weight: '50g'
    },
    features: [
      'High-yield cartridge',
      'Original HP ink formula',
      'Smudge-resistant prints',
      'Easy installation'
    ],
    rating: 4.5,
    reviews: [
      {
        id: 'r1',
        userId: 'u1',
        userName: 'Jean Pierre',
        rating: 5,
        comment: 'Excellent quality, lasted longer than expected.',
        date: '2023-09-15'
      },
      {
        id: 'r2',
        userId: 'u2',
        userName: 'Emilia Fouda',
        rating: 4,
        comment: 'Good quality but a bit expensive.',
        date: '2023-10-22'
      }
    ],
    createdAt: '2023-01-15',
    updatedAt: '2023-11-05'
  },
  {
    id: '2',
    name: 'Kingston 16GB USB Flash Drive',
    description: 'Portable storage solution with USB 3.0 technology for fast file transfers.',
    price: 8500,
    category: 'Storage',
    brand: 'Kingston',
    inStock: 25,
    imageUrl: 'https://images.pexels.com/photos/7172975/pexels-photo-7172975.jpeg',
    specifications: {
      type: 'USB Flash Drive',
      capacity: '16GB',
      interface: 'USB 3.0',
      readSpeed: '100MB/s',
      writeSpeed: '30MB/s',
      dimensions: '6 x 2.1 x 1 cm',
      weight: '12g'
    },
    features: [
      'Compact design',
      'USB 3.0 technology',
      'Durable metal casing',
      'Keyring attachment'
    ],
    rating: 4.2,
    reviews: [
      {
        id: 'r3',
        userId: 'u3',
        userName: 'Thomas Nkeng',
        rating: 4,
        comment: 'Fast and reliable, great for everyday use.',
        date: '2023-08-05'
      }
    ],
    createdAt: '2023-02-20',
    updatedAt: '2023-10-12'
  },
  {
    id: '3',
    name: 'Logitech MK270 Wireless Keyboard and Mouse Combo',
    description: 'Reliable wireless keyboard and mouse combination for everyday computing.',
    price: 35000,
    category: 'Peripherals',
    brand: 'Logitech',
    inStock: 10,
    imageUrl: 'https://images.pexels.com/photos/3937174/pexels-photo-3937174.jpeg',
    specifications: {
      type: 'Keyboard and Mouse Combo',
      connection: 'Wireless 2.4GHz',
      batteryLife: 'Keyboard: 24 months, Mouse: 12 months',
      range: '10 meters',
      compatibility: 'Windows, macOS, Chrome OS',
      dimensions: 'Keyboard: 45 x 16 x 2.5 cm, Mouse: 10 x 6 x 3.5 cm',
      weight: 'Keyboard: 450g, Mouse: 90g'
    },
    features: [
      'Reliable wireless connection',
      'Long battery life',
      'Durable design',
      'Plug-and-play USB receiver'
    ],
    rating: 4.7,
    reviews: [
      {
        id: 'r4',
        userId: 'u4',
        userName: 'Marie Tamba',
        rating: 5,
        comment: 'Excellent combo, the keyboard is comfortable for long typing sessions.',
        date: '2023-07-12'
      },
      {
        id: 'r5',
        userId: 'u5',
        userName: 'Patrick Ndolo',
        rating: 4,
        comment: 'Good quality for the price, easy to set up.',
        date: '2023-06-30'
      }
    ],
    createdAt: '2023-03-10',
    updatedAt: '2023-09-25'
  },
  {
    id: '4',
    name: 'Samsung 1TB External SSD',
    description: 'Portable solid-state drive with USB-C connectivity for fast data storage and transfer.',
    price: 120000,
    category: 'Storage',
    brand: 'Samsung',
    inStock: 5,
    imageUrl: 'https://images.pexels.com/photos/4584547/pexels-photo-4584547.jpeg',
    specifications: {
      type: 'External SSD',
      capacity: '1TB',
      interface: 'USB 3.2 Gen 2 (10Gbps)',
      readSpeed: '1,050MB/s',
      writeSpeed: '1,000MB/s',
      dimensions: '8 x 5.7 x 0.8 cm',
      weight: '58g'
    },
    features: [
      'Shock-resistant design',
      'Password protection',
      'Compact and portable',
      'Compatible with PC, Mac, Android'
    ],
    rating: 4.8,
    reviews: [
      {
        id: 'r6',
        userId: 'u6',
        userName: 'Samuel Ekonde',
        rating: 5,
        comment: 'Incredibly fast and reliable. Worth every franc.',
        date: '2023-05-18'
      }
    ],
    createdAt: '2023-04-05',
    updatedAt: '2023-11-10'
  },
  {
    id: '5',
    name: 'Canon PG-245 Black Ink Cartridge',
    description: 'Original Canon ink cartridge for high-quality document and photo printing.',
    price: 18000,
    category: 'Ink Cartridges',
    brand: 'Canon',
    inStock: 20,
    imageUrl: 'https://images.pexels.com/photos/3747139/pexels-photo-3747139.jpeg',
    specifications: {
      type: 'Ink Cartridge',
      color: 'Black',
      compatibility: 'Canon PIXMA MG, Canon PIXMA TS series',
      yield: '180 pages',
      dimensions: '10.5 x 3.2 x 2 cm',
      weight: '45g'
    },
    features: [
      'Fade-resistant formula',
      'Precise text and image printing',
      'Easy installation',
      'Genuine Canon quality'
    ],
    rating: 4.3,
    reviews: [
      {
        id: 'r7',
        userId: 'u7',
        userName: 'Claire Mbango',
        rating: 4,
        comment: 'Reliable cartridge, prints are crisp and clear.',
        date: '2023-09-02'
      }
    ],
    createdAt: '2023-02-28',
    updatedAt: '2023-10-15'
  },
  {
    id: '6',
    name: 'WD Elements 2TB External Hard Drive',
    description: 'High-capacity external hard drive for data backup and storage expansion.',
    price: 65000,
    category: 'Storage',
    brand: 'Western Digital',
    inStock: 8,
    imageUrl: 'https://images.pexels.com/photos/8634360/pexels-photo-8634360.jpeg',
    specifications: {
      type: 'External HDD',
      capacity: '2TB',
      interface: 'USB 3.0',
      formFactor: '2.5"',
      compatibility: 'Windows, macOS (reformatting required)',
      dimensions: '11 x 8.2 x 1.5 cm',
      weight: '230g'
    },
    features: [
      'Plug-and-play ready',
      'USB 3.0 for fast transfer speeds',
      'Compact design',
      'Reliable storage solution'
    ],
    rating: 4.5,
    reviews: [
      {
        id: 'r8',
        userId: 'u8',
        userName: 'Robert Fon',
        rating: 5,
        comment: 'Excellent value for money, plenty of storage space.',
        date: '2023-07-25'
      },
      {
        id: 'r9',
        userId: 'u9',
        userName: 'Esther Nkwain',
        rating: 4,
        comment: 'Works well, a bit slow for large file transfers but reliable.',
        date: '2023-08-15'
      }
    ],
    createdAt: '2023-03-20',
    updatedAt: '2023-09-18'
  }
];

export const getProductById = (id: string): Product | undefined => {
  return products.find(product => product.id === id);
};

export const getProductsByCategory = (category: string): Product[] => {
  return products.filter(product => product.category === category);
};

export const getProductsByBrand = (brand: string): Product[] => {
  return products.filter(product => product.brand === brand);
};

export const getFilteredProducts = (
  categoryFilter?: string,
  brandFilter?: string,
  minPrice?: number,
  maxPrice?: number
): Product[] => {
  return products.filter(product => {
    const matchesCategory = !categoryFilter || product.category === categoryFilter;
    const matchesBrand = !brandFilter || product.brand === brandFilter;
    const matchesPrice = (!minPrice || product.price >= minPrice) && 
                         (!maxPrice || product.price <= maxPrice);
    
    return matchesCategory && matchesBrand && matchesPrice;
  });
};