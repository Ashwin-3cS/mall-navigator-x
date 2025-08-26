import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight, ArrowUp, Navigation2, Clock, MapPin, RotateCcw, Share } from 'lucide-react';
import { Route, RouteStep } from '@/lib/mallData';

interface RouteDisplayProps {
  route: Route;
  currentStep: number;
  onStartNavigation: () => void;
  onRecalculate: () => void;
  onShare?: () => void;
  onBack: () => void;
}

export const RouteDisplay: React.FC<RouteDisplayProps> = ({
  route,
  currentStep,
  onStartNavigation,
  onRecalculate,
  onShare,
  onBack
}) => {
  const [isNavigationStarted, setIsNavigationStarted] = useState(false);
  const progress = ((currentStep + 1) / route.steps.length) * 100;

  const getDirectionIcon = (direction?: string) => {
    switch (direction) {
      case 'left': return <ArrowLeft className="w-4 h-4" />;
      case 'right': return <ArrowRight className="w-4 h-4" />;
      case 'up': return <ArrowUp className="w-4 h-4" />;
      default: return <Navigation2 className="w-4 h-4" />;
    }
  };

  const handleStartNavigation = () => {
    setIsNavigationStarted(true);
    onStartNavigation();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button variant="ghost" onClick={onBack} className="p-2">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <h2 className="text-xl font-semibold">Route to Destination</h2>
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-1" />
              <span>{route.totalDistance}</span>
            </div>
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              <span>{route.estimatedTime}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Progress */}
      {isNavigationStarted && (
        <Card className="bg-gradient-to-r from-primary/5 to-primary-glow/5 border-primary/20">
          <CardContent className="pt-6">
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Progress</span>
                <span className="text-primary font-medium">
                  Step {currentStep + 1} of {route.steps.length}
                </span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Route Instructions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Navigation2 className="w-5 h-5 text-primary" />
            <span>Turn-by-Turn Directions</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {route.steps.map((step, index) => (
            <RouteStepCard
              key={index}
              step={step}
              index={index}
              isActive={index === currentStep && isNavigationStarted}
              isCompleted={index < currentStep && isNavigationStarted}
              isUpcoming={index > currentStep && isNavigationStarted}
            />
          ))}
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="space-y-3">
        {!isNavigationStarted ? (
          <Button
            onClick={handleStartNavigation}
            className="w-full bg-gradient-to-r from-primary to-primary-glow hover:from-primary/90 hover:to-primary-glow/90 text-white font-medium py-6"
            size="lg"
          >
            <Navigation2 className="w-5 h-5 mr-2" />
            Start Navigation
          </Button>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={onRecalculate}
              variant="outline"
              className="py-6"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Recalculate
            </Button>
            {onShare && (
              <Button
                onClick={onShare}
                variant="outline"
                className="py-6"
              >
                <Share className="w-4 h-4 mr-2" />
                Share Route
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const RouteStepCard: React.FC<{
  step: RouteStep;
  index: number;
  isActive: boolean;
  isCompleted: boolean;
  isUpcoming: boolean;
}> = ({ step, index, isActive, isCompleted, isUpcoming }) => {
  const getCardClassName = () => {
    if (isActive) return 'bg-primary/10 border-primary/30 shadow-route';
    if (isCompleted) return 'bg-location-active/10 border-location-active/30 opacity-75';
    if (isUpcoming) return 'opacity-60';
    return '';
  };

  const getStepNumber = () => {
    if (isCompleted) return '✓';
    if (step.arrival) return '🏁';
    return index + 1;
  };

  const getDirectionIcon = (direction?: string) => {
    switch (direction) {
      case 'left': return <ArrowLeft className="w-4 h-4 text-primary" />;
      case 'right': return <ArrowRight className="w-4 h-4 text-primary" />;
      case 'up': return <ArrowUp className="w-4 h-4 text-primary" />;
      default: return <Navigation2 className="w-4 h-4 text-primary" />;
    }
  };

  return (
    <div className={`border rounded-lg p-4 transition-all duration-300 ${getCardClassName()}`}>
      <div className="flex items-start space-x-4">
        {/* Step Number */}
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
          isActive ? 'bg-primary text-white' :
          isCompleted ? 'bg-location-active text-white' :
          'bg-muted text-muted-foreground'
        }`}>
          {getStepNumber()}
        </div>

        {/* Step Content */}
        <div className="flex-1 space-y-2">
          <div className="flex items-center space-x-2">
            {step.direction && getDirectionIcon(step.direction)}
            <p className={`font-medium ${isActive ? 'text-primary' : 'text-foreground'}`}>
              {step.instruction}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {step.distance && (
              <Badge variant="secondary" className="text-xs">
                {step.distance}
              </Badge>
            )}
            {step.landmark && (
              <Badge variant="outline" className="text-xs">
                📍 {step.landmark}
              </Badge>
            )}
            {step.checkpoint && (
              <Badge variant="secondary" className="text-xs bg-primary/10 text-primary">
                Checkpoint
              </Badge>
            )}
            {step.arrival && (
              <Badge className="text-xs bg-location-active text-white">
                Destination
              </Badge>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};