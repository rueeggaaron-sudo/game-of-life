import { describe, it, expect } from 'vitest';
import { createEmptyGrid, createRandomGrid, placePattern, toggleCell, clearGrid, shiftGrid } from '../grid';

describe('grid', () => {
  it('createEmptyGrid should create a grid of correct size with all false', () => {
    const grid = createEmptyGrid(3, 3);
    expect(grid.length).toBe(3);
    expect(grid[0].length).toBe(3);
    expect(grid.every(row => row.every(cell => cell === false))).toBe(true);
  });

  it('createRandomGrid should create a grid of correct size', () => {
    const grid = createRandomGrid(3, 3);
    expect(grid.length).toBe(3);
    expect(grid[0].length).toBe(3);
  });

  it('placePattern should place a pattern correctly', () => {
    const grid = createEmptyGrid(5, 5);
    const pattern = [[true, true], [true, true]];
    const newGrid = placePattern(grid, pattern, 1, 1);
    expect(newGrid[1][1]).toBe(true);
    expect(newGrid[2][2]).toBe(true);
    expect(newGrid[0][0]).toBe(false);
  });

  it('toggleCell should toggle a cell', () => {
    const grid = createEmptyGrid(3, 3);
    const newGrid = toggleCell(grid, 1, 1);
    expect(newGrid[1][1]).toBe(true);
    const newerGrid = toggleCell(newGrid, 1, 1);
    expect(newerGrid[1][1]).toBe(false);
  });

  it('clearGrid should return an empty grid', () => {
    const grid = createRandomGrid(3, 3, 1.0); // All true
    const cleared = clearGrid(grid);
    expect(cleared.every(row => row.every(cell => cell === false))).toBe(true);
  });

  describe('shiftGrid', () => {
    it('should shift content correctly', () => {
      const grid = createEmptyGrid(3, 3);
      grid[1][1] = true; // Center
      // Shift right by 1
      const shifted = shiftGrid(grid, 1, 0, 0); // density 0 for deterministic test
      expect(shifted[1][2]).toBe(true);
      expect(shifted[1][1]).toBe(false);
    });

    it('should populate new cells with density 1.0', () => {
      const grid = createEmptyGrid(3, 3);
      // Shift right by 1, so column 0 is new.
      const shifted = shiftGrid(grid, 1, 0, 1.0);
      expect(shifted[0][0]).toBe(true);
      expect(shifted[1][0]).toBe(true);
      expect(shifted[2][0]).toBe(true);
      // Original content (empty) shifted right
      expect(shifted[0][1]).toBe(false);
    });

    it('should populate new cells with density 0.0', () => {
      const grid = createEmptyGrid(3, 3);
      // Shift right by 1, so column 0 is new.
      const shifted = shiftGrid(grid, 1, 0, 0.0);
      expect(shifted[0][0]).toBe(false);
      expect(shifted[1][0]).toBe(false);
      expect(shifted[2][0]).toBe(false);
    });
  });
});
