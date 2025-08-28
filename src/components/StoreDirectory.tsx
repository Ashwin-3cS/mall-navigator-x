import React, { useState, useMemo, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, MapPin, Clock, Phone, Navigation, Loader2, AlertCircle } from 'lucide-react';
import { useStores, useStoreCategories } from '@/hooks/use-api';
import { Store } from '@/lib/api';

interface StoreDirectoryProps {
  onNavigateToStore: (store: Store) => void;
  routeLoading?: boolean;
}

export const StoreDirectory: React.FC<StoreDirectoryProps> = ({ onNavigateToStore, routeLoading }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Debounce search query to prevent rapid API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500); // Wait 500ms after user stops typing

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch stores and categories from API
  const { data: stores, loading: storesLoading, error: storesError, refetch: refetchStores } = useStores({
    floor: undefined, // Will be filtered by category
    category: selectedCategory === 'All' ? undefined : selectedCategory,
    search: debouncedSearchQuery.trim() || undefined,
  });

  const { data: categories, loading: categoriesLoading, error: categoriesError } = useStoreCategories();

  // Filter stores based on search query
  const filteredStores = useMemo(() => {
    if (!stores) return [];
    
    if (searchQuery.trim()) {
      return stores.filter(store =>
        store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        store.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        store.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return stores;
  }, [stores, searchQuery]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    if (e.target.value.trim()) {
      setSelectedCategory('All');
    }
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setSearchQuery(''); // Clear search when changing category
  };

  const handleRetry = () => {
    refetchStores();
  };

  // Loading state
  if (storesLoading || categoriesLoading) {
    return (
      <div className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Where would you like to go?</h3>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search stores, restaurants, or services..."
              disabled
              className="pl-10 text-base py-6"
            />
          </div>
        </div>

        <div className="flex items-center justify-center py-12">
          <div className="text-center space-y-3">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
            <p className="text-muted-foreground">Loading stores...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (storesError || categoriesError) {
    return (
      <div className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Where would you like to go?</h3>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search stores, restaurants, or services..."
              disabled
              className="pl-10 text-base py-6"
            />
          </div>
        </div>

        <div className="flex items-center justify-center py-12">
          <div className="text-center space-y-3">
            <AlertCircle className="w-8 h-8 mx-auto text-destructive" />
            <p className="text-destructive font-medium">Failed to load stores</p>
            <p className="text-muted-foreground text-sm">
              {storesError || categoriesError}
            </p>
            <Button onClick={handleRetry} variant="outline" size="sm">
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Where would you like to go?</h3>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search stores, restaurants, or services..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="pl-10 text-base py-6"
          />
        </div>
      </div>

      {/* Category Tabs */}
      <Tabs value={selectedCategory} onValueChange={handleCategoryChange} className="w-full">
        <TabsList className="w-full flex-wrap h-auto p-1 bg-muted/30">
          {categories && Array.isArray(categories) && categories.map((category) => (
            <TabsTrigger
              key={category}
              value={category}
              className="flex-1 min-w-fit px-4 py-2 text-sm"
              disabled={searchQuery.trim().length > 0}
            >
              {category}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={selectedCategory} className="mt-6">
          <div className="mall-grid">
            {filteredStores.length > 0 ? (
              filteredStores.map((store) => (
                <StoreCard
                  key={store.store_id}
                  store={store}
                  onNavigate={() => onNavigateToStore(store)}
                  routeLoading={routeLoading}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <p className="text-muted-foreground">
                  {searchQuery ? `No stores found for "${searchQuery}"` : 'No stores in this category'}
                </p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

const StoreCard: React.FC<{ store: Store; onNavigate: () => void; routeLoading?: boolean }> = ({ store, onNavigate, routeLoading }) => {
  return (
    <Card className="store-card hover:border-primary/30 cursor-pointer group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg group-hover:text-primary transition-colors">
              {store.name}
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-xs">
                {store.category}
              </Badge>
              <Badge variant="secondary" className="text-xs">
                Floor {store.floor}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {store.description && (
          <p className="text-sm text-muted-foreground">
            {store.description}
          </p>
        )}

        <div className="space-y-2">
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="w-4 h-4 mr-2" />
            <span>{store.operating_hours.monday} - {store.operating_hours.friday}</span>
          </div>
          
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="w-4 h-4 mr-2" />
            <span>Floor {store.floor} • Section {store.location.x}-{store.location.y}</span>
          </div>
          
          {store.contact && (
            <div className="flex items-center text-sm text-muted-foreground">
              <Phone className="w-4 h-4 mr-2" />
              <span>{store.contact}</span>
            </div>
          )}
        </div>

        <Button 
          onClick={onNavigate}
          disabled={routeLoading}
          className="w-full bg-gradient-to-r from-primary to-primary-glow hover:from-primary/90 hover:to-primary-glow/90 text-white font-medium"
        >
          {routeLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Calculating Route...
            </>
          ) : (
            <>
              <Navigation className="w-4 h-4 mr-2" />
              Navigate Here
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};