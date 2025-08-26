// Dummy Mall Navigation Data Structure

export interface Location {
  id: string;
  floor: number;
  name: string;
  x: number;
  y: number;
  type: 'entrance' | 'store' | 'amenity' | 'intersection' | 'exit';
}

export interface Store {
  id: string;
  name: string;
  floor: number;
  category: string;
  hours: string;
  description?: string;
  phone?: string;
  image?: string;
  location: {
    x: number;
    y: number;
  };
}

export interface RouteStep {
  instruction: string;
  direction?: 'straight' | 'left' | 'right' | 'up' | 'down';
  distance?: string;
  landmark?: string;
  checkpoint?: boolean;
  arrival?: boolean;
}

export interface Route {
  startId: string;
  endId: string;
  steps: RouteStep[];
  totalDistance: string;
  estimatedTime: string;
}

export const MALL_LOCATIONS: Record<string, Location> = {
  // Floor 1 Entrances
  '1E01': { id: '1E01', floor: 1, name: 'Main Entrance - South', x: 5, y: 0, type: 'entrance' },
  '1E02': { id: '1E02', floor: 1, name: 'North Entrance', x: 5, y: 10, type: 'entrance' },
  '1E03': { id: '1E03', floor: 1, name: 'West Entrance', x: 0, y: 5, type: 'entrance' },
  
  // Floor 1 Intersections
  '1I01': { id: '1I01', floor: 1, name: 'Information Desk', x: 5, y: 3, type: 'intersection' },
  '1I02': { id: '1I02', floor: 1, name: 'Central Court', x: 5, y: 5, type: 'intersection' },
  '1I03': { id: '1I03', floor: 1, name: 'Escalator Area', x: 7, y: 5, type: 'intersection' },
  
  // Floor 1 Stores
  '1S01': { id: '1S01', floor: 1, name: 'Zara', x: 3, y: 4, type: 'store' },
  '1S02': { id: '1S02', floor: 1, name: 'Nike Store', x: 7, y: 3, type: 'store' },
  '1S03': { id: '1S03', floor: 1, name: 'Apple Store', x: 2, y: 6, type: 'store' },
  '1S04': { id: '1S04', floor: 1, name: 'H&M', x: 8, y: 4, type: 'store' },
  '1S05': { id: '1S05', floor: 1, name: 'Bookstore', x: 3, y: 7, type: 'store' },
  
  // Floor 1 Amenities
  '1A01': { id: '1A01', floor: 1, name: 'Restrooms', x: 1, y: 3, type: 'amenity' },
  '1A02': { id: '1A02', floor: 1, name: 'ATM Area', x: 6, y: 2, type: 'amenity' },
  '1A03': { id: '1A03', floor: 1, name: 'Customer Service', x: 4, y: 3, type: 'amenity' },
  
  // Floor 2 Intersections
  '2I01': { id: '2I01', floor: 2, name: 'Escalator Arrival', x: 7, y: 5, type: 'intersection' },
  '2I02': { id: '2I02', floor: 2, name: 'Food Court Entrance', x: 6, y: 7, type: 'intersection' },
  
  // Floor 2 Stores & Dining
  '2FC01': { id: '2FC01', floor: 2, name: 'Food Court', x: 7, y: 8, type: 'store' },
  '2S01': { id: '2S01', floor: 2, name: 'Electronics Mega Store', x: 2, y: 4, type: 'store' },
  '2S02': { id: '2S02', floor: 2, name: 'Game Zone', x: 8, y: 3, type: 'store' },
  '2S03': { id: '2S03', floor: 2, name: 'Movie Theater', x: 3, y: 8, type: 'store' },
  '2S04': { id: '2S04', floor: 2, name: 'Home & Living', x: 5, y: 3, type: 'store' },
  
  // Floor 2 Amenities
  '2A01': { id: '2A01', floor: 2, name: 'Restrooms', x: 1, y: 7, type: 'amenity' },
  '2A02': { id: '2A02', floor: 2, name: 'Children Play Area', x: 9, y: 6, type: 'amenity' },
};

export const MALL_STORES: Store[] = [
  {
    id: '1S01', name: 'Zara', floor: 1, category: 'Fashion',
    hours: '10:00 AM - 10:00 PM', description: 'Latest fashion trends',
    location: { x: 3, y: 4 }
  },
  {
    id: '1S02', name: 'Nike Store', floor: 1, category: 'Sports',
    hours: '10:00 AM - 9:00 PM', description: 'Sports apparel and footwear',
    location: { x: 7, y: 3 }
  },
  {
    id: '1S03', name: 'Apple Store', floor: 1, category: 'Electronics',
    hours: '10:00 AM - 10:00 PM', description: 'Latest Apple products',
    location: { x: 2, y: 6 }
  },
  {
    id: '1S04', name: 'H&M', floor: 1, category: 'Fashion',
    hours: '10:00 AM - 10:00 PM', description: 'Affordable fashion for everyone',
    location: { x: 8, y: 4 }
  },
  {
    id: '1S05', name: 'Bookstore', floor: 1, category: 'Books',
    hours: '9:00 AM - 9:00 PM', description: 'Books, magazines, and stationery',
    location: { x: 3, y: 7 }
  },
  {
    id: '2FC01', name: 'Food Court', floor: 2, category: 'Dining',
    hours: '10:00 AM - 11:00 PM', description: 'Multiple dining options',
    location: { x: 7, y: 8 }
  },
  {
    id: '2S01', name: 'Electronics Mega Store', floor: 2, category: 'Electronics',
    hours: '10:00 AM - 10:00 PM', description: 'Laptops, phones, gadgets',
    location: { x: 2, y: 4 }
  },
  {
    id: '2S02', name: 'Game Zone', floor: 2, category: 'Entertainment',
    hours: '11:00 AM - 11:00 PM', description: 'Arcade and gaming center',
    location: { x: 8, y: 3 }
  },
  {
    id: '2S03', name: 'Movie Theater', floor: 2, category: 'Entertainment',
    hours: '10:00 AM - 12:00 AM', description: 'Latest movies and shows',
    location: { x: 3, y: 8 }
  },
  {
    id: '2S04', name: 'Home & Living', floor: 2, category: 'Home',
    hours: '10:00 AM - 9:00 PM', description: 'Furniture and home decor',
    location: { x: 5, y: 3 }
  },
];

export const SAMPLE_ROUTES: Record<string, Route> = {
  '1E01_2FC01': {
    startId: '1E01',
    endId: '2FC01',
    steps: [
      { instruction: 'Walk straight from Main Entrance', distance: '25m', landmark: 'Pass Information Desk' },
      { instruction: 'Continue to Central Court area', distance: '15m', checkpoint: true },
      { instruction: 'Turn right towards escalator', direction: 'right', distance: '20m' },
      { instruction: 'Take escalator to Floor 2', direction: 'up', checkpoint: true },
      { instruction: 'Walk straight after escalator', distance: '15m' },
      { instruction: 'Turn left towards Food Court', direction: 'left', distance: '10m' },
      { instruction: 'Arrive at Food Court', arrival: true }
    ],
    totalDistance: '85m',
    estimatedTime: '3 minutes'
  },
  '1E01_1S03': {
    startId: '1E01',
    endId: '1S03',
    steps: [
      { instruction: 'Walk straight from Main Entrance', distance: '25m' },
      { instruction: 'Turn left at Information Desk', direction: 'left', distance: '15m' },
      { instruction: 'Continue past Central Court', distance: '10m' },
      { instruction: 'Apple Store on your right', arrival: true }
    ],
    totalDistance: '50m',
    estimatedTime: '2 minutes'
  },
  '1S01_2S01': {
    startId: '1S01',
    endId: '2S01',
    steps: [
      { instruction: 'Exit Zara and head to Central Court', distance: '15m' },
      { instruction: 'Turn right towards escalator', direction: 'right', distance: '20m' },
      { instruction: 'Take escalator to Floor 2', direction: 'up', checkpoint: true },
      { instruction: 'Turn left after escalator', direction: 'left', distance: '30m' },
      { instruction: 'Electronics Mega Store on your left', arrival: true }
    ],
    totalDistance: '65m',
    estimatedTime: '3 minutes'
  }
};

export const STORE_CATEGORIES = [
  'All', 'Fashion', 'Electronics', 'Dining', 'Entertainment', 'Sports', 'Books', 'Home'
];

export const AMENITIES = [
  { id: '1A01', name: 'Restrooms', floor: 1, icon: '🚻' },
  { id: '2A01', name: 'Restrooms', floor: 2, icon: '🚻' },
  { id: '1A02', name: 'ATM', floor: 1, icon: '🏧' },
  { id: '1A03', name: 'Customer Service', floor: 1, icon: 'ℹ️' },
  { id: '2A02', name: 'Children Play Area', floor: 2, icon: '🎠' },
];

// Helper functions
export function parseQRLocation(qrParam: string): Location | null {
  return MALL_LOCATIONS[qrParam] || null;
}

export function findRoute(startId: string, endId: string): Route | null {
  const routeKey = `${startId}_${endId}`;
  return SAMPLE_ROUTES[routeKey] || null;
}

export function getStoresByCategory(category: string): Store[] {
  if (category === 'All') return MALL_STORES;
  return MALL_STORES.filter(store => store.category === category);
}

export function searchStores(query: string): Store[] {
  const lowercaseQuery = query.toLowerCase();
  return MALL_STORES.filter(store =>
    store.name.toLowerCase().includes(lowercaseQuery) ||
    store.category.toLowerCase().includes(lowercaseQuery) ||
    store.description?.toLowerCase().includes(lowercaseQuery)
  );
}