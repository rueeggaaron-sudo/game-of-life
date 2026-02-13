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
 * @param density Probability of a cell being alive (0.0 to 1.0). Default 0.3.
 * @returns A Grid with random alive/dead cells
 */
export function createRandomGrid(rows: number, cols: number, density: number = 0.3): Grid {
  return Array(rows).fill(null).map(() =>
    Array(cols).fill(null).map(() => Math.random() < density)
  );
}

/**
 * Places a pattern on the grid at a specific position.
 * @param grid Current grid
 * @param pattern 2D boolean array representing the pattern
 * @param offsetX Top-left X coordinate
 * @param offsetY Top-left Y coordinate
 * @returns New grid with pattern applied
 */
export function placePattern(grid: Grid, pattern: boolean[][], offsetX: number, offsetY: number): Grid {
  const newGrid = grid.map(row => [...row]);
  const rows = newGrid.length;
  const cols = newGrid[0].length;

  for (let y = 0; y < pattern.length; y++) {
    for (let x = 0; x < pattern[y].length; x++) {
      const targetY = offsetY + y;
      const targetX = offsetX + x;

      if (targetY >= 0 && targetY < rows && targetX >= 0 && targetX < cols) {
        newGrid[targetY][targetX] = pattern[y][x];
      }
    }
  }
  return newGrid;
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

/**
 * Shifts the grid content by (dx, dy).
 * New cells entering the view are dead (false).
 * @param grid Current grid
 * @param dx Horizontal shift amount (positive = right)
 * @param dy Vertical shift amount (positive = down)
 * @returns New shifted grid
 */
export function shiftGrid(grid: Grid, dx: number, dy: number, density: number = 0.0): Grid {
  const rows = grid.length;
  if (rows === 0) return grid;
  const cols = grid[0].length;
  const newGrid = createEmptyGrid(rows, cols);

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const srcY = y - dy;
      const srcX = x - dx;

      if (srcY >= 0 && srcY < rows && srcX >= 0 && srcX < cols) {
        newGrid[y][x] = grid[srcY][srcX];
      } else {
        // Generative fill for new cells
        newGrid[y][x] = Math.random() < density;
      }
    }
  }
  return newGrid;
}
