import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { House, HouseType, Classification } from "@/types";
import ReadOnlyHouseGrid from "@/components/ReadOnlyHouseGrid";

export default function ReadOnly() {
  const [filters, setFilters] = useState({
    houseType: "all",
    status: "all",
  });

  // Fetch houses data
  const { data: houses = [], isLoading } = useQuery({
    queryKey: ["/api/houses"],
  });

  // Filter houses based on selected filters
  const filteredHouses = (houses as House[]).filter((house: House) => {
    // House type filter
    if (filters.houseType !== "all") {
      if (filters.houseType === "indoor" && house.type !== HouseType.INDOOR) return false;
      if (filters.houseType === "outdoor" && house.type !== HouseType.OUTDOOR) return false;
    }
    
    // Status filter
    if (filters.status !== "all" && house.status !== filters.status) return false;
    
    return true;
  });

  return (
    <div className="min-h-screen">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-blue-800">Gestión de Casas del Hotel</h1>
            <p className="text-xs text-slate-500">Vista de Solo Lectura</p>
          </div>
          <div className="flex items-center gap-3">
            <a 
              href="/" 
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Ir a Vista de Administración
            </a>
          </div>
        </div>
      </header>
      
      <ReadOnlyHouseGrid 
        houses={filteredHouses} 
        isLoading={isLoading}
      />
    </div>
  );
}