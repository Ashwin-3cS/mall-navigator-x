import React, { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, MapPin, Clock, Phone, Navigation } from 'lucide-react';
import { Store, MALL_STORES, STORE_CATEGORIES, getStoresByCategory, searchStores } from '@/lib/mallData';

interface StoreDirectoryProps {
  onNavigateToStore: (store: Store) => void;
}

export const StoreDirectory: React.FC<StoreDirectoryProps> = ({ onNavigateToStore }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredStores = useMemo(() => {
    if (searchQuery.trim()) {
      return searchStores(searchQuery);
    }
    return getStoresByCategory(selectedCategory);
  }, [searchQuery, selectedCategory]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    if (e.target.value.trim()) {
      setSelectedCategory('All');
    }
  };

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
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
        <TabsList className="w-full flex-wrap h-auto p-1 bg-muted/30">
          {STORE_CATEGORIES.map((category) => (
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
                  key={store.id}
                  store={store}
                  onNavigate={() => onNavigateToStore(store)}
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

const StoreCard: React.FC<{ store: Store; onNavigate: () => void }> = ({ store, onNavigate }) => {
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
            <span>{store.hours}</span>
          </div>
          
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="w-4 h-4 mr-2" />
            <span>Floor {store.floor} • Section {store.location.x}-{store.location.y}</span>
          </div>
          
          {store.phone && (
            <div className="flex items-center text-sm text-muted-foreground">
              <Phone className="w-4 h-4 mr-2" />
              <span>{store.phone}</span>
            </div>
          )}
        </div>

        <Button 
          onClick={onNavigate}
          className="w-full bg-gradient-to-r from-primary to-primary-glow hover:from-primary/90 hover:to-primary-glow/90 text-white font-medium"
        >
          <Navigation className="w-4 h-4 mr-2" />
          Navigate Here
        </Button>
      </CardContent>
    </Card>
  );
};