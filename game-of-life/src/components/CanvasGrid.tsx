import { useEffect, useRef, useState, useMemo } from 'react';
import type { Grid, Rule } from '../game/types';
import { detectPatterns, type DetectedPattern } from '../game/recognition';

interface CanvasGridProps {
  grid: Grid;
  setCell: (x: number, y: number, value: boolean) => void;
  shift: (dx: number, dy: number) => void;
  rule: Rule;
  isRunning: boolean;
}

export const CanvasGrid = ({ grid, setCell, shift, rule, isRunning }: CanvasGridProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [patternGrid, setPatternGrid] = useState<(DetectedPattern | undefined)[]>([]);

  // Viewport State
  const ZOOM = 25;
  const [size, setSize] = useState({ width: 0, height: 0 });
  
  const offset = useMemo(() => {
    if (size.width === 0 || size.height === 0) return { x: 0, y: 0 };
    const gridWidth = (grid[0]?.length || 0) * ZOOM;
    const gridHeight = grid.length * ZOOM;
    return {
      x: Math.max(0, (size.width - gridWidth) / 2),
      y: Math.max(0, (size.height - gridHeight) / 2)
    };
  }, [size, grid]);

  // Keep offset in ref to avoid stale closures in event listeners
  const offsetRef = useRef(offset);
  useEffect(() => {
    offsetRef.current = offset;
  }, [offset]);

  // Interaction State
  const lastMousePos = useRef({ x: 0, y: 0 });
  const dragAcc = useRef({ x: 0, y: 0 });
  const isDrawingRef = useRef(false);
  const drawModeRef = useRef(true);

  // Stale State Ref: Verhindert veraltete Closures in Event-Listenern
  const gridRef = useRef(grid);
  useEffect(() => {
    gridRef.current = grid;
  }, [grid]);

  const rows = grid.length;
  const cols = rows > 0 ? grid[0].length : 0;

  // Pattern detection logic

  useEffect(() => {
    if (rule.name !== 'Conway' || rows * cols > 50000) {
      setPatternGrid([]);
      return;
    }

    if (!isRunning) {
      setPatternGrid(detectPatterns(grid));
      return;
    }

    const timer = setTimeout(() => {
      setPatternGrid(detectPatterns(grid));
    }, 500);

    return () => clearTimeout(timer);
  }, [grid, isRunning, rule.name, rows, cols]);

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

  // Update Canvas Size & Scale
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

    ctx.fillStyle = '#0f172a'; // gray-950
    ctx.fillRect(0, 0, size.width, size.height);

    ctx.save();
    ctx.translate(offset.x, offset.y);
    ctx.scale(ZOOM, ZOOM);

    // Grid Lines
    ctx.lineWidth = 1 / ZOOM;
    ctx.strokeStyle = '#334155'; // gray-700
    ctx.beginPath();
    for (let x = 0; x <= cols; x++) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, rows);
    }
    for (let y = 0; y <= rows; y++) {
      ctx.moveTo(0, y);
      ctx.lineTo(cols, y);
    }
    ctx.stroke();

    // Cells
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        if (grid[y][x]) {
          const pattern = patternGrid[y * cols + x];
          ctx.fillStyle = pattern?.hex || '#22c55e';
          ctx.fillRect(x, y, 1, 1);
        }
      }
    }

    // Border
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 2 / ZOOM;
    ctx.strokeRect(0, 0, cols, rows);

    ctx.restore();
  }, [grid, offset, size, rows, cols, patternGrid]);

  const getGridCoordinates = (clientX: number, clientY: number, rect: DOMRect, currentOffset: { x: number, y: number }) => {
    const x = (clientX - rect.left - currentOffset.x) / ZOOM;
    const y = (clientY - rect.top - currentOffset.y) / ZOOM;
    return { x: Math.floor(x), y: Math.floor(y) };
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (!canvasRef.current) return;

    // Cache Rect and Offset at start of interaction
    const rect = canvasRef.current.getBoundingClientRect();
    const currentOffset = offsetRef.current;

    // Rechtsklick (2) oder gehaltene Taste (2): Dragging
    if (e.button === 2 || e.buttons === 2) {
      lastMousePos.current = { x: e.clientX, y: e.clientY };
      dragAcc.current = { x: 0, y: 0 };

      const onDragMove = (ev: PointerEvent) => {
        const dx = ev.clientX - lastMousePos.current.x;
        const dy = ev.clientY - lastMousePos.current.y;

        dragAcc.current.x += dx;
        dragAcc.current.y += dy;

        const cellsX = Math.floor(dragAcc.current.x / ZOOM);
        const cellsY = Math.floor(dragAcc.current.y / ZOOM);

        if (cellsX !== 0 || cellsY !== 0) {
          shift(cellsX, cellsY);
          dragAcc.current.x -= cellsX * ZOOM;
          dragAcc.current.y -= cellsY * ZOOM;
        }
        lastMousePos.current = { x: ev.clientX, y: ev.clientY };
      };

      const onDragUp = () => {
        window.removeEventListener('pointermove', onDragMove);
        window.removeEventListener('pointerup', onDragUp);
        window.removeEventListener('pointercancel', onDragUp);
      };

      window.addEventListener('pointermove', onDragMove);
      window.addEventListener('pointerup', onDragUp);
      window.addEventListener('pointercancel', onDragUp);
      return;
    }

    // Linksklick: Zeichnen
    if (e.button === 0) {
      isDrawingRef.current = true;
      const { x, y } = getGridCoordinates(e.clientX, e.clientY, rect, currentOffset);
      const currentGrid = gridRef.current;

      if (x >= 0 && x < cols && y >= 0 && y < rows) {
        const currentVal = currentGrid[y][x];
        drawModeRef.current = !currentVal;
        setCell(x, y, !currentVal);
      }

      const onDrawMove = (ev: PointerEvent) => {
        const { x, y } = getGridCoordinates(ev.clientX, ev.clientY, rect, currentOffset);
        const activeGrid = gridRef.current; 
        if (x >= 0 && x < cols && y >= 0 && y < rows) {
          if (activeGrid[y][x] !== drawModeRef.current) {
            setCell(x, y, drawModeRef.current);
          }
        }
      };

      const onDrawUp = () => {
        isDrawingRef.current = false;
        window.removeEventListener('pointermove', onDrawMove);
        window.removeEventListener('pointerup', onDrawUp);
        window.removeEventListener('pointercancel', onDrawUp);
      };

      window.addEventListener('pointermove', onDrawMove);
      window.addEventListener('pointerup', onDrawUp);
      window.addEventListener('pointercancel', onDrawUp);
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    const deltaY = e.deltaY;
    const deltaX = e.deltaX;
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
        onPointerDown={handlePointerDown}
        onWheel={handleWheel}
        onContextMenu={(e) => e.preventDefault()}
        className="block touch-none"
      />

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
