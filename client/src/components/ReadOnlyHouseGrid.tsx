import ReadOnlyHouseCard from "./ReadOnlyHouseCard";
import { House } from "@/types";
import { useEffect, useState } from "react";
import { useResizeObserver } from "@/hooks/useResizeObserver";

interface ReadOnlyHouseGridProps {
  houses: House[];
  isLoading: boolean;
}

// Helper functions for summary
const formatHouseSection = (numbers: string[], type: string) => {
  if (numbers.length === 0) return "";
  return `${numbers.join(", ")} ${type}`;
};

const getHousesList = (houses: House[], checkType: string) => {
  const filtered = houses.filter(h => h.Checks === checkType);
  if (filtered.length === 0) return "Ninguna";

  const indoor = filtered
    .filter(h => h.type === "indoor")
    .map(h => h.name.replace("Casa ", ""))
    .sort((a, b) => Number(a) - Number(b));

  const outdoor = filtered
    .filter(h => h.type === "outdoor")
    .map(h => h.name.replace("Casa ", ""))
    .sort((a, b) => Number(a) - Number(b));

  const parts = [];
  if (indoor.length > 0) parts.push(formatHouseSection(indoor, "Interior"));
  if (outdoor.length > 0) parts.push(formatHouseSection(outdoor, "Exterior"));

  return parts.join(" y ");
};

const getStatusList = (houses: House[], status: string) => {
  const filtered = houses.filter(h => h.status === status);
  if (filtered.length === 0) return "Ninguna";

  const indoor = filtered
    .filter(h => h.type === "indoor")
    .map(h => h.name.replace("Casa ", ""))
    .sort((a, b) => Number(a) - Number(b));

  const outdoor = filtered
    .filter(h => h.type === "outdoor")
    .map(h => h.name.replace("Casa ", ""))
    .sort((a, b) => Number(a) - Number(b));

  const parts = [];
  if (indoor.length > 0) parts.push(formatHouseSection(indoor, "Interior"));
  if (outdoor.length > 0) parts.push(formatHouseSection(outdoor, "Exterior"));

  return parts.join(" y ");
};

const ROW_CONFIG = [
  { start: 0, end: 11, count: 11 },
  { start: 11, end: 22, count: 11 },
  { start: 22, end: 33, count: 11 },
  { start: 33, end: 34, count: 11 },
  { start: 34, end: 45, count: 11 }
];

export default function ReadOnlyHouseGrid({ 
  houses, 
  isLoading
}: ReadOnlyHouseGridProps) {
  const [containerRef, { width, height }] = useResizeObserver();
  const [cardSize, setCardSize] = useState(120);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  useEffect(() => {
    if (!isMounted || !width || !height || width === 0 || height === 0) return;

    const calculateCardSize = () => {
      const headerHeight = 40;
      const availableHeight = height - headerHeight;
      const gap = 4;
      const padding = 8;

      const rows = ROW_CONFIG.length;
      const maxHeightPerCard = Math.floor((availableHeight - (gap * (rows - 1)) - padding) / rows);

      const maxColumns = Math.max(...ROW_CONFIG.map(row => row.count));
      const maxWidthPerCard = Math.floor((width - (gap * (maxColumns - 1)) - padding) / maxColumns);

      const newSize = Math.max(80, Math.min(200, Math.min(maxWidthPerCard, maxHeightPerCard)));

      if (newSize !== cardSize) {
        setCardSize(newSize);
      }
    };

    const timer = setTimeout(calculateCardSize, 100);
    return () => clearTimeout(timer);
  }, [width, height, isMounted, cardSize]);

  // Cálculo mejorado de tamaños de fuente con escala más suave
  const baseScale = cardSize / 120; // 120 es el tamaño base de referencia
  const fontSize = `${Math.max(10, Math.min(16, 12 * baseScale))}px`;
  const headingFontSize = `${Math.max(12, Math.min(18, 14 * baseScale))}px`;
  const panelPadding = `${Math.max(8, Math.min(20, 12 * baseScale))}px`;
  const gapSize = `${Math.max(4, Math.min(12, 8 * baseScale))}px`;

  if (isLoading) {
    return <div className="h-screen w-screen p-4">{/* Skeleton loaders... */}</div>;
  }

  const sortedHouses = [...houses].sort((a, b) => a.id - b.id);
  const invisibleHouses = Array(10).fill(null);

  return (
    <div 
      ref={containerRef}
      className="flex flex-col h-[calc(100vh-40px)] mt-4 px-2 overflow-auto relative"
      style={{ minHeight: '500px' }}
    >
      <div className="flex flex-col gap-1 pb-4">
        {ROW_CONFIG.map((row, rowIndex) => (
          <div 
            key={`row-${rowIndex}`}
            className="grid gap-1 mx-auto relative"
            style={{
              gridTemplateColumns: `repeat(${row.count}, minmax(0, ${cardSize}px))`,
              gap: '4px',
              minWidth: `${row.count * 80}px`
            }}
          >
            {sortedHouses.slice(row.start, row.end).map(house => (
              <ReadOnlyHouseCard key={house.id} house={house} size={cardSize} />
            ))}

            {rowIndex === 3 && (
              <>
                {invisibleHouses.map((_, index) => (
                  <div 
                    key={`invisible-${index}`} 
                    style={{ 
                      width: cardSize, 
                      height: cardSize,
                      visibility: 'hidden' 
                    }} 
                  />
                ))}

                <div 
                  className="col-span-10 bg-white rounded-lg shadow-sm absolute flex items-center justify-center font-bold"
                  style={{
                    left: `${cardSize + 4}px`,
                    width: `calc(${cardSize * 10}px + 9 * 4px)`,
                    top: 0,
                    height: '100%',
                    padding: panelPadding,
                  }}
                >
                  <div 
                    className="grid grid-cols-2 w-full" 
                    style={{
                      gap: `${gapSize} ${Math.max(8, Math.min(32, 16 * baseScale))}px`
                    }}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <h3 className="text-blue-800 whitespace-nowrap" 
                            style={{ 
                              fontSize: headingFontSize,
                              minWidth: `${cardSize * 0.8}px`,
                              marginRight: gapSize
                            }}>
                          Llegadas hoy:
                        </h3>
                        <p className="text-slate-600" style={{ fontSize }}>
                          {getHousesList(houses, "Check-in")}
                        </p>
                      </div>

                      <div className="flex items-center">
                        <h3 className="text-blue-800 whitespace-nowrap" 
                            style={{ 
                              fontSize: headingFontSize,
                              minWidth: `${cardSize * 0.8}px`,
                              marginRight: gapSize
                            }}>
                          Salidas hoy:
                        </h3>
                        <p className="text-slate-600" style={{ fontSize }}>
                          {getHousesList(houses, "Check-out")}
                        </p>
                      </div>

                      <div className="flex items-center">
                        <h3 className="text-blue-800 whitespace-nowrap" 
                            style={{ 
                              fontSize: headingFontSize,
                              minWidth: `${cardSize * 0.8}px`,
                              marginRight: gapSize
                            }}>
                          Check-in Check-out:
                        </h3>
                        <p className="text-slate-600" style={{ fontSize }}>
                          {getHousesList(houses, "Check-in Check-out")}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center">
                        <h3 className="text-amber-600 whitespace-nowrap" 
                            style={{ 
                              fontSize: headingFontSize,
                              minWidth: `${cardSize * 0.7}px`,
                              marginRight: gapSize
                            }}>
                          Ocupadas:
                        </h3>
                        <p className="text-slate-600" style={{ fontSize }}>
                          {getStatusList(houses, "occupied")}
                        </p>
                      </div>

                      <div className="flex items-center">
                        <h3 className="text-green-600 whitespace-nowrap" 
                            style={{ 
                              fontSize: headingFontSize,
                              minWidth: `${cardSize * 0.7}px`,
                              marginRight: gapSize
                            }}>
                          Limpias:
                        </h3>
                        <p className="text-slate-600" style={{ fontSize }}>
                          {getStatusList(houses, "clean")}
                        </p>
                      </div>

                      <div className="flex items-center">
                        <h3 className="text-red-600 whitespace-nowrap" 
                            style={{ 
                              fontSize: headingFontSize,
                              minWidth: `${cardSize * 0.7}px`,
                              marginRight: gapSize
                            }}>
                          Sucias:
                        </h3>
                        <p className="text-slate-600" style={{ fontSize }}>
                          {getStatusList(houses, "dirty")}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}