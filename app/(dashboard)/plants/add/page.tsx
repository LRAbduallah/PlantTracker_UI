'use client';

import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Form,
} from '@/components/ui/form';
import { useCreatePlant } from '@/lib/hooks/usePlants';
import { PlantInput } from '@/lib/types/plant';
import { plantSchema } from './components/plantsSchema';
import BasicInformationSection from './components/baseInfoSection';
import CategorySection from './components/categorySection';
import ClassificationSection from './components/classicficationSection';
import CollectionSection from './components/collectionSection';
import DescriptionSection from './components/descriptionSection';
import LocationSection from './components/locationSection';
import AdditionalNotesSection from './components/notesSection';
import TaxonomySection from './components/taxonomySection';
import Imageupload from './components/plantImageUploadSection';
import React from 'react';
import { useImageUpload } from '@/lib/hooks/useImageUpload';

// Infer TypeScript type from the schema
type PlantFormValues = typeof plantSchema._type;

export interface UploadedFile {
  id: string;
  url: string;
  publicId: string;
  progress: number;
  fileType: string;
  isUploading: boolean;
  isDeleting: boolean;
}

export default function AddPlantPage() {
  const router = useRouter();
  const createPlant = useCreatePlant();
  const { mutateAsync: uploadImages, isPending } = useImageUpload();
  let value: string[] = [];
  const imageRegex = /\.(jpeg|jpg|png|gif|webp|avif)$/i;
  const [files, setFiles] = React.useState<UploadedFile[]>(() =>
    value.map((url: string, index: number) => ({
      id: `${index}-${Date.now()}`,
      url,
      publicId: '',
      progress: 100,
      fileType: imageRegex.test(url)
        ? `image/${url.split(".").pop()?.toLowerCase() || "jpeg"}`
        : "application/octet-stream",
      isUploading: false,
      isDeleting: false,
    }))
  );
  
  // Initialize form with React Hook Form and Zod resolver
  const form = useForm<PlantFormValues>({
    resolver: zodResolver(plantSchema),
    defaultValues: {
      scientific_name: '',
      tamil_name: '',
      herbarium_id: '',
      taxonomic_class: '',
      taxonomic_subclass: '',
      taxonomic_order: '',
      family: '',
      genus: '',
      species: '',
      Series:'',
      subfamily:'',
      collector: '',
      identifier: '',
      collection_date: new Date().toISOString().split('T')[0],
      habit: 'Tree',
      description: '',
      red_list_category: 'LC',
      uses: '',
      ethnobotanical_notes: '',
      remarks: '',
      location: undefined,
      categories: [],
      // image_urls: ''
    },
  });

  // const onSubmit = async (data: PlantFormValues) => {
  //   try {
  //     await createPlant.mutateAsync(data as PlantInput);
  //     router.push('/plants');
  //   } catch (error) {
  //     console.error('Error creating plant:', error);
  //   }
  // };

  const onSubmit = async (data: PlantFormValues) => {
    try {
      // Step 1: Create the plant
      const createdPlant = await createPlant.mutateAsync(data as PlantInput);
      
      if (!createdPlant?.id) {
        console.error('Plant created but no ID returned');
        router.push('/plants');
        return;
      }
      
      // Step 2: Handle image uploads if files exist
      if (files.length > 0) {
        // Get completed uploads that have URLs (not blob URLs from in-progress uploads)
        const completedUploads = files.filter(
          file => !file.isUploading && !file.isDeleting && file.url && !file.url.startsWith('blob:')
        );
        
        if (completedUploads.length > 0) {
          try {
            // Upload or associate images with the newly created plant
            await uploadImages({
              plantId: createdPlant.id,
              imageUrls: completedUploads.map(file => file.url)
            });
          } catch (uploadError) {
            console.error('Failed to associate images with plant:', uploadError);
            // Plant was still created, so we continue with navigation
          }
        }
      }
      
      // Step 3: Navigate to the plants page
      router.push('/plants');
    } catch (error) {
      console.error('Error in plant creation process:', error);
    }
  };

  return (
    <main className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle>Add New Plant</CardTitle>
          <CardDescription>
            Enter the details of the new plant to add to the collection.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <BasicInformationSection control={form.control} />
              <TaxonomySection control={form.control} />
              <CollectionSection control={form.control} />
              <ClassificationSection control={form.control} />
              <LocationSection control={form.control} />
              <CategorySection control={form.control} />
              <DescriptionSection control={form.control} />
              {/* <PhenologySection control={form.control} /> */}
              <AdditionalNotesSection control={form.control} />
              <Imageupload files={files} setFiles={setFiles}/>
              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push('/plants')}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={createPlant.isPending}
                >
                  {createPlant.isPending ? 'Creating...' : 'Create Plant'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </main>
  );
}