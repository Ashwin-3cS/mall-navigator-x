import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Navigation, Phone, MapPin, Clock } from 'lucide-react';

interface EmergencyOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  currentLocation: string;
}

export const EmergencyOverlay: React.FC<EmergencyOverlayProps> = ({
  isOpen,
  onClose,
  currentLocation
}) => {
  const emergencyExits = [
    {
      id: 'exit-1',
      name: 'Main Exit (South)',
      distance: '25m',
      direction: 'Straight ahead, then left',
      estimated: '30 seconds',
      floor: 1
    },
    {
      id: 'exit-2', 
      name: 'Emergency Exit (West)',
      distance: '40m',
      direction: 'Turn right, follow red signs',
      estimated: '45 seconds',
      floor: 1
    },
    {
      id: 'exit-3',
      name: 'Fire Exit (Stairwell B)',
      distance: '35m', 
      direction: 'Past escalator, turn left',
      estimated: '40 seconds',
      floor: 1
    }
  ];

  const emergencyContacts = [
    { label: 'Mall Security', number: '+1 (555) 0123', icon: '🛡️' },
    { label: 'Emergency Services', number: '911', icon: '🚨' },
    { label: 'Medical Emergency', number: '+1 (555) 0199', icon: '🏥' }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-200">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2 text-red-700">
            <AlertTriangle className="w-6 h-6" />
            <span className="text-xl font-bold">Emergency Information</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Current Status */}
          <Card className="border-red-200 bg-red-50/50">
            <CardContent className="pt-4">
              <div className="flex items-center space-x-2 text-red-700">
                <MapPin className="w-4 h-4" />
                <span className="font-medium">Your current location:</span>
              </div>
              <p className="text-red-800 font-semibold mt-1">{currentLocation}</p>
            </CardContent>
          </Card>

          {/* Nearest Exits */}
          <div>
            <h3 className="font-semibold text-red-700 mb-3 flex items-center">
              <Navigation className="w-4 h-4 mr-2" />
              Nearest Emergency Exits
            </h3>
            <div className="space-y-3">
              {emergencyExits.map((exit, index) => (
                <Card key={exit.id} className={`border-red-200 ${index === 0 ? 'bg-red-100' : 'bg-red-50/50'}`}>
                  <CardContent className="pt-3 pb-3">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium text-red-800">{exit.name}</h4>
                          {index === 0 && (
                            <Badge className="bg-red-600 text-white text-xs">
                              Closest
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-red-700 mt-1">{exit.direction}</p>
                        <div className="flex items-center space-x-4 mt-2 text-xs text-red-600">
                          <span className="flex items-center">
                            <MapPin className="w-3 h-3 mr-1" />
                            {exit.distance}
                          </span>
                          <span className="flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            ~{exit.estimated}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Emergency Contacts */}
          <div>
            <h3 className="font-semibold text-red-700 mb-3 flex items-center">
              <Phone className="w-4 h-4 mr-2" />
              Emergency Contacts
            </h3>
            <div className="space-y-2">
              {emergencyContacts.map((contact, index) => (
                <Card key={index} className="border-red-200 bg-red-50/50">
                  <CardContent className="pt-3 pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-lg">{contact.icon}</span>
                        <span className="font-medium text-red-800">{contact.label}</span>
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="bg-red-600 hover:bg-red-700"
                        onClick={() => window.location.href = `tel:${contact.number}`}
                      >
                        Call {contact.number}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Instructions */}
          <Card className="border-red-300 bg-red-100">
            <CardContent className="pt-4">
              <h4 className="font-semibold text-red-800 mb-2">⚠️ Emergency Instructions</h4>
              <ul className="text-sm text-red-700 space-y-1">
                <li>• Stay calm and follow exit signs</li>
                <li>• Do not use elevators during emergencies</li>
                <li>• Assist others if safe to do so</li>
                <li>• Report to designated assembly point</li>
              </ul>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="destructive"
              className="bg-red-600 hover:bg-red-700"
              onClick={() => {
                // In a real app, this would start navigation to nearest exit
                onClose();
              }}
            >
              <Navigation className="w-4 h-4 mr-2" />
              Navigate to Exit
            </Button>
            <Button
              variant="outline"
              className="border-red-300 text-red-700 hover:bg-red-50"
              onClick={onClose}
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};