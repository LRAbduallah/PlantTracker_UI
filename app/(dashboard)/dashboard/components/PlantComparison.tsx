import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plant } from '@/lib/types/plant';
import { Leaf } from 'lucide-react';
import Image from 'next/image';

interface PlantComparisonProps {
  selectedPlants: Plant[];
  onExitCompare: () => void;
}

export function PlantComparison({ selectedPlants, onExitCompare }: PlantComparisonProps) {
  const getConservationBadgeVariant = (status: string | undefined) => {
    if (!status) return 'outline';
    
    switch (status) {
      case 'Least Concern':
        return 'secondary';
      case 'Near Threatened':
        return 'outline';
      case 'Vulnerable':
        return 'default';
      case 'Endangered':
        return 'destructive';
      case 'Critically Endangered':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  if (selectedPlants.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-gray-500">Select up to 4 plants to compare</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mt-4">
      <h2 className="text-xl font-semibold mb-4">Plant Comparison</h2>
      
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50">
              <th className="text-left py-2 px-4 border">Properties</th>
              {selectedPlants.map(plant => (
                <th key={plant.id} className="text-left py-2 px-4 border">
                  {plant.scientific_name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="py-2 px-4 border font-medium">Image</td>
              {selectedPlants.map(plant => (
                <td key={plant.id} className="py-2 px-4 border">
                  <div className="relative h-24 w-24">
                    {plant.images?.[0] ? (
                      <Image
                        src={plant.images[0]}
                        alt={plant.scientific_name}
                        fill
                        className="object-cover rounded-md"
                      />
                    ) : (
                      <div className="h-full w-full bg-gray-200 flex items-center justify-center rounded-md">
                        <Leaf className="text-gray-400" size={20} />
                      </div>
                    )}
                  </div>
                </td>
              ))}
            </tr>
            <tr>
              <td className="py-2 px-4 border font-medium">Scientific Name</td>
              {selectedPlants.map(plant => (
                <td key={plant.id} className="py-2 px-4 border">
                  {plant.scientific_name || '-'}
                </td>
              ))}
            </tr>
            <tr>
              <td className="py-2 px-4 border font-medium">Tamil Name</td>
              {selectedPlants.map(plant => (
                <td key={plant.id} className="py-2 px-4 border">
                  {plant.tamil_name || '-'}
                </td>
              ))}
            </tr>
            <tr>
              <td className="py-2 px-4 border font-medium">Habit</td>
              {selectedPlants.map(plant => (
                <td key={plant.id} className="py-2 px-4 border">
                  {plant.habit || '-'}
                </td>
              ))}
            </tr>
            <tr>
              <td className="py-2 px-4 border font-medium">Conservation Status</td>
              {selectedPlants.map(plant => (
                <td key={plant.id} className="py-2 px-4 border">
                  {plant.red_list_category ? (
                    <Badge variant={getConservationBadgeVariant(plant.red_list_category)}>
                      {plant.red_list_category}
                    </Badge>
                  ) : '-'}
                </td>
              ))}
            </tr>
            <tr>
              <td className="py-2 px-4 border font-medium">Location</td>
              {selectedPlants.map(plant => (
                <td key={plant.id} className="py-2 px-4 border">
                  {plant.location_name || '-'}
                </td>
              ))}
            </tr>
            <tr>
              <td className="py-2 px-4 border font-medium">Categories</td>
              {selectedPlants.map(plant => (
                <td key={plant.id} className="py-2 px-4 border">
                  <div className="flex flex-wrap gap-1">
                    {plant.categories_list.slice(0, 3).map(cat => (
                      <Badge key={cat.id} variant="secondary" className="text-xs">
                        {cat.name}
                      </Badge>
                    ))}
                    {plant.categories_list.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{plant.categories_list.length - 3} more
                      </Badge>
                    )}
                  </div>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
      
      <div className="mt-4 flex justify-end">
        <Button variant="outline" onClick={onExitCompare}>
          Exit Compare Mode
        </Button>
      </div>
    </div>
  );
} 