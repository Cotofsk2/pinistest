import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { House, Note, NoteArea } from "@/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function NotesReport() {
  const [selectedArea, setSelectedArea] = useState<NoteArea | "all">("all");
  const [selectedHouse, setSelectedHouse] = useState<number | null>(null);
  const [selectedNotes, setSelectedNotes] = useState<number[]>([]);
  const { toast } = useToast();

  const { data: houses = [] } = useQuery<House[]>({
    queryKey: ["/api/houses"],
  });

  const deleteNotesMutation = useMutation({
    mutationFn: async (noteIds: number[]) => {
      return Promise.all(noteIds.map(id => apiRequest("DELETE", `/api/notes/${id}`)));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/houses"] });
      setSelectedNotes([]);
      toast({
        title: "Notas eliminadas",
        description: "Las notas seleccionadas han sido eliminadas correctamente.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error al eliminar notas",
        description: error.message || "Ocurrió un error al eliminar las notas.",
        variant: "destructive",
      });
    }
  });

  const handleDeleteSelected = () => {
    if (selectedNotes.length === 0) return;
    if (confirm('¿Estás seguro de que deseas eliminar las notas seleccionadas?')) {
      deleteNotesMutation.mutate(selectedNotes);
    }
  };

  const indoorHouses = houses
    .filter(h => h.type === "indoor")
    .sort((a, b) => {
      const numA = parseInt(a.name.replace("Casa ", ""));
      const numB = parseInt(b.name.replace("Casa ", ""));
      return numA - numB;
    });

  const outdoorHouses = houses
    .filter(h => h.type === "outdoor")
    .sort((a, b) => {
      const numA = parseInt(a.name.replace("Casa ", ""));
      const numB = parseInt(b.name.replace("Casa ", ""));
      return numA - numB;
    });

  const filteredNotes = houses.flatMap(house => 
    (house.notes || [])
      .filter(note => 
        (selectedArea === "all" || note.area === selectedArea) &&
        (selectedHouse === null || house.id === selectedHouse)
      )
      .map(note => ({
        ...note,
        houseName: house.name
      }))
  );

  return (
    <div className="space-y-6">
      <div className="flex gap-4 items-center">
        <div className="w-64">
          <label className="block text-sm font-medium">Filtrar por área</label>
          <Select value={selectedArea} onValueChange={(value: NoteArea | "all") => setSelectedArea(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar área" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las áreas</SelectItem>
              <SelectItem value="gasfiteria">Gasfitería</SelectItem>
              <SelectItem value="electricidad">Electricidad</SelectItem>
              <SelectItem value="reposicion">Reposición</SelectItem>
              <SelectItem value="otro">Otro</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1">
          
          <div className="flex gap-4">
            <div className="space-y-1">
              <div className="text-xs text-gray-500 font-medium mb-1">Casas Interiores</div>
              {/* Casas 1-11 interior */}
              <div className="flex gap-1">
                {indoorHouses.slice(0, 11).map(house => (
                  <button
                    key={house.id}
                    onClick={() => setSelectedHouse(selectedHouse === house.id ? null : house.id)}
                    className={`p-1 text-xs font-bold border rounded w-8 h-8 flex items-center justify-center ${
                      selectedHouse === house.id ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'
                    }`}
                  >
                    {house.name.replace('Casa ', '')}
                  </button>
                ))}
              </div>

              {/* Casas 12-22 interior */}
              <div className="flex gap-1">
                {indoorHouses.slice(11, 22).map(house => (
                  <button
                    key={house.id}
                    onClick={() => setSelectedHouse(selectedHouse === house.id ? null : house.id)}
                    className={`p-1 text-xs font-bold border rounded w-8 h-8 flex items-center justify-center ${
                      selectedHouse === house.id ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'
                    }`}
                  >
                    {house.name.replace('Casa ', '')}
                  </button>
                ))}
              </div>

              {/* Casas 23-33 interior */}
              <div className="flex gap-1">
                {indoorHouses.slice(22, 33).map(house => (
                  <button
                    key={house.id}
                    onClick={() => setSelectedHouse(selectedHouse === house.id ? null : house.id)}
                    className={`p-1 text-xs font-bold border rounded w-8 h-8 flex items-center justify-center ${
                      selectedHouse === house.id ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'
                    }`}
                  >
                    {house.name.replace('Casa ', '')}
                  </button>
                ))}
              </div>

              {/* Casa 34 interior */}
              <div className="flex gap-1">
                {indoorHouses.slice(33, 34).map(house => (
                  <button
                    key={house.id}
                    onClick={() => setSelectedHouse(selectedHouse === house.id ? null : house.id)}
                    className={`p-1 text-xs font-bold border rounded w-8 h-8 flex items-center justify-center ${
                      selectedHouse === house.id ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'
                    }`}
                  >
                    {house.name.replace('Casa ', '')}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-xs text-gray-500 font-medium mb-1">Casas Exteriores</div>
              <div className="flex gap-1">
                {outdoorHouses.map(house => (
                  <button
                    key={house.id}
                    onClick={() => setSelectedHouse(selectedHouse === house.id ? null : house.id)}
                    className={`p-1 text-xs font-bold border rounded w-8 h-8 flex items-center justify-center ${
                      selectedHouse === house.id ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'
                    }`}
                  >
                    {house.name.replace('Casa ', '')}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end mb-2">
        <Button
          variant="destructive"
          size="sm"
          onClick={handleDeleteSelected}
          disabled={selectedNotes.length === 0}
          className="flex items-center gap-2"
        >
          <Trash2 className="h-4 w-4" />
          Eliminar seleccionadas ({selectedNotes.length})
        </Button>
        <Button
              onClick={() => window.print()}
              className="flex items-center gap-2 ml-2"
              variant="outline"
              size="sm"
            >
              <span>Imprimir</span>
            </Button>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={selectedNotes.length === filteredNotes.length && filteredNotes.length > 0}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedNotes(filteredNotes.map(note => note.id));
                    } else {
                      setSelectedNotes([]);
                    }
                  }}
                />
              </TableHead>
              <TableHead>Casa</TableHead>
              <TableHead>Área</TableHead>
              <TableHead>Nota</TableHead>
              <TableHead>Fecha</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredNotes.map(note => {
              const house = houses.find(h => h.id === note.houseId);
              const displayName = house?.type === 'outdoor' 
                ? `${house.name} exterior`
                : house?.name;

              return (
                <TableRow key={note.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedNotes.includes(note.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedNotes([...selectedNotes, note.id]);
                        } else {
                          setSelectedNotes(selectedNotes.filter(id => id !== note.id));
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell>{displayName}</TableCell>
                  <TableCell>{note.area}</TableCell>
                  <TableCell>{note.content}</TableCell>
                  <TableCell>{new Date(note.createdAt).toLocaleDateString()}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}