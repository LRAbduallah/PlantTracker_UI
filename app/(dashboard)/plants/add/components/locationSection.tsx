import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useEffect, useState } from 'react';
import api from '@/lib/services/api';
import { Control } from 'react-hook-form';

type LocationSectionProps = {
  control: Control<any>;
  defaultLocationId?: number; // Optional default location ID for edit mode
  isEditMode?: boolean; // Flag to indicate if component is in edit mode
};

type Location = {
  id: number;
  name: string;
};

export default function LocationSection({ 
  control, 
  defaultLocationId,
  isEditMode = false 
}: LocationSectionProps) {
  const [locations, setLocations] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<number | undefined>(
    defaultLocationId ? defaultLocationId : undefined
  );

  useEffect(() => {
    // Fetch locations from API
    const fetchLocations = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await api.get('/locations/');
        
        if (response.data && Array.isArray(response.data)) {
          setLocations(response.data);
          
          // If in edit mode and we have a defaultLocationId, validate it exists
          if (isEditMode && defaultLocationId) {
            const locationExists = response.data.some(
              (loc: Location) => loc.id.toString() === defaultLocationId.toString()
            );
            
            if (!locationExists) {
              console.warn(`Default location ID ${defaultLocationId} not found in locations list`);
            }
          }
        } else {
          console.error('Unexpected API response format:', response.data);
          setError('Failed to load locations: Invalid data format');
        }
      } catch (error) {
        console.error('Error fetching locations:', error);
        setError('Failed to load locations. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchLocations();
  }, [defaultLocationId, isEditMode]);

  // Set default field value when in edit mode and locations are loaded
  useEffect(() => {
    if (isEditMode && defaultLocationId && locations.length > 0) {
      setSelectedLocation(defaultLocationId);
    }
  }, [defaultLocationId, isEditMode, locations]);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">
        {isEditMode ? 'Edit Location' : 'Location'}
      </h3>
      <div className="grid grid-cols-1 gap-4">
        <FormField
          control={control}
          name="location"
          defaultValue={defaultLocationId}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Collection Location *</FormLabel>
              <Select 
                disabled={isLoading}
                defaultValue={field.value}
                value={field.value?.toString() || selectedLocation || ""}
                onValueChange={(newValue) => {
                  console.log(newValue)
                  field.onChange(newValue);
                  setSelectedLocation(Number(newValue));
                }}
              >
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={isEditMode ? "Select or update location" : "Select a location"} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {error ? (
                    <SelectItem value="Error" disabled>
                      {error}
                    </SelectItem>
                  ) : isLoading ? (
                    <SelectItem value="Loading" disabled>
                      Loading locations...
                    </SelectItem>
                  ) : locations.length === 0 ? (
                    <SelectItem value="No location" disabled>
                      No locations available
                    </SelectItem>
                  ) : (
                    locations.map((location) => (
                      <SelectItem 
                        key={location.id} 
                        value={location.id.toString()}
                      >
                        {location.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}