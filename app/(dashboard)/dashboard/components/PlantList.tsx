import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plant } from '@/lib/types/plant';
import { Heart, Leaf, CheckCircle2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface PlantListProps {
  plants: Plant[];
  favoritePlants: Set<number>;
  isCompareMode: boolean;
  selectedForComparison: Set<number>;
  onFavoriteToggle: (plantId: number, e: React.MouseEvent) => void;
  onCompareToggle: (plantId: number, e: React.MouseEvent) => void;
}

export function PlantList({
  plants,
  favoritePlants,
  isCompareMode,
  selectedForComparison,
  onFavoriteToggle,
  onCompareToggle,
}: PlantListProps) {
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

  return (
    <div className="space-y-2">
      {plants.map((plant) => (
        <Link href={`/plants/${plant.id}`} key={plant.id} className="relative">
          <Card className="hover:shadow-md transition-shadow mb-2">
            <div className="flex items-center p-3">
              <div className="relative h-16 w-16 mr-4 flex-shrink-0">
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
              
              <div className="flex-grow">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium italic">{plant.scientific_name}</h3>
                  <div className="flex items-center gap-2">
                    {plant.red_list_category && (
                      <Badge variant={getConservationBadgeVariant(plant.red_list_category)}>
                        {plant.red_list_category}
                      </Badge>
                    )}
                    
                    {/* Favorite button */}
                    {/* <button onClick={(e) => onFavoriteToggle(plant.id, e)}>
                      <Heart 
                        size={16} 
                        className={favoritePlants.has(plant.id) ? "fill-red-500 text-red-500" : "text-gray-400"} 
                      />
                    </button> */}
                    
                    {/* Compare checkbox */}
                    {isCompareMode && (
                      <button onClick={(e) => onCompareToggle(plant.id, e)}>
                        <CheckCircle2 
                          size={16} 
                          className={selectedForComparison.has(plant.id) ? "fill-blue-500 text-white" : "text-gray-400"} 
                        />
                      </button>
                    )}
                  </div>
                </div>
                
                <div className="text-sm text-gray-500 mt-1">
                  {plant.scientific_name && <span className="mr-3">Common: {plant.scientific_name}</span>}
                  {plant.habit && <span className="mr-3">Habit: {plant.habit}</span>}
                  {plant.location_name && <span>Location: {plant.location_name}</span>}
                </div>
                
                <div className="flex flex-wrap gap-1 mt-2">
                  {plant.categories_list.slice(0, 2).map((category) => (
                    <Badge key={category.id} variant="secondary" className="text-xs">
                      {category.name}
                    </Badge>
                  ))}
                  {plant.categories_list.length > 2 && (
                    <Badge variant="outline" className="text-xs">
                      +{plant.categories_list.length - 2} more
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  );
} 