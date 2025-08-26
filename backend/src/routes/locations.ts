import { Router, Request, Response } from 'express';
import { LocationService } from '../services/locationService';

const router = Router();
const locationService = new LocationService();

/**
 * POST /api/locations/validate
 * Validate QR code and return location information
 */
router.post('/validate', async (req: Request, res: Response) => {
  try {
    const { qr_id } = req.body;

    if (!qr_id) {
      return res.status(400).json({
        success: false,
        error: 'QR ID is required'
      });
    }

    const location = await locationService.validateQR(qr_id);

    res.json({
      success: true,
      location: {
        qr_id: location.qr_id,
        name: location.name,
        floor: location.floor,
        coordinates: location.coordinates,
        nearby_landmarks: location.nearby_landmarks,
        type: location.type
      }
    });

  } catch (error) {
    console.error('Error validating QR code:', error);
    res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to validate QR code'
    });
  }
});

/**
 * GET /api/locations
 * Get all locations with optional filtering
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const { floor, type } = req.query;

    let locations;
    if (floor) {
      locations = await locationService.getLocationsByFloor(Number(floor));
    } else if (type) {
      locations = await locationService.getLocationsByType(String(type));
    } else {
      locations = await locationService.getAllLocations();
    }

    res.json({
      success: true,
      locations,
      total: locations.length
    });

  } catch (error) {
    console.error('Error fetching locations:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch locations'
    });
  }
});

/**
 * GET /api/locations/:qrId
 * Get specific location by QR ID
 */
router.get('/:qrId', async (req: Request, res: Response) => {
  try {
    const { qrId } = req.params;
    const location = await locationService.getLocationByQR(qrId);

    if (!location) {
      return res.status(404).json({
        success: false,
        error: 'Location not found'
      });
    }

    res.json({
      success: true,
      location
    });

  } catch (error) {
    console.error('Error fetching location:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch location'
    });
  }
});

/**
 * GET /api/locations/:qrId/nearby
 * Get nearby locations within specified distance
 */
router.get('/:qrId/nearby', async (req: Request, res: Response) => {
  try {
    const { qrId } = req.params;
    const { distance = 50 } = req.query;

    const nearbyLocations = await locationService.getNearbyLocations(
      qrId, 
      Number(distance)
    );

    res.json({
      success: true,
      nearby_locations: nearbyLocations,
      total: nearbyLocations.length,
      max_distance: Number(distance)
    });

  } catch (error) {
    console.error('Error fetching nearby locations:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch nearby locations'
    });
  }
});

export default router; 