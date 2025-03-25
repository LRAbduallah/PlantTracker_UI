import { Plant, Category, PlantHabit, RedListCategory } from '@/lib/types/plant';

// Define interface for UI filter state (different from API filters)
export interface PlantFilters {
  search: string;
  categories: number[];
  habits: PlantHabit[];
  redListStatuses: RedListCategory[];
  locationId: number | null;
  sortBy: string;
  viewMode: 'grid' | 'list' | 'map';
  favoriteOnly: boolean;
  rarityLevel: number[];
}

// Interface for environmental statistics
export interface EnvStats {
  month: string;
  temperature: number;
  humidity: number;
  rainfall: number;
}

// Interface for the stats data structure
export interface DashboardStats {
  habitStats: Array<{ name: string; value: number; color: string }>;
  categoryStats: Array<{ name: string; count: number }>;
  conservationStats: Array<{ status: string; count: number; color: string }>;
  monthlyDiscoveries: Array<{ month: string; count: number }>;
  geographicDistribution: Array<{ region: string; count: number }>;
  plantTraits: Array<{ trait: string; value: number }>;
  environmentalData: EnvStats[];
}

export interface DashboardProps {
  plants: Plant[];
  stats: DashboardStats;
  filters: PlantFilters;
  loading: boolean;
  error: string | null;
  categories: { value: number; label: string; }[];
  locations: { id: number; name: string; }[];
  habits: PlantHabit[];
  redListStatuses: RedListCategory[];
  favoritePlants: Set<number>;
  onFilterChange: (newFilters: Partial<PlantFilters>) => void;
  onFavoriteToggle: (plantId: number) => void;
  onRefresh: () => void;
}

export const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82ca9d', '#ffc658', '#8dd1e1'];

export const CONSERVATION_COLORS = {
  'LC': '#4CAF50', // Least Concern
  'NT': '#FFC107', // Near Threatened
  'VU': '#FF9800', // Vulnerable
  'EN': '#FF5722', // Endangered
  'CR': '#F44336', // Critically Endangered
  'EW': '#9C27B0', // Extinct in the Wild
  'EX': '#000000', // Extinct
  'DD': '#9E9E9E', // Data Deficient
  'NE': '#607D8B', // Not Evaluated
} as const;