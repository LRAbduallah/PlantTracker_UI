'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Plant, PlantHabit, RedListCategory, Category } from '@/lib/types/plant';
import api from '@/lib/services/api';
import { PlantFilters as UIPlantFilters, DashboardStats, COLORS, CONSERVATION_COLORS } from './components/types';
import { DashboardHeader } from './components/DashboardHeader';
import { DashboardTabs } from './components/DashboardTabs';
import { FilterSection } from './components/FilterSection';
import { PlantGrid } from './components/PlantGrid';
import { PlantList } from './components/PlantList';
import { PlantComparison } from './components/PlantComparison';

// Cache duration in milliseconds (e.g., 5 minutes)
const CACHE_DURATION = 5 * 60 * 1000;

export default function PlantsDashboard() {
  // Core state
  const [plants, setPlants] = useState<Plant[]>([]);
  const [filteredPlants, setFilteredPlants] = useState<Plant[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<{ value: number; label: string; }[]>([]);
  const [locations, setLocations] = useState<{ id: number; name: string; }[]>([]);
  const [habits, setHabits] = useState<PlantHabit[]>([]);
  const [redListStatuses, setRedListStatuses] = useState<RedListCategory[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const initialLoadComplete = useRef(false);
  const cacheTimestamp = useRef<number | null>(null);
  
  // Favorite plants functionality
  const [favoritePlants, setFavoritePlants] = useState<Set<number>>(new Set());
  
  // View state
  const [activeTab, setActiveTab] = useState('overview');
  const [isCompareMode, setIsCompareMode] = useState(false);
  const [selectedForComparison, setSelectedForComparison] = useState<Set<number>>(new Set());
  
  // Filter state
  const [filters, setFilters] = useState<UIPlantFilters>({
    search: '',
    categories: [],
    habits: [],
    redListStatuses: [],
    locationId: null,
    sortBy: 'scientific_name',
    viewMode: 'grid',
    favoriteOnly: false,
    rarityLevel: [0, 100],
  });

  // Apply filters to plants
  const applyClientFilters = useCallback((plantsData: Plant[], appliedFilters: UIPlantFilters) => {
    let filtered = [...plantsData];

    // Apply search filter
    if (appliedFilters.search) {
      const searchLower = appliedFilters.search.toLowerCase();
      filtered = filtered.filter(plant => 
        plant.scientific_name.toLowerCase().includes(searchLower) ||
        plant.tamil_name?.toLowerCase().includes(searchLower)
      );
    }

    // Apply category filter
    if (appliedFilters.categories.length > 0) {
      filtered = filtered.filter(plant =>
        plant.categories_list.some(cat => appliedFilters.categories.includes(cat.id))
      );
    }

    // Apply habit filter
    if (appliedFilters.habits.length > 0) {
      filtered = filtered.filter(plant =>
        plant.habit && appliedFilters.habits.includes(plant.habit as PlantHabit)
      );
    }

    // Apply conservation status filter
    if (appliedFilters.redListStatuses.length > 0) {
      filtered = filtered.filter(plant =>
        plant.red_list_category && appliedFilters.redListStatuses.includes(plant.red_list_category as RedListCategory)
      );
    }

    // Apply location filter
    if (appliedFilters.locationId) {
      filtered = filtered.filter(plant => plant.location === appliedFilters.locationId);
    }

    // Apply favorites filter
    if (appliedFilters.favoriteOnly) {
      filtered = filtered.filter(plant => favoritePlants.has(plant.id));
    }

    // Apply rarity level filter
    if (appliedFilters.rarityLevel[0] > 0 || appliedFilters.rarityLevel[1] < 100) {
      filtered = filtered.filter(plant => {
        const rarityScore = plant.rarity_score ?? 50; // Default to middle if not set
        return rarityScore >= appliedFilters.rarityLevel[0] && 
               rarityScore <= appliedFilters.rarityLevel[1];
      });
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (appliedFilters.sortBy) {
        case 'scientific_name':
          return a.scientific_name.localeCompare(b.scientific_name);
        case 'scientific_name_desc':
          return b.scientific_name.localeCompare(a.scientific_name);
        case 'conservation_status':
          const statusOrder = {
            'LC': 0,
            'NT': 1,
            'VU': 2,
            'EN': 3,
            'CR': 4,
            'EW': 5,
            'EX': 6
          };
          const aStatus = a.red_list_category ? statusOrder[a.red_list_category as keyof typeof statusOrder] || -1 : -1;
          const bStatus = b.red_list_category ? statusOrder[b.red_list_category as keyof typeof statusOrder] || -1 : -1;
          return bStatus - aStatus;
        case 'recently_added':
          const aDate = a.date_added ? new Date(a.date_added).getTime() : 0;
          const bDate = b.date_added ? new Date(b.date_added).getTime() : 0;
          return bDate - aDate;
        default:
          return 0;
      }
    });

    setFilteredPlants(filtered);
  }, [favoritePlants]);

  // Load environmental data
  const loadEnvironmentalData = useCallback(() => {
    // Simulate environmental data (in a real app, this would come from an API)
    return [
      { month: 'Jan', temperature: 22, humidity: 60, rainfall: 20 },
      { month: 'Feb', temperature: 24, humidity: 65, rainfall: 25 },
      { month: 'Mar', temperature: 26, humidity: 70, rainfall: 40 },
      { month: 'Apr', temperature: 28, humidity: 75, rainfall: 65 },
      { month: 'May', temperature: 30, humidity: 80, rainfall: 80 },
      { month: 'Jun', temperature: 29, humidity: 85, rainfall: 150 },
      { month: 'Jul', temperature: 28, humidity: 90, rainfall: 180 },
      { month: 'Aug', temperature: 28, humidity: 88, rainfall: 160 },
      { month: 'Sep', temperature: 27, humidity: 82, rainfall: 90 },
      { month: 'Oct', temperature: 26, humidity: 75, rainfall: 70 },
      { month: 'Nov', temperature: 24, humidity: 68, rainfall: 45 },
      { month: 'Dec', temperature: 23, humidity: 62, rainfall: 30 },
    ];
  }, []);

  // Calculate statistics based on current plants data
  const calculateStats = useCallback((plantsData: Plant[]) => {
    // Calculate habit statistics
    const habitCounts = plantsData.reduce((acc, plant) => {
      if (plant.habit) {
        acc[plant.habit] = (acc[plant.habit] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    const habitStats = Object.entries(habitCounts).map(([name, value], index) => ({
      name,
      value,
      color: COLORS[index % COLORS.length]
    }));

    // Calculate category statistics
    const categoryCountMap = new Map<string, number>();
    plantsData.forEach(plant => {
      plant.categories_list.forEach(category => {
        categoryCountMap.set(category.name, (categoryCountMap.get(category.name) || 0) + 1);
      });
    });

    const categoryStats = Array.from(categoryCountMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    // Calculate conservation statistics
    const conservationCounts = plantsData.reduce((acc, plant) => {
      if (plant.red_list_category) {
        acc[plant.red_list_category] = (acc[plant.red_list_category] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    const conservationStats = Object.entries(conservationCounts).map(([status, count]) => ({
      status,
      count,
      color: CONSERVATION_COLORS[status as keyof typeof CONSERVATION_COLORS] || '#9E9E9E'
    }));

    // Calculate monthly discoveries (simulated data)
    const monthlyDiscoveries = Array.from({ length: 12 }, (_, i) => {
      const date = new Date();
      date.setMonth(i);
      return {
        month: date.toLocaleString('default', { month: 'short' }),
        count: Math.floor(Math.random() * 20) + 1 // Simulated data
      };
    });

    // Calculate geographic distribution (simulated data)
    const geographicDistribution = Array.from(
      new Set(plantsData.map(p => p.location_name).filter(Boolean))
    ).map(region => ({
      region: region as string,
      count: plantsData.filter(p => p.location_name === region).length
    }));

    // Calculate plant traits (simulated data)
    const plantTraits = [
      { trait: 'Height', value: Math.random() * 100 },
      { trait: 'Leaf Size', value: Math.random() * 100 },
      { trait: 'Growth Rate', value: Math.random() * 100 },
      { trait: 'Sunlight', value: Math.random() * 100 },
      { trait: 'Water Needs', value: Math.random() * 100 }
    ];

    // Get environmental data
    const environmentalData = loadEnvironmentalData();

    setStats({
      habitStats,
      categoryStats,
      conservationStats,
      monthlyDiscoveries,
      geographicDistribution,
      plantTraits,
      environmentalData
    });
  }, [loadEnvironmentalData]);

  // Initialize local storage for favorites and cached data
  useEffect(() => {
    // Load favorites
    const storedFavorites = localStorage.getItem('favoritePlants');
    if (storedFavorites) {
      setFavoritePlants(new Set(JSON.parse(storedFavorites).map(Number)));
    }

    // Check for cached plants data
    const cachedPlantsData = localStorage.getItem('cachedPlantsData');
    const cachedTimestamp = localStorage.getItem('cachedTimestamp');
    
    if (cachedPlantsData && cachedTimestamp) {
      const timestamp = parseInt(cachedTimestamp, 10);
      const now = Date.now();
      
      // Use cached data if it's still valid
      if (now - timestamp < CACHE_DURATION) {
        try {
          const parsedData = JSON.parse(cachedPlantsData);
          const uniqueHabits = Array.from(
            new Set(parsedData.map((p: Plant) => p.habit).filter(Boolean))
          ) as PlantHabit[];
          
          const uniqueStatuses = Array.from(
            new Set(parsedData.map((p: Plant) => p.red_list_category).filter(Boolean))
          ) as RedListCategory[];
          
          setHabits(uniqueHabits);
          setRedListStatuses(uniqueStatuses);
          setPlants(parsedData);
          applyClientFilters(parsedData, filters);
          calculateStats(parsedData);
          initialLoadComplete.current = true;
          cacheTimestamp.current = timestamp;
          console.log('Using cached plants data');
        } catch (error) {
          console.error('Error parsing cached data:', error);
          // If there's an error parsing, we'll fetch fresh data
        }
      }
    }
  }, [applyClientFilters, calculateStats, filters]);

  // Save favorites to local storage when they change
  useEffect(() => {
    if (favoritePlants.size > 0) {
      localStorage.setItem('favoritePlants', JSON.stringify(Array.from(favoritePlants)));
    }
  }, [favoritePlants]);

  // Load categories, habits, and locations once on component mount
  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        if (categories.length > 0) return;
        
        setLoading(true);
        
        const categoriesData = (await api.get('/categories')).data;
        const formattedCategories = categoriesData.map((cat: Category) => ({
          value: cat.id,
          label: cat.name
        }));
        setCategories(formattedCategories);
        
        const locationsData = (await api.get('/locations')).data;
        setLocations(locationsData);
        
        // No need to fetch initial plants here as we'll get all data at once
        setLoading(false);
      } catch (error) {
        console.error('Error fetching metadata:', error);
        setError('Failed to load initial data. Please refresh the page.');
        setLoading(false);
      }
    };

    fetchMetadata();
  }, [categories.length]);

  // Fetch all plants data with caching
  const fetchAllPlants = useCallback(async () => {
    // Don't fetch if already loading or if we have valid cached data
    if (loading || (initialLoadComplete.current && cacheTimestamp.current && Date.now() - cacheTimestamp.current < CACHE_DURATION)) {
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // Fetch all plants at once with a large page size
      const response = await api.get('/plants/?page_size=1000');
      const plantsData = response.data.results;
      
      // Extract unique habits and statuses
      const uniqueHabits = Array.from(
        new Set(plantsData.map((p: Plant) => p.habit).filter(Boolean))
      ) as PlantHabit[];
      
      const uniqueStatuses = Array.from(
        new Set(plantsData.map((p: Plant) => p.red_list_category).filter(Boolean))
      ) as RedListCategory[];
      
      setHabits(uniqueHabits);
      setRedListStatuses(uniqueStatuses);
      
      // Set plants and apply filters
      setPlants(plantsData);
      applyClientFilters(plantsData, filters);
      calculateStats(plantsData);
      
      // Cache the data
      const now = Date.now();
      localStorage.setItem('cachedPlantsData', JSON.stringify(plantsData));
      localStorage.setItem('cachedTimestamp', now.toString());
      cacheTimestamp.current = now;
      
      initialLoadComplete.current = true;
      
    } catch (error) {
      console.error('Error fetching plants:', error);
      setError('Failed to load plants. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [loading, filters, applyClientFilters, calculateStats]);

  // Effect for filter changes
  useEffect(() => {
    if (!initialLoadComplete.current) return;
    applyClientFilters(plants, filters);
  }, [filters, plants, applyClientFilters]);

  // Effect for initial data loading
  useEffect(() => {
    if (categories.length > 0 && !initialLoadComplete.current && !loading) {
      fetchAllPlants();
    }
  }, [categories.length, fetchAllPlants, loading]);

  // Handle filter changes
  const handleFilterChange = useCallback((newFilters: Partial<UIPlantFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  // Handle favorite toggle
  const handleFavoriteToggle = useCallback((plantId: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setFavoritePlants(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(plantId)) {
        newFavorites.delete(plantId);
      } else {
        newFavorites.add(plantId);
      }
      return newFavorites;
    });
  }, []);

  // Handle compare toggle
  const handleCompareToggle = useCallback((plantId: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isCompareMode) return;
    
    setSelectedForComparison(prev => {
      const newSelection = new Set(prev);
      if (newSelection.has(plantId)) {
        newSelection.delete(plantId);
      } else {
        if (newSelection.size < 4) {
          newSelection.add(plantId);
        } else {
          alert('You can compare up to 4 plants at a time');
        }
      }
      return newSelection;
    });
  }, [isCompareMode]);

  // Render error state
  const renderError = () => (
    <Alert variant="destructive" className="mb-6">
      <AlertTriangle className="h-4 w-4" />
      <AlertDescription>{error}</AlertDescription>
    </Alert>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {error && renderError()}
        
        {/* Dashboard Header */}
        <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm mb-6">
          <DashboardHeader
            isCompareMode={isCompareMode}
            onCompareToggle={() => setIsCompareMode(!isCompareMode)}
            onRefresh={fetchAllPlants}
          />
          
          {/* Dashboard Tabs */}
          <DashboardTabs
            stats={stats}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            totalPlants={plants.length}
            endangeredCount={plants.filter(p => p.red_list_category && ['EN', 'CR'].includes(p.red_list_category)).length}
            categoriesCount={categories.length}
            favoritesCount={favoritePlants.size}
          />
        </div>
        
        {/* Filter and Search Section */}
        <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm mb-6">
          <FilterSection
            filters={filters}
            categories={categories}
            locations={locations}
            habits={habits}
            redListStatuses={redListStatuses}
            onFilterChange={handleFilterChange}
            onReset={() => setFilters({
              search: '',
              categories: [],
              habits: [],
              redListStatuses: [],
              locationId: null,
              sortBy: 'scientific_name',
              viewMode: 'grid',
              favoriteOnly: false,
              rarityLevel: [0, 100],
            })}
          />

          {/* Plants Display Section */}
          <div className="mt-6">
            {isCompareMode ? (
              <PlantComparison
                selectedPlants={plants.filter(p => selectedForComparison.has(p.id))}
                onExitCompare={() => setIsCompareMode(false)}
              />
            ) : (
              <>
                {filters.viewMode === 'grid' ? (
                  <PlantGrid
                    plants={filteredPlants}
                    favoritePlants={favoritePlants}
                    isCompareMode={isCompareMode}
                    selectedForComparison={selectedForComparison}
                    onFavoriteToggle={handleFavoriteToggle}
                    onCompareToggle={handleCompareToggle}
                  />
                ) : (
                  <PlantList
                    plants={filteredPlants}
                    favoritePlants={favoritePlants}
                    isCompareMode={isCompareMode}
                    selectedForComparison={selectedForComparison}
                    onFavoriteToggle={handleFavoriteToggle}
                    onCompareToggle={handleCompareToggle}
                  />
                )}

                {/* Loading State */}
                {loading && (
                  <div className="flex justify-center my-8">
                    <RefreshCw className="animate-spin h-6 w-6 text-gray-400" />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}