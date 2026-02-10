import type { Grid } from './types';

type Coordinate = { x: number; y: number };
type PatternSignature = string; // JSON.stringify of sorted normalized coordinates

interface PatternDefinition {
  name: string;
  type: 'Still Life' | 'Oscillator' | 'Spaceship';
  signatures: Set<PatternSignature>;
  color: string; // TailWind color class part, e.g., 'blue-500'
  hex: string;
}

// Helper to normalize and sign a set of cells
function normalize(cells: Coordinate[]): Coordinate[] {
  if (cells.length === 0) return [];
  const minX = Math.min(...cells.map(c => c.x));
  const minY = Math.min(...cells.map(c => c.y));
  // Sort by y, then x
  return cells.map(c => ({ x: c.x - minX, y: c.y - minY })).sort((a, b) => a.y - b.y || a.x - b.x);
}

function getSignature(cells: Coordinate[]): PatternSignature {
  return JSON.stringify(normalize(cells));
}

// Generate all 8 transformations (rotations + reflections)
function generateVariations(coords: [number, number][]): Set<PatternSignature> {
  const variations = new Set<PatternSignature>();
  let cells = coords.map(([x, y]) => ({ x, y }));

  // Helper to add current cells signature
  const add = (c: Coordinate[]) => variations.add(getSignature(c));

  // 4 Rotations
  for (let i = 0; i < 4; i++) {
    add(cells);
    // Rotate 90 deg clockwise around (0,0): (x, y) -> (-y, x)
    cells = cells.map(c => ({ x: -c.y, y: c.x }));
  }

  // Flip X
  cells = coords.map(([x, y]) => ({ x: -x, y }));
  // 4 Rotations of flipped
  for (let i = 0; i < 4; i++) {
    add(cells);
    cells = cells.map(c => ({ x: -c.y, y: c.x }));
  }

  return variations;
}

const PATTERNS: PatternDefinition[] = [];

// Helper to get Hex color from Tailwind class
function getHexFromTailwind(className: string): string {
  if (className.includes('bg-red-500')) return '#ef4444';
  if (className.includes('bg-amber-400')) return '#fbbf24';
  if (className.includes('bg-yellow-600')) return '#ca8a04';
  if (className.includes('bg-blue-500')) return '#3b82f6';
  if (className.includes('bg-purple-500')) return '#a855f7';
  if (className.includes('bg-green-600')) return '#16a34a';
  if (className.includes('bg-gray-400')) return '#9ca3af';
  return '#22c55e'; // Default Green-500
}

function registerPattern(name: string, type: 'Still Life' | 'Oscillator' | 'Spaceship', coords: [number, number][], color: string) {
  PATTERNS.push({
    name,
    type,
    signatures: generateVariations(coords),
    color,
    hex: getHexFromTailwind(color)
  });
}

// --- Register Patterns ---

// Still Lifes
registerPattern('Block', 'Still Life', [[0,0], [1,0], [0,1], [1,1]], 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]');
registerPattern('Beehive', 'Still Life', [[1,0], [2,0], [0,1], [3,1], [1,2], [2,2]], 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)]');
registerPattern('Loaf', 'Still Life', [[1,0], [2,0], [0,1], [3,1], [1,2], [3,2], [2,3]], 'bg-yellow-600 shadow-[0_0_8px_rgba(202,138,4,0.6)]');
registerPattern('Boat', 'Still Life', [[0,0], [1,0], [0,1], [2,1], [1,2]], 'bg-gray-400 shadow-[0_0_8px_rgba(156,163,175,0.6)]');
registerPattern('Tub', 'Still Life', [[1,0], [0,1], [2,1], [1,2]], 'bg-gray-400 shadow-[0_0_8px_rgba(156,163,175,0.6)]');
registerPattern('Pond', 'Still Life', [[1,0], [2,0], [0,1], [3,1], [0,2], [3,2], [1,3], [2,3]], 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]');

// Oscillators
registerPattern('Blinker', 'Oscillator', [[0,0], [1,0], [2,0]], 'bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.6)]');
registerPattern('Toad', 'Oscillator', [[1,0], [2,0], [3,0], [0,1], [1,1], [2,1]], 'bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.6)]');
registerPattern('Beacon', 'Oscillator', [[0,0], [1,0], [0,1], [3,3], [2,3], [3,2]], 'bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.6)]');

// Spaceships
registerPattern('Glider', 'Spaceship', [[1,0], [2,1], [0,2], [1,2], [2,2]], 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]');
registerPattern('LWSS', 'Spaceship', [[1,0], [4,0], [0,1], [0,2], [4,2], [0,3], [1,3], [2,3], [3,3]], 'bg-green-600 shadow-[0_0_8px_rgba(22,163,74,0.6)]');

// Detection Logic

export type DetectedPattern = {
  name: string;
  type: string;
  cells: Coordinate[]; // Absolute coordinates
  color: string;
  hex: string;
};

// 8-way connectivity neighbors
const neighbors = [[-1, -1], [0, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [0, 1], [1, 1]];

export function detectPatterns(grid: Grid): (DetectedPattern | undefined)[] {
  const rows = grid.length;
  if (rows === 0) return [];
  const cols = grid[0].length;
  const count = rows * cols;

  // Use a 1D TypedArray for visited tracking (Fastest initialization and access)
  const visited = new Uint8Array(count);

  // Use a 1D array for the result
  const result: (DetectedPattern | undefined)[] = new Array(count);

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const idx = y * cols + x;
      if (grid[y][x] && visited[idx] === 0) {
        // Start BFS for connected component
        const component: Coordinate[] = [];
        const queue: Coordinate[] = [{ x, y }];
        visited[idx] = 1;
        component.push({ x, y });

        let head = 0;
        while(head < queue.length) {
          const curr = queue[head++];

          for (const [dx, dy] of neighbors) {
            const nx = curr.x + dx;
            const ny = curr.y + dy;

            if (nx >= 0 && nx < cols && ny >= 0 && ny < rows && grid[ny][nx]) {
              const nIdx = ny * cols + nx;
              if (visited[nIdx] === 0) {
                visited[nIdx] = 1;
                queue.push({ x: nx, y: ny });
                component.push({ x: nx, y: ny });
              }
            }
          }
        }

        // Identify Pattern
        const signature = getSignature(component);
        let match: PatternDefinition | undefined;

        for (const pattern of PATTERNS) {
          if (pattern.signatures.has(signature)) {
            match = pattern;
            break;
          }
        }

        if (match) {
          const detected: DetectedPattern = {
            name: match.name,
            type: match.type,
            cells: component,
            color: match.color,
            hex: match.hex
          };
          // Map each cell to this pattern in the result grid
          for (const cell of component) {
            result[cell.y * cols + cell.x] = detected;
          }
        }
      }
    }
  }

  return result;
}
