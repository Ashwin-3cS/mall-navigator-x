import { Router, Request, Response } from 'express';
import { StoreService } from '../services/storeService';

const router = Router();
const storeService = new StoreService();

/**
 * GET /api/stores
 * Get stores with optional filtering
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const { floor, category, search } = req.query;

    const filters: any = {};
    if (floor) filters.floor = Number(floor);
    if (category) filters.category = String(category);
    if (search) filters.search = String(search);

    const result = await storeService.getStores(filters);

    res.json({
      success: true,
      stores: result.stores,
      total: result.total,
      filters: result.filters
    });

  } catch (error) {
    console.error('Error fetching stores:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch stores'
    });
  }
});

/**
 * GET /api/stores/:storeId
 * Get specific store by ID
 */
router.get('/:storeId', async (req: Request, res: Response) => {
  try {
    const { storeId } = req.params;
    const store = await storeService.getStoreById(storeId);

    if (!store) {
      return res.status(404).json({
        success: false,
        error: 'Store not found'
      });
    }

    res.json({
      success: true,
      store
    });

  } catch (error) {
    console.error('Error fetching store:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch store'
    });
  }
});

/**
 * GET /api/stores/category/:category
 * Get stores by category
 */
router.get('/category/:category', async (req: Request, res: Response) => {
  try {
    const { category } = req.params;
    const stores = await storeService.getStoresByCategory(category);

    res.json({
      success: true,
      stores,
      total: stores.length,
      category
    });

  } catch (error) {
    console.error('Error fetching stores by category:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch stores by category'
    });
  }
});

/**
 * GET /api/stores/floor/:floor
 * Get stores by floor
 */
router.get('/floor/:floor', async (req: Request, res: Response) => {
  try {
    const { floor } = req.params;
    const stores = await storeService.getStoresByFloor(Number(floor));

    res.json({
      success: true,
      stores,
      total: stores.length,
      floor: Number(floor)
    });

  } catch (error) {
    console.error('Error fetching stores by floor:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch stores by floor'
    });
  }
});

/**
 * GET /api/stores/categories/all
 * Get all store categories
 */
router.get('/categories/all', async (req: Request, res: Response) => {
  try {
    const categories = await storeService.getStoreCategories();

    res.json({
      success: true,
      categories,
      total: categories.length
    });

  } catch (error) {
    console.error('Error fetching store categories:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch store categories'
    });
  }
});

/**
 * GET /api/stores/promotions/active
 * Get stores with active promotions
 */
router.get('/promotions/active', async (req: Request, res: Response) => {
  try {
    const stores = await storeService.getStoresWithPromotions();

    res.json({
      success: true,
      stores,
      total: stores.length
    });

  } catch (error) {
    console.error('Error fetching stores with promotions:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch stores with promotions'
    });
  }
});

/**
 * GET /api/stores/search/:query
 * Search stores by name or description
 */
router.get('/search/:query', async (req: Request, res: Response) => {
  try {
    const { query } = req.params;
    const stores = await storeService.searchStores(query);

    res.json({
      success: true,
      stores,
      total: stores.length,
      search_query: query
    });

  } catch (error) {
    console.error('Error searching stores:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to search stores'
    });
  }
});

export default router; 