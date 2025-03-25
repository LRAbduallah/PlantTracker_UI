import { Control } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

type CollectionSectionProps = {
  control: Control<any>;
};

export default function CollectionSection({ control }: CollectionSectionProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Collection Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormField
          control={control}
          name="collector"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Collector *</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="identifier"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Identifier *</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="collection_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Collection Date *</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}