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

type ClassificationSectionProps = {
  control: Control<any>;
};

export default function ClassificationSection({ control }: ClassificationSectionProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Classification</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="habit"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Habit *</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select habit" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Tree">Tree</SelectItem>
                  <SelectItem value="Shrub">Shrub</SelectItem>
                  <SelectItem value="Herb">Herb</SelectItem>
                  <SelectItem value="Climber">Climber</SelectItem>
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
              <FormLabel>Red List Category *</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
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