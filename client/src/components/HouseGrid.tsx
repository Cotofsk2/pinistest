import HouseCard from "./HouseCard";
import { House, HouseType, Status } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";

interface HouseGridProps {
  houses: House[];
  isLoading: boolean;
  onStatusChange: (houseId: number, status: Status) => void;
  onAddNoteClick: (house: House) => void;
}

export default function HouseGrid({ 
  houses, 
  isLoading,
  onStatusChange, 
  onAddNoteClick 
}: HouseGridProps) {
  // Filter and sort houses by type and number
  const indoorHouses = houses
    .filter(house => house.type === HouseType.INDOOR)
    .sort((a, b) => {
      const numA = parseInt(a.name.replace("Casa ", ""));
      const numB = parseInt(b.name.replace("Casa ", ""));
      return numA - numB;
    });
    
  const outdoorHouses = houses
    .filter(house => house.type === HouseType.OUTDOOR)
    .sort((a, b) => {
      const numA = parseInt(a.name.replace("Casa ", ""));
      const numB = parseInt(b.name.replace("Casa ", ""));
      return numA - numB;
    });
  
  // Count premium houses
  const premiumHouses = outdoorHouses.filter(house => house.name.includes("5") || house.name.includes("8") || house.name.includes("11"));
  
  if (isLoading) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <section className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <Skeleton className="h-6 w-36" />
            <Skeleton className="h-4 w-32" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
            {Array.from({ length: 12 }).map((_, index) => (
              <Skeleton key={index} className="h-32 w-full rounded-lg" />
            ))}
          </div>
        </section>
        <section>
          <div className="flex justify-between items-center mb-3">
            <Skeleton className="h-6 w-36" />
            <Skeleton className="h-4 w-32" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} className="h-32 w-full rounded-lg" />
            ))}
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
      {/* Indoor Houses Section */}
      <section className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-bold text-blue-800">Casas Interiores ({indoorHouses.length})</h2>
          <span className="text-xs font-medium text-slate-500">Todas Gold Standard</span>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
          {indoorHouses.map(house => (
            <HouseCard
              key={house.id}
              house={house}
              onStatusChange={onStatusChange}
              onAddNoteClick={onAddNoteClick}
            />
          ))}
        </div>
      </section>
      
      {/* Outdoor Houses Section */}
      <section>
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-bold text-blue-800">Casas Exteriores ({outdoorHouses.length})</h2>
          <span className="text-xs font-medium text-slate-500">
            {outdoorHouses.length - premiumHouses.length} Gold Standard, {premiumHouses.length} Gold Premium
          </span>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
          {outdoorHouses.map(house => (
            <HouseCard
              key={house.id}
              house={house}
              onStatusChange={onStatusChange}
              onAddNoteClick={onAddNoteClick}
            />
          ))}
        </div>
      </section>
    </main>
  );
}
