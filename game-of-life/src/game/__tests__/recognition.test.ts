import { describe, it, expect } from 'vitest';
import { detectPatterns } from '../recognition';
import { createEmptyGrid, placePattern } from '../grid';

describe('recognition', () => {
  it('should detect a Block (Still Life)', () => {
    const grid = createEmptyGrid(10, 10);
    // Block: 2x2
    const block = [[true, true], [true, true]];
    const withBlock = placePattern(grid, block, 1, 1);

    const detected = detectPatterns(withBlock);
    // Any cell in the block should identify as 'Block'
    const key = `1,1`;
    expect(detected.has(key)).toBe(true);
    expect(detected.get(key)?.name).toBe('Block');
    expect(detected.get(key)?.type).toBe('Still Life');
  });

  it('should detect a Blinker (Oscillator)', () => {
    const grid = createEmptyGrid(10, 10);
    // Blinker: 1x3
    const blinker = [[true, true, true]]; // Horizontal
    const withBlinker = placePattern(grid, blinker, 2, 2);

    const detected = detectPatterns(withBlinker);
    const key = `2,2`; // First cell
    expect(detected.has(key)).toBe(true);
    expect(detected.get(key)?.name).toBe('Blinker');
  });

  it('should detect a Glider (Spaceship)', () => {
    const grid = createEmptyGrid(10, 10);
    // Glider
    const glider = [
      [false, true, false],
      [false, false, true],
      [true, true, true]
    ];
    const withGlider = placePattern(grid, glider, 1, 1);

    const detected = detectPatterns(withGlider);
    // Check one of the live cells
    const key = `3,3`; // (1+2, 1+2) -> 3,3 is bottom right of glider
    expect(detected.has(key)).toBe(true);
    expect(detected.get(key)?.name).toBe('Glider');
  });
});
