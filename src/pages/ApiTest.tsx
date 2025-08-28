import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useStores, useStoreCategories, useLocations, useQRValidation } from '@/hooks/use-api';
import { CheckCircle, XCircle, Loader2, RefreshCw } from 'lucide-react';

export const ApiTest: React.FC = () => {
  const [testQR, setTestQR] = useState('1E01');
  const [testFloor, setTestFloor] = useState(1);
  const [testCategory, setTestCategory] = useState('All');

  // Test different API endpoints
  const { data: stores, loading: storesLoading, error: storesError, refetch: refetchStores } = useStores({
    floor: testFloor,
    category: testCategory === 'All' ? undefined : testCategory,
  });

  const { data: categories, loading: categoriesLoading, error: categoriesError } = useStoreCategories();
  
  const { data: locations, loading: locationsLoading, error: locationsError } = useLocations({
    floor: testFloor,
  });

  const { data: qrValidation, loading: qrLoading, error: qrError, validateQR } = useQRValidation();

  const handleTestQR = () => {
    if (testQR.trim()) {
      validateQR(testQR.trim());
    }
  };

  const getStatusIcon = (loading: boolean, error: string | null) => {
    if (loading) return <Loader2 className="w-4 h-4 animate-spin" />;
    if (error) return <XCircle className="w-4 h-4 text-red-500" />;
    return <CheckCircle className="w-4 h-4 text-green-500" />;
  };

  const getStatusText = (loading: boolean, error: string | null) => {
    if (loading) return 'Loading...';
    if (error) return 'Error';
    return 'Success';
  };

  const getStatusColor = (loading: boolean, error: string | null) => {
    if (loading) return 'bg-yellow-100 text-yellow-800';
    if (error) return 'bg-red-100 text-red-800';
    return 'bg-green-100 text-green-800';
  };

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">API Integration Test</h1>
        <p className="text-muted-foreground">
          Test backend connectivity and API endpoints
        </p>
      </div>

      <Tabs defaultValue="stores" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="stores">Stores</TabsTrigger>
          <TabsTrigger value="locations">Locations</TabsTrigger>
          <TabsTrigger value="qr">QR Validation</TabsTrigger>
          <TabsTrigger value="summary">Summary</TabsTrigger>
        </TabsList>

        {/* Stores Tab */}
        <TabsContent value="stores" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span>Store Directory API</span>
                {getStatusIcon(storesLoading, storesError)}
                <Badge className={getStatusColor(storesLoading, storesError)}>
                  {getStatusText(storesLoading, storesError)}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="test-floor">Floor</Label>
                  <Input
                    id="test-floor"
                    type="number"
                    value={testFloor}
                    onChange={(e) => setTestFloor(Number(e.target.value))}
                    min={1}
                    max={2}
                  />
                </div>
                <div>
                  <Label htmlFor="test-category">Category</Label>
                  <Input
                    id="test-category"
                    value={testCategory}
                    onChange={(e) => setTestCategory(e.target.value)}
                    placeholder="All"
                  />
                </div>
              </div>

              <Button onClick={() => refetchStores()} variant="outline" size="sm">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>

              {storesError && (
                <div className="text-red-600 bg-red-50 p-3 rounded-md">
                  <p className="font-medium">Error:</p>
                  <p className="text-sm">{storesError}</p>
                </div>
              )}

              {stores && (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Found {stores.length} stores
                  </p>
                  <div className="max-h-40 overflow-y-auto space-y-1">
                    {stores.slice(0, 5).map((store) => (
                      <div key={store.store_id} className="text-sm p-2 bg-muted rounded">
                        <strong>{store.name}</strong> - {store.category} (Floor {store.floor})
                      </div>
                    ))}
                    {stores.length > 5 && (
                      <p className="text-xs text-muted-foreground">
                        ... and {stores.length - 5} more
                      </p>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Locations Tab */}
        <TabsContent value="locations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span>Locations API</span>
                {getStatusIcon(locationsLoading, locationsError)}
                <Badge className={getStatusColor(locationsLoading, locationsError)}>
                  {getStatusText(locationsLoading, locationsError)}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="test-floor-loc">Floor</Label>
                <Input
                  id="test-floor-loc"
                  type="number"
                  value={testFloor}
                  onChange={(e) => setTestFloor(Number(e.target.value))}
                  min={1}
                  max={2}
                />
              </div>

              {locationsError && (
                <div className="text-red-600 bg-red-50 p-3 rounded-md">
                  <p className="font-medium">Error:</p>
                  <p className="text-sm">{locationsError}</p>
                </div>
              )}

              {locations && (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Found {locations.length} locations on Floor {testFloor}
                  </p>
                  <div className="max-h-40 overflow-y-auto space-y-1">
                    {locations.slice(0, 5).map((location) => (
                      <div key={location.qr_id} className="text-sm p-2 bg-muted rounded">
                        <strong>{location.qr_id}</strong> - {location.name} ({location.type})
                      </div>
                    ))}
                    {locations.length > 5 && (
                      <p className="text-xs text-muted-foreground">
                        ... and {locations.length - 5} more
                      </p>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* QR Validation Tab */}
        <TabsContent value="qr" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span>QR Validation API</span>
                {getStatusIcon(qrLoading, qrError)}
                <Badge className={getStatusColor(qrLoading, qrError)}>
                  {getStatusText(qrLoading, qrError)}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex space-x-2">
                <Input
                  value={testQR}
                  onChange={(e) => setTestQR(e.target.value)}
                  placeholder="Enter QR ID (e.g., 1E01)"
                />
                <Button onClick={handleTestQR} disabled={qrLoading}>
                  Test QR
                </Button>
              </div>

              {qrError && (
                <div className="text-red-600 bg-red-50 p-3 rounded-md">
                  <p className="font-medium">Error:</p>
                  <p className="text-sm">{qrError}</p>
                </div>
              )}

              {qrValidation && (
                <div className="space-y-2 p-3 bg-green-50 rounded-md">
                  <p className="font-medium text-green-800">QR Validated Successfully!</p>
                  <div className="text-sm text-green-700 space-y-1">
                    <p><strong>ID:</strong> {qrValidation.qr_id}</p>
                    <p><strong>Name:</strong> {qrValidation.name}</p>
                    <p><strong>Floor:</strong> {qrValidation.floor}</p>
                    <p><strong>Type:</strong> {qrValidation.type}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Summary Tab */}
        <TabsContent value="summary" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>API Test Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Store Directory</h4>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(storesLoading, storesError)}
                    <span className="text-sm">
                      {storesLoading ? 'Loading...' : storesError ? 'Failed' : 'Working'}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Store Categories</h4>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(categoriesLoading, categoriesError)}
                    <span className="text-sm">
                      {categoriesLoading ? 'Loading...' : categoriesError ? 'Failed' : 'Working'}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Locations</h4>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(locationsLoading, locationsError)}
                    <span className="text-sm">
                      {locationsLoading ? 'Loading...' : locationsError ? 'Failed' : 'Working'}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">QR Validation</h4>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(qrLoading, qrError)}
                    <span className="text-sm">
                      {qrLoading ? 'Loading...' : qrError ? 'Failed' : 'Working'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <h4 className="font-medium mb-2">Test Results:</h4>
                <div className="space-y-1 text-sm">
                  {stores && <p>✅ Store Directory: {stores.length} stores loaded</p>}
                  {categories && <p>✅ Store Categories: {categories.length} categories loaded</p>}
                  {locations && <p>✅ Locations: {locations.length} locations on Floor {testFloor}</p>}
                  {qrValidation && <p>✅ QR Validation: {qrValidation.qr_id} validated</p>}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}; 