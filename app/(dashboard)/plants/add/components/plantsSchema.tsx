import { z } from 'zod';

// Define the validation schema with Zod
export const plantSchema = z.object({
  // Basic Information
  scientific_name: z.string().min(1, 'Scientific name is required'),
  tamil_name: z.string().optional(),
  herbarium_id: z.string().min(1, 'Herbarium ID is required'),
  
  // Taxonomy
  taxonomic_class: z.string().min(1, 'Class is required'),
  taxonomic_subclass: z.string().min(1,'Sub Class is required'),
  taxonomic_order: z.string().min(1,'Order is required'),
  family: z.string().min(1, 'Family is required'),
  genus: z.string().min(1, 'Genus is required'),
  species: z.string().min(1, 'Species is required'),
  
  // Collection Information
  collector: z.string().min(1, 'Collector is required'),
  identifier: z.string().min(1, 'Identifier is required'),
  collection_date: z.string().min(1, 'Collection date is required'),
  
  // Classification
  habit: z.enum(['Tree', 'Shrub', 'Herb', 'Climber']),
  description: z.string().min(1, 'Description is required'),
  red_list_category: z.enum(['EX', 'EW', 'CR', 'EN', 'VU', 'NT', 'LC']),
  uses: z.string().optional(),
  
  // Phenology
  flowering_period: z.string().optional(),
  fruiting_period: z.string().optional(),
  life_cycle: z.string().optional(),
  
  // Additional Notes
  ethnobotanical_notes: z.string().optional(),
  remarks: z.string().optional(),
  
  // Location - added to match model
  location: z.coerce.number().min(1, 'Location is Required'),
  
  // Categories - added to match model
  categories: z.array(z.number()).optional(),
  
});