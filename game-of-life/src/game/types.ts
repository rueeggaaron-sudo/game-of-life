// Represents a single cell state: true = Alive, false = Dead
export type Cell = boolean;

// The grid is a 2D array of Cells
export type Grid = Cell[][];

// Coordinates for a cell
export interface Coords {
  x: number;
  y: number;
}

// Rule interface for cellular automata
export interface Rule {
  name: string;
  birth: number[];
  survival: number[];
}
