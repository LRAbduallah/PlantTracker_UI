import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plant } from '@/lib/types/plant';
import { Heart, Leaf, MapPin, CheckCircle2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface PlantGridProps {
  plants: Plant[];
  favoritePlants: Set<number>;
  isCompareMode: boolean;
  selectedForComparison: Set<number>;
  onFavoriteToggle: (plantId: number, e: React.MouseEvent) => void;
  onCompareToggle: (plantId: number, e: React.MouseEvent) => void;
}

export function PlantGrid({
  plants,
  favoritePlants,
  isCompareMode,
  selectedForComparison,
  onFavoriteToggle,
  onCompareToggle,
}: PlantGridProps) {
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {plants.map((plant) => (
        <Link href={`/plants/${plant.id}`} key={plant.id} className="relative">
          <Card className="h-full hover:shadow-lg transition-shadow overflow-hidden">
            {/* Favorite button */}
            {/* <button 
              className="absolute top-2 right-2 z-10 bg-white bg-opacity-80 rounded-full p-1 hover:bg-opacity-100 transition-colors"
              onClick={(e) => onFavoriteToggle(plant.id, e)}
            >
              <Heart 
                size={20} 
                className={favoritePlants.has(plant.id) ? "fill-red-500 text-red-500" : "text-gray-400"} 
              />
            </button> */}
            
            {/* Compare checkbox */}
            {isCompareMode && (
              <button 
                className="absolute top-2 left-2 z-10 bg-white bg-opacity-80 rounded-full p-1 hover:bg-opacity-100 transition-colors"
                onClick={(e) => onCompareToggle(plant.id, e)}
              >
                <CheckCircle2 
                  size={20} 
                  className={selectedForComparison.has(plant.id) ? "fill-blue-500 text-white" : "text-gray-400"} 
                />
              </button>
            )}
            
            <div className="relative h-48">
              {plant.images?.[0] ? (
                <Image
                  src={plant.images[0]}
                  alt={plant.scientific_name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                  <Leaf className="text-gray-400" size={32} />
                </div>
              )}
            </div>
            <CardContent className="p-4 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <h2 className="text-lg font-semibold text-gray-900">{plant.scientific_name}</h2>
                {plant.red_list_category && (
                  <Badge variant={getConservationBadgeVariant(plant.red_list_category)}>
                    {plant.red_list_category}
                  </Badge>
                )}
              </div>
              
              {plant.tamil_name && <p className="text-gray-600">{plant.tamil_name}</p>}
              
              <div className="flex flex-wrap gap-1 mt-1">
                {plant.categories_list.slice(0, 3).map((category) => (
                  <Badge key={category.id} variant="secondary" className="text-xs">
                    {category.name}
                  </Badge>
                ))}
                {plant.categories_list.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{plant.categories_list.length - 3} more
                  </Badge>
                )}
              </div>
              
              <div className="text-sm text-gray-500 pt-2 border-t border-gray-100 mt-2">
                <div className="flex items-center gap-1 mb-1">
                  <Leaf size={14} />
                  <span>Habit: {plant.habit || 'Not specified'}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin size={14} />
                  <span>Location: {plant.location_name || 'Not specified'}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
} 