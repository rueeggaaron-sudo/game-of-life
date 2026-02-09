import type { Grid as GridType } from '../game/types';
import { Cell } from './Cell';

interface GridProps {
  grid: GridType;
  onToggle: (x: number, y: number) => void;
}

export const Grid = ({ grid, onToggle }: GridProps) => {
  const rows = grid.length;
  if (rows === 0) return null;
  const cols = grid[0].length;

  return (
    <div className="overflow-auto w-full flex justify-center p-4 bg-gray-950/50 rounded-xl border border-gray-800/50 backdrop-blur-sm shadow-inner">
      <div
        className="grid gap-[1px] bg-gray-800/50 border border-gray-700 shadow-2xl"
        style={{
          gridTemplateColumns: `repeat(${cols}, 20px)`,
          width: 'fit-content',
        }}
      >
        {grid.map((row, y) =>
          row.map((isAlive, x) => (
            <Cell key={`${x}-${y}`} x={x} y={y} isAlive={isAlive} onToggle={onToggle} />
          ))
        )}
      </div>
    </div>
  );
};
