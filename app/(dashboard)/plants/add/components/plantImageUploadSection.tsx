import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { z } from 'zod';
import { MultiImageUpload } from '@/components/ui/imageupload';
import { UploadedFile } from '../page';

interface ImageuploadProps {
  onChange?: (images: string[]) => void;
  files: UploadedFile[];
  setFiles: React.Dispatch<React.SetStateAction<UploadedFile[]>>;
  maxImages?: number;
  className?: string;
  name?: string;
  imageRegex?: RegExp;
  accept?: string;
}

const schema = z.object({
  images: z.array(z.string().url()).min(1).max(5),
});

export default function Imageupload({ onChange , files , setFiles}: ImageuploadProps) {
  const form = useForm({ 
    resolver: zodResolver(schema), 
    defaultValues: { images: [] } 
  });

  // Add effect to propagate changes to parent
  useEffect(() => {
    onChange?.(form.watch('images'));
  }, [form.watch('images'), onChange]);

  return (
        <FormField
          control={form.control}
          name="images"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Images</FormLabel>
              <FormControl>
                <MultiImageUpload 
                  value={field.value} 
                  onChange={field.onChange} 
                  maxImages={5} 
                  files={files}
                  setFiles={setFiles}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
  );
} 