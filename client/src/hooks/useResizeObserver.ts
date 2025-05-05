import { useState, useEffect, useCallback } from 'react';

export function useResizeObserver() {
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [element, setElement] = useState<HTMLElement | null>(null);
  const ref = useCallback((node: HTMLElement | null) => {
    setElement(node);
  }, []);

  useEffect(() => {
    if (!element) return;

    const handleResize = () => {
      setSize({
        width: element.offsetWidth,
        height: element.offsetHeight
      });
    };

    // Ejecutar inmediatamente para obtener el tamaño inicial
    handleResize();

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === element) {
          setSize({
            width: entry.contentRect.width,
            height: entry.contentRect.height
          });
        }
      }
    });

    observer.observe(element);
    return () => observer.disconnect();
  }, [element]);

  return [ref, size] as const;
}