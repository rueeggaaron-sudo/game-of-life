import React from 'react';

interface CellProps {
  x: number;
  y: number;
  isAlive: boolean;
  onToggle: (x: number, y: number) => void;
}

export const Cell = React.memo(({ x, y, isAlive, onToggle }: CellProps) => {
  return (
    <div
      onClick={() => onToggle(x, y)}
      className={`aspect-square border-[0.5px] border-gray-800/30 transition-colors duration-75 ${
        isAlive ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-transparent'
      } hover:bg-gray-700 cursor-pointer`}
    />
  );
});
