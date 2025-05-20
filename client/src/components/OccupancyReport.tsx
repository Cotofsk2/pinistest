
import { useQuery } from "@tanstack/react-query";
import { House } from "@/types";
import { Button } from "@/components/ui/button";
import { Copy, FileText } from "lucide-react";
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

  const getHtmlTable = () => {
    const today = new Date().toLocaleDateString('es-CL');
    return `<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 20px;
        }
        table {
            border-collapse: collapse;
            margin-bottom: 20px;
            font-size: 14px;
        }
        th, td {
            border: 1px solid #000;
            padding: 4px 8px;
            text-align: center;
            height: 8px;
            line-height: 1.2;
        }
        .header {
            background-color: #000;
            color: white;
        }
        .interior-row {
            background-color: #dbdabe;
        }
        .exterior-row {
            background-color: #dbdabe;
        }
        .status {
            width: 100px;
        }
        .section-spacer {
            width: 20px;
            border: none;
            background-color: transparent;
            padding: 0;
        }
        .house-cell {
            width: 100px;
        }
        .data-cell {
            min-width: 50px;
        }
        tr {
            height: 8px;
        }
        .tables-container {
            display: flex;
            align-items: flex-start;
        }
        .observations-table {
            margin-left: 20px;
        }
        .observations-header {
            background-color: #000;
            color: white;
            width: 150px;
            height: 34px;
        }
        .observations-cell {
            width: 150px;
            height: 33px;
        }
        .title {
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 10px;
        }
        .header-container {
            display: flex;
            align-items: center;
            margin-bottom: 10px;
        }
        .occupation-table {
            margin-right: 20px;
        }
    </style>
</head>
<body>
<div class="header-container">
    <table class="occupation-table">
        <tr>
            <th colspan="2" class="header">OCUPACION DIARIA</th>
        </tr>
        <tr>
            <td>Casas interiores</td>
            <td class="data-cell">${occupiedIndoor.length}</td>
        </tr>
        <tr>
            <td>Casas exteriores</td>
            <td class="data-cell">${occupiedOutdoor.length}</td>
        </tr>
        <tr>
            <td><strong>Total de casas</strong></td>
            <td class="data-cell">${occupiedIndoor.length + occupiedOutdoor.length}</td>
        </tr>
    </table>
    <div class="title">Casas pinares de higuerillas - ${today}</div>
</div>
<div class="tables-container">
    <table>
        <tr>
            <th class="header house-cell">Casas interiores</th>
            <th class="header status">Estado</th>
            <th class="section-spacer"></th>
            <th class="header house-cell">Casas exteriores</th>
            <th class="header status">Estado</th>
        </tr>
        ${Array.from({ length: 34 }, (_, i) => {
          const indoor = indoorHouses[i];
          const outdoor = outdoorHouses[i];
          return `
        <tr>
            <td class="interior-row house-cell">Casa ${i + 1}</td>
            <td class="status">${indoor?.status === 'occupied' ? 'Ocupada' : ''}</td>
            <td class="section-spacer"></td>
            ${i < 11 ? `
            <td class="exterior-row house-cell">Casa ${i + 1}</td>
            <td class="status">${outdoor?.status === 'occupied' ? 'Ocupada' : ''}</td>
            ` : '<td></td><td></td>'}
        </tr>`;
        }).join('')}
    </table>
    <table class="observations-table">
        <tr>
            <th class="observations-header">Observaciones</th>
        </tr>
        <tr>
            <td class="observations-cell"></td>
        </tr>
        <tr>
            <td class="observations-cell"></td>
        </tr>
    </table>
</div>
</body>
</html>`;
  };

    const handleCopyHtml = () => {
      try {
        const previewContainer = document.querySelector('.table-preview');

        if (!previewContainer) {
          throw new Error('No se encontró el contenedor de preview');
        }

        // Crear un rango de selección
        const range = document.createRange();
        range.selectNodeContents(previewContainer);

        // Limpiar selecciones existentes
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);

        // Ejecutar el comando de copia
        document.execCommand('copy');

        // Limpiar la selección
        selection.removeAllRanges();

        toast({
          title: "Contenido copiado",
          description: "El contenido ha sido copiado exactamente como se ve",
        });
      } catch (err) {
        console.error('Error al copiar:', err);
        toast({
          title: "Error",
          description: "No se pudo copiar el contenido",
          variant: "destructive",
        });
      }
    };

  return (
    <div className="space-y-4">
      <div className="flex justify-end gap-2">
        <Button onClick={handleCopyHtml} className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          Copiar tabla HTML
        </Button>
      </div>
      <div className="table-preview p-4 border rounded-lg bg-white font-mono" style={{ overflowX: 'auto' }}>
        <div dangerouslySetInnerHTML={{ __html: getHtmlTable() }} />
      </div>
    </div>
  );
}
