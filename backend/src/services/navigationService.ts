import { Location, ILocation } from '../models/Location';
import { NavigationGraph, INavigationGraph } from '../models/NavigationGraph';
import { Store, IStore } from '../models/Store';

export interface RouteStep {
  step_number: number;
  instruction: string;
  direction: string;
  landmark: string;
  checkpoint_qr: string;
  distance: number;
  estimated_time: number;
}

export interface RouteResult {
  session_id: string;
  total_distance: number;
  estimated_time: number;
  steps: RouteStep[];
  current_step: number;
}

export class NavigationService {
  /**
   * Calculate route from start to destination
   * Simplified version for MVP - uses direct path calculation
   */
  async calculateRoute(
    startQR: string, 
    destinationQR: string,
    options: { accessibility_needed?: boolean } = {}
  ): Promise<RouteResult> {
    // Get start and destination locations
    const startLocation = await Location.findOne({ qr_id: startQR, is_active: true });
    const destLocation = await Location.findOne({ qr_id: destinationQR, is_active: true });

    if (!startLocation) {
      throw new Error('Start location not found');
    }

    if (!destLocation) {
      throw new Error('Destination location not found');
    }

    // Generate session ID
    const sessionId = this.generateSessionId();

    // Calculate route steps
    const steps = await this.generateRouteSteps(startLocation, destLocation, options);

    // Calculate total distance and time
    const totalDistance = steps.reduce((sum, step) => sum + step.distance, 0);
    const totalTime = steps.reduce((sum, step) => sum + step.estimated_time, 0);

    return {
      session_id: sessionId,
      total_distance: totalDistance,
      estimated_time: totalTime,
      steps,
      current_step: 1
    };
  }

  /**
   * Generate route steps between two locations
   */
  private async generateRouteSteps(
    start: ILocation,
    destination: ILocation,
    options: { accessibility_needed?: boolean } = {}
  ): Promise<RouteStep[]> {
    const steps: RouteStep[] = [];
    let currentLocation = start;
    let stepNumber = 1;

    // If same floor, use direct path
    if (start.floor === destination.floor) {
      const directSteps = this.calculateDirectPath(currentLocation, destination, stepNumber);
      steps.push(...directSteps);
    } else {
      // Multi-floor navigation - find escalator path
      const escalatorSteps = await this.calculateEscalatorPath(
        currentLocation, 
        destination, 
        stepNumber
      );
      steps.push(...escalatorSteps);
    }

    return steps;
  }

  /**
   * Calculate direct path on same floor
   */
  private calculateDirectPath(
    start: ILocation,
    destination: ILocation,
    startStepNumber: number
  ): RouteStep[] {
    const steps: RouteStep[] = [];
    let stepNumber = startStepNumber;

    // Simple direct path calculation
    const dx = destination.coordinates.x - start.coordinates.x;
    const dy = destination.coordinates.y - start.coordinates.y;

    // Horizontal movement
    if (dx !== 0) {
      const direction = dx > 0 ? 'right' : 'left';
      const distance = Math.abs(dx) * 5; // 5 meters per grid unit
      const time = Math.ceil(distance / 1.4); // 1.4 m/s walking speed

      steps.push({
        step_number: stepNumber++,
        instruction: `Walk ${direction} ${distance} meters`,
        direction,
        landmark: `Toward ${destination.name}`,
        checkpoint_qr: destination.qr_id,
        distance,
        estimated_time: time
      });
    }

    // Vertical movement
    if (dy !== 0) {
      const direction = dy > 0 ? 'forward' : 'backward';
      const distance = Math.abs(dy) * 5; // 5 meters per grid unit
      const time = Math.ceil(distance / 1.4); // 1.4 m/s walking speed

      steps.push({
        step_number: stepNumber++,
        instruction: `Walk ${direction} ${distance} meters`,
        direction,
        landmark: `Toward ${destination.name}`,
        checkpoint_qr: destination.qr_id,
        distance,
        estimated_time: time
      });
    }

    // If no movement needed, create a single step
    if (steps.length === 0) {
      steps.push({
        step_number: stepNumber,
        instruction: `You have arrived at ${destination.name}`,
        direction: 'arrived',
        landmark: destination.name,
        checkpoint_qr: destination.qr_id,
        distance: 0,
        estimated_time: 0
      });
    }

    return steps;
  }

  /**
   * Calculate path using escalator for floor changes
   */
  private async calculateEscalatorPath(
    start: ILocation,
    destination: ILocation,
    startStepNumber: number
  ): Promise<RouteStep[]> {
    const steps: RouteStep[] = [];
    let stepNumber = startStepNumber;

    // Find escalator on start floor
    const startEscalator = await Location.findOne({
      floor: start.floor,
      type: 'vertical',
      is_active: true
    });

    if (!startEscalator) {
      throw new Error('No escalator found on start floor');
    }

    // Step 1: Go to escalator
    const escalatorDistance = this.calculateDistance(start.coordinates, startEscalator.coordinates);
    const escalatorTime = Math.ceil(escalatorDistance / 1.4);

    steps.push({
      step_number: stepNumber++,
      instruction: `Walk to escalator (${escalatorDistance}m)`,
      direction: 'straight',
      landmark: `Escalator to Floor ${destination.floor}`,
      checkpoint_qr: startEscalator.qr_id,
      distance: escalatorDistance,
      estimated_time: escalatorTime
    });

    // Step 2: Take escalator
    steps.push({
      step_number: stepNumber++,
      instruction: `Take escalator to Floor ${destination.floor}`,
      direction: 'up',
      landmark: `Escalator to Floor ${destination.floor}`,
      checkpoint_qr: `2E01`, // Floor 2 escalator landing
      distance: 30,
      estimated_time: 25
    });

    // Step 3: Go to destination from escalator landing
    const escalatorLanding = await Location.findOne({
      qr_id: '2E01',
      is_active: true
    });

    if (escalatorLanding) {
      const finalDistance = this.calculateDistance(escalatorLanding.coordinates, destination.coordinates);
      const finalTime = Math.ceil(finalDistance / 1.4);

      steps.push({
        step_number: stepNumber++,
        instruction: `Walk to ${destination.name} (${finalDistance}m)`,
        direction: 'straight',
        landmark: destination.name,
        checkpoint_qr: destination.qr_id,
        distance: finalDistance,
        estimated_time: finalTime
      });
    }

    return steps;
  }

  /**
   * Calculate distance between two coordinates
   */
  private calculateDistance(
    coord1: { x: number; y: number },
    coord2: { x: number; y: number }
  ): number {
    const dx = Math.abs(coord1.x - coord2.x);
    const dy = Math.abs(coord1.y - coord2.y);
    return (dx + dy) * 5; // Each grid unit = 5 meters
  }

  /**
   * Generate unique session ID
   */
  private generateSessionId(): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 9);
    return `nav_${timestamp}_${random}`;
  }

  /**
   * Get nearest exit for emergency situations
   */
  async getNearestExit(qrId: string): Promise<ILocation | null> {
    const location = await Location.findOne({ qr_id: qrId, is_active: true });
    if (!location) return null;

    // Find nearest exit on same floor
    const exits = await Location.find({
      floor: location.floor,
      type: 'entrance',
      is_active: true
    });

    if (exits.length === 0) return null;

    // Return the closest exit
    let nearestExit = exits[0];
    let shortestDistance = this.calculateDistance(location.coordinates, nearestExit.coordinates);

    for (const exit of exits) {
      const distance = this.calculateDistance(location.coordinates, exit.coordinates);
      if (distance < shortestDistance) {
        shortestDistance = distance;
        nearestExit = exit;
      }
    }

    return nearestExit;
  }
} 