import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FilterControlsProps {
  filters: {
    houseType: string;
    status: string;
    notes: string;
  };
  onFilterChange: (filterName: string, value: string) => void;
}

export default function FilterControls({ filters, onFilterChange }: FilterControlsProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div className="bg-white rounded-lg shadow p-3 mb-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
          <h2 className="text-base font-semibold">Filtros</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full md:w-auto">
            {/* House Type Filter */}
            <div>
              <label htmlFor="house-type" className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de Casa
              </label>
              <Select 
                value={filters.houseType} 
                onValueChange={(value) => onFilterChange("houseType", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las Casas</SelectItem>
                  <SelectItem value="indoor">Casas Interiores</SelectItem>
                  <SelectItem value="outdoor">Casas Exteriores</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Status Filter */}
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                Estado
              </label>
              <Select 
                value={filters.status} 
                onValueChange={(value) => onFilterChange("status", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los Estados</SelectItem>
                  <SelectItem value="clean">Limpia</SelectItem>
                  <SelectItem value="dirty">Sucia</SelectItem>
                  <SelectItem value="occupied">Ocupada</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Notes Filter */}
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                Notas
              </label>
              <Select 
                value={filters.notes} 
                onValueChange={(value) => onFilterChange("notes", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por notas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las Casas</SelectItem>
                  <SelectItem value="with-notes">Con Notas</SelectItem>
                  <SelectItem value="no-notes">Sin Notas</SelectItem>
                  <SelectItem value="critical">Notas Críticas</SelectItem>
                  <SelectItem value="minor">Notas Menores</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
