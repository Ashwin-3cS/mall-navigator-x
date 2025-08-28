import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { QrCode, Wifi, WifiOff, Globe } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import mallnavLogo from '@/assets/mallnav-logo.jpg';

// Components
import { CurrentLocation } from '@/components/CurrentLocation';
import { StoreDirectory } from '@/components/StoreDirectory';
import { RouteDisplay } from '@/components/RouteDisplay';
import { QuickActions } from '@/components/QuickActions';
import { FloorPlan } from '@/components/FloorPlan';
import { EmergencyOverlay } from '@/components/EmergencyOverlay';
import { ApiStatus } from '@/components/ApiStatus';

// Data and utilities
import { 
  parseQRLocation, 
  findRoute, 
  Store, 
  Location, 
  Route,
  MALL_LOCATIONS 
} from '@/lib/mallData';

type ViewMode = 'directory' | 'route' | 'navigation';

const Index = () => {
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [selectedDestination, setSelectedDestination] = useState<Store | null>(null);
  const [route, setRoute] = useState<Route | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('directory');
  const [currentStep, setCurrentStep] = useState(0);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [qrSimulator, setQrSimulator] = useState<string>('');
  const [currentFloor, setCurrentFloor] = useState(1);
  const [showEmergencyOverlay, setShowEmergencyOverlay] = useState(false);
  const { toast } = useToast();

  // Demo QR locations for testing
  const demoLocations = [
    { id: '1E01', label: 'Main Entrance (South)' },
    { id: '1I02', label: 'Central Court Area' },
    { id: '1S01', label: 'Near Zara Store' },
    { id: '2I01', label: 'Floor 2 Escalator' },
  ];

  // Parse QR code from URL or simulate
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const locParam = urlParams.get('loc');
    
    if (locParam) {
      handleQRLocation(locParam);
    } else {
      // Default to main entrance for demo
      handleQRLocation('1E01');
    }

    // Online status monitoring
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleQRLocation = (locationId: string) => {
    const location = parseQRLocation(locationId);
    if (location) {
      setCurrentLocation(location);
      setQrSimulator(locationId);
      toast({
        title: "Location detected",
        description: `You are at ${location.name}`,
      });
    } else {
      toast({
        title: "Invalid QR Code",
        description: "Please scan a valid QR code",
        variant: "destructive",
      });
    }
  };

  const handleNavigateToStore = (store: Store) => {
    if (!currentLocation) return;
    
    const storeLocation = MALL_LOCATIONS[store.id];
    if (!storeLocation) {
      toast({
        title: "Route not available",
        description: "Unable to calculate route to this destination",
        variant: "destructive",
      });
      return;
    }

    const calculatedRoute = findRoute(currentLocation.id, store.id);
    if (calculatedRoute) {
      setSelectedDestination(store);
      setRoute(calculatedRoute);
      setViewMode('route');
      setCurrentStep(0);
    } else {
      toast({
        title: "Route not available", 
        description: "No route found to this destination",
        variant: "destructive",
      });
    }
  };

  const handleStartNavigation = () => {
    setViewMode('navigation');
    toast({
      title: "Navigation started",
      description: "Follow the step-by-step directions",
    });
  };

  const handleNextStep = () => {
    if (route && currentStep < route.steps.length - 1) {
      setCurrentStep(currentStep + 1);
      toast({
        title: "Step completed",
        description: `Moving to step ${currentStep + 2}`,
      });
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleRecalculateRoute = () => {
    toast({
      title: "Recalculating route",
      description: "Finding alternative path...",
    });
  };

  const handleBackToDirectory = () => {
    setViewMode('directory');
    setSelectedDestination(null);
    setRoute(null);
    setCurrentStep(0);
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'emergency':
        setShowEmergencyOverlay(true);
        break;
      case 'restrooms':
        // Find nearest restroom and navigate
        const restroom = Object.values(MALL_LOCATIONS).find(
          loc => loc.name.toLowerCase().includes('restroom')
        );
        if (restroom && currentLocation) {
          const restroomRoute = findRoute(currentLocation.id, restroom.id);
          if (restroomRoute) {
            setRoute(restroomRoute);
            setViewMode('route');
          }
        }
        break;
      case 'customerService':
        handleQRLocation('1A03'); // Customer Service location
        break;
      case 'parking':
        toast({
          title: "Parking Information",
          description: "Basement Level 1 & 2 available",
        });
        break;
    }
  };

  if (!currentLocation) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center space-y-4">
            <QrCode className="w-16 h-16 mx-auto text-muted-foreground" />
            <div>
              <h2 className="text-xl font-semibold mb-2">Scan QR Code</h2>
              <p className="text-muted-foreground">
                Please scan a QR code to start navigation
              </p>
            </div>
            
            {/* QR Simulator for Demo */}
            <div className="space-y-3">
              <Separator />
              <p className="text-sm text-muted-foreground">Demo Mode</p>
              <Select value={qrSimulator} onValueChange={handleQRLocation}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a location to simulate" />
                </SelectTrigger>
                <SelectContent>
                  {demoLocations.map(loc => (
                    <SelectItem key={loc.id} value={loc.id}>
                      {loc.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img src={mallnavLogo} alt="MallNav Logo" className="w-10 h-10 rounded-lg shadow-sm" />
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                  MallNav
                </h1>
                <p className="text-sm text-muted-foreground">Indoor Navigation System</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Language Selector */}
              <Select defaultValue="en">
                <SelectTrigger className="w-20 h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">EN</SelectItem>
                  <SelectItem value="hi">HI</SelectItem>
                  <SelectItem value="kn">KN</SelectItem>
                </SelectContent>
              </Select>

              {/* Online Status */}
              <Badge variant={isOnline ? 'secondary' : 'destructive'} className="text-xs">
                {isOnline ? <Wifi className="w-3 h-3 mr-1" /> : <WifiOff className="w-3 h-3 mr-1" />}
                {isOnline ? 'Online' : 'Offline'}
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 space-y-6 pb-20">
        {/* Current Location - Always visible */}
        <CurrentLocation location={currentLocation} />

        {/* API Status - For testing backend connectivity */}
        <ApiStatus />

        {/* Content based on view mode */}
        {viewMode === 'directory' && (
          <>
            <StoreDirectory onNavigateToStore={handleNavigateToStore} />
            <FloorPlan
              currentLocation={currentLocation}
              destination={selectedDestination ? MALL_LOCATIONS[selectedDestination.id] : undefined}
              floor={currentFloor}
              onFloorChange={setCurrentFloor}
            />
            <QuickActions
              onEmergencyExit={() => handleQuickAction('emergency')}
              onRestrooms={() => handleQuickAction('restrooms')}
              onCustomerService={() => handleQuickAction('customerService')}
              onParking={() => handleQuickAction('parking')}
            />
          </>
        )}

        {viewMode === 'route' && route && (
          <RouteDisplay
            route={route}
            currentStep={currentStep}
            onStartNavigation={handleStartNavigation}
            onRecalculate={handleRecalculateRoute}
            onBack={handleBackToDirectory}
            onNextStep={handleNextStep}
            onPreviousStep={handlePreviousStep}
            isNavigating={false}
          />
        )}

        {viewMode === 'navigation' && route && (
          <RouteDisplay
            route={route}
            currentStep={currentStep}
            onStartNavigation={() => {}}
            onRecalculate={handleRecalculateRoute}
            onBack={handleBackToDirectory}
            onNextStep={handleNextStep}
            onPreviousStep={handlePreviousStep}
            isNavigating={true}
          />
        )}
      </main>

      {/* Emergency Overlay */}
      <EmergencyOverlay
        isOpen={showEmergencyOverlay}
        onClose={() => setShowEmergencyOverlay(false)}
        currentLocation={currentLocation?.name || ''}
      />

      {/* QR Code Simulator Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <QrCode className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Demo QR:</span>
            </div>
            <Select value={qrSimulator} onValueChange={handleQRLocation}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {demoLocations.map(loc => (
                  <SelectItem key={loc.id} value={loc.id}>
                    {loc.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;