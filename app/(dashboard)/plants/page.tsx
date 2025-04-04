'use client';

import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
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
import { Button } from '@/components/ui/button';
import { PlusCircle, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePlants, usePlantsByHabit } from '@/lib/hooks/usePlants';
import { Plant, PlantHabit, RedListCategory } from '@/lib/types/plant';
import { ImageWithZoom } from '@/components/ui/imageWithZoom';
import { base64ToImageBlob } from '@/lib/helper';

export default function PlantsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentHabit, setCurrentHabit] = useState<PlantHabit | 'all'>('all');
  const [username, setUsername] = useState('');

  const { data: plants, isLoading } =
    currentHabit === 'all'
      ? usePlants({
          search: searchQuery || undefined
        })
      : usePlantsByHabit(currentHabit);

  const handleHabitChange = (habit: string) => {
    setCurrentHabit(habit as PlantHabit | 'all');
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

  useEffect(() => {
    const username = localStorage.getItem('username');
    setUsername(username as string);
  }, []);

  return (
    <main className="grid flex-1 gap-4 md:gap-8">
      <Tabs
        defaultValue="all"
        className="w-full"
        onValueChange={handleHabitChange}
      >
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="all">All Plants</TabsTrigger>
            <TabsTrigger value="Tree">Trees</TabsTrigger>
            <TabsTrigger value="Shrub">Shrubs</TabsTrigger>
            <TabsTrigger value="Herb">Herbs</TabsTrigger>
            <TabsTrigger value="Climber">Climbers</TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search plants..."
                className="pl-8 w-[300px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            {username && (
              <Link href="/plants/add">
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Plant
                </Button>
              </Link>
            )}
          </div>
        </div>

        <TabsContent value={currentHabit} className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Plant Collection</CardTitle>
              <CardDescription>
                Browse and manage your plant collection. View details, edit
                information, or add new plants.
                {plants?.count && (
                  <span className="ml-2 text-muted-foreground">
                    Total: {plants.count} plants
                  </span>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Image</TableHead>
                    <TableHead className="w-[100px]">QR Code</TableHead>
                    <TableHead>Scientific Name</TableHead>
                    <TableHead>Tamil Name</TableHead>
                    <TableHead>Herbarium ID</TableHead>
                    <TableHead>Family</TableHead>
                    <TableHead>Habit</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Collection Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-8">
                        Loading plants...
                      </TableCell>
                    </TableRow>
                  ) : plants && plants.results.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-8">
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
                            className="w-16 h-16 object-cover rounded-lg"
                          /> 
                        </TableCell>
                        <TableCell>
                          <ImageWithZoom
                            src={
                              plant.qr_data
                                ? URL.createObjectURL(base64ToImageBlob(plant.qr_data))
                                : null
                            }
                            alt={"QR Code"}
                            className="w-16 h-16 object-cover rounded-lg"
                          /> 
                        </TableCell>
                        <TableCell className="font-medium">
                          {plant.scientific_name}
                        </TableCell>
                        <TableCell>{plant.tamil_name}</TableCell>
                        <TableCell>{plant.herbarium_id}</TableCell>
                        <TableCell>{plant.family}</TableCell>
                        <TableCell>{plant.habit}</TableCell>
                        <TableCell>
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
                          {new Date(plant.collection_date).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right space-x-2">
                          <Link href={`/plants/${plant.id}`}>
                            <Button variant="outline" size="sm">
                              View
                            </Button>
                          </Link>
                          {username && (
                            <Link href={`/plants/${plant.id}/edit`}>
                              <Button variant="outline" size="sm">
                                Edit
                              </Button>
                            </Link>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  );
}
