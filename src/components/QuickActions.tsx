import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, Car, HelpCircle, MapPin } from 'lucide-react';

interface QuickActionsProps {
  onEmergencyExit: () => void;
  onRestrooms: () => void;
  onCustomerService: () => void;
  onParking: () => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  onEmergencyExit,
  onRestrooms,
  onCustomerService,
  onParking
}) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-3">
          <Button
            onClick={onEmergencyExit}
            variant="destructive"
            className="h-20 flex-col space-y-2 bg-gradient-to-br from-emergency to-emergency/80"
          >
            <AlertTriangle className="w-6 h-6" />
            <span className="text-sm font-medium">Emergency Exit</span>
          </Button>

          <Button
            onClick={onRestrooms}
            variant="outline"
            className="h-20 flex-col space-y-2 hover:bg-primary/5 hover:border-primary/30"
          >
            <span className="text-xl">🚻</span>
            <span className="text-sm font-medium">Restrooms</span>
          </Button>

          <Button
            onClick={onCustomerService}
            variant="outline"
            className="h-20 flex-col space-y-2 hover:bg-primary/5 hover:border-primary/30"
          >
            <HelpCircle className="w-6 h-6" />
            <span className="text-sm font-medium">Help Desk</span>
          </Button>

          <Button
            onClick={onParking}
            variant="outline"
            className="h-20 flex-col space-y-2 hover:bg-primary/5 hover:border-primary/30"
          >
            <Car className="w-6 h-6" />
            <span className="text-sm font-medium">Parking</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};