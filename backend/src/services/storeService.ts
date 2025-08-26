import { Store, IStore } from '../models/Store';

export interface StoreFilters {
  floor?: number;
  category?: string;
  search?: string;
}

export class StoreService {
  /**
   * Get stores with optional filtering
   */
  async getStores(filters: StoreFilters = {}): Promise<{
    stores: IStore[];
    total: number;
    filters: StoreFilters;
  }> {
    const query: any = { is_active: true };

    // Apply floor filter
    if (filters.floor) {
      query.floor = filters.floor;
    }

    // Apply category filter
    if (filters.category) {
      query.category = { $regex: filters.category, $options: 'i' };
    }

    // Apply search filter
    if (filters.search) {
      query.$or = [
        { name: { $regex: filters.search, $options: 'i' } },
        { description: { $regex: filters.search, $options: 'i' } }
      ];
    }

    const stores = await Store.find(query).sort({ name: 1 });
    const total = await Store.countDocuments(query);

    return {
      stores,
      total,
      filters
    };
  }

  /**
   * Get store by ID
   */
  async getStoreById(storeId: string): Promise<IStore | null> {
    return await Store.findOne({ 
      store_id: storeId, 
      is_active: true 
    });
  }

  /**
   * Get stores by category
   */
  async getStoresByCategory(category: string): Promise<IStore[]> {
    return await Store.find({ 
      category: { $regex: category, $options: 'i' }, 
      is_active: true 
    }).sort({ name: 1 });
  }

  /**
   * Get stores by floor
   */
  async getStoresByFloor(floor: number): Promise<IStore[]> {
    return await Store.find({ 
      floor, 
      is_active: true 
    }).sort({ name: 1 });
  }

  /**
   * Get all store categories
   */
  async getStoreCategories(): Promise<string[]> {
    const categories = await Store.distinct('category', { is_active: true });
    return categories.sort();
  }

  /**
   * Get stores with active promotions
   */
  async getStoresWithPromotions(): Promise<IStore[]> {
    return await Store.find({
      'promotions.is_active': true,
      'promotions.valid_until': { $gt: new Date() },
      is_active: true
    }).sort({ name: 1 });
  }

  /**
   * Search stores by name or description
   */
  async searchStores(searchTerm: string): Promise<IStore[]> {
    return await Store.find({
      $or: [
        { name: { $regex: searchTerm, $options: 'i' } },
        { description: { $regex: searchTerm, $options: 'i' } }
      ],
      is_active: true
    }).sort({ name: 1 });
  }

  /**
   * Get stores near a specific location
   */
  async getStoresNearLocation(
    qrId: string, 
    maxDistance: number = 100
  ): Promise<IStore[]> {
    // This would typically use the navigation graph
    // For now, return stores on the same floor
    const stores = await this.getAllStores();
    return stores.filter(store => {
      // Simple distance calculation - in real implementation,
      // this would use the navigation graph
      return true; // Placeholder
    });
  }

  /**
   * Get all active stores
   */
  async getAllStores(): Promise<IStore[]> {
    return await Store.find({ is_active: true }).sort({ 
      floor: 1, 
      name: 1 
    });
  }
} 