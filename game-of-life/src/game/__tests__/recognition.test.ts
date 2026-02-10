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
    // Index: y * cols + x. 1 * 10 + 1 = 11
    const idx = 1 * 10 + 1;
    expect(detected[idx]).toBeDefined();
    expect(detected[idx]?.name).toBe('Block');
    expect(detected[idx]?.type).toBe('Still Life');
  });

  it('should detect a Blinker (Oscillator)', () => {
    const grid = createEmptyGrid(10, 10);
    // Blinker: 1x3
    const blinker = [[true, true, true]]; // Horizontal
    const withBlinker = placePattern(grid, blinker, 2, 2);

    const detected = detectPatterns(withBlinker);
    // Index: 2 * 10 + 2 = 22
    const idx = 2 * 10 + 2;
    expect(detected[idx]).toBeDefined();
    expect(detected[idx]?.name).toBe('Blinker');
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
    // Check one of the live cells. 3,3 is bottom right.
    // Index: 3 * 10 + 3 = 33
    const idx = 3 * 10 + 3;
    expect(detected[idx]).toBeDefined();
    expect(detected[idx]?.name).toBe('Glider');
  });
});
