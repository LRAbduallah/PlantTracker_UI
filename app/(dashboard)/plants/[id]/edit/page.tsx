'use client';

import { useRouter, useParams } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
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
import { usePlant, useUpdatePlant } from '@/lib/hooks/usePlants';
import { PlantInput } from '@/lib/types/plant';
import React from 'react';
import { useImageRemove, useImageUpload } from '@/lib/hooks/useImageUpload';
import { toast } from '@/components/ui/use-toast';
import BasicInformationSection from '../../add/components/baseInfoSection';
import CategorySection from '../../add/components/categorySection';
import ClassificationSection from '../../add/components/classicficationSection';
import CollectionSection from '../../add/components/collectionSection';
import DescriptionSection from '../../add/components/descriptionSection';
import LocationSection from '../../add/components/locationSection';
import AdditionalNotesSection from '../../add/components/notesSection';
import Imageupload from '../../add/components/plantImageUploadSection';
import { plantSchema } from '../../add/components/plantsSchema';
import TaxonomySection from '../../add/components/taxonomySection';

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

// Modify the EditPlantPage to accept no props
export default function EditPlantPage() {
  const router = useRouter();
  const params = useParams();
  const plantId = Number(params.id);
  
  // Constants for image upload
  const imageRegex = /\.(jpeg|jpg|png|gif|webp|avif)$/i;
  
  // Fetch the plant data
  const { data: plant, isLoading, error } = usePlant(plantId);
  const updatePlant = useUpdatePlant(plantId);
  const { mutateAsync: uploadImages } = useImageUpload();
  const removeImage = useImageRemove();
  
  const [files, setFiles] = React.useState<UploadedFile[]>([]);

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
      subfamily:'',
      genus: '',
      species: '',
      Series:'',
      collector: '',
      identifier: '',
      collection_date: new Date().toISOString().split('T')[0],
      habit: '',
      description: '',
      red_list_category: '',
      uses: '',
      ethnobotanical_notes: '',
      remarks: '',
      location: undefined,
      categories: [],
    },
  });

  useEffect(() => {
    if (plant) {
      // Reset form with plant data without checking isDirty'
      form.reset({
        scientific_name: plant.scientific_name || '',
        tamil_name: plant.tamil_name || '',
        herbarium_id: plant.herbarium_id || '',
        taxonomic_class: plant.taxonomic_class || '',
        taxonomic_subclass: plant.taxonomic_subclass || '',
        taxonomic_order: plant.taxonomic_order || '',
        family: plant.family || '',
        subfamily: plant.subfamily || '',
        genus: plant.genus || '',
        species: plant.species || '',
        Series: plant.Series || '',
        collector: plant.collector || '',
        identifier: plant.identifier || '',
        collection_date: plant.collection_date || new Date().toISOString().split('T')[0],
        habit: plant.habit,
        description: plant.description || '',
        red_list_category: plant.red_list_category as "EX" | "EW" | "CR" | "EN" | "VU" | "NT" | "LC" | 'NE' | 'NIL',
        uses: plant.uses || '',
        ethnobotanical_notes: plant.ethnobotanical_notes || '',
        remarks: plant.remarks || '',
        location: plant.location,
        categories: plant.categories || [],
      });
    }
  // Only depend on plant, not form
  }, [plant]);

  useEffect(() => {
    if (plant?.images && Array.isArray(plant.images)) {
      // Force reset the files array whenever plant images change
      setFiles(
        plant.images.map((url, index) => ({
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
    }
  }, [plant?.images]); // Depend specifically on plant.images

  // Handle loading state
  if (isLoading) {
    return (
      <main className="container mx-auto py-6">
        <Card>
          <CardContent className="pt-6">
            <p>Loading plant data...</p>
          </CardContent>
        </Card>
      </main>
    );
  }

  // Handle error state
  if (error) {
    return (
      <main className="container mx-auto py-6">
        <Card>
          <CardContent className="pt-6">
            <p>Error loading plant: {error.message}</p>
            <Button onClick={() => router.push('/plants')} className="mt-4">
              Back to Plants
            </Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  const onSubmit = async (data: PlantFormValues) => {
    try {
      // Step 2: Handle image uploads if new files exist
      const newUploads = files.filter(
        file => !file.isUploading && !file.isDeleting && file.url && !file.url.startsWith('blob:') && 
        (!plant?.images || !plant?.images.includes(file.url))
      );

      const deletedImages = plant?.images?.filter(
        imageUrl => !files.some(file => file.url === imageUrl)
      ) || [];
      
      if (newUploads.length > 0) {
        try {
          // Upload or associate new images with the plant
          await uploadImages({
            plantId,
            imageUrls: newUploads.map(file => file.url)
          });
        } catch (uploadError) {
          console.error('Failed to associate images with plant:', uploadError);
          toast({
            title: 'Warning',
            description: 'Plant was updated but there was an issue with image uploads.',
            variant: 'destructive',
          });
        }
      }

      if (deletedImages.length > 0) {
        try {
          const deletionPromises = deletedImages.map(imageUrl => 
            removeImage.mutateAsync({ plantId, imageUrl })
          );
          
          await Promise.all(deletionPromises);
        } catch (deleteError) {
          console.error('Failed to remove images from plant:', deleteError);
          toast({
            title: 'Warning',
            description: 'Plant was updated but there was an issue removing some images.',
            variant: 'destructive',
          });
        }
      }

      await updatePlant.mutateAsync(data as Partial<PlantInput>);
      
      // Step 3: Navigate to the plant details page or plants listing
      router.push(`/plants`);

    } catch (error) {
      console.error('Error in plant update process:', error);
    }
  };

  return (
    <main className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle>Edit Plant</CardTitle>
          <CardDescription>
            Update the details of {plant?.scientific_name || 'this plant'}.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <BasicInformationSection control={form.control} />
              <TaxonomySection control={form.control} />
              <CollectionSection control={form.control} />
              <ClassificationSection 
              control={form.control} 
              defaultCategory={plant?.red_list_category}
              defaultHabit={plant?.habit}
              isEditMode={true}
              />
              <LocationSection
                control={form.control}
                defaultLocationId={plant?.location}
                isEditMode={true}
              />
              <CategorySection control={form.control} />
              <DescriptionSection control={form.control} />
              {/* <PhenologySection
                control={form.control}
                defaultValues={{
                  life_cycle: plant?.life_cycle
                }}
                isEditMode={true}
              /> */}
              <AdditionalNotesSection control={form.control} />
              <Imageupload files={files} setFiles={setFiles} />
              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push(`/plants/${plantId}`)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={updatePlant.isPending}>
                  {updatePlant.isPending ? 'Updating...' : 'Update Plant'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </main>
  );
}