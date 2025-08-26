import { Router, Request, Response } from 'express';
import { NavigationService } from '../services/navigationService';

const router = Router();
const navigationService = new NavigationService();

/**
 * POST /api/navigation/calculate
 * Calculate route from start to destination
 */
router.post('/calculate', async (req: Request, res: Response) => {
  try {
    const { start_location, destination, accessibility_needed } = req.body;

    if (!start_location || !destination) {
      return res.status(400).json({
        success: false,
        error: 'Start location and destination are required'
      });
    }

    const route = await navigationService.calculateRoute(
      start_location,
      destination,
      { accessibility_needed }
    );

    res.json({
      success: true,
      route: {
        session_id: route.session_id,
        total_distance: `${route.total_distance}m`,
        estimated_time: `${Math.ceil(route.estimated_time / 60)} minutes`,
        steps: route.steps,
        current_step: route.current_step
      }
    });

  } catch (error) {
    console.error('Error calculating route:', error);
    res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to calculate route'
    });
  }
});

/**
 * GET /api/navigation/emergency/nearest-exit
 * Get nearest exit for emergency situations
 */
router.get('/emergency/nearest-exit', async (req: Request, res: Response) => {
  try {
    const { location } = req.query;

    if (!location) {
      return res.status(400).json({
        success: false,
        error: 'Current location is required'
      });
    }

    const nearestExit = await navigationService.getNearestExit(String(location));

    if (!nearestExit) {
      return res.status(404).json({
        success: false,
        error: 'No exit found'
      });
    }

    res.json({
      success: true,
      emergency_exit: {
        qr_id: nearestExit.qr_id,
        name: nearestExit.name,
        floor: nearestExit.floor,
        coordinates: nearestExit.coordinates,
        type: nearestExit.type
      }
    });

  } catch (error) {
    console.error('Error finding nearest exit:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to find nearest exit'
    });
  }
});

/**
 * GET /api/navigation/health
 * Navigation service health check
 */
router.get('/health', async (req: Request, res: Response) => {
  try {
    res.json({
      success: true,
      service: 'Navigation Service',
      status: 'Healthy',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      service: 'Navigation Service',
      status: 'Unhealthy',
      error: 'Service check failed'
    });
  }
});

export default router; 