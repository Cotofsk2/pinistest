
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { House } from "@/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

export default function HouseReport() {
  const [filter, setFilter] = useState<string>("all");
  const { data: houses = [] } = useQuery<House[]>({
    queryKey: ["/api/houses"],
  });

  const filteredHouses = houses
    .filter(house => {
      switch (filter) {
        case "clean":
          return house.status === "clean";
        case "dirty":
          return house.status === "dirty";
        case "occupied":
          return house.status === "occupied";
        case "with-notes":
          return house.notes && house.notes.length > 0;
        case "no-notes":
          return !house.notes || house.notes.length === 0;
        default:
          return true;
      }
    })
    .sort((a, b) => {
      const numA = parseInt(a.name.replace("Casa ", ""));
      const numB = parseInt(b.name.replace("Casa ", ""));
      return numA - numB;
    });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="w-64">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filtrar casas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las casas</SelectItem>
              <SelectItem value="clean">Casas limpias</SelectItem>
              <SelectItem value="dirty">Casas sucias</SelectItem>
              <SelectItem value="occupied">Casas ocupadas</SelectItem>
              <SelectItem value="with-notes">Con notas</SelectItem>
              <SelectItem value="no-notes">Sin notas</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button
          onClick={() => window.print()}
          className="flex items-center gap-2"
          variant="outline"
          size="sm"
        >
          <span>Imprimir</span>
        </Button>
      </div>
      
      <div className="border rounded-lg">
        <Table>
          <TableHeader className="print:hidden">
            <TableRow>
              <TableHead>Casa</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Notas</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredHouses.map(house => (
              <TableRow key={house.id}>
                <TableCell>{house.name}</TableCell>
                <TableCell>{house.type === 'indoor' ? 'Interior' : 'Exterior'}</TableCell>
                <TableCell>{house.status === 'clean' ? 'Limpia' : house.status === 'dirty' ? 'Sucia' : 'Ocupada'}</TableCell>
                <TableCell>{house.notes?.length || 0}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
