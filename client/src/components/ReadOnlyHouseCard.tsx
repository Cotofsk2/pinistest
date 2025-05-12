import { House, Note, NoteCategory } from "@/types";
import { cn } from "@/lib/utils";
import { AlertTriangle, AlertCircle, Info, Home } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ReadOnlyHouseCardProps {
  house: House;
  size: number;
}

export default function ReadOnlyHouseCard({ house, size }: ReadOnlyHouseCardProps) {
  // 1. Primero definimos todas las variables necesarias
  const groupedNotes = (house.notes || []).reduce((acc, note) => {
    (acc[note.category] = acc[note.category] || []).push(note);
    return acc;
  }, {} as Record<NoteCategory, Note[]>);

  // Definimos hasNotes aquí, después de que groupedNotes esté definido
  const hasNotes = Object.keys(groupedNotes).length > 0;

  // 2. Funciones de utilidad
  const formatDate = (date: string) => {
    const diffHours = Math.floor((Date.now() - new Date(date).getTime()) / 3600000);
    if (diffHours < 1) return 'Ahora';
    if (diffHours < 24) return `Hace ${diffHours} ${diffHours === 1 ? 'hora' : 'horas'}`;
    if (diffHours < 48) return 'Ayer';
    return `Hace ${Math.floor(diffHours / 24)} días`;
  };

  const getNoteIcon = (category: NoteCategory) => {
    switch(category) {
      case "critical":
        return <AlertTriangle className="h-3 w-3 text-red-600" />;
      case "minor":
        return <AlertCircle className="h-3 w-3 text-yellow-500" />;
      case "other":
        return <Info className="h-3 w-3 text-blue-500" />;
      default:
        return null;
    }
  };

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

  // 3. Calculamos tamaños proporcionales
  const iconSize = Math.max(24, size * 0.4);
  const fontSize = Math.max(10, size * 0.1);
  const badgeFontSize = Math.max(8, size * 0.08);

  return (
    <div 
      className={cn(
        "flex flex-col bg-white rounded-md shadow-sm overflow-hidden",
        "hover:shadow-md transition-all duration-200",
        house.Checks === "Check-in" && "!shadow-[inset_0_0_0_3px_#9B51E0]",
        house.Checks === "Check-out" && "!shadow-[inset_0_0_0_3px_#56CCF2]",
        house.Checks === "Check-in Check-out" && "animate-border-color",
        house.Checks === "Nada" && ""
      )}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        minWidth: `${size}px`,
        minHeight: `${size}px`
      }}
    >
      <div className="flex-grow flex flex-col p-1">
        {/* Header */}
        <h3 
          className="font-bold text-center truncate px-1"
          style={{ fontSize: `${fontSize}px` }}
        >
          {house.name}
        </h3>

        {/* Icono principal */}
        <div className="flex-grow flex justify-center items-center">
          <Home 
            className={cn(
              house.status === "clean" ? "text-green-600" :
              house.status === "dirty" ? "text-red-600" :
              "text-amber-600"
            )}
            style={{ 
              width: `${iconSize}px`,
              height: `${iconSize}px`
            }}
          />
        </div>

        {/* Footer */}
        <div className="flex flex-col items-center gap-1">
          {/* Estado */}
          <span className={cn(
            "rounded-full px-2 py-1",
            house.status === "clean" ? "bg-green-100 text-green-800" :
            house.status === "dirty" ? "bg-red-100 text-red-800" :
            "bg-amber-100 text-amber-800"
          )} style={{
            fontSize: `${badgeFontSize}px`
          }}>
            {house.status === "clean" ? "Limpia" : 
             house.status === "dirty" ? "Sucia" : "Ocupada"}
          </span>

          {/* Notas - Ahora usando hasNotes correctamente definido */}
          {hasNotes && (
            <div className="flex justify-center gap-1">
              {Object.entries(groupedNotes).map(([category, notes]) => (
                <TooltipProvider key={category}>
                  <Tooltip>
                    <TooltipTrigger className="flex items-center">
                      {getNoteIcon(category as NoteCategory)}
                      {notes.length > 1 && (
                        <span style={{ fontSize: `${badgeFontSize * 0.8}px` }}>
                          {notes.length}
                        </span>
                      )}
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      <div style={{ padding: `${size * 0.05}px` }}>
                        <h4 className="font-bold mb-1" style={{ fontSize: `${fontSize}px` }}>
                          {getNoteCategoryLabel(category as NoteCategory)} ({notes.length})
                        </h4>
                        {notes.map(note => (
                          <div key={note.id} className="mb-1 last:mb-0">
                            <p style={{ fontSize: `${fontSize}px` }}>{note.content}</p>
                            <p className="text-gray-500" style={{ fontSize: `${fontSize * 0.9}px` }}>
                              {formatDate(note.createdAt)}
                            </p>
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