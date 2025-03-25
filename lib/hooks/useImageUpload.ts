import { useMutation } from '@tanstack/react-query';
import api from '../services/api';

interface ImageUploadResponse {
  urls: string[];
}

export const useImageUpload = () => {
  return useMutation({
    mutationFn: async ({ 
      plantId, 
      images, 
      imageUrls 
    }: { 
      plantId: number; 
      images?: File[]; 
      imageUrls?: string[] 
    }) => {
      if (images && images.length > 0) {
        // Upload actual File objects
        const promises = images.map(async (image) => {
          const formData = new FormData();
          formData.append('image', image);

          const response = await api.post(`/plants/${plantId}/upload_image/`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });

          return response.data;
        });

        const results = await Promise.all(promises);
        return results as ImageUploadResponse[];
      } 
      else if (imageUrls && imageUrls.length > 0) {
        // Send existing URLs to associate with the plant
        const response = await api.post(`/plants/${plantId}/add_image/`, {
          url:imageUrls
        });
        
        return response.data;
      }
      
      return [] as ImageUploadResponse[];
    },
  });
};

export const useImageRemove = () => {
  return useMutation({
    mutationFn: async ({ 
      plantId, 
      imageUrl 
    }: { 
      plantId: number; 
      imageUrl: string 
    }) => {
      const response = await api.delete(`/plants/${plantId}/remove_image/`, {
        data: { url: imageUrl }
      });
      
      return response.data;
    },
  });
}