import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { MultiSelect } from '@/components/ui/multiselect';
import { Search, GridIcon, ListFilter, Map } from 'lucide-react';
import { PlantFilters } from './types';
import { PlantHabit, RedListCategory } from '@/lib/types/plant';

interface FilterSectionProps {
  filters: PlantFilters;
  categories: { value: number; label: string; }[];
  locations: { id: number; name: string; }[];
  habits: PlantHabit[];
  redListStatuses: RedListCategory[];
  onFilterChange: (newFilters: Partial<PlantFilters>) => void;
  onReset: () => void;
}

export function FilterSection({
  filters,
  categories,
  locations,
  habits,
  redListStatuses,
  onFilterChange,
  onReset,
}: FilterSectionProps) {
  // Convert number[] to string[] for MultiSelect
  const categoryValues = filters.categories.map(String);
  const categoryOptions = categories.map(cat => ({
    value: String(cat.value),
    label: cat.label
  }));

  // Convert PlantHabit[] to string[] for MultiSelect
  const habitOptions = habits.map(h => ({
    value: h,
    label: h
  }));

  // Convert RedListCategory[] to string[] for MultiSelect
  const statusOptions = redListStatuses.map(s => ({
    value: s,
    label: s
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
        <div className="flex-grow">
          <Input
            type="search"
            placeholder="Search plants..."
            value={filters.search}
            onChange={(e) => onFilterChange({ search: e.target.value })}
            className="w-full"
          />
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className={filters.viewMode === 'grid' ? 'bg-accent' : ''}
            onClick={() => onFilterChange({ viewMode: 'grid' })}
          >
            <GridIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className={filters.viewMode === 'list' ? 'bg-accent' : ''}
            onClick={() => onFilterChange({ viewMode: 'list' })}
          >
            <ListFilter className="h-4 w-4" />
          </Button>
        </div>
        
        <Select 
          value={filters.sortBy} 
          onValueChange={(value) => onFilterChange({ sortBy: value })}
        >
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="scientific_name">Scientific Name (A-Z)</SelectItem>
            <SelectItem value="scientific_name_desc">Scientific Name (Z-A)</SelectItem>
            <SelectItem value="conservation_status">Conservation Status</SelectItem>
            <SelectItem value="recently_added">Recently Added</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-4">
        <div className="flex flex-wrap gap-4">
          <div className="flex-grow md:flex-grow-0 md:w-64">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Categories
            </label>
            <MultiSelect
              options={categoryOptions}
              value={categoryValues}
              onChange={(value) => onFilterChange({ categories: value.map(Number) })}
              placeholder="Select categories..."
              truncateCount={1}
              className="w-full"
            />
          </div>
          
          <div className="flex-grow md:flex-grow-0 md:w-64">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Habit
            </label>
            <MultiSelect
              options={habitOptions}
              value={filters.habits}
              onChange={(value) => onFilterChange({ habits: value as PlantHabit[] })}
              placeholder="Select habits..."
              truncateCount={1}
              className="w-full"
            />
          </div>
          
          <div className="flex-grow md:flex-grow-0 md:w-64">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Conservation Status
            </label>
            <MultiSelect
              options={statusOptions}
              value={filters.redListStatuses}
              onChange={(value) => onFilterChange({ redListStatuses: value as RedListCategory[] })}
              placeholder="Select statuses..."
              truncateCount={1}
              className="w-full"
            />
          </div>
          
          <div className="flex-grow md:flex-grow-0 md:w-64">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <Select 
              value={String(filters.locationId || '')} 
              onValueChange={(value) => onFilterChange({ locationId: value ? Number(value) : null })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent>
                {locations.map(loc => (
                  <SelectItem key={loc.id} value={String(loc.id)}>{loc.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex-grow md:flex-grow-0">
            <Label htmlFor="favorite-only" className="flex items-center gap-2 cursor-pointer">
              <Switch
                id="favorite-only"
                checked={filters.favoriteOnly}
                onCheckedChange={(checked) => onFilterChange({ favoriteOnly: checked })}
              />
              <span>Show favorites only</span>
            </Label>
          </div>

          <div className="flex-grow">
            {/* <Label className="block text-sm font-medium text-gray-700 mb-2">
              Rarity Level
            </Label>
            <Slider
              value={filters.rarityLevel}
              onValueChange={(value) => onFilterChange({ rarityLevel: value })}
              max={100}
              step={1}
              className="w-full md:w-[200px]"
            /> */}
          </div>

          <Button variant="outline" onClick={onReset}>
            Reset Filters
          </Button>
        </div>
      </div>
    </div>
  );
}