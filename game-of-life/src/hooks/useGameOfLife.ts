import { useState, useCallback, useEffect } from 'react';
import type { Grid, Rule } from '../game/types';
import { createEmptyGrid, createRandomGrid, placePattern, shiftGrid } from '../game/grid';
import { computeNextGeneration, CONWAY_RULE } from '../game/rules';
import type { Pattern } from '../game/patterns';

export const useGameOfLife = () => {
  const [rows] = useState(50);
  const [cols] = useState(50); // Default medium size
  const [grid, setGrid] = useState<Grid>(() => createEmptyGrid(50, 50));
  const [generation, setGeneration] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(100); // ms
  const [rule, setRule] = useState<Rule>(CONWAY_RULE);
  const [isWrapped, setIsWrapped] = useState(false);

  const reset = useCallback(() => {
    setGrid(createEmptyGrid(rows, cols));
    setGeneration(0);
    setIsRunning(false);
  }, [rows, cols]);

  const randomize = useCallback(() => {
    setGrid(createRandomGrid(rows, cols));
    setGeneration(0);
  }, [rows, cols]);

  const loadPattern = useCallback((pattern: Pattern) => {
    const emptyGrid = createEmptyGrid(rows, cols);
    const patternHeight = pattern.grid.length;
    const patternWidth = pattern.grid[0].length;

    // Center the pattern
    const offsetY = Math.floor((rows - patternHeight) / 2);
    const offsetX = Math.floor((cols - patternWidth) / 2);

    const newGrid = placePattern(emptyGrid, pattern.grid, offsetX, offsetY);
    setGrid(newGrid);
    setGeneration(0);
    setIsRunning(false);
  }, [rows, cols]);

  const setCell = useCallback((x: number, y: number, value: boolean) => {
    setGrid((prevGrid) => {
      if (prevGrid[y][x] === value) return prevGrid;
      const newGrid = prevGrid.map((row) => [...row]);
      newGrid[y][x] = value;
      return newGrid;
    });
  }, []);

  const step = useCallback(() => {
    setGrid((prevGrid) => computeNextGeneration(prevGrid, rule, isWrapped));
    setGeneration((gen) => gen + 1);
  }, [rule, isWrapped]);

  const shift = useCallback((dx: number, dy: number) => {
    setGrid((prevGrid) => shiftGrid(prevGrid, dx, dy, 0.0, isWrapped));
  }, [isWrapped]);

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
    setCell,
    step,
    reset,
    randomize,
    loadPattern,
    speed,
    setSpeed,
    shift,
    rule,
    setRule,
    isWrapped,
    setIsWrapped,
  };
};
