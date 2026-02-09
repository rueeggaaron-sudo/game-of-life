import { useRef, useCallback, useEffect, useMemo } from 'react';
import type { Grid as GridType } from '../game/types';
import { Cell } from './Cell';
import { detectPatterns } from '../game/recognition';

interface GridProps {
  grid: GridType;
  setCell: (x: number, y: number, value: boolean) => void;
}

export const Grid = ({ grid, setCell }: GridProps) => {
  // Use refs for interaction state to avoid unnecessary re-renders
  const isDrawingRef = useRef(false);
  const drawModeRef = useRef(true); // true = draw alive, false = erase

  // We still need a ref for grid to access it in callbacks without making them depend on it
  const gridRef = useRef(grid);

  useEffect(() => {
    gridRef.current = grid;
  }, [grid]);

  // Detect patterns
  const patternMap = useMemo(() => detectPatterns(grid), [grid]);

  const rows = grid.length;
  const cols = rows > 0 ? grid[0].length : 0;

  const handleMouseDown = useCallback((x: number, y: number) => {
    isDrawingRef.current = true;
    // Determine mode based on the clicked cell's current state
    const currentVal = gridRef.current[y][x];
    const newMode = !currentVal;
    drawModeRef.current = newMode;
    setCell(x, y, newMode);
  }, [setCell]);

  const handleMouseEnter = useCallback((x: number, y: number) => {
    if (isDrawingRef.current) {
      setCell(x, y, drawModeRef.current);
    }
  }, [setCell]);

  const handleMouseUp = useCallback(() => {
    isDrawingRef.current = false;
  }, []);

  const handleMouseLeave = useCallback(() => {
    isDrawingRef.current = false;
  }, []);

  if (rows === 0) return null;

  return (
    <div
      className="overflow-auto w-full flex justify-center p-4 bg-gray-950/50 rounded-xl border border-gray-800/50 backdrop-blur-sm shadow-inner select-none"
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className="grid gap-[1px] bg-gray-800/50 border border-gray-700 shadow-2xl touch-none"
        style={{
          gridTemplateColumns: `repeat(${cols}, 20px)`,
          width: 'fit-content',
        }}
      >
        {grid.map((row, y) =>
          row.map((isAlive, x) => {
            const pattern = patternMap.get(`${x},${y}`);
            return (
              <Cell
                key={`${x}-${y}`}
                x={x}
                y={y}
                isAlive={isAlive}
                color={pattern?.color}
                onMouseDown={handleMouseDown}
                onMouseEnter={handleMouseEnter}
              />
            );
          })
        )}
      </div>
    </div>
  );
};
