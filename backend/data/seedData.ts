import { Location } from '../src/models/Location';
import { Store } from '../src/models/Store';
import { NavigationGraph } from '../src/models/NavigationGraph';
import { connectDB, disconnectDB } from '../src/utils/database';

const seedLocations = async () => {
  const locations = [
    // Floor 1 - Entrances
    {
      qr_id: '1E01',
      floor: 1,
      name: 'Main Entrance - South',
      type: 'entrance',
      coordinates: { x: 5, y: 0 },
      nearby_landmarks: ['Information Desk', 'ATM'],
      connected_nodes: ['1I01']
    },
    {
      qr_id: '1E02',
      floor: 1,
      name: 'Main Entrance - North',
      type: 'entrance',
      coordinates: { x: 5, y: 9 },
      nearby_landmarks: ['Parking Garage', 'Security Desk'],
      connected_nodes: ['1I08']
    },
    {
      qr_id: '1E03',
      floor: 1,
      name: 'Side Entrance - East',
      type: 'entrance',
      coordinates: { x: 9, y: 4 },
      nearby_landmarks: ['Coffee Shop', 'News Stand'],
      connected_nodes: ['1I04']
    },
    {
      qr_id: '1E04',
      floor: 1,
      name: 'Side Entrance - West',
      type: 'entrance',
      coordinates: { x: 0, y: 4 },
      nearby_landmarks: ['Restroom', 'Vending Machines'],
      connected_nodes: ['1I05']
    },

    // Floor 1 - Intersections
    {
      qr_id: '1I01',
      floor: 1,
      name: 'Information Desk Intersection',
      type: 'intersection',
      coordinates: { x: 5, y: 2 },
      nearby_landmarks: ['Information Desk', 'ATM', 'Rest Area'],
      connected_nodes: ['1E01', '1I02', '1V01']
    },
    {
      qr_id: '1I02',
      floor: 1,
      name: 'Central Plaza',
      type: 'intersection',
      coordinates: { x: 5, y: 4 },
      nearby_landmarks: ['Fountain', 'Seating Area', 'Plant Display'],
      connected_nodes: ['1I01', '1I03', '1I06', '1V01']
    },
    {
      qr_id: '1I03',
      floor: 1,
      name: 'Food Court Junction',
      type: 'intersection',
      coordinates: { x: 5, y: 6 },
      nearby_landmarks: ['Food Court Entrance', 'Rest Area'],
      connected_nodes: ['1I02', '1I07', '1V01']
    },
    {
      qr_id: '1I04',
      floor: 1,
      name: 'East Wing Junction',
      type: 'intersection',
      coordinates: { x: 7, y: 4 },
      nearby_landmarks: ['Coffee Shop', 'News Stand'],
      connected_nodes: ['1E03', '1I02', '1S01', '1S02']
    },
    {
      qr_id: '1I05',
      floor: 1,
      name: 'West Wing Junction',
      type: 'intersection',
      coordinates: { x: 3, y: 4 },
      nearby_landmarks: ['Restroom', 'Vending Machines'],
      connected_nodes: ['1E04', '1I02', '1S03', '1S04']
    },
    {
      qr_id: '1I06',
      floor: 1,
      name: 'North Wing Junction',
      type: 'intersection',
      coordinates: { x: 5, y: 7 },
      nearby_landmarks: ['Security Desk', 'Rest Area'],
      connected_nodes: ['1I03', '1E02', '1S05', '1S06']
    },
    {
      qr_id: '1I07',
      floor: 1,
      name: 'South Wing Junction',
      type: 'intersection',
      coordinates: { x: 5, y: 3 },
      nearby_landmarks: ['Rest Area', 'Plant Display'],
      connected_nodes: ['1I02', '1I01', '1S07', '1S08']
    },
    {
      qr_id: '1I08',
      floor: 1,
      name: 'North Entrance Junction',
      type: 'intersection',
      coordinates: { x: 5, y: 8 },
      nearby_landmarks: ['Parking Garage', 'Security Desk'],
      connected_nodes: ['1E02', '1I06', '1S09', '1S10']
    },

    // Floor 1 - Vertical Transport
    {
      qr_id: '1V01',
      floor: 1,
      name: 'Main Escalator',
      type: 'vertical',
      coordinates: { x: 5, y: 5 },
      nearby_landmarks: ['Escalator to Floor 2', 'Emergency Exit'],
      connected_nodes: ['1I02', '2V01']
    },

    // Floor 1 - Amenities
    {
      qr_id: '1A01',
      floor: 1,
      name: 'Restroom - East',
      type: 'amenity',
      coordinates: { x: 8, y: 3 },
      nearby_landmarks: ['Restroom', 'Baby Changing Station'],
      connected_nodes: ['1I04']
    },
    {
      qr_id: '1A02',
      floor: 1,
      name: 'Restroom - West',
      type: 'amenity',
      coordinates: { x: 2, y: 3 },
      nearby_landmarks: ['Restroom', 'Vending Machines'],
      connected_nodes: ['1I05']
    },

    // Floor 1 - Store Locations (adding missing store QR codes)
    {
      qr_id: '1S01',
      floor: 1,
      name: 'Zara',
      type: 'shop',
      coordinates: { x: 8, y: 5 },
      nearby_landmarks: ['Fashion Store', 'Display Windows'],
      connected_nodes: ['1I04']
    },
    {
      qr_id: '1S02',
      floor: 1,
      name: 'H&M',
      type: 'shop',
      coordinates: { x: 8, y: 6 },
      nearby_landmarks: ['Fashion Store', 'Display Windows'],
      connected_nodes: ['1I04']
    },
    {
      qr_id: '1S03',
      floor: 1,
      name: 'Nike',
      type: 'shop',
      coordinates: { x: 2, y: 5 },
      nearby_landmarks: ['Sports Store', 'Display Windows'],
      connected_nodes: ['1I05']
    },
    {
      qr_id: '1S04',
      floor: 1,
      name: 'Adidas',
      type: 'shop',
      coordinates: { x: 2, y: 6 },
      nearby_landmarks: ['Sports Store', 'Display Windows'],
      connected_nodes: ['1I05']
    },
    {
      qr_id: '1S05',
      floor: 1,
      name: 'Apple Store',
      type: 'shop',
      coordinates: { x: 6, y: 7 },
      nearby_landmarks: ['Electronics Store', 'Display Windows'],
      connected_nodes: ['1I06']
    },
    {
      qr_id: '1S06',
      floor: 1,
      name: 'Samsung Store',
      type: 'shop',
      coordinates: { x: 4, y: 7 },
      nearby_landmarks: ['Electronics Store', 'Display Windows'],
      connected_nodes: ['1I06']
    },
    {
      qr_id: '1S07',
      floor: 1,
      name: 'Starbucks',
      type: 'shop',
      coordinates: { x: 6, y: 2 },
      nearby_landmarks: ['Coffee Shop', 'Seating Area'],
      connected_nodes: ['1I07']
    },
    {
      qr_id: '1S08',
      floor: 1,
      name: 'McDonald\'s',
      type: 'shop',
      coordinates: { x: 4, y: 2 },
      nearby_landmarks: ['Fast Food', 'Seating Area'],
      connected_nodes: ['1I07']
    },
    {
      qr_id: '1S09',
      floor: 1,
      name: 'Bookstore',
      type: 'shop',
      coordinates: { x: 6, y: 8 },
      nearby_landmarks: ['Book Store', 'Reading Area'],
      connected_nodes: ['1I08']
    },
    {
      qr_id: '1S10',
      floor: 1,
      name: 'Gift Shop',
      type: 'shop',
      coordinates: { x: 4, y: 8 },
      nearby_landmarks: ['Gift Store', 'Display Area'],
      connected_nodes: ['1I08']
    },

    // Floor 2 - Entrances (from escalator)
    {
      qr_id: '2E01',
      floor: 2,
      name: 'Floor 2 - Escalator Landing',
      type: 'entrance',
      coordinates: { x: 5, y: 5 },
      nearby_landmarks: ['Escalator from Floor 1', 'Floor 2 Map'],
      connected_nodes: ['2I01']
    },

    // Floor 2 - Intersections
    {
      qr_id: '2I01',
      floor: 2,
      name: 'Floor 2 Central Hub',
      type: 'intersection',
      coordinates: { x: 5, y: 4 },
      nearby_landmarks: ['Floor 2 Map', 'Rest Area', 'Plant Display'],
      connected_nodes: ['2E01', '2I02', '2I03', '2I04', '2V01']
    },
    {
      qr_id: '2I02',
      floor: 2,
      name: 'Floor 2 East Wing',
      type: 'intersection',
      coordinates: { x: 7, y: 4 },
      nearby_landmarks: ['Rest Area', 'Plant Display'],
      connected_nodes: ['2I01', '2S01', '2S02']
    },
    {
      qr_id: '2I03',
      floor: 2,
      name: 'Floor 2 West Wing',
      type: 'intersection',
      coordinates: { x: 3, y: 4 },
      nearby_landmarks: ['Rest Area', 'Plant Display'],
      connected_nodes: ['2I01', '2S03', '2S04']
    },
    {
      qr_id: '2I04',
      floor: 2,
      name: 'Floor 2 North Wing',
      type: 'intersection',
      coordinates: { x: 5, y: 6 },
      nearby_landmarks: ['Rest Area', 'Plant Display'],
      connected_nodes: ['2I01', '2S05', '2S06']
    },

    // Floor 2 - Vertical Transport
    {
      qr_id: '2V01',
      floor: 2,
      name: 'Floor 2 Escalator',
      type: 'vertical',
      coordinates: { x: 5, y: 5 },
      nearby_landmarks: ['Escalator to Floor 1', 'Emergency Exit'],
      connected_nodes: ['2I01', '1V01']
    },

    // Floor 2 - Amenities
    {
      qr_id: '2A01',
      floor: 2,
      name: 'Floor 2 Restroom',
      type: 'amenity',
      coordinates: { x: 8, y: 3 },
      nearby_landmarks: ['Restroom', 'Baby Changing Station'],
      connected_nodes: ['2I02']
    },

    // Floor 2 - Store Locations (adding missing store QR codes)
    {
      qr_id: '2S01',
      floor: 2,
      name: 'Food Court - Asian',
      type: 'shop',
      coordinates: { x: 8, y: 5 },
      nearby_landmarks: ['Asian Cuisine', 'Seating Area'],
      connected_nodes: ['2I02']
    },
    {
      qr_id: '2S02',
      floor: 2,
      name: 'Food Court - Western',
      type: 'shop',
      coordinates: { x: 8, y: 6 },
      nearby_landmarks: ['Western Cuisine', 'Seating Area'],
      connected_nodes: ['2I02']
    },
    {
      qr_id: '2S03',
      floor: 2,
      name: 'Cinema',
      type: 'shop',
      coordinates: { x: 2, y: 5 },
      nearby_landmarks: ['Movie Theater', 'Ticket Counter'],
      connected_nodes: ['2I03']
    },
    {
      qr_id: '2S04',
      floor: 2,
      name: 'Arcade',
      type: 'shop',
      coordinates: { x: 2, y: 6 },
      nearby_landmarks: ['Gaming Arcade', 'Prize Counter'],
      connected_nodes: ['2I03']
    },
    {
      qr_id: '2S05',
      floor: 2,
      name: 'Spa & Wellness',
      type: 'shop',
      coordinates: { x: 6, y: 7 },
      nearby_landmarks: ['Wellness Center', 'Reception'],
      connected_nodes: ['2I04']
    },
    {
      qr_id: '2S06',
      floor: 2,
      name: 'Fitness Center',
      type: 'shop',
      coordinates: { x: 4, y: 7 },
      nearby_landmarks: ['Gym Equipment', 'Reception'],
      connected_nodes: ['2I04']
    },
    {
      qr_id: '2S07',
      floor: 2,
      name: 'Beauty Salon',
      type: 'shop',
      coordinates: { x: 6, y: 2 },
      nearby_landmarks: ['Hair Salon', 'Reception'],
      connected_nodes: ['2I01']
    },
    {
      qr_id: '2S08',
      floor: 2,
      name: 'Nail Salon',
      type: 'shop',
      coordinates: { x: 4, y: 2 },
      nearby_landmarks: ['Nail Care', 'Reception'],
      connected_nodes: ['2I01']
    },
    {
      qr_id: '2S09',
      floor: 2,
      name: 'Toy Store',
      type: 'shop',
      coordinates: { x: 6, y: 8 },
      nearby_landmarks: ['Children Toys', 'Display Area'],
      connected_nodes: ['2I04']
    },
    {
      qr_id: '2S10',
      floor: 2,
      name: 'Pet Store',
      type: 'shop',
      coordinates: { x: 4, y: 8 },
      nearby_landmarks: ['Pet Supplies', 'Display Area'],
      connected_nodes: ['2I04']
    }
  ];

  for (const location of locations) {
    await Location.findOneAndUpdate(
      { qr_id: location.qr_id },
      location,
      { upsert: true, new: true }
    );
  }

  console.log('✅ Locations seeded successfully');
};

const seedStores = async () => {
  const stores = [
    // Floor 1 Stores
    {
      store_id: '1S01',
      name: 'Zara',
      floor: 1,
      category: 'Fashion',
      location: { x: 8, y: 5 },
      qr_location: '1S01',
      description: 'International fashion retailer',
      contact: '123-456-7890'
    },
    {
      store_id: '1S02',
      name: 'H&M',
      floor: 1,
      category: 'Fashion',
      location: { x: 8, y: 6 },
      qr_location: '1S02',
      description: 'Swedish fashion retailer',
      contact: '123-456-7891'
    },
    {
      store_id: '1S03',
      name: 'Nike',
      floor: 1,
      category: 'Sports',
      location: { x: 2, y: 5 },
      qr_location: '1S03',
      description: 'Athletic footwear and apparel',
      contact: '123-456-7892'
    },
    {
      store_id: '1S04',
      name: 'Adidas',
      floor: 1,
      category: 'Sports',
      location: { x: 2, y: 6 },
      qr_location: '1S04',
      description: 'German sportswear manufacturer',
      contact: '123-456-7893'
    },
    {
      store_id: '1S05',
      name: 'Apple Store',
      floor: 1,
      category: 'Electronics',
      location: { x: 6, y: 7 },
      qr_location: '1S05',
      description: 'Premium electronics retailer',
      contact: '123-456-7894'
    },
    {
      store_id: '1S06',
      name: 'Samsung Store',
      floor: 1,
      category: 'Electronics',
      location: { x: 4, y: 7 },
      qr_location: '1S06',
      description: 'Korean electronics manufacturer',
      contact: '123-456-7895'
    },
    {
      store_id: '1S07',
      name: 'Starbucks',
      floor: 1,
      category: 'Food',
      location: { x: 6, y: 2 },
      qr_location: '1S07',
      description: 'Premium coffee chain',
      contact: '123-456-7896'
    },
    {
      store_id: '1S08',
      name: 'McDonald\'s',
      floor: 1,
      category: 'Food',
      location: { x: 4, y: 2 },
      qr_location: '1S08',
      description: 'Fast food restaurant',
      contact: '123-456-7897'
    },
    {
      store_id: '1S09',
      name: 'Bookstore',
      floor: 1,
      category: 'Books',
      location: { x: 6, y: 8 },
      qr_location: '1S09',
      description: 'General bookstore',
      contact: '123-456-7898'
    },
    {
      store_id: '1S10',
      name: 'Gift Shop',
      floor: 1,
      category: 'Gifts',
      location: { x: 4, y: 8 },
      qr_location: '1S10',
      description: 'Souvenirs and gifts',
      contact: '123-456-7899'
    },

    // Floor 2 Stores
    {
      store_id: '2S01',
      name: 'Food Court - Asian',
      floor: 2,
      category: 'Food',
      location: { x: 8, y: 5 },
      qr_location: '2S01',
      description: 'Asian cuisine food court',
      contact: '123-456-7900'
    },
    {
      store_id: '2S02',
      name: 'Food Court - Western',
      floor: 2,
      category: 'Food',
      location: { x: 8, y: 6 },
      qr_location: '2S02',
      description: 'Western cuisine food court',
      contact: '123-456-7901'
    },
    {
      store_id: '2S03',
      name: 'Cinema',
      floor: 2,
      category: 'Entertainment',
      location: { x: 2, y: 5 },
      qr_location: '2S03',
      description: 'Movie theater complex',
      contact: '123-456-7902'
    },
    {
      store_id: '2S04',
      name: 'Arcade',
      floor: 2,
      category: 'Entertainment',
      location: { x: 2, y: 6 },
      qr_location: '2S04',
      description: 'Gaming arcade',
      contact: '123-456-7903'
    },
    {
      store_id: '2S05',
      name: 'Spa & Wellness',
      floor: 2,
      category: 'Health',
      location: { x: 6, y: 7 },
      qr_location: '2S05',
      description: 'Relaxation and wellness center',
      contact: '123-456-7904'
    },
    {
      store_id: '2S06',
      name: 'Fitness Center',
      floor: 2,
      category: 'Health',
      location: { x: 4, y: 7 },
      qr_location: '2S06',
      description: '24/7 fitness facility',
      contact: '123-456-7905'
    },
    {
      store_id: '2S07',
      name: 'Beauty Salon',
      floor: 2,
      category: 'Beauty',
      location: { x: 6, y: 2 },
      qr_location: '2S07',
      description: 'Hair and beauty services',
      contact: '123-456-7906'
    },
    {
      store_id: '2S08',
      name: 'Nail Salon',
      floor: 2,
      category: 'Beauty',
      location: { x: 4, y: 2 },
      qr_location: '2S08',
      description: 'Nail care and manicures',
      contact: '123-456-7907'
    },
    {
      store_id: '2S09',
      name: 'Toy Store',
      floor: 2,
      category: 'Toys',
      location: { x: 6, y: 8 },
      qr_location: '2S09',
      description: 'Children\'s toys and games',
      contact: '123-456-7908'
    },
    {
      store_id: '2S10',
      name: 'Pet Store',
      floor: 2,
      category: 'Pets',
      location: { x: 4, y: 8 },
      qr_location: '2S10',
      description: 'Pet supplies and accessories',
      contact: '123-456-7909'
    }
  ];

  for (const store of stores) {
    await Store.findOneAndUpdate(
      { store_id: store.store_id },
      store,
      { upsert: true, new: true }
    );
  }

  console.log('✅ Stores seeded successfully');
};

const seedNavigationGraph = async () => {
  const connections = [
    // Floor 1 connections
    {
      from_node: '1E01',
      to_node: '1I01',
      distance: 25,
      direction: 'straight',
      instructions: 'Walk straight toward Information Desk',
      landmarks: ['Information Desk on your right'],
      is_accessible: true,
      floor_change: false,
      estimated_time: 18
    },
    {
      from_node: '1I01',
      to_node: '1E01',
      distance: 25,
      direction: 'straight',
      instructions: 'Walk straight toward Main Entrance',
      landmarks: ['Main Entrance ahead'],
      is_accessible: true,
      floor_change: false,
      estimated_time: 18
    },
    {
      from_node: '1I01',
      to_node: '1I02',
      distance: 20,
      direction: 'straight',
      instructions: 'Walk straight toward Central Plaza',
      landmarks: ['Fountain ahead', 'Seating Area on left'],
      is_accessible: true,
      floor_change: false,
      estimated_time: 15
    },
    {
      from_node: '1I02',
      to_node: '1I01',
      distance: 20,
      direction: 'straight',
      instructions: 'Walk straight toward Information Desk',
      landmarks: ['Information Desk ahead'],
      is_accessible: true,
      floor_change: false,
      estimated_time: 15
    },
    {
      from_node: '1I02',
      to_node: '1I03',
      distance: 20,
      direction: 'straight',
      instructions: 'Walk straight toward Food Court',
      landmarks: ['Food Court Entrance ahead'],
      is_accessible: true,
      floor_change: false,
      estimated_time: 15
    },
    {
      from_node: '1I03',
      to_node: '1I02',
      distance: 20,
      direction: 'straight',
      instructions: 'Walk straight toward Central Plaza',
      landmarks: ['Central Plaza ahead', 'Fountain on right'],
      is_accessible: true,
      floor_change: false,
      estimated_time: 15
    },
    {
      from_node: '1I02',
      to_node: '1I04',
      distance: 20,
      direction: 'right',
      instructions: 'Turn right toward East Wing',
      landmarks: ['Coffee Shop on right', 'News Stand ahead'],
      is_accessible: true,
      floor_change: false,
      estimated_time: 15
    },
    {
      from_node: '1I04',
      to_node: '1I02',
      distance: 20,
      direction: 'left',
      instructions: 'Turn left toward Central Plaza',
      landmarks: ['Central Plaza ahead'],
      is_accessible: true,
      floor_change: false,
      estimated_time: 15
    },
    {
      from_node: '1I02',
      to_node: '1I05',
      distance: 20,
      direction: 'left',
      instructions: 'Turn left toward West Wing',
      landmarks: ['Restroom on left', 'Vending Machines ahead'],
      is_accessible: true,
      floor_change: false,
      estimated_time: 15
    },
    {
      from_node: '1I05',
      to_node: '1I02',
      distance: 20,
      direction: 'right',
      instructions: 'Turn right toward Central Plaza',
      landmarks: ['Central Plaza ahead'],
      is_accessible: true,
      floor_change: false,
      estimated_time: 15
    },
    {
      from_node: '1I03',
      to_node: '1I06',
      distance: 15,
      direction: 'straight',
      instructions: 'Walk straight toward North Wing',
      landmarks: ['Security Desk on right'],
      is_accessible: true,
      floor_change: false,
      estimated_time: 12
    },
    {
      from_node: '1I06',
      to_node: '1I03',
      distance: 15,
      direction: 'straight',
      instructions: 'Walk straight toward Food Court',
      landmarks: ['Food Court ahead'],
      is_accessible: true,
      floor_change: false,
      estimated_time: 12
    },
    {
      from_node: '1I02',
      to_node: '1I07',
      distance: 15,
      direction: 'straight',
      instructions: 'Walk straight toward South Wing',
      landmarks: ['Rest Area on left'],
      is_accessible: true,
      floor_change: false,
      estimated_time: 12
    },
    {
      from_node: '1I07',
      to_node: '1I02',
      distance: 15,
      direction: 'straight',
      instructions: 'Walk straight toward Central Plaza',
      landmarks: ['Central Plaza ahead'],
      is_accessible: true,
      floor_change: false,
      estimated_time: 12
    },
    {
      from_node: '1I06',
      to_node: '1I08',
      distance: 15,
      direction: 'straight',
      instructions: 'Walk straight toward North Entrance',
      landmarks: ['Parking Garage ahead'],
      is_accessible: true,
      floor_change: false,
      estimated_time: 12
    },
    {
      from_node: '1I08',
      to_node: '1I06',
      distance: 15,
      direction: 'straight',
      instructions: 'Walk straight toward North Wing',
      landmarks: ['North Wing ahead'],
      is_accessible: true,
      floor_change: false,
      estimated_time: 12
    },

    // Vertical connections (escalator)
    {
      from_node: '1I02',
      to_node: '1V01',
      distance: 10,
      direction: 'straight',
      instructions: 'Walk straight to escalator',
      landmarks: ['Escalator to Floor 2 ahead'],
      is_accessible: true,
      floor_change: true,
      estimated_time: 8
    },
    {
      from_node: '1V01',
      to_node: '1I02',
      distance: 10,
      direction: 'straight',
      instructions: 'Walk straight to Central Plaza',
      landmarks: ['Central Plaza ahead'],
      is_accessible: true,
      floor_change: false,
      estimated_time: 8
    },

    // Floor 2 connections
    {
      from_node: '2E01',
      to_node: '2I01',
      distance: 15,
      direction: 'straight',
      instructions: 'Walk straight to Floor 2 Central Hub',
      landmarks: ['Floor 2 Map ahead'],
      is_accessible: true,
      floor_change: false,
      estimated_time: 12
    },
    {
      from_node: '2I01',
      to_node: '2E01',
      distance: 15,
      direction: 'straight',
      instructions: 'Walk straight to escalator',
      landmarks: ['Escalator to Floor 1 ahead'],
      is_accessible: true,
      floor_change: false,
      estimated_time: 12
    },
    {
      from_node: '2I01',
      to_node: '2I02',
      distance: 20,
      direction: 'right',
      instructions: 'Turn right toward East Wing',
      landmarks: ['East Wing ahead'],
      is_accessible: true,
      floor_change: false,
      estimated_time: 15
    },
    {
      from_node: '2I02',
      to_node: '2I01',
      distance: 20,
      direction: 'left',
      instructions: 'Turn left toward Central Hub',
      landmarks: ['Central Hub ahead'],
      is_accessible: true,
      floor_change: false,
      estimated_time: 15
    },
    {
      from_node: '2I01',
      to_node: '2I03',
      distance: 20,
      direction: 'left',
      instructions: 'Turn left toward West Wing',
      landmarks: ['West Wing ahead'],
      is_accessible: true,
      floor_change: false,
      estimated_time: 15
    },
    {
      from_node: '2I03',
      to_node: '2I01',
      distance: 20,
      direction: 'right',
      instructions: 'Turn right toward Central Hub',
      landmarks: ['Central Hub ahead'],
      is_accessible: true,
      floor_change: false,
      estimated_time: 15
    },
    {
      from_node: '2I01',
      to_node: '2I04',
      distance: 20,
      direction: 'straight',
      instructions: 'Walk straight toward North Wing',
      landmarks: ['North Wing ahead'],
      is_accessible: true,
      floor_change: false,
      estimated_time: 15
    },
    {
      from_node: '2I04',
      to_node: '2I01',
      distance: 20,
      direction: 'straight',
      instructions: 'Walk straight toward Central Hub',
      landmarks: ['Central Hub ahead'],
      is_accessible: true,
      floor_change: false,
      estimated_time: 15
    },

    // Cross-floor escalator connection
    {
      from_node: '1V01',
      to_node: '2V01',
      distance: 30,
      direction: 'up',
      instructions: 'Take escalator up to Floor 2',
      landmarks: ['Escalator to Floor 2'],
      is_accessible: true,
      floor_change: true,
      estimated_time: 25
    },
    {
      from_node: '2V01',
      to_node: '1V01',
      distance: 30,
      direction: 'down',
      instructions: 'Take escalator down to Floor 1',
      landmarks: ['Escalator to Floor 1'],
      is_accessible: true,
      floor_change: true,
      estimated_time: 25
    }
  ];

  for (const connection of connections) {
    await NavigationGraph.findOneAndUpdate(
      { from_node: connection.from_node, to_node: connection.to_node },
      connection,
      { upsert: true, new: true }
    );
  }

  console.log('✅ Navigation graph seeded successfully');
};

const seedAll = async () => {
  try {
    await connectDB();
    
    console.log('🌱 Starting database seeding...');
    
    await seedLocations();
    await seedStores();
    await seedNavigationGraph();
    
    console.log('✅ All data seeded successfully!');
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await disconnectDB();
  }
};

// Run seeding if this file is executed directly
if (require.main === module) {
  seedAll();
}

export { seedAll }; 