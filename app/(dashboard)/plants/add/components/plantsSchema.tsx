import { z } from 'zod';

// Define the validation schema with Zod
export const plantSchema = z.object({
  // Basic Information
  scientific_name: z.string().min(1, 'Scientific name is required'),
  tamil_name: z.string().optional(),
  herbarium_id: z.string().optional(),
  
  // Taxonomy
  taxonomic_class: z.string().optional(),
  taxonomic_subclass: z.string().optional(),
  taxonomic_order: z.string().optional(),
  family: z.string().optional(),
  subfamily: z.string().optional(),
  genus: z.string().optional(),
  species: z.string().optional(),
  Series: z.string().optional(),

  
  // Collection Information
  collector: z.string().min(1, 'Collector is required'),
  identifier: z.string().min(1, 'Identifier is required'),
  collection_date: z.string().min(1, 'Collection date is required'),
  
  // Classification
  habit: z.string().optional(),
  description: z.string().optional(),
  red_list_category: z.enum(['EX', 'EW', 'CR', 'EN', 'VU', 'NT', 'LC','NIL','NE']),
  uses: z.string().optional(),
  
  // Additional Notes
  ethnobotanical_notes: z.string().optional(),
  remarks: z.string().optional(),
  
  // Location - added to match model
  location: z.coerce.number().min(1, 'Location is Required'),
  
  // Categories - added to match model
  categories: z.array(z.number()).optional(),
  
});