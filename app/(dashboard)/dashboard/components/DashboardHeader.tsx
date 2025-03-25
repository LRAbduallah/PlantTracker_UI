import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { RefreshCw, Sliders } from 'lucide-react';

interface DashboardHeaderProps {
  isCompareMode: boolean;
  onCompareToggle: () => void;
  onRefresh: () => void;
}

export function DashboardHeader({ isCompareMode, onCompareToggle, onRefresh }: DashboardHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Plant Dashboard</h1>
        <p className="text-gray-500 mt-1">
          Explore and analyze plant biodiversity data
        </p>
      </div>
      
      <div className="flex items-center gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button size="sm" variant="outline" onClick={onRefresh}>
                <RefreshCw size={16} className="mr-1" />
                Refresh
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Refresh dashboard data</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                size="sm" 
                variant={isCompareMode ? "default" : "outline"} 
                onClick={onCompareToggle}
              >
                <Sliders size={16} className="mr-1" />
                {isCompareMode ? "Exit Compare" : "Compare"}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Compare selected plants</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
} 