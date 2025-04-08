'use client';

import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { Trash2 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast'; // Assuming you have toast component
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, PlusCircle, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePlants, usePlantsByHabit, usePlantsByClass, usePlantsBySubClass } from '@/lib/hooks/usePlants';
import { Plant, PlantHabit, RedListCategory } from '@/lib/types/plant';
import { ImageWithZoom } from '@/components/ui/imageWithZoom';
import { base64ToImageBlob } from '@/lib/helper';
import api from '@/lib/services/api';

export default function PlantsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentHabit, setCurrentHabit] = useState<string | 'all'>('all');
  const [username, setUsername] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [deletingPlantId, setDeletingPlantId] = useState<number | null>(null);
  // Add this state to store plants data after fetching or modifying
  const [plantsData, setPlantsData] = useState<any>(null); 
  const [isDeleting, setIsDeleting] = useState(false);

  const { data: fetchedPlants, isLoading } =
  currentHabit === 'all'
    ? usePlants({
        search: searchQuery || undefined,
        ...(searchQuery ? {} : { page: currentPage }),
        ...(searchQuery ? {} : { ordering: "-last_updated" })
      })
    : currentHabit === 'Polypetalae' || currentHabit === 'Gamopetalae' || currentHabit === 'Monochlamydeae'
      ? usePlantsBySubClass(currentHabit)
      : currentHabit === 'Monocotyledons' 
        ? usePlantsByClass(currentHabit)
        : usePlantsByHabit(currentHabit);
    
  // Set the plants data when fetchedPlants changes
  useEffect(() => {
    if (fetchedPlants) {
      setPlantsData(fetchedPlants);
    }
  }, [fetchedPlants]);

  const plants = plantsData || fetchedPlants;

  const handleHabitChange = (habit: string) => {
    setCurrentHabit(habit);
    setCurrentPage(1); // Reset to first page when habit changes
  };

  const getStatusColor = (status: RedListCategory) => {
    switch (status) {
      case 'EX':
        return 'bg-red-100 text-red-800';
      case 'EW':
        return 'bg-orange-100 text-orange-800';
      case 'CR':
        return 'bg-red-50 text-red-600';
      case 'EN':
        return 'bg-yellow-100 text-yellow-800';
      case 'VU':
        return 'bg-amber-100 text-amber-800';
      case 'NT':
        return 'bg-blue-100 text-blue-800';
      case 'LC':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };


const handleDeletePlant = async (plantId: number) => {
  setIsDeleting(true);
  try {
    await api.delete(`/plants/${plantId}/`);
    
    if (plants && plants.results) {
      const updatedResults = plants.results.filter((plant: Plant) => plant.id !== plantId);
      setPlantsData({
        ...plants,
        results: updatedResults,
        count: plants.count - 1
      });
    }
    
    toast({
      title: 'Plant deleted',
      description: 'The plant has been successfully deleted.'
    });
  } catch (error) {
    console.error('Error deleting plant:', error);
    toast({
      title: 'Error',
      description: 'Failed to delete the plant. Please try again.',
      variant: 'destructive'
    });
  } finally {
    setDeletingPlantId(null);
    setIsDeleting(false);
  }
};
  useEffect(() => {
    const username = localStorage.getItem('username');
    setUsername(username as string);
  }, []);

  // Handle pagination
  const handleNextPage = () => {
    if (plants && plants.next) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (plants && plants.previous) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Calculate total pages
  const totalPages = plants
    ? Math.ceil(plants.count / (plants.results?.length || 10))
    : 0;

  return (
    <main className="grid flex-1 gap-4 md:gap-8 px-4 md:px-6 py-4">
      <Tabs
        defaultValue="all"
        className="w-full"
        onValueChange={handleHabitChange}
      >
        {/* Tab and Search Controls - Improved Responsive Layout */}
        <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:items-center md:justify-between">
        <TabsList className="overflow-x-auto scrollbar-hide h-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-8">
            <TabsTrigger value="all" className="whitespace-nowrap">All Plants</TabsTrigger>
            <TabsTrigger value="Tree" className="whitespace-nowrap">Trees</TabsTrigger>
            <TabsTrigger value="Shrub" className="whitespace-nowrap">Shrubs</TabsTrigger>
            <TabsTrigger value="Herb" className="whitespace-nowrap">Herbs</TabsTrigger>
            <TabsTrigger value="Polypetalae" className="whitespace-nowrap">Polypetalae</TabsTrigger>
            <TabsTrigger value="Gamopetalae" className="whitespace-nowrap">Gamopetalae</TabsTrigger>
            <TabsTrigger value="Monochlamydeae" className="whitespace-nowrap">Monochlamydeae</TabsTrigger>
            <TabsTrigger value="Monocotyledons" className="whitespace-nowrap">Monocotyledons</TabsTrigger>
          </TabsList>
          <div className="flex flex-col sm:flex-row w-full sm:w-auto items-start sm:items-center gap-3">
            <div className="relative w-full">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search plants..."
                className="pl-8 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            {username && (
              <Link href="/plants/add" className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Plant
                </Button>
              </Link>
            )}
          </div>
        </div>

        {plants && (plants.next || plants.previous) && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 mt-4">
            <div className="text-sm text-muted-foreground order-2 sm:order-1">
              Showing page {currentPage} of {totalPages}
            </div>
            <div className="flex items-center space-x-2 order-1 sm:order-2 w-full sm:w-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrevPage}
                disabled={!plants.previous}
                className="flex-1 sm:flex-initial"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleNextPage}
                disabled={!plants.next}
                className="flex-1 sm:flex-initial"
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        )}
        
        <TabsContent value={currentHabit} className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Plant Collection</CardTitle>
              <CardDescription className="flex flex-col sm:flex-row sm:items-center gap-2">
                <span>Browse and manage your plant collection.</span>
                {plants?.count && (
                  <span className="text-muted-foreground">
                    Total: {plants.count} plants
                  </span>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent className="px-1 sm:px-6">
              {/* Mobile-optimized cards view for small screens */}
              <div className="grid grid-cols-1 gap-4 md:hidden">
                {isLoading || isDeleting ? (
                  <div className="text-center py-8">Loading plants...</div>
                ) : plants && plants.results.length === 0 ? (
                  <div className="text-center py-8">No plants found</div>
                ) : (
                  plants &&
                  plants.results.map((plant: Plant) => (
                    <Card key={plant.id} className="overflow-hidden">
                      <div className="grid grid-cols-2 [@media(max-width:450px)]:grid-cols-1 gap-2 p-4">
                        <div>
                          <ImageWithZoom
                            src={
                              plant.images && plant.images.length > 0
                                ? plant.images[0]
                                : null
                            }
                            alt={plant.scientific_name}
                            className="w-full h-56 object-cover rounded-lg"
                          />
                          <p className="text-xs mt-1 text-center truncate">Plant Image</p>
                        </div>
                        <div className='[@media(max-width:450px)]:hidden'>
                          <ImageWithZoom
                            src={
                              plant.qr_data
                                ? URL.createObjectURL(
                                    base64ToImageBlob(plant.qr_data)
                                  )
                                : null
                            }
                            alt={'QR Code'}
                            className="w-full h-56 object-cover rounded-lg"
                          />
                          <p className="text-xs mt-1 text-center truncate">QR Code</p>
                        </div>
                      </div>
                      
                      <CardContent className="p-4 pt-0">
                        <div className="space-y-2">
                          <div>
                            <p className="text-sm font-medium">Scientific Name</p>
                            <p className="text-sm truncate italic">{plant.scientific_name}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Tamil Name</p>
                            <p className="text-sm truncate">{plant.tamil_name}</p>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <p className="text-sm font-medium">Family</p>
                              <p className="text-sm truncate">{plant.family}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium">Habit</p>
                              <p className="text-sm truncate">{plant.habit}</p>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <p className="text-sm font-medium">Status</p>
                              <Badge
                                variant="outline"
                                className={getStatusColor(
                                  plant.red_list_category as RedListCategory
                                )}
                              >
                                {plant.red_list_category}
                              </Badge>
                            </div>
                            <div>
                              <p className="text-sm font-medium">Collection Date</p>
                              <p className="text-sm">{new Date(plant.collection_date).toLocaleDateString()}</p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                      
                      <CardFooter className="flex flex-wrap gap-2 p-4 pt-0">
                        <Link href={`/plants/${plant.id}`} className="flex-1">
                          <Button variant="outline" size="sm" className="w-full">
                            View
                          </Button>
                        </Link>
                        {username && (
                          <>
                            <Link href={`/plants/${plant.id}/edit`} className="flex-1">
                              <Button variant="outline" size="sm" className="w-full">
                                Edit
                              </Button>
                            </Link>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={() => setDeletingPlantId(plant.id)}
                              disabled={isDeleting}
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Delete
                            </Button>
                          </>
                        )}
                      </CardFooter>
                    </Card>
                  ))
                )}
              </div>

              {/* Table view for medium screens and up with proper horizontal scroll */}
              <div className="hidden md:block overflow-hidden">
                <div className="overflow-x-auto max-w-">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[80px]">Image</TableHead>
                        <TableHead className="w-[80px]">QR Code</TableHead>
                        <TableHead>Scientific Name</TableHead>
                        <TableHead className='max-xl:hidden'>Tamil Name</TableHead>
                        <TableHead className='max-xl:hidden'>Family</TableHead>
                        <TableHead className='max-xl:hidden'>Habit</TableHead>
                        <TableHead className='max-xl:hidden'>Status</TableHead>
                        <TableHead>Collection Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isLoading || isDeleting ? (
                        <TableRow>
                          <TableCell colSpan={10} className="text-center py-8">
                            Loading plants...
                          </TableCell>
                        </TableRow>
                      ) : plants && plants.results.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={10} className="text-center py-8">
                            No plants found
                          </TableCell>
                        </TableRow>
                      ) : (
                        plants &&
                        plants.results.map((plant: Plant) => (
                          <TableRow key={plant.id}>
                            <TableCell>
                              <ImageWithZoom
                                src={
                                  plant.images && plant.images.length > 0
                                    ? plant.images[0]
                                    : null
                                }
                                alt={plant.scientific_name}
                                className="w-12 h-12 object-cover rounded-lg"
                              />
                            </TableCell>
                            <TableCell>
                              <ImageWithZoom
                                src={
                                  plant.qr_data
                                    ? URL.createObjectURL(
                                        base64ToImageBlob(plant.qr_data)
                                      )
                                    : null
                                }
                                alt={'QR Code'}
                                className="w-12 h-12 object-cover rounded-lg"
                              />
                            </TableCell>
                            <TableCell className="font-medium italic">
                              {plant.scientific_name}
                            </TableCell>
                            <TableCell className='max-xl:hidden'>{plant.tamil_name}</TableCell>
                            <TableCell className='max-xl:hidden'>{plant.family}</TableCell>
                            <TableCell className='max-xl:hidden'>{plant.habit}</TableCell>
                            <TableCell className='max-xl:hidden'>
                              <Badge
                                variant="outline"
                                className={getStatusColor(
                                  plant.red_list_category as RedListCategory
                                )}
                              >
                                {plant.red_list_category}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {new Date(
                                plant.collection_date
                              ).toLocaleDateString()}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex flex-row gap-2 justify-end">
                                <Link href={`/plants/${plant.id}`}>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                  >
                                    View
                                  </Button>
                                </Link>
                                {username && (
                                  <>
                                    <Link href={`/plants/${plant.id}/edit`}>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                      >
                                        Edit
                                      </Button>
                                    </Link>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                      onClick={() =>
                                        setDeletingPlantId(plant.id)
                                      }
                                      disabled={isDeleting}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                      <span className="sr-only">Delete</span>
                                    </Button>
                                  </>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <AlertDialog
        open={!!deletingPlantId}
        onOpenChange={() => setDeletingPlantId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this
              plant and remove its data from the server.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex flex-col sm:flex-row gap-2">
            <AlertDialogCancel className="w-full sm:w-auto">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                deletingPlantId && handleDeletePlant(deletingPlantId)
              }
              className="bg-red-600 hover:bg-red-700 w-full sm:w-auto"
              disabled={isDeleting}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
}