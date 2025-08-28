import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  QrCode, 
  MapPin, 
  Navigation, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  Target,
  Loader2
} from 'lucide-react';
import { NavigationSession, CheckpointResult } from '@/hooks/use-navigation-session';
import { RouteStep } from '@/lib/api';

interface CheckpointValidationProps {
  session: NavigationSession;
  onValidateCheckpoint: (qrId: string) => CheckpointResult;
  onCompleteSession: () => void;
  onCancelSession: () => void;
}

export const CheckpointValidation: React.FC<CheckpointValidationProps> = ({
  session,
  onValidateCheckpoint,
  onCompleteSession,
  onCancelSession,
}) => {
  const [qrInput, setQrInput] = useState('');
  const [lastResult, setLastResult] = useState<CheckpointResult | null>(null);
  const [validating, setValidating] = useState(false);

  const currentStep = session.steps[session.currentStep - 1];
  const nextStep = session.steps[session.currentStep];

  const handleValidateCheckpoint = () => {
    if (!qrInput.trim()) return;
    
    setValidating(true);
    const result = onValidateCheckpoint(qrInput.trim());
    setLastResult(result);
    setQrInput('');
    setValidating(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleValidateCheckpoint();
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress < 30) return 'bg-red-500';
    if (progress < 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getStepStatus = (stepIndex: number) => {
    if (stepIndex < session.currentStep - 1) return 'completed';
    if (stepIndex === session.currentStep - 1) return 'current';
    return 'pending';
  };

  return (
    <div className="space-y-6">
      {/* Session Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">Navigation Session</CardTitle>
              <p className="text-sm text-muted-foreground">
                Session ID: {session.sessionId}
              </p>
            </div>
            <Badge variant="outline" className="text-xs">
              {session.isActive ? 'Active' : 'Completed'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Progress</span>
              <span className="font-medium">{session.progress}%</span>
            </div>
            <Progress value={session.progress} className="h-2" />
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Step {session.currentStep} of {session.totalSteps}</span>
              <span>{session.totalDistance} • {session.estimatedTime}</span>
            </div>
          </div>

          {/* Session Stats */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="space-y-1">
              <p className="text-2xl font-bold text-primary">{session.currentStep}</p>
              <p className="text-xs text-muted-foreground">Current Step</p>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-green-600">
                {session.totalSteps - session.currentStep + 1}
              </p>
              <p className="text-xs text-muted-foreground">Remaining</p>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-blue-600">
                {Math.round((session.currentStep - 1) / session.totalSteps * 100)}%
              </p>
              <p className="text-xs text-muted-foreground">Completed</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Step Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="w-5 h-5 text-primary" />
            <span>Current Step {session.currentStep}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <Navigation className="w-5 h-5 text-primary mt-0.5" />
              <div className="flex-1">
                <p className="font-medium">{currentStep.instruction}</p>
                <p className="text-sm text-muted-foreground">
                  {currentStep.landmark}
                </p>
              </div>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span>Checkpoint: {currentStep.checkpoint_qr}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span>~{currentStep.estimated_time}s</span>
              </div>
            </div>
          </div>

          {/* Next Step Preview */}
          {nextStep && (
            <>
              <Separator />
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Next Step:</p>
                <div className="flex items-start space-x-3">
                  <Navigation className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm">{nextStep.instruction}</p>
                    <p className="text-xs text-muted-foreground">
                      {nextStep.landmark}
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Checkpoint Validation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <QrCode className="w-5 h-5 text-primary" />
            <span>Scan Checkpoint QR</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex space-x-2">
              <input
                type="text"
                value={qrInput}
                onChange={(e) => setQrInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter QR code or scan..."
                className="flex-1 px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                disabled={validating}
              />
              <Button 
                onClick={handleValidateCheckpoint}
                disabled={!qrInput.trim() || validating}
                className="px-6"
              >
                {validating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Validating...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Validate
                  </>
                )}
              </Button>
            </div>
            
            <p className="text-xs text-muted-foreground">
              Scan the QR code at your current location to proceed to the next step
            </p>
          </div>

          {/* Validation Result */}
          {lastResult && (
            <div className={`p-3 rounded-md border ${
              lastResult.success 
                ? lastResult.isDestination 
                  ? 'border-green-200 bg-green-50' 
                  : 'border-blue-200 bg-blue-50'
                : 'border-red-200 bg-red-50'
            }`}>
              <div className="flex items-start space-x-2">
                {lastResult.success ? (
                  lastResult.isDestination ? (
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  ) : (
                    <Navigation className="w-5 h-5 text-blue-600 mt-0.5" />
                  )
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                )}
                <div className="flex-1">
                  <p className={`font-medium ${
                    lastResult.success 
                      ? lastResult.isDestination 
                        ? 'text-green-800' 
                        : 'text-blue-800'
                      : 'text-red-800'
                  }`}>
                    {lastResult.message}
                  </p>
                  {lastResult.success && !lastResult.isDestination && lastResult.nextStep && (
                    <p className="text-sm text-blue-700 mt-1">
                      Next: {lastResult.nextStep.instruction}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Route Steps Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Route Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {session.steps.map((step, index) => {
              const status = getStepStatus(index);
              return (
                <div key={index} className={`flex items-center space-x-3 p-2 rounded-md ${
                  status === 'completed' ? 'bg-green-50 border border-green-200' :
                  status === 'current' ? 'bg-blue-50 border border-blue-200' :
                  'bg-gray-50 border border-gray-200'
                }`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                    status === 'completed' ? 'bg-green-500 text-white' :
                    status === 'current' ? 'bg-blue-500 text-white' :
                    'bg-gray-300 text-gray-600'
                  }`}>
                    {status === 'completed' ? '✓' : index + 1}
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm ${
                      status === 'completed' ? 'text-green-800' :
                      status === 'current' ? 'text-blue-800' :
                      'text-gray-600'
                    }`}>
                      {step.instruction}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {step.landmark} • {step.distance}m
                    </p>
                  </div>
                  {status === 'current' && (
                    <Badge variant="outline" className="text-xs">
                      Current
                    </Badge>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex space-x-3">
        <Button 
          onClick={onCancelSession}
          variant="outline"
          className="flex-1"
        >
          Cancel Navigation
        </Button>
        {!session.isActive && (
          <Button 
            onClick={onCompleteSession}
            className="flex-1 bg-green-600 hover:bg-green-700"
          >
            Complete Session
          </Button>
        )}
      </div>
    </div>
  );
}; 