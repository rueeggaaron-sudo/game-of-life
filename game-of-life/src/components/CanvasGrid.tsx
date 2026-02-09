import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import type { Grid } from '../game/types';
import { detectPatterns } from '../game/recognition';

interface CanvasGridProps {
  grid: Grid;
  setCell: (x: number, y: number, value: boolean) => void;
}

const getColorFromClass = (className?: string) => {
  if (!className) return '#22c55e'; // Default Green-500
  if (className.includes('bg-red-500')) return '#ef4444';
  if (className.includes('bg-amber-400')) return '#fbbf24';
  if (className.includes('bg-yellow-600')) return '#ca8a04';
  if (className.includes('bg-blue-500')) return '#3b82f6';
  if (className.includes('bg-purple-500')) return '#a855f7';
  if (className.includes('bg-green-600')) return '#16a34a';
  if (className.includes('bg-gray-400')) return '#9ca3af';
  return '#22c55e';
};

export const CanvasGrid = ({ grid, setCell }: CanvasGridProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Viewport State
  const [offset, setOffset] = useState({ x: 20, y: 20 }); // Initial padding
  const [zoom, setZoom] = useState(20); // Pixels per cell
  const [size, setSize] = useState({ width: 0, height: 0 });

  // Interaction State
  const [isDragging, setIsDragging] = useState(false);
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });
  const isDrawingRef = useRef(false);
  const drawModeRef = useRef(true);

  const rows = grid.length;
  const cols = rows > 0 ? grid[0].length : 0;

  // Pattern detection
  // Optimization: Disable pattern detection for large grids to maintain performance
  const patternMap = useMemo(() => {
    if (rows * cols > 50000) return new Map();
    return detectPatterns(grid);
  }, [grid, rows, cols]);

  // Resize Observer
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        setSize({ width, height });
      }
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Update Canvas Size
  useEffect(() => {
    if (canvasRef.current && size.width > 0 && size.height > 0) {
      const dpr = window.devicePixelRatio || 1;
      canvasRef.current.width = size.width * dpr;
      canvasRef.current.height = size.height * dpr;
      canvasRef.current.style.width = `${size.width}px`;
      canvasRef.current.style.height = `${size.height}px`;

      const ctx = canvasRef.current.getContext('2d');
      if (ctx) ctx.scale(dpr, dpr);
    }
  }, [size]);

  // Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || size.width === 0 || size.height === 0) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    // Clear
    ctx.fillStyle = '#0f172a'; // gray-950
    ctx.fillRect(0, 0, size.width, size.height);

    const showGrid = zoom > 5;

    // Viewport Calculations
    const startCol = Math.floor(-offset.x / zoom);
    const endCol = Math.floor((-offset.x + size.width) / zoom) + 1;
    const startRow = Math.floor(-offset.y / zoom);
    const endRow = Math.floor((-offset.y + size.height) / zoom) + 1;

    const visStartCol = Math.max(0, startCol);
    const visEndCol = Math.min(cols, endCol);
    const visStartRow = Math.max(0, startRow);
    const visEndRow = Math.min(rows, endRow);

    ctx.save();
    ctx.translate(offset.x, offset.y);
    ctx.scale(zoom, zoom);

    // Grid Lines
    if (showGrid) {
      ctx.lineWidth = 1 / zoom; // Keeps line width constant ~1px relative to screen
      ctx.strokeStyle = '#334155'; // gray-700

      ctx.beginPath();
      for (let x = visStartCol; x <= visEndCol; x++) {
        ctx.moveTo(x, visStartRow);
        ctx.lineTo(x, visEndRow);
      }
      for (let y = visStartRow; y <= visEndRow; y++) {
        ctx.moveTo(visStartCol, y);
        ctx.lineTo(visEndCol, y);
      }
      ctx.stroke();
    }

    // Cells
    for (let y = visStartRow; y < visEndRow; y++) {
      for (let x = visStartCol; x < visEndCol; x++) {
        if (grid[y][x]) {
          const pattern = patternMap.get(`${x},${y}`);
          ctx.fillStyle = getColorFromClass(pattern?.color);
          // Overlap grid lines slightly to look clean
          ctx.fillRect(x, y, 1, 1);
        }
      }
    }

    // World Border
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 2 / zoom;
    ctx.strokeRect(0, 0, cols, rows);

    ctx.restore();

  }, [grid, offset, zoom, size, rows, cols, patternMap]);

  // Interaction Handlers
  const screenToWorld = useCallback((sx: number, sy: number) => {
    if (!canvasRef.current) return { x: 0, y: 0 };
    const rect = canvasRef.current.getBoundingClientRect();
    const x = (sx - rect.left - offset.x) / zoom;
    const y = (sy - rect.top - offset.y) / zoom;
    return { x: Math.floor(x), y: Math.floor(y) };
  }, [offset, zoom]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 2 || e.buttons === 2) {
      setIsDragging(true);
      setLastMousePos({ x: e.clientX, y: e.clientY });
      return;
    }
    if (e.button === 0) {
      isDrawingRef.current = true;
      const { x, y } = screenToWorld(e.clientX, e.clientY);
      if (x >= 0 && x < cols && y >= 0 && y < rows) {
        const currentVal = grid[y][x];
        drawModeRef.current = !currentVal;
        setCell(x, y, !currentVal);
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      const dx = e.clientX - lastMousePos.x;
      const dy = e.clientY - lastMousePos.y;
      setOffset(prev => ({ x: prev.x + dx, y: prev.y + dy }));
      setLastMousePos({ x: e.clientX, y: e.clientY });
      return;
    }
    if (isDrawingRef.current) {
      const { x, y } = screenToWorld(e.clientX, e.clientY);
      if (x >= 0 && x < cols && y >= 0 && y < rows) {
        if (grid[y][x] !== drawModeRef.current) {
           setCell(x, y, drawModeRef.current);
        }
      }
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    isDrawingRef.current = false;
  };

  const handleDoubleClick = () => {
    setZoom(20);
    setOffset({ x: 20, y: 20 });
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (!containerRef.current) return;
    const zoomSensitivity = 0.001;
    const delta = -e.deltaY;
    const zoomFactor = Math.exp(delta * zoomSensitivity);

    const rect = containerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const worldX = (mouseX - offset.x) / zoom;
    const worldY = (mouseY - offset.y) / zoom;

    const newZoom = Math.max(1, Math.min(200, zoom * zoomFactor));

    const newOffsetX = mouseX - worldX * newZoom;
    const newOffsetY = mouseY - worldY * newZoom;

    setZoom(newZoom);
    setOffset({ x: newOffsetX, y: newOffsetY });
  };

  return (
    <div
      ref={containerRef}
      className="w-full h-full relative bg-gray-950 overflow-hidden cursor-crosshair select-none"
    >
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onDoubleClick={handleDoubleClick}
        onWheel={handleWheel}
        onContextMenu={(e) => e.preventDefault()}
        className="block touch-none"
      />

      {/* HUD */}
      <div className="absolute bottom-4 right-4 pointer-events-none bg-black/50 backdrop-blur text-[10px] md:text-xs text-gray-400 p-2 rounded border border-gray-800 z-10 hidden md:block">
        <div>Rechtsklick + Ziehen: Verschieben</div>
        <div>Mausrad: Zoomen</div>
        <div>Linksklick: Zeichnen</div>
        <div>Doppelklick: Reset Ansicht</div>
        <div className="mt-1 pt-1 border-t border-gray-700 font-mono">
          Zoom: {zoom.toFixed(1)}px | Pos: {Math.round(-offset.x/zoom)},{Math.round(-offset.y/zoom)}
        </div>
      </div>
    </div>
  );
};
