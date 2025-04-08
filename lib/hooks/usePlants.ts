import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { plantService } from '../services/plant.service';
import { Plant, PlantInput, PlantFilters } from '../types/plant';
import { toast } from '@/components/ui/use-toast';

export function usePlants(filters?: PlantFilters) {
  return useQuery({
    queryKey: ['plants', filters],
    queryFn: () => plantService.getPlants(filters),
  });
}

export function usePlant(id: number) {
  return useQuery({
    queryKey: ['plant', id],
    queryFn: () => plantService.getPlantById(id),
    enabled: !!id,
  });
}

export function useCreatePlant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (plant: PlantInput) => plantService.createPlant(plant),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plants'] });
      toast({
        title: 'Success',
        description: 'Plant created successfully',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create plant',
        variant: 'destructive',
      });
    },
  });
}

export function useUpdatePlant(id: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (plant: Partial<PlantInput>) => plantService.updatePlant(id, plant),
    onSuccess: (updatedPlant: Plant) => {
      queryClient.invalidateQueries({ queryKey: ['plants'] });
      queryClient.invalidateQueries({ queryKey: ['plant', id] });
      toast({
        title: 'Success',
        description: 'Plant updated successfully',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update plant',
        variant: 'destructive',
      });
    },
  });
}

export function useDeletePlant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => plantService.deletePlant(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plants'] });
      toast({
        title: 'Success',
        description: 'Plant deleted successfully',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete plant',
        variant: 'destructive',
      });
    },
  });
}

export function useSearchPlants(query: string) {
  return useQuery({
    queryKey: ['plants', 'search', query],
    queryFn: () => plantService.searchPlants(query),
    enabled: !!query,
  });
}

export function usePlantsByFamily(family: string) {
  return useQuery({
    queryKey: ['plants', 'family', family],
    queryFn: () => plantService.getPlantsByFamily(family),
    enabled: !!family,
  });
}

export function usePlantsByGenus(genus: string) {
  return useQuery({
    queryKey: ['plants', 'genus', genus],
    queryFn: () => plantService.getPlantsByGenus(genus),
    enabled: !!genus,
  });
}

export function usePlantsByRedListCategory(category: string) {
  return useQuery({
    queryKey: ['plants', 'redList', category],
    queryFn: () => plantService.getPlantsByRedListCategory(category),
    enabled: !!category,
  });
}

export function usePlantsByHabit(habit: string) {
  return useQuery({
    queryKey: ['plants', 'habit', habit],
    queryFn: () => plantService.getPlantsByHabit(habit),
    enabled: !!habit,
  });
}

export function usePlantsByClass(classs: string) {
  return useQuery({
    queryKey: ['plants', 'classs', classs],
    queryFn: () => plantService.getPlantsByClass(classs),
    enabled: !!classs,
  });
}

export function usePlantsBySubClass(subclass: string) {
  return useQuery({
    queryKey: ['plants', 'subclass', subclass],
    queryFn: () => plantService.getPlantsBySubClass(subclass),
    enabled: !!subclass,
  });
}

export function useAddPlantImage() {
  const queryClient = useQueryClient();

  return useMutation<string[], Error, { id: number; url: string }>({
    mutationFn: ({ id, url }) => plantService.addImageUrl(id, url),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['plant', variables.id] });
      toast({
        title: 'Success',
        description: 'Image added successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to add image',
        variant: 'destructive',
      });
    },
  });
}

export function useRemovePlantImage() {
  const queryClient = useQueryClient();

  return useMutation<string[], Error, { id: number; url: string }>({
    mutationFn: ({ id, url }) => plantService.removeImageUrl(id, url),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['plant', variables.id] });
      toast({
        title: 'Success',
        description: 'Image removed successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to remove image',
        variant: 'destructive',
      });
    },
  });
} 