import ReadOnlyHouseCard from "./ReadOnlyHouseCard";
import { House } from "@/types";
import { useEffect, useState } from "react";
import { useResizeObserver } from "@/hooks/useResizeObserver";

interface ReadOnlyHouseGridProps {
  houses: House[];
  isLoading: boolean;
}

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

  if (isLoading) {
    return <div className="h-screen w-screen p-4">{/* Skeleton loaders... */}</div>;
  }

  const sortedHouses = [...houses].sort((a, b) => a.id - b.id);
  const invisibleHouses = Array(10).fill(null);

  return (
    <div 
      ref={containerRef}
      className="flex flex-col h-[calc(100vh-40px)] mt-4 px-2 overflow-auto"
      style={{ minHeight: '500px' }} // Altura mínima de fallback
    >
      <div className="flex flex-col gap-1 pb-4">
        {ROW_CONFIG.map((row, rowIndex) => (
          <div 
            key={`row-${rowIndex}`}
            className="grid gap-1 mx-auto"
            style={{
              gridTemplateColumns: `repeat(${row.count}, minmax(0, ${cardSize}px))`,
              gap: '4px',
              minWidth: `${row.count * 80}px` // Ancho mínimo basado en cards de 80px
            }}
          >
            {sortedHouses.slice(row.start, row.end).map(house => (
              <ReadOnlyHouseCard key={house.id} house={house} size={cardSize} />
            ))}
            {rowIndex === 3 && invisibleHouses.map((_, index) => (
              <div key={`invisible-${index}`} style={{ width: cardSize, height: cardSize }} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}