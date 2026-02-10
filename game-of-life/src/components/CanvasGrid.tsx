import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import type { Grid } from '../game/types';
import { detectPatterns } from '../game/recognition';

interface CanvasGridProps {
  grid: Grid;
  setCell: (x: number, y: number, value: boolean) => void;
  shift: (dx: number, dy: number) => void;
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

export const CanvasGrid = ({ grid, setCell, shift }: CanvasGridProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Viewport State
  // Fixed zoom for the infinite grid illusion
  const ZOOM = 25;
  // Center the grid in the container
  const [size, setSize] = useState({ width: 0, height: 0 });
  const offset = useMemo(() => {
     if (size.width === 0 || size.height === 0) return { x: 0, y: 0 };
     // Center the grid based on its pixel size
     const gridWidth = (grid[0]?.length || 0) * ZOOM;
     const gridHeight = grid.length * ZOOM;
     return {
         x: Math.max(0, (size.width - gridWidth) / 2),
         y: Math.max(0, (size.height - gridHeight) / 2)
     };
  }, [size, grid]);


  // Interaction State
  const [isDragging, setIsDragging] = useState(false);
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });
  const dragAcc = useRef({ x: 0, y: 0 });
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

    const showGrid = true;

    // Viewport Calculations - Simplified since we just center the fixed grid
    // For infinite grid illusion, we render the whole grid (since it represents the view)
    const visStartCol = 0;
    const visEndCol = cols;
    const visStartRow = 0;
    const visEndRow = rows;

    ctx.save();
    ctx.translate(offset.x, offset.y);
    ctx.scale(ZOOM, ZOOM);

    // Grid Lines
    if (showGrid) {
      ctx.lineWidth = 1 / ZOOM;
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
          ctx.fillRect(x, y, 1, 1);
        }
      }
    }

    // World Border (Visible Viewport Border)
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 2 / ZOOM;
    ctx.strokeRect(0, 0, cols, rows);

    ctx.restore();

  }, [grid, offset, size, rows, cols, patternMap]);

  // Interaction Handlers
  const screenToWorld = useCallback((sx: number, sy: number) => {
    if (!canvasRef.current) return { x: 0, y: 0 };
    const rect = canvasRef.current.getBoundingClientRect();
    const x = (sx - rect.left - offset.x) / ZOOM;
    const y = (sy - rect.top - offset.y) / ZOOM;
    return { x: Math.floor(x), y: Math.floor(y) };
  }, [offset]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 2 || e.buttons === 2) {
      setIsDragging(true);
      setLastMousePos({ x: e.clientX, y: e.clientY });
      // Reset accumulator on new drag
      dragAcc.current = { x: 0, y: 0 };
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

      dragAcc.current.x += dx;
      dragAcc.current.y += dy;

      const cellsX = Math.floor(dragAcc.current.x / ZOOM);
      const cellsY = Math.floor(dragAcc.current.y / ZOOM);

      if (cellsX !== 0 || cellsY !== 0) {
        // Invert cellsX/Y because moving mouse RIGHT means "pulling" the grid, so content moves RIGHT.
        // shift(1, 0) moves content right.
        shift(cellsX, cellsY);
        dragAcc.current.x -= cellsX * ZOOM;
        dragAcc.current.y -= cellsY * ZOOM;
      }

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
    // No-op for now, or maybe reset grid?
  };

  const handleWheel = (e: React.WheelEvent) => {
    // Translate wheel to shift
    const deltaY = e.deltaY;
    const deltaX = e.deltaX;

    // Threshold for wheel steps
    if (Math.abs(deltaY) > 10 || Math.abs(deltaX) > 10) {
       const shiftY = deltaY > 0 ? -1 : (deltaY < 0 ? 1 : 0);
       const shiftX = deltaX > 0 ? -1 : (deltaX < 0 ? 1 : 0);
       if (shiftX !== 0 || shiftY !== 0) {
          shift(shiftX, shiftY);
       }
    }
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
        <div>Rechtsklick + Ziehen: Welt verschieben</div>
        <div>Mausrad/Trackpad: Welt verschieben</div>
        <div>Linksklick: Zeichnen</div>
        <div className="mt-1 pt-1 border-t border-gray-700 font-mono">
          Sichtbarer Bereich: {cols}x{rows}
        </div>
      </div>
    </div>
  );
};
