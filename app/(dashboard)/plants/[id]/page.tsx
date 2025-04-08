'use client';

import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import plantService from '@/lib/services/plant.service';
import Image from 'next/image';
import { Plant } from '@/lib/types/plant';
import { useParams } from 'next/navigation';

export default function PlantView() {
  // Parse the plant ID
  const params = useParams();
  const plantId = Number(params.id);
  
  // Define state types
  const [plant, setPlant] = useState<Plant | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Fetch plant data effect
  useEffect(() => {
    const fetchPlantData = async () => {
      try {
        setIsLoading(true);
        const data = await plantService.getPlantById(plantId);
        setPlant(data);
      } catch (err) {
        // Ensure error is an Error object
        setError(err instanceof Error ? err : new Error('Failed to fetch plant data'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlantData();
  }, [plantId]);

  // Loading state
  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center">
      Loading...
    </div>
  );

  // Error state
  if (error) return (
    <div className="min-h-screen flex items-center justify-center text-red-500">
      Error: {error.message}
    </div>
  );

  // No plant found
  if (!plant) return (
    <div className="min-h-screen flex items-center justify-center">
      Plant not found
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <article className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow-sm space-y-8">
        {/* Header Section */}
        <header className="space-y-4">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold text-gray-900 italic">{plant.scientific_name}</h1>
            {plant.red_list_category && (
              <Badge variant="destructive">
                {plant.red_list_category}
              </Badge>
            )}
          </div>
          <h2 className="text-xl text-gray-600">{plant.tamil_name}</h2>
          <div className="flex flex-wrap gap-2">
            {plant.categories_list.map((category) => (
              <Badge key={category.id} variant="secondary">
                {category.name}
              </Badge>
            ))}
          </div>
        </header>

        {/* Image Gallery */}
        {plant.images && plant.images.length > 0 && (
          <div className={`grid ${
            plant.images.length === 1 ? 'grid-cols-1' : 
            plant.images.length === 2 ? 'grid-cols-2' :
            plant.images.length === 3 ? 'grid-cols-2' :
            'grid-cols-2'
          } gap-4`}>
            {plant.images.map((image, index) => (
              <div 
                key={index} 
                className={`relative ${
                  plant.images.length === 3 && index === 0 ? 'col-span-2' : ''
                } aspect-video rounded-lg overflow-hidden`}
              >
                <Image
                  src={image}
                  alt={`${plant.scientific_name} - Image ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        )}

        {/* Quick Info */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
          <div>
            <p className="text-sm text-gray-500">Herbarium ID</p>
            <p className="font-medium">{plant.herbarium_id || 'Not specified'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Habit</p>
            <p className="font-medium">{plant.habit || 'Not specified'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Life Cycle</p>
            <p className="font-medium">{plant.life_cycle || 'Not specified'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Location</p>
            <p className="font-medium">{plant.location_name || 'Not specified'}</p>
          </div>
        </div>

        {/* Description */}
        <section className="prose max-w-none">
          <h3 className="text-xl font-semibold mb-3">Description</h3>
          <p className="text-gray-700">{plant.description}</p>
        </section>

        {/* Taxonomy */}
        <section className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-4">Taxonomic Classification</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              ['Class', plant.taxonomic_class],
              ['Subclass', plant.taxonomic_subclass],
              ['Series', plant.Series],
              ['Order', plant.taxonomic_order],
              ['Family', plant.family],
              ['Subfamily', plant.subfamily],
              ['Genus', plant.genus],
              ['Species', plant.species],
            ].map(([label, value]) => (
              <div key={label} className="space-y-1">
                <p className="text-sm text-gray-500">{label}</p>
                <p className="font-medium">{value}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Uses and Periods */}
        <section className="space-y-6">
          <div className="prose max-w-none">
            <h3 className="text-xl font-semibold mb-3">Uses</h3>
            <p className="whitespace-pre-line text-gray-700">{plant.uses}</p>
          </div>

          <div className="prose max-w-none">
            <h3 className="text-xl font-semibold mb-3">Useful Parts</h3>
            <p className="whitespace-pre-line text-gray-700">{plant.ethnobotanical_notes}</p>
          </div>

        </section>

        {/* Remarks */}
        {plant.remarks && (
          <section className="prose max-w-none">
            <h3 className="text-xl font-semibold mb-3">Remarks</h3>
            <p className="text-gray-700">{plant.remarks}</p>
          </section>
        )}

        {/* Footer */}
        <footer className="text-sm text-gray-500 border-t pt-4 space-y-1">
          <p>Collection Date: {new Date(plant.collection_date).toLocaleDateString()}</p>
          <p>Collected by: {plant.collector} | Identified by: {plant.identifier}</p>
          <p>Last updated: {new Date(plant.last_updated).toLocaleString()}</p>
        </footer>
      </article>
    </div>
  );
}