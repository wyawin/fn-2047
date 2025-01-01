import { useState, useCallback, useRef } from 'react';

interface ZoomState {
  scale: number;
  position: { x: number; y: number };
}

interface PanState {
  isPanning: boolean;
  lastX: number;
  lastY: number;
}

export function useCanvasZoom() {
  const [zoom, setZoom] = useState<ZoomState>({
    scale: 1,
    position: { x: 0, y: 0 }
  });

  const panState = useRef<PanState>({
    isPanning: false,
    lastX: 0,
    lastY: 0
  });

  const handleZoom = useCallback((delta: number, point: { x: number; y: number }) => {
    setZoom(current => {
      const newScale = Math.min(Math.max(current.scale + delta * 0.1, 0.1), 2);
      const scaleDiff = newScale - current.scale;

      const newPosition = {
        x: current.position.x - (point.x - current.position.x) * scaleDiff / current.scale,
        y: current.position.y - (point.y - current.position.y) * scaleDiff / current.scale
      };

      return {
        scale: newScale,
        position: newPosition
      };
    });
  }, []);

  const startPanning = useCallback((e: React.MouseEvent) => {
    // Only start panning on left mouse button
    if (e.button === 0) {
      panState.current = {
        isPanning: true,
        lastX: e.clientX,
        lastY: e.clientY
      };
      e.preventDefault();
    }
  }, []);

  const handlePanning = useCallback((e: React.MouseEvent) => {
    if (panState.current.isPanning) {
      const deltaX = e.clientX - panState.current.lastX;
      const deltaY = e.clientY - panState.current.lastY;

      setZoom(current => ({
        ...current,
        position: {
          x: current.position.x + deltaX,
          y: current.position.y + deltaY
        }
      }));

      panState.current.lastX = e.clientX;
      panState.current.lastY = e.clientY;
    }
  }, []);

  const stopPanning = useCallback(() => {
    panState.current.isPanning = false;
  }, []);

  const resetZoom = useCallback(() => {
    setZoom({
      scale: 1,
      position: { x: 0, y: 0 }
    });
  }, []);

  return {
    zoom,
    handleZoom,
    resetZoom,
    startPanning,
    handlePanning,
    stopPanning,
    isPanning: panState.current.isPanning
  };
}