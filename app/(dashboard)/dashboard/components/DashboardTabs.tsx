import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DashboardStats, COLORS, CONSERVATION_COLORS } from './types';
import { Leaf, AlertTriangle, Tag, Heart, RefreshCw, Maximize2, X } from 'lucide-react';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip,
  ResponsiveContainer, LineChart, Line, AreaChart, Area, Legend, CartesianGrid,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import { useState } from 'react';

interface DashboardTabsProps {
  stats: DashboardStats | null;
  activeTab: string;
  onTabChange: (value: string) => void;
  totalPlants: number;
  endangeredCount: number;
  categoriesCount: number;
  favoritesCount: number;
}

// Chart wrapper component to handle fullscreen functionality
interface ChartCardProps {
  title: string;
  height?: string;
  children: React.ReactNode;
  className?: string;
}

function ChartCard({ title, height = "h-64", children, className = "" }: ChartCardProps) {
  const [isFullScreen, setIsFullScreen] = useState(false);

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  if (isFullScreen) {
    return (
      <div className="fixed inset-0 z-50 bg-white dark:bg-gray-900 overflow-auto flex flex-col animate-in fade-in duration-300">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold">{title}</h2>
          <button 
            onClick={toggleFullScreen}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="flex-1 p-6">
          <div className="h-full w-full">
            {children}
          </div>
        </div>
      </div>
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-base">{title}</CardTitle>
          <button 
            onClick={toggleFullScreen}
            className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <Maximize2 className="h-4 w-4" />
          </button>
        </div>
      </CardHeader>
      <CardContent className={height}>
        {children}
      </CardContent>
    </Card>
  );
}

export function DashboardTabs({
  stats,
  activeTab,
  onTabChange,
  totalPlants,
  endangeredCount,
  categoriesCount,
  favoritesCount
}: DashboardTabsProps) {
  if (!stats) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="animate-spin h-6 w-6 text-gray-400" />
      </div>
    );
  }

  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="space-y-4">
      <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-2">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="conservation">Conservation</TabsTrigger>
        {/* <TabsTrigger value="geography">Geography</TabsTrigger> */}
        <TabsTrigger value="climate">Climate Data</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-4">
        {/* Charts Section */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          <ChartCard title="Plant Habits Distribution" className="col-span-1">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={stats.habitStats} 
                  dataKey="value" 
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {stats.habitStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Top Categories" className="col-span-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.categoryStats.slice(0, 5)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <RechartsTooltip />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Monthly Discoveries" className="col-span-1">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.monthlyDiscoveries}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <RechartsTooltip />
                <Line type="monotone" dataKey="count" stroke="#8884d8" activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <Leaf className="h-8 w-8 text-blue-500 mb-2" />
                <h3 className="text-2xl font-bold">{totalPlants}</h3>
                <p className="text-sm text-gray-500">Total Plants</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <AlertTriangle className="h-8 w-8 text-amber-500 mb-2" />
                <h3 className="text-2xl font-bold">{endangeredCount}</h3>
                <p className="text-sm text-gray-500">Endangered</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <Tag className="h-8 w-8 text-green-500 mb-2" />
                <h3 className="text-2xl font-bold">{categoriesCount}</h3>
                <p className="text-sm text-gray-500">Categories</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <Heart className="h-8 w-8 text-red-500 mb-2" />
                <h3 className="text-2xl font-bold">{favoritesCount}</h3>
                <p className="text-sm text-gray-500">Favorites</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="conservation" className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <ChartCard title="Conservation Status Distribution" height="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={stats.conservationStats} 
                  dataKey="count" 
                  nameKey="status"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {stats.conservationStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Legend />
                <RechartsTooltip />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Plant Traits Analysis" height="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={stats.plantTraits}>
                <PolarGrid />
                <PolarAngleAxis dataKey="trait" />
                <PolarRadiusAxis />
                <Radar name="Plant Traits" dataKey="value" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
              </RadarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Conservation Status Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {stats.conservationStats.map(stat => (
                <div key={stat.status} className="flex items-center gap-2 p-3 rounded-lg border">
                  <div className="h-4 w-4 rounded-full" style={{ backgroundColor: stat.color }}></div>
                  <div>
                    <p className="font-medium">{stat.status}</p>
                    <p className="text-sm text-gray-500">{stat.count} plants</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="climate">
        <div className="grid gap-4">
          <ChartCard title="Climate Conditions" height="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.environmentalData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                <RechartsTooltip />
                <Legend />
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="temperature" 
                  stroke="#8884d8" 
                  activeDot={{ r: 8 }}
                  name="Temperature (°C)" 
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="humidity" 
                  stroke="#82ca9d"
                  name="Humidity (%)" 
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Rainfall Distribution" height="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.environmentalData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <RechartsTooltip />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="rainfall" 
                  stroke="#8884d8" 
                  fill="#8884d8" 
                  name="Rainfall (mm)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </TabsContent>
    </Tabs>
  );
}