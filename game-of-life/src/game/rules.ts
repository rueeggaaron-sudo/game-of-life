import type { Grid, Cell, Rule } from './types';

export const CONWAY_RULE: Rule = { name: "Conway", birth: [3], survival: [2, 3] };
export const HIGHLIFE_RULE: Rule = { name: "HighLife", birth: [3, 6], survival: [2, 3] };
export const SEEDS_RULE: Rule = { name: "Seeds", birth: [2], survival: [] };

/**
 * Calculates the number of alive neighbors for a given cell at (x, y).
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
 * Determines the next state of a cell based on the provided Rule.
 */
export function getNextCellState(isAlive: Cell, neighbors: number, rule: Rule): Cell {
  if (isAlive) {
    return rule.survival.includes(neighbors);
  } else {
    return rule.birth.includes(neighbors);
  }
}

/**
 * Computes the next generation of the entire grid.
 */
export function computeNextGeneration(currentGrid: Grid, rule: Rule = CONWAY_RULE): Grid {
  const rows = currentGrid.length;
  if (rows === 0) return [];
  const cols = currentGrid[0].length;

  const nextGrid: Grid = Array(rows).fill(null).map(() => Array(cols).fill(false));

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const neighbors = countNeighbors(currentGrid, x, y);
      const isAlive = currentGrid[y][x];
      nextGrid[y][x] = getNextCellState(isAlive, neighbors, rule);
    }
  }

  return nextGrid;
}
