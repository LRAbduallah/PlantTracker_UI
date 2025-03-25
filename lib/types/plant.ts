export interface Category {
  id: number;
  name: string;
}

export interface PlantInput {
  scientific_name: string;
  tamil_name?: string;
  herbarium_id: string;
  categories?: number[];
  taxonomic_class: string;
  taxonomic_subclass?: string;
  taxonomic_order?: string;
  family: string;
  genus: string;
  species: string;
  collector: string;
  identifier: string;
  collection_date: string;
  location?: number;
  habit: string;
  description: string;
  red_list_category: string;
  uses?: string;
  flowering_period?: string;
  fruiting_period?: string;
  life_cycle?: string;
  ethnobotanical_notes?: string;
  remarks?: string;
}

export interface Plant extends PlantInput {
  id: number;
  location_name?: string;
  images: string[];
  categories_list: Category[];
  date_added: string;
  last_updated: string;
  rarity_score?: number;
}

export interface PaginatedPlantsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Plant[];
}

export type RedListCategory = 'EX' | 'EW' | 'CR' | 'EN' | 'VU' | 'NT' | 'LC';
export type PlantHabit = 'Tree' | 'Shrub' | 'Herb' | 'Climber';

export interface PlantFilters {
  search?: string;
  habit?: PlantHabit;
  red_list_category?: RedListCategory;
  family?: string;
  genus?: string;
  page?: number;
  ordering?: string;
} 