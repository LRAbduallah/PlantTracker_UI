import { Map } from 'lucide-react';

export function MapView() {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 h-96 flex items-center justify-center">
      <div className="text-center">
        <Map size={48} className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-600 mb-2">Map View</h3>
        <p className="text-gray-500 max-w-md mx-auto">
          Interactive map visualization is available in the full version.
          This would show geographic distribution of plants.
        </p>
      </div>
    </div>
  );
} 