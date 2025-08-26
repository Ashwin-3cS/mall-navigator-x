import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Navigation } from 'lucide-react';
import { Location } from '@/lib/mallData';

interface CurrentLocationProps {
  location: Location;
  nearbyLandmarks?: string[];
}

export const CurrentLocation: React.FC<CurrentLocationProps> = ({ 
  location, 
  nearbyLandmarks = ['Information Desk', 'ATM'] 
}) => {
  return (
    <Card className="p-6 bg-gradient-to-br from-location-active/5 to-location-active/10 border-location-active/20">
      <div className="flex items-center space-x-4">
        <div className="relative">
          <div className="w-12 h-12 bg-location-active rounded-full flex items-center justify-center location-pulse">
            <MapPin className="w-6 h-6 text-white" />
          </div>
        </div>
        
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <Badge variant="secondary" className="bg-location-active/10 text-location-active border-location-active/20">
              You are here
            </Badge>
            <Badge variant="outline">
              Floor {location.floor}
            </Badge>
          </div>
          
          <h2 className="text-xl font-semibold text-foreground mb-1">
            {location.name}
          </h2>
          
          {nearbyLandmarks.length > 0 && (
            <div className="flex items-center text-sm text-muted-foreground">
              <Navigation className="w-4 h-4 mr-1" />
              <span>Near: {nearbyLandmarks.join(', ')}</span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};