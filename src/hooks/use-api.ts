import { useState, useEffect, useCallback } from 'react';
import { apiService, ApiResponse, Store, Location, StoreFilters, LocationFilters } from '@/lib/api';

export interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  success: boolean;
}

export function useApiState<T>() {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
    success: false,
  });

  const setLoading = useCallback((loading: boolean) => {
    setState(prev => ({ ...prev, loading, error: loading ? null : prev.error }));
  }, []);

  const setError = useCallback((error: string) => {
    setState(prev => ({ ...prev, error, loading: false, success: false }));
  }, []);

  const setData = useCallback((data: T) => {
    setState(prev => ({ ...prev, data, loading: false, error: null, success: true }));
  }, []);

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null, success: false });
  }, []);

  return { state, setLoading, setError, setData, reset };
}

// Hook for stores
export function useStores(filters: StoreFilters = {}) {
  const { state, setLoading, setError, setData } = useApiState<Store[]>();

  const fetchStores = useCallback(async () => {
    setLoading(true);
    try {
      const response = await apiService.getStores(filters);
      if (response.success && response.data && response.data.stores) {
        setData(response.data.stores);
      } else {
        setError(response.error || 'Failed to fetch stores');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Unknown error occurred');
    }
  }, [filters, setLoading, setError, setData]);

  useEffect(() => {
    fetchStores();
  }, [filters.floor, filters.category, filters.search]); // Only depend on actual filter values

  const refetch = useCallback(() => {
    fetchStores();
  }, [fetchStores]);

  return { ...state, refetch };
}

// Hook for store categories
export function useStoreCategories() {
  const { state, setLoading, setError, setData } = useApiState<string[]>();

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const response = await apiService.getStoreCategories();
      if (response.success && response.data && response.data.categories) {
        setData(response.data.categories);
      } else {
        setError(response.error || 'Failed to fetch categories');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Unknown error occurred');
    }
  }, [setLoading, setError, setData]);

  useEffect(() => {
    fetchCategories();
  }, []); // Only run once on mount

  return { ...state, refetch: fetchCategories };
}

// Hook for locations
export function useLocations(filters: LocationFilters = {}) {
  const { state, setLoading, setError, setData } = useApiState<Location[]>();

  const fetchLocations = useCallback(async () => {
    setLoading(true);
    try {
      const response = await apiService.getLocations(filters);
      if (response.success && response.data && response.data.locations) {
        setData(response.data.locations);
      } else {
        setError(response.error || 'Failed to fetch locations');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Unknown error occurred');
    }
  }, [filters, setLoading, setError, setData]);

  useEffect(() => {
    fetchLocations();
  }, [filters.floor, filters.type]); // Only depend on actual filter values

  const refetch = useCallback(() => {
    fetchLocations();
  }, [fetchLocations]);

  return { ...state, refetch };
}

// Hook for QR validation
export function useQRValidation() {
  const { state, setLoading, setError, setData } = useApiState<Location>();

  const validateQR = useCallback(async (qrId: string) => {
    setLoading(true);
    try {
      const response = await apiService.validateQR(qrId);
      if (response.success && response.data) {
        setData(response.data);
      } else {
        setError(response.error || 'Invalid QR code');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Unknown error occurred');
    }
  }, [setLoading, setError, setData]);

  return { ...state, validateQR };
}

// Hook for route calculation
export function useRouteCalculation() {
  const { state, setLoading, setError, setData } = useApiState<RouteResponse>();

  const calculateRoute = useCallback(async (startLocation: string, destination: string, options: { accessibility_needed?: boolean } = {}) => {
    setLoading(true);
    try {
      const response = await apiService.calculateRoute(startLocation, destination, options);
      if (response.success && response.data) {
        setData(response.data);
      } else {
        setError(response.error || 'Failed to calculate route');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Unknown error occurred');
    }
  }, [setLoading, setError, setData]);

  return { ...state, calculateRoute };
}

// Hook for backend availability
export function useBackendAvailability() {
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [checking, setChecking] = useState(true);

  const checkAvailability = useCallback(async () => {
    setChecking(true);
    try {
      const available = await apiService.isBackendAvailable();
      setIsAvailable(available);
    } catch {
      setIsAvailable(false);
    } finally {
      setChecking(false);
    }
  }, []);

  useEffect(() => {
    checkAvailability();
  }, [checkAvailability]);

  return { isAvailable, checking, checkAvailability };
} 