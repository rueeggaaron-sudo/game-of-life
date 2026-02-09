import { useState, useCallback, useEffect } from 'react';
import type { Grid } from '../game/types';
import { createEmptyGrid, createRandomGrid, toggleCell as toggleGridCell } from '../game/grid';
import { computeNextGeneration } from '../game/rules';

export const useGameOfLife = () => {
  const [rows, setRows] = useState(30);
  const [cols, setCols] = useState(50); // Default medium size
  const [grid, setGrid] = useState<Grid>(() => createEmptyGrid(rows, cols));
  const [generation, setGeneration] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(100); // ms

  // Reset grid when size changes
  const setGridSize = useCallback((newRows: number, newCols: number) => {
    setRows(newRows);
    setCols(newCols);
    setGrid(createEmptyGrid(newRows, newCols));
    setGeneration(0);
    setIsRunning(false);
  }, []);

  const reset = useCallback(() => {
    setGrid(createEmptyGrid(rows, cols));
    setGeneration(0);
    setIsRunning(false);
  }, [rows, cols]);

  const randomize = useCallback(() => {
    setGrid(createRandomGrid(rows, cols));
    setGeneration(0);
  }, [rows, cols]);

  const toggleCell = useCallback((x: number, y: number) => {
    setGrid((prevGrid) => toggleGridCell(prevGrid, x, y));
  }, []);

  const step = useCallback(() => {
    setGrid((prevGrid) => computeNextGeneration(prevGrid));
    setGeneration((gen) => gen + 1);
  }, []);

  // Game loop
  useEffect(() => {
    let intervalId: number | undefined;
    if (isRunning) {
      intervalId = window.setInterval(step, speed);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isRunning, speed, step]);

  return {
    grid,
    generation,
    isRunning,
    setIsRunning,
    toggleCell,
    step,
    reset,
    randomize,
    speed,
    setSpeed,
    rows,
    cols,
    setGridSize,
  };
};
