
import { useQuery } from "@tanstack/react-query";
import { House } from "@/types";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function OccupancyReport() {
  const { data: houses = [] } = useQuery<House[]>({
    queryKey: ["/api/houses"],
  });
  const { toast } = useToast();

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

  const occupiedIndoor = indoorHouses.filter(h => h.status === "occupied");
  const occupiedOutdoor = outdoorHouses.filter(h => h.status === "occupied");

  const formatReport = () => {
    const occupiedIndoorNames = occupiedIndoor
      .map(h => h.name)
      .join(", ");
    
    const occupiedOutdoorNames = occupiedOutdoor
      .map(h => h.name)
      .join(", ");

    return `REPORTE DE OCUPACIÓN\n\nCasas Interiores (${occupiedIndoor.length})\nOcupadas: ${occupiedIndoorNames || "Ninguna"}\n\nCasas Exteriores (${occupiedOutdoor.length})\nOcupadas: ${occupiedOutdoorNames || "Ninguna"}`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(formatReport());
    toast({
      title: "Copiado al portapapeles",
      description: "El reporte ha sido copiado y está listo para pegar",
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={handleCopy} className="flex items-center gap-2">
          <Copy className="h-4 w-4" />
          Copiar al portapapeles
        </Button>
      </div>
      <pre className="whitespace-pre-wrap p-4 border rounded-lg bg-white font-mono">
        {formatReport()}
      </pre>
    </div>
  );
}
