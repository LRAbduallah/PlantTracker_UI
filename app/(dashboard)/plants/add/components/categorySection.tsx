import { Control } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { useEffect, useState } from 'react';
import api from '@/lib/services/api';

type CategorySectionProps = {
  control: Control<any>;
};

type Category = {
  id: number;
  name: string;
};

export default function CategorySection({ control }: CategorySectionProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch categories from API
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        // Replace with your actual API endpoint
        const response = await api.get('/categories/');
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Categories</h3>
      <div className="space-y-4">
        <FormField
          control={control}
          name="categories"
          render={({ field }) => (
            <FormItem>
              <div className="mb-4">
                <FormLabel>Plant Categories</FormLabel>
              </div>
              {isLoading ? (
                <div>Loading categories...</div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {categories.map((category) => (
                    <div key={category.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`category-${category.id}`}
                        checked={field.value?.includes(category.id)}
                        onCheckedChange={(checked) => {
                          const updatedCategories = checked 
                            ? [...(field.value || []), category.id]
                            : (field.value || []).filter(
                                (id: number) => id !== category.id
                              );
                          field.onChange(updatedCategories);
                        }}
                      />
                      <label
                        htmlFor={`category-${category.id}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {category.name}
                      </label>
                    </div>
                  ))}
                </div>
              )}
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}