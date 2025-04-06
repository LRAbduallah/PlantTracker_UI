import { Control } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';

type DescriptionSectionProps = {
  control: Control<any>;
};

export default function DescriptionSection({ control }: DescriptionSectionProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Description and Uses</h3>
      <div className="space-y-4">
        <FormField
          control={control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea className="min-h-[100px]" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="uses"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Uses</FormLabel>
              <FormControl>
                <Textarea className="min-h-[100px]" placeholder="Medicinal, ornamental, etc." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Ethnobotanical Notes */}
        <FormField
            control={control}
            name="ethnobotanical_notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Useful Part</FormLabel>
                <FormControl>
                  <Textarea className="min-h-[100px]" placeholder="Enter Useful Parts" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
      </div>
    </div>
  );
}