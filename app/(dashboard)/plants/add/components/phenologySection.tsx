import { Control } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { useEffect, useState } from 'react';

type PhenologySectionProps = {
  control: Control<any>;
  defaultValues?: {
    flowering_period?: string;
    fruiting_period?: string;
    life_cycle?: string;
  };
  isEditMode?: boolean;
};

export default function PhenologySection({ 
  control, 
  defaultValues = {}, 
  isEditMode = false 
}: PhenologySectionProps) {
  const [selectedLifeCycle, setSelectedLifeCycle] = useState<string | undefined>(
    defaultValues.life_cycle
  );

  // Update selected value if default values change
  useEffect(() => {
    if (isEditMode && defaultValues.life_cycle) {
      setSelectedLifeCycle(defaultValues.life_cycle);
    }
  }, [defaultValues.life_cycle, isEditMode]);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">
        {isEditMode ? 'Edit Phenology' : 'Phenology'}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormField
          control={control}
          name="flowering_period"
          defaultValue={defaultValues.flowering_period || ''}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Flowering Period</FormLabel>
              <FormControl>
                <Input 
                  placeholder="e.g., January-March" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="fruiting_period"
          defaultValue={defaultValues.fruiting_period || ''}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fruiting Period</FormLabel>
              <FormControl>
                <Input 
                  placeholder="e.g., April-June" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="life_cycle"
          defaultValue={defaultValues.life_cycle || ''}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Life Cycle</FormLabel>
              <Select
                value={field.value || selectedLifeCycle || ''}
                onValueChange={(newValue) => {
                  field.onChange(newValue);
                  setSelectedLifeCycle(newValue);
                }}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={isEditMode ? "Select or update life cycle" : "Select life cycle"} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Annual">Annual</SelectItem>
                  <SelectItem value="Biennial">Biennial</SelectItem>
                  <SelectItem value="Perennial">Perennial</SelectItem>
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