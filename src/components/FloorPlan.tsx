import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Navigation, Zap } from 'lucide-react';
import { Location, Store } from '@/lib/mallData';

interface FloorPlanProps {
  currentLocation: Location;
  destination?: Location;
  route?: { x: number; y: number }[];
  floor: number;
  onFloorChange: (floor: number) => void;
}

export const FloorPlan: React.FC<FloorPlanProps> = ({
  currentLocation,
  destination,
  route,
  floor,
  onFloorChange
}) => {
  // Grid dimensions (10x10 for each floor)
  const gridSize = 10;
  const cellSize = 30;

  // Sample store locations for visualization
  const sampleStores = [
    { x: 3, y: 4, name: 'Zara', type: 'fashion' },
    { x: 7, y: 3, name: 'Nike', type: 'sports' },
    { x: 2, y: 6, name: 'Apple', type: 'electronics' },
    { x: 8, y: 4, name: 'H&M', type: 'fashion' },
    { x: 7, y: 8, name: 'Food Court', type: 'dining' },
  ];

  const getStoreIcon = (type: string) => {
    switch (type) {
      case 'fashion': return '👕';
      case 'sports': return '👟';
      case 'electronics': return '📱';
      case 'dining': return '🍽️';
      default: return '🏪';
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <MapPin className="w-5 h-5 text-primary" />
            <span>Floor Plan</span>
          </CardTitle>
          
          {/* Floor Selector */}
          <div className="flex space-x-1">
            {[1, 2].map((f) => (
              <Button
                key={f}
                onClick={() => onFloorChange(f)}
                variant={floor === f ? 'default' : 'outline'}
                size="sm"
                className="px-3 py-1"
              >
                Floor {f}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="relative bg-muted/20 rounded-lg p-4 overflow-auto">
          {/* Grid Background */}
          <svg
            width={gridSize * cellSize}
            height={gridSize * cellSize}
            className="border border-border rounded"
            style={{ minWidth: `${gridSize * cellSize}px` }}
          >
            {/* Grid lines */}
            <defs>
              <pattern id="grid" width={cellSize} height={cellSize} patternUnits="userSpaceOnUse">
                <path
                  d={`M ${cellSize} 0 L 0 0 0 ${cellSize}`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="0.5"
                  className="text-border"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />

            {/* Route Path */}
            {route && route.length > 1 && (
              <path
                d={`M ${route.map(p => `${p.x * cellSize + cellSize/2},${p.y * cellSize + cellSize/2}`).join(' L ')}`}
                fill="none"
                stroke="hsl(var(--route-path))"
                strokeWidth="3"
                strokeDasharray="8 4"
                className="route-path"
                opacity="0.8"
              />
            )}

            {/* Store Locations */}
            {sampleStores
              .filter(store => floor === 1 || (floor === 2 && ['Food Court'].includes(store.name)))
              .map((store, index) => (
                <g key={index}>
                  <rect
                    x={store.x * cellSize + 2}
                    y={store.y * cellSize + 2}
                    width={cellSize - 4}
                    height={cellSize - 4}
                    fill="hsl(var(--card))"
                    stroke="hsl(var(--border))"
                    strokeWidth="1"
                    rx="4"
                    className="hover:fill-primary/5 cursor-pointer transition-colors"
                  />
                  <text
                    x={store.x * cellSize + cellSize/2}
                    y={store.y * cellSize + cellSize/2}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize="16"
                  >
                    {getStoreIcon(store.type)}
                  </text>
                </g>
              ))}

            {/* Current Location */}
            <g>
              <circle
                cx={currentLocation.x * cellSize + cellSize/2}
                cy={currentLocation.y * cellSize + cellSize/2}
                r="8"
                fill="hsl(var(--location-active))"
                className="location-pulse"
              />
              <circle
                cx={currentLocation.x * cellSize + cellSize/2}
                cy={currentLocation.y * cellSize + cellSize/2}
                r="4"
                fill="white"
              />
            </g>

            {/* Destination Location */}
            {destination && (
              <g>
                <rect
                  x={destination.x * cellSize + cellSize/2 - 8}
                  y={destination.y * cellSize + cellSize/2 - 12}
                  width="16"
                  height="16"
                  fill="hsl(var(--primary))"
                  rx="2"
                />
                <text
                  x={destination.x * cellSize + cellSize/2}
                  y={destination.y * cellSize + cellSize/2 - 4}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="12"
                  fill="white"
                >
                  🏁
                </text>
              </g>
            )}

            {/* Landmarks */}
            {floor === 1 && (
              <>
                {/* Information Desk */}
                <g>
                  <circle
                    cx={5 * cellSize + cellSize/2}
                    cy={3 * cellSize + cellSize/2}
                    r="6"
                    fill="hsl(var(--accent))"
                  />
                  <text
                    x={5 * cellSize + cellSize/2}
                    y={3 * cellSize + cellSize/2}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize="10"
                    fill="white"
                  >
                    ℹ️
                  </text>
                </g>

                {/* Escalator */}
                <g>
                  <rect
                    x={7 * cellSize + 2}
                    y={5 * cellSize + 2}
                    width={cellSize - 4}
                    height={cellSize - 4}
                    fill="hsl(var(--secondary))"
                    rx="4"
                  />
                  <text
                    x={7 * cellSize + cellSize/2}
                    y={5 * cellSize + cellSize/2}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize="14"
                  >
                    ⬆️
                  </text>
                </g>
              </>
            )}
          </svg>

          {/* Legend */}
          <div className="mt-4 flex flex-wrap gap-3 text-xs">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-location-active rounded-full location-pulse"></div>
              <span>You are here</span>
            </div>
            {destination && (
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-primary rounded"></div>
                <span>Destination</span>
              </div>
            )}
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-accent rounded"></div>
              <span>Information</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-secondary rounded"></div>
              <span>Escalator</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};