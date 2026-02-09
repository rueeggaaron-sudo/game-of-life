import type { Grid } from './types';

/**
 * Creates an empty grid (all dead cells) of the specified size.
 * @param rows Number of rows
 * @param cols Number of columns
 * @returns A Grid filled with false (dead)
 */
export function createEmptyGrid(rows: number, cols: number): Grid {
  return Array(rows).fill(null).map(() => Array(cols).fill(false));
}

/**
 * Creates a randomized grid where each cell has a chance to be alive.
 * @param rows Number of rows
 * @param cols Number of columns
 * @param density Probability of a cell being alive (0.0 to 1.0). Default 0.2.
 * @returns A Grid with random alive/dead cells
 */
export function createRandomGrid(rows: number, cols: number, density: number = 0.2): Grid {
  return Array(rows).fill(null).map(() =>
    Array(cols).fill(null).map(() => Math.random() < density)
  );
}

/**
 * Toggles the state of a specific cell in the grid.
 * Returns a new grid (immutable update).
 * @param grid Current grid
 * @param x Column index
 * @param y Row index
 * @returns New grid with the cell toggled
 */
export function toggleCell(grid: Grid, x: number, y: number): Grid {
  const newGrid = grid.map(row => [...row]); // Shallow copy
  if (y >= 0 && y < newGrid.length && x >= 0 && x < newGrid[0].length) {
    newGrid[y][x] = !newGrid[y][x];
  }
  return newGrid;
}

/**
 * Clears the grid (sets all cells to dead).
 * @param grid Current grid (used for dimensions)
 * @returns A new empty grid of same dimensions
 */
export function clearGrid(grid: Grid): Grid {
  return createEmptyGrid(grid.length, grid[0].length);
}
