import { Location, ILocation } from '../models/Location';

export class LocationService {
  /**
   * Validate a QR code and return location information
   */
  async validateQR(qrId: string): Promise<ILocation> {
    const location = await Location.findOne({ 
      qr_id: qrId, 
      is_active: true 
    });

    if (!location) {
      throw new Error('Invalid QR code or location not found');
    }

    return location;
  }

  /**
   * Get location by QR ID
   */
  async getLocationByQR(qrId: string): Promise<ILocation | null> {
    return await Location.findOne({ 
      qr_id: qrId, 
      is_active: true 
    });
  }

  /**
   * Get all locations on a specific floor
   */
  async getLocationsByFloor(floor: number): Promise<ILocation[]> {
    return await Location.find({ 
      floor, 
      is_active: true 
    }).sort({ 'coordinates.x': 1, 'coordinates.y': 1 });
  }

  /**
   * Get locations by type
   */
  async getLocationsByType(type: string): Promise<ILocation[]> {
    return await Location.find({ 
      type, 
      is_active: true 
    }).sort({ floor: 1, 'coordinates.x': 1, 'coordinates.y': 1 });
  }

  /**
   * Get all active locations
   */
  async getAllLocations(): Promise<ILocation[]> {
    return await Location.find({ is_active: true }).sort({ 
      floor: 1, 
      'coordinates.x': 1, 
      'coordinates.y': 1 
    });
  }

  /**
   * Get nearby locations within a certain distance
   */
  async getNearbyLocations(
    qrId: string, 
    maxDistance: number = 50
  ): Promise<ILocation[]> {
    const location = await this.getLocationByQR(qrId);
    if (!location) {
      throw new Error('Location not found');
    }

    const allLocations = await this.getAllLocations();
    const nearby: ILocation[] = [];

    for (const loc of allLocations) {
      if (loc.qr_id === qrId) continue;

      const distance = this.calculateDistance(
        location.coordinates,
        loc.coordinates
      );

      if (distance <= maxDistance) {
        nearby.push(loc);
      }
    }

    return nearby.sort((a, b) => {
      const distA = this.calculateDistance(location.coordinates, a.coordinates);
      const distB = this.calculateDistance(location.coordinates, b.coordinates);
      return distA - distB;
    });
  }

  /**
   * Calculate Manhattan distance between two coordinates
   */
  private calculateDistance(
    coord1: { x: number; y: number }, 
    coord2: { x: number; y: number }
  ): number {
    const dx = Math.abs(coord1.x - coord2.x);
    const dy = Math.abs(coord1.y - coord2.y);
    return (dx + dy) * 5; // Each grid unit = 5 meters
  }
} 