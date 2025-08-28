// API Service Layer for Mall Navigation Backend
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface Location {
  qr_id: string;
  name: string;
  floor: number;
  type: 'entrance' | 'shop' | 'intersection' | 'vertical' | 'amenity';
  coordinates: {
    x: number;
    y: number;
  };
  nearby_landmarks: string[];
  connected_nodes: string[];
}

export interface Store {
  store_id: string;
  name: string;
  floor: number;
  category: string;
  location: {
    x: number;
    y: number;
  };
  operating_hours: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
  };
  contact: string;
  description: string;
  promotions: any[];
  qr_location: string;
}

export interface StoreFilters {
  floor?: number;
  category?: string;
  search?: string;
}

export interface StoreResponse {
  stores: Store[];
  total: number;
  filters: StoreFilters;
}

export interface LocationFilters {
  floor?: number;
  type?: string;
}

export interface LocationResponse {
  locations: Location[];
  total: number;
}

export interface NearbyLocationResponse {
  nearby_locations: Location[];
  total: number;
  max_distance: number;
}

export interface RouteStep {
  step_number: number;
  instruction: string;
  direction: string;
  landmark: string;
  checkpoint_qr: string;
  distance: number;
  estimated_time: number;
}

export interface RouteResponse {
  session_id: string;
  total_distance: string;
  estimated_time: string;
  steps: RouteStep[];
  current_step: number;
}

export interface EmergencyExitResponse {
  emergency_exit: Location;
}

class ApiService {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseUrl}${endpoint}`;
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error('API request failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  // Health Check
  async healthCheck(): Promise<ApiResponse<any>> {
    return this.request('/health');
  }

  // Store Directory
  async getStores(filters: StoreFilters = {}): Promise<ApiResponse<StoreResponse>> {
    const params = new URLSearchParams();
    if (filters.floor) params.append('floor', filters.floor.toString());
    if (filters.category) params.append('category', filters.category);
    if (filters.search) params.append('search', filters.search);

    const endpoint = `/api/stores${params.toString() ? `?${params.toString()}` : ''}`;
    return this.request<StoreResponse>(endpoint);
  }

  async getStoreById(storeId: string): Promise<ApiResponse<Store>> {
    return this.request<Store>(`/api/stores/${storeId}`);
  }

  async getStoresByCategory(category: string): Promise<ApiResponse<Store[]>> {
    return this.request<Store[]>(`/api/stores/category/${category}`);
  }

  async getStoresByFloor(floor: number): Promise<ApiResponse<Store[]>> {
    return this.request<Store[]>(`/api/stores/floor/${floor}`);
  }

  async getStoreCategories(): Promise<ApiResponse<string[]>> {
    return this.request<string[]>('/api/stores/categories/all');
  }

  async getStoresWithPromotions(): Promise<ApiResponse<Store[]>> {
    return this.request<Store[]>('/api/stores/promotions/active');
  }

  async searchStores(query: string): Promise<ApiResponse<Store[]>> {
    return this.request<Store[]>(`/api/stores/search/${encodeURIComponent(query)}`);
  }

  // Location Management
  async validateQR(qrId: string): Promise<ApiResponse<Location>> {
    const response = await this.request<{ location: Location }>('/api/locations/validate', {
      method: 'POST',
      body: JSON.stringify({ qr_id: qrId }),
    });
    
    // Transform the response to match expected structure
    if (response.success && response.data) {
      return {
        success: response.success,
        data: response.data.location,
        error: response.error
      };
    }
    
    return response as ApiResponse<Location>;
  }

  async getLocations(filters: LocationFilters = {}): Promise<ApiResponse<LocationResponse>> {
    const params = new URLSearchParams();
    if (filters.floor) params.append('floor', filters.floor.toString());
    if (filters.type) params.append('type', filters.type);

    const endpoint = `/api/locations${params.toString() ? `?${params.toString()}` : ''}`;
    return this.request<LocationResponse>(endpoint);
  }

  async getLocationByQR(qrId: string): Promise<ApiResponse<Location>> {
    return this.request<Location>(`/api/locations/${qrId}`);
  }

  async getNearbyLocations(qrId: string, distance: number = 50): Promise<ApiResponse<NearbyLocationResponse>> {
    return this.request<NearbyLocationResponse>(`/api/locations/${qrId}/nearby?distance=${distance}`);
  }

  // Navigation
  async calculateRoute(startLocation: string, destination: string, options: { accessibility_needed?: boolean } = {}): Promise<ApiResponse<RouteResponse>> {
    const response = await this.request<{ route: RouteResponse }>('/api/navigation/calculate', {
      method: 'POST',
      body: JSON.stringify({
        start_location: startLocation,
        destination,
        ...options,
      }),
    });
    
    // Transform the response to match expected structure
    if (response.success && response.data) {
      return {
        success: response.success,
        data: response.data.route,
        error: response.error
      };
    }
    
    return response as ApiResponse<RouteResponse>;
  }

  async getNearestExit(location: string): Promise<ApiResponse<EmergencyExitResponse>> {
    return this.request<EmergencyExitResponse>(`/api/navigation/emergency/nearest-exit?location=${location}`);
  }

  // Utility method to check if backend is available
  async isBackendAvailable(): Promise<boolean> {
    try {
      const response = await this.healthCheck();
      return response.success;
    } catch {
      return false;
    }
  }
}

// Create and export a singleton instance
export const apiService = new ApiService();

// Export the class for testing purposes
export { ApiService }; 