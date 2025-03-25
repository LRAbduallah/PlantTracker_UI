import api from './api';
import { Plant, PlantInput, PaginatedPlantsResponse, PlantFilters } from '../types/plant';
import { AxiosResponse } from 'axios';

class PlantService {
  private static instance: PlantService;
  private readonly baseUrl = '/plants';

  private constructor() {}

  public static getInstance(): PlantService {
    if (!PlantService.instance) {
      PlantService.instance = new PlantService();
    }
    return PlantService.instance;
  }

  // Get all plants with optional filters
  async getPlants(filters?: PlantFilters): Promise<PaginatedPlantsResponse> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, value.toString());
        }
      });
    }
    const response: AxiosResponse<PaginatedPlantsResponse> = await api.get(
      `${this.baseUrl}/?${params.toString()}`
    );
    return response.data;
  }

  // Get a single plant by ID
  async getPlantById(id: number): Promise<Plant> {
    const response: AxiosResponse<Plant> = await api.get(`${this.baseUrl}/${id}/`);
    return response.data;
  }

  // Create a new plant
  async createPlant(plant: PlantInput): Promise<Plant> {
    const response: AxiosResponse<Plant> = await api.post(this.baseUrl + '/', plant);
    return response.data;
  }

  // Update a plant
  async updatePlant(id: number, plant: Partial<PlantInput>): Promise<Plant> {
    const response: AxiosResponse<Plant> = await api.put(`${this.baseUrl}/${id}/`, plant);
    return response.data;
  }

  // Delete a plant
  async deletePlant(id: number): Promise<void> {
    await api.delete(`${this.baseUrl}/${id}/`);
  }

  // Get plants by family
  async getPlantsByFamily(family: string): Promise<Plant[]> {
    const response: AxiosResponse<Plant[]> = await api.get(`${this.baseUrl}/by_family/`, {
      params: { family },
    });
    return response.data;
  }

  // Get plants by genus
  async getPlantsByGenus(genus: string): Promise<Plant[]> {
    const response: AxiosResponse<Plant[]> = await api.get(`${this.baseUrl}/by_genus/`, {
      params: { genus },
    });
    return response.data;
  }

  // Get plants by red list category
  async getPlantsByRedListCategory(category: string): Promise<Plant[]> {
    const response: AxiosResponse<Plant[]> = await api.get(`${this.baseUrl}/red_list/`, {
      params: { category },
    });
    return response.data;
  }

  // Get plants by habit
  async getPlantsByHabit(habit: string): Promise<PaginatedPlantsResponse>  {
    const response: AxiosResponse<PaginatedPlantsResponse> = await api.get(`${this.baseUrl}/by_habit/`, {
      params: { habit },
    });
    return response.data
  }

  // Add image URL to a plant
  async addImageUrl(id: number, url: string): Promise<string[]> {
    const response: AxiosResponse<string[]> = await api.post(`${this.baseUrl}/${id}/add_image/`, {
      url,
    });
    return response.data;
  }

  // Remove image URL from a plant
  async removeImageUrl(id: number, url: string): Promise<string[]> {
    const response: AxiosResponse<string[]> = await api.delete(`${this.baseUrl}/${id}/remove_image/`, {
      data: { url },
    });
    return response.data;
  }

  // Get plant taxonomy
  async getPlantTaxonomy(id: number): Promise<any> {
    const response: AxiosResponse = await api.get(`${this.baseUrl}/${id}/taxonomy/`);
    return response.data;
  }

  // Search plants
  async searchPlants(query: string): Promise<Plant[]> {
    const response: AxiosResponse<Plant[]> = await api.get(`${this.baseUrl}/search/`, {
      params: { q: query },
    });
    return response.data;
  }
}

export const plantService = PlantService.getInstance();
export default plantService; 