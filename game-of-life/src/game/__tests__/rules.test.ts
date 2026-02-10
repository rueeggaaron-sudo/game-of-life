import { describe, it, expect } from 'vitest';
import { computeNextGeneration } from '../rules';
import { createEmptyGrid } from '../grid';

describe('rules', () => {
  it('should handle underpopulation (live cell < 2 neighbors dies)', () => {
    const grid = createEmptyGrid(3, 3);
    grid[1][1] = true; // 0 neighbors
    const next = computeNextGeneration(grid);
    expect(next[1][1]).toBe(false);
  });

  it('should handle survival (live cell with 2 or 3 neighbors lives)', () => {
    const grid = createEmptyGrid(3, 3);
    grid[1][1] = true;
    grid[0][1] = true;
    grid[2][1] = true; // 2 neighbors for 1,1
    const next = computeNextGeneration(grid);
    expect(next[1][1]).toBe(true);
  });

  it('should handle overpopulation (live cell > 3 neighbors dies)', () => {
    const grid = createEmptyGrid(3, 3);
    grid[1][1] = true;
    grid[0][1] = true;
    grid[2][1] = true;
    grid[1][0] = true;
    grid[1][2] = true; // 4 neighbors
    const next = computeNextGeneration(grid);
    expect(next[1][1]).toBe(false);
  });

  it('should handle reproduction (dead cell with 3 neighbors becomes live)', () => {
    const grid = createEmptyGrid(3, 3);
    grid[0][1] = true;
    grid[1][0] = true;
    grid[1][2] = true; // 3 neighbors for 1,1 (which is dead)
    const next = computeNextGeneration(grid);
    expect(next[1][1]).toBe(true);
  });
});
