import React from 'react';

interface CellProps {
  x: number;
  y: number;
  isAlive: boolean;
  color?: string;
  onMouseDown: (x: number, y: number) => void;
  onMouseEnter: (x: number, y: number) => void;
}

export const Cell = React.memo(({ x, y, isAlive, color, onMouseDown, onMouseEnter }: CellProps) => {
  const baseClasses = "aspect-square w-full h-full border-[0.5px] border-gray-800/30 transition-colors duration-75 cursor-pointer select-none hover:bg-gray-700/50";
  // Default alive style: Green
  const defaultAliveStyle = "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]";

  let cellClass = "";
  if (isAlive) {
    cellClass = color || defaultAliveStyle;
  } else {
    cellClass = "bg-transparent";
  }

  return (
    <div
      onMouseDown={() => onMouseDown(x, y)}
      onMouseEnter={() => onMouseEnter(x, y)}
      className={`${baseClasses} ${cellClass}`}
    />
  );
});
