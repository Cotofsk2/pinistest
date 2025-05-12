import { useState } from "react";
import Header from "@/components/Header";
import FilterControls from "@/components/FilterControls";
import HouseGrid from "@/components/HouseGrid";
import AddNoteModal from "@/components/AddNoteModal";
import Reports from "@/components/Reports";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { House, HouseType, Classification, Status, NoteCategory, NoteArea } from "@/types";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const [filters, setFilters] = useState({
    houseType: "all",
    status: "all",
    notes: "all"
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedHouse, setSelectedHouse] = useState<House | null>(null);
  const { toast } = useToast();

  // Fetch houses data
  const { data: houses = [], isLoading } = useQuery({
    queryKey: ["/api/houses"],
  });

  // Update house status mutation
  const updateStatusMutation = useMutation({
    mutationFn: async ({ 
      houseId, 
      updates 
    }: { 
      houseId: number, 
      updates: { status?: Status; Checks?: Checks }
    }) => {
      return apiRequest("PATCH", `/api/houses/${houseId}/status`, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/houses"] });
      toast({
        title: "Estado actualizado",
        description: "El estado de la casa ha sido actualizado correctamente.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error al actualizar estado",
        description: error.message || "Ocurrió un error al actualizar el estado.",
        variant: "destructive",
      });
    }
  });

  // Add note mutation
  const addNoteMutation = useMutation({
    mutationFn: async ({ 
      houseId, 
      category,
      area,
      content 
    }: { 
      houseId: number, 
      category: NoteCategory,
      area: NoteArea,
      content: string 
    }) => {
      return apiRequest("POST", `/api/houses/${houseId}/notes`, { category, area, content });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/houses"] });
      setModalOpen(false);
      toast({
        title: "Nota añadida",
        description: "Tu nota ha sido añadida correctamente.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error al añadir nota",
        description: error.message || "Ocurrió un error al añadir la nota.",
        variant: "destructive",
      });
    }
  });

  const handleStatusChange = (houseId: number, updates: { status?: Status; Checks?: Checks }) => {
    updateStatusMutation.mutate({ houseId, updates });
  };

  const handleAddNoteClick = (house: House) => {
    setSelectedHouse(house);
    setModalOpen(true);
  };

  const handleAddNote = (category: NoteCategory, area: NoteArea, content: string) => {
    if (!selectedHouse) return;

    addNoteMutation.mutate({
      houseId: selectedHouse.id,
      category,
      area,
      content
    });
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedHouse(null);
  };

  const handleFilterChange = (filterName: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  // Filter houses based on selected filters
  const filteredHouses = (houses as House[]).filter((house: House) => {
    // House type filter
    if (filters.houseType !== "all") {
      if (filters.houseType === "indoor" && house.type !== HouseType.INDOOR) return false;
      if (filters.houseType === "outdoor" && house.type !== HouseType.OUTDOOR) return false;
    }

    // Status filter
    if (filters.status !== "all" && house.status !== filters.status) return false;

    // Notes filter
    if (filters.notes === "with-notes" && (!house.notes || house.notes.length === 0)) return false;
    if (filters.notes === "no-notes" && house.notes && house.notes.length > 0) return false;
    if (filters.notes === "critical" && (!house.notes || !house.notes.some(note => note.category === "critical"))) return false;
    if (filters.notes === "minor" && (!house.notes || !house.notes.some(note => note.category === "minor"))) return false;

    return true;
  });

  return (
    <div className="min-h-screen">
      <Header username="Personal" />
      <Tabs defaultValue="houses" className="px-4 flex flex-col items-center">
        <TabsList>
          <TabsTrigger value="houses">Casas</TabsTrigger>
          <TabsTrigger value="reports">Informes</TabsTrigger>
        </TabsList>
        <TabsContent value="houses">
          <FilterControls filters={filters} onFilterChange={handleFilterChange} />
          <HouseGrid 
            houses={filteredHouses} 
            isLoading={isLoading}
            onStatusChange={handleStatusChange} 
            onAddNoteClick={handleAddNoteClick}
          />
        </TabsContent>
        <TabsContent value="reports">
          <Reports />
        </TabsContent>
      </Tabs>

      {selectedHouse && (
        <AddNoteModal 
          isOpen={modalOpen} 
          house={selectedHouse}
          onClose={handleCloseModal} 
          onSave={handleAddNote}
          isPending={addNoteMutation.isPending}
        />
      )}
    </div>
  );
}