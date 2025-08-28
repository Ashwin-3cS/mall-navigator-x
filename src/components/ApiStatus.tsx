import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useBackendAvailability } from '@/hooks/use-api';
import { CheckCircle, XCircle, Loader2, RefreshCw } from 'lucide-react';

export const ApiStatus: React.FC = () => {
  const { isAvailable, checking, checkAvailability } = useBackendAvailability();

  const getStatusIcon = () => {
    if (checking) return <Loader2 className="w-5 h-5 animate-spin" />;
    if (isAvailable) return <CheckCircle className="w-5 h-5 text-green-500" />;
    return <XCircle className="w-5 h-5 text-red-500" />;
  };

  const getStatusText = () => {
    if (checking) return 'Checking...';
    if (isAvailable) return 'Connected';
    return 'Disconnected';
  };

  const getStatusColor = () => {
    if (checking) return 'bg-yellow-100 text-yellow-800';
    if (isAvailable) return 'bg-green-100 text-green-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center space-x-2">
          <span>Backend Status</span>
          {getStatusIcon()}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Status:</span>
          <Badge className={getStatusColor()}>
            {getStatusText()}
          </Badge>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Backend URL:</span>
          <span className="text-sm font-mono">
            {import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}
          </span>
        </div>

        <Button 
          onClick={checkAvailability} 
          variant="outline" 
          size="sm" 
          className="w-full"
          disabled={checking}
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${checking ? 'animate-spin' : ''}`} />
          Refresh Status
        </Button>

        {!isAvailable && !checking && (
          <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
            <p className="font-medium">Backend not available</p>
            <p className="text-xs mt-1">
              Make sure the backend server is running on port 3000
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}; 