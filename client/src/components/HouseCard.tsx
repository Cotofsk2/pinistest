import { House, Status, Classification, Note, NoteCategory } from "@/types";
import { cn } from "@/lib/utils";
import { ClipboardList, AlertTriangle, AlertCircle, Info, PlusCircle, Trash2, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip } from "@/components/ui/tooltip";
import {
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface HouseCardProps {
  house: House;
  onStatusChange: (houseId: number, status: Status) => void;
  onAddNoteClick: (house: House) => void;
}

export default function HouseCard({ house, onStatusChange, onAddNoteClick }: HouseCardProps) {
  const { toast } = useToast();
  
  // Group notes by category
  const groupedNotes = () => {
    if (!house.notes || house.notes.length === 0) return {} as Record<string, Note[]>;
    
    return house.notes.reduce((acc, note) => {
      if (!acc[note.category]) {
        acc[note.category] = [];
      }
      acc[note.category].push(note);
      return acc;
    }, {} as Record<string, Note[]>);
  };
  
  const deleteNoteMutation = useMutation({
    mutationFn: async (noteId: number) => {
      return apiRequest("DELETE", `/api/notes/${noteId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/houses"] });
      toast({
        title: "Nota eliminada",
        description: "La nota ha sido eliminada correctamente.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error al eliminar nota",
        description: error.message || "Ocurrió un error al eliminar la nota.",
        variant: "destructive",
      });
    }
  });
  
  const handleDeleteNote = (noteId: number) => {
    if (confirm('¿Estás seguro de que deseas eliminar esta nota?')) {
      deleteNoteMutation.mutate(noteId);
    }
  };
  
  const formatDate = (date: string) => {
    const d = new Date(date);
    const now = new Date();
    const diff = Math.floor((now.getTime() - d.getTime()) / 1000 / 60 / 60);
    
    if (diff < 1) return 'Ahora';
    if (diff < 24) return `Hace ${diff} ${diff === 1 ? 'hora' : 'horas'}`;
    if (diff < 48) return 'Ayer';
    return `Hace ${Math.floor(diff / 24)} días`;
  };

  // Get note icon by category
  const getNoteIcon = (category: NoteCategory) => {
    switch(category) {
      case "critical":
        return <AlertTriangle className="h-4 w-4 text-[hsl(var(--critical))]" />;
      case "minor":
        return <AlertCircle className="h-4 w-4 text-[hsl(var(--minor))]" />;
      case "other":
        return <Info className="h-4 w-4 text-purple-500" />;
      default:
        return null;
    }
  };

  // Get note category label
  const getNoteCategoryLabel = (category: NoteCategory) => {
    switch(category) {
      case "critical":
        return "Grave";
      case "minor":
        return "Leve";
      case "other":
        return "Otra";
      default:
        return "";
    }
  };

  // Get note category class
  const getNoteCategoryClass = (category: NoteCategory) => {
    switch(category) {
      case "critical":
        return "bg-[hsl(var(--critical))]";
      case "minor":
        return "bg-[hsl(var(--minor))]";
      case "other":
        return "bg-purple-500";
      default:
        return "";
    }
  };

  const notes = groupedNotes();
  const hasNotes = Object.keys(notes).length > 0;

  return (
    <div className="house-card bg-white rounded-lg shadow hover:shadow-lg" data-house-id={house.id}>
      <div className="p-2">
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-1">
            <Home className={cn(
              "h-4 w-4",
              house.status === "clean" 
                ? "text-green-600" 
                : house.status === "dirty"
                ? "text-red-600"
                : "text-amber-600"
            )} />
            <h3 className="text-sm font-semibold">{house.name}</h3>
          </div>
          <span className={cn(
            "text-xs px-1.5 py-0.5 rounded-full text-[0.65rem]",
            house.classification === Classification.GOLD_PREMIUM 
              ? "bg-premium text-white" 
              : "bg-blue-100 text-blue-800"
          )}>
            {house.classification === Classification.GOLD_PREMIUM ? "Gold Premium" : "Gold Standard"}
          </span>
        </div>
        
        <div className="flex gap-1 mb-2">
          <button 
            className={cn(
              "status-badge text-xs py-0.5 px-1.5",
              house.status === "clean" 
                ? "bg-[hsl(var(--clean))] text-white" 
                : "bg-slate-100 text-slate-700"
            )}
            onClick={() => onStatusChange(house.id, "clean")}
          >
            Limpia
          </button>
          <button 
            className={cn(
              "status-badge text-xs py-0.5 px-1.5",
              house.status === "dirty" 
                ? "bg-[hsl(var(--dirty))] text-white" 
                : "bg-slate-100 text-slate-700"
            )}
            onClick={() => onStatusChange(house.id, "dirty")}
          >
            Sucia
          </button>
          <button 
            className={cn(
              "status-badge text-xs py-0.5 px-1.5",
              house.status === "occupied" 
                ? "bg-[hsl(var(--occupied))] text-white" 
                : "bg-slate-100 text-slate-700"
            )}
            onClick={() => onStatusChange(house.id, "occupied")}
          >
            Ocupada
          </button>
        </div>
        
        <div className="flex justify-between items-center">
          <Button 
            variant="ghost" 
            className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1 p-0 h-auto"
            onClick={() => onAddNoteClick(house)}
          >
            <PlusCircle className="h-3 w-3" /> Añadir Nota
          </Button>
          
          {/* Note indicators (grouped by category) */}
          {hasNotes && (
            <div className="flex gap-1">
              {Object.entries(notes).map(([category, categoryNotes]: [string, any]) => (
                <TooltipProvider key={category}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="tooltip-trigger relative flex items-center">
                        {getNoteIcon(category as NoteCategory)}
                        {categoryNotes.length > 1 && (
                          <span className="absolute -top-1 -right-1 text-[0.6rem] font-bold">
                            {categoryNotes.length}
                          </span>
                        )}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="w-64 p-0">
                      <div className="bg-white shadow-lg rounded-md p-2 z-10 max-h-52 overflow-y-auto">
                        <h4 className="font-medium text-xs mb-2 border-b pb-1">
                          {getNoteCategoryLabel(category as NoteCategory)} ({categoryNotes.length})
                        </h4>
                        
                        {categoryNotes.map((note: Note) => (
                          <div key={note.id} className="mb-2 pb-2 border-b last:border-0">
                            <div className="flex justify-between items-start gap-1 mb-1">
                              <p className="text-xs">{note.content}</p>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-5 w-5 p-0 text-red-500 hover:bg-red-50"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteNote(note.id);
                                }}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                            <div className="text-[0.65rem] text-slate-500">
                              {formatDate(note.createdAt)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
