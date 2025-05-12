
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import HouseReport from "./HouseReport";
import NotesReport from "./NotesReport";
import OccupancyReport from "./OccupancyReport";

export default function Reports() {
  return (
    <div className="p-4">
      <Tabs defaultValue="house-report" className="flex flex-col items-center">
        <TabsList>
          <TabsTrigger value="house-report">Informe casas</TabsTrigger>
          <TabsTrigger value="notes-report">Informe notas</TabsTrigger>
          <TabsTrigger value="occupancy-report">Informe ocupación</TabsTrigger>
        </TabsList>
        <TabsContent value="house-report">
          <HouseReport />
        </TabsContent>
        <TabsContent value="notes-report">
          <NotesReport />
        </TabsContent>
        <TabsContent value="occupancy-report">
          <OccupancyReport />
        </TabsContent>
      </Tabs>
    </div>
  );
}
