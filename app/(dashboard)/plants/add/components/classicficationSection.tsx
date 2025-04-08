import { Control } from 'react-hook-form';
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

type ClassificationSectionProps = {
  control: Control<any>;
  defaultHabit?: string;
  defaultCategory?: string; 
  isEditMode?: boolean;
};

export default function ClassificationSection({ control , defaultCategory , defaultHabit , isEditMode}: ClassificationSectionProps) {
    const [selectedHabit, setSelectedHabit] = useState<string | undefined>(
      defaultHabit ? defaultHabit : undefined
    );
    const [selectedCategory, setSelectedCategory] = useState<string | undefined>(
      defaultCategory ? defaultCategory : undefined
    );
    const [habits, setHabits] = useState([]);
    const [isLoading, setLoading] = useState(true);

    const fetchHabits = async () => {
      try {
        const response = await api.get('/habits/');
        return response.data.habits;
      } catch (error) {
        console.error('Error fetching habits:', error);
        throw error;
      }
    };

    useEffect(() => {
      const getHabits = async () => {
        try {
          const habitsData = await fetchHabits();
          setHabits(habitsData);
        } catch (error) {
          // Handle error
        } finally {
          setLoading(false);
        }
      };
      
      getHabits();
    }, []);


  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Classification</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="habit"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Habit</FormLabel>
              <Select 
                onValueChange={(value) => {
                  field.onChange(value);
                  setSelectedHabit(value);
                }} 
                defaultValue={field.value}
                value={selectedHabit}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select habit" />
                  </SelectTrigger>
                </FormControl>
                {/* <SelectContent>
                  <SelectItem value="Tree">Tree</SelectItem>
                  <SelectItem value="Shrub">Shrub</SelectItem>
                  <SelectItem value="Herb">Herb</SelectItem>
                  <SelectItem value="Climber">Climber</SelectItem>
                </SelectContent> */}
                                <SelectContent>
                  {isLoading ? (
                    <SelectItem value="Loading" disabled>
                      Loading locations...
                    </SelectItem>
                  ) : habits.length === 0 ? (
                    <SelectItem value="No location" disabled>
                      No locations available
                    </SelectItem>
                  ) : (
                    habits.map((habit) => (
                      <SelectItem 
                        key={habit} 
                        value={habit}
                      >
                        {habit}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="red_list_category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Red List Category</FormLabel>
              <Select 
                onValueChange={(value) => {
                  field.onChange(value);
                  setSelectedCategory(value);
                }} 
                defaultValue={field.value}
                value={selectedCategory}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="EX">Extinct (EX)</SelectItem>
                  <SelectItem value="EW">Extinct in the Wild (EW)</SelectItem>
                  <SelectItem value="CR">Critically Endangered (CR)</SelectItem>
                  <SelectItem value="EN">Endangered (EN)</SelectItem>
                  <SelectItem value="VU">Vulnerable (VU)</SelectItem>
                  <SelectItem value="NT">Near Threatened (NT)</SelectItem>
                  <SelectItem value="LC">Least Concern (LC)</SelectItem>
                  <SelectItem value="NE">Not Evaluated (NE)</SelectItem>
                  <SelectItem value="NIL">Not in list(NIL)</SelectItem>
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