import type { Grid, Cell } from './types';

/**
 * Calculates the number of alive neighbors for a given cell at (x, y).
 * Uses modulo arithmetic for wrapping around the edges (toroidal grid) is a common variant,
 * but the standard Conway implementation usually has hard edges.
 * Given the requirements don't specify wrapping, I will assume hard edges (dead zone outside).
 */
export function countNeighbors(grid: Grid, x: number, y: number): number {
  const rows = grid.length;
  const cols = grid[0].length;
  let count = 0;

  // Check all 8 possible neighbors
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      // Skip the cell itself
      if (i === 0 && j === 0) continue;

      const newRow = y + i;
      const newCol = x + j;

      // Check boundaries
      if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols) {
        if (grid[newRow][newCol]) {
          count++;
        }
      }
    }
  }
  return count;
}

/**
 * Determines the next state of a cell based on Conway's Game of Life rules:
 * 1. Birth: A dead cell with exactly 3 live neighbors becomes a live cell.
 * 2. Survival: A live cell with 2 or 3 live neighbors stays alive.
 * 3. Death: A live cell with fewer than 2 or more than 3 live neighbors dies.
 *
 * @param isAlive Current state of the cell
 * @param neighbors Number of alive neighbors
 * @returns The new state of the cell (true = alive, false = dead)
 */
export function getNextCellState(isAlive: Cell, neighbors: number): Cell {
  if (isAlive) {
    // Rule: Survival (2 or 3 neighbors)
    // Rule: Death (< 2 or > 3 neighbors)
    return neighbors === 2 || neighbors === 3;
  } else {
    // Rule: Birth (exactly 3 neighbors)
    return neighbors === 3;
  }
}

/**
 * Computes the next generation of the entire grid.
 * @param currentGrid The current state of the grid
 * @returns A new grid representing the next generation
 */
export function computeNextGeneration(currentGrid: Grid): Grid {
  const rows = currentGrid.length;
  if (rows === 0) return [];
  const cols = currentGrid[0].length;

  // Create a new grid to store the next state
  // We cannot modify the current grid in-place because the updates must happen simultaneously
  const nextGrid: Grid = Array(rows).fill(null).map(() => Array(cols).fill(false));

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const neighbors = countNeighbors(currentGrid, x, y);
      const isAlive = currentGrid[y][x];
      nextGrid[y][x] = getNextCellState(isAlive, neighbors);
    }
  }

  return nextGrid;
}
