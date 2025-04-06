import { Control } from 'react-hook-form';
import { Button } from '@/components/ui/button'; // Assuming you're using a Button component
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';

type AdditionalNotesSectionProps = {
  control: Control<any>;
//   createPlant: { isPending: boolean };
};

export default function AdditionalNotesSection({ control }: AdditionalNotesSectionProps) {

  return (
    <div className="space-y-4">
      {/* Additional Notes Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Additional Notes</h3>
        <div className="space-y-4">
          
          {/* Remarks */}
          <FormField
            control={control}
            name="remarks"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Remarks</FormLabel>
                <FormControl>
                  <Textarea className="min-h-[100px]" placeholder="Enter any additional remarks" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      {/* Action Buttons */}
      {/* <div className="flex justify-end space-x-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/plants')} // Navigate to '/plants' on cancel
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={createPlant.isPending} // Disable button while creating
        >
          {createPlant.isPending ? 'Creating...' : 'Create Plant'}
        </Button>
      </div> */}
    </div>
  );
}
