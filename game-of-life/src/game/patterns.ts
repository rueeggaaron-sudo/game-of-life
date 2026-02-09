export interface Pattern {
  name: string;
  grid: boolean[][];
}

export const patterns: Pattern[] = [
  {
    name: "Glider",
    grid: [
      [false, true, false],
      [false, false, true],
      [true, true, true]
    ]
  },
  {
    name: "Lightweight Spaceship",
    grid: [
      [false, true, true, true, true],
      [true, false, false, false, true],
      [false, false, false, false, true],
      [true, false, false, true, false]
    ]
  },
  {
    name: "Pulsar (Period 3)",
    grid: [
      [false, false, true, true, true, false, false, false, true, true, true, false, false],
      [false, false, false, false, false, false, false, false, false, false, false, false, false],
      [true, false, false, false, false, true, false, true, false, false, false, false, true],
      [true, false, false, false, false, true, false, true, false, false, false, false, true],
      [true, false, false, false, false, true, false, true, false, false, false, false, true],
      [false, false, true, true, true, false, false, false, true, true, true, false, false],
      [false, false, false, false, false, false, false, false, false, false, false, false, false],
      [false, false, true, true, true, false, false, false, true, true, true, false, false],
      [true, false, false, false, false, true, false, true, false, false, false, false, true],
      [true, false, false, false, false, true, false, true, false, false, false, false, true],
      [true, false, false, false, false, true, false, true, false, false, false, false, true],
      [false, false, false, false, false, false, false, false, false, false, false, false, false],
      [false, false, true, true, true, false, false, false, true, true, true, false, false]
    ]
  },
  {
    name: "Gosper Glider Gun",
    grid: [
      [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, false, false, false, false, false, false, false, false, false, false, false],
      [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, false, true, false, false, false, false, false, false, false, false, false, false, false],
      [false, false, false, false, false, false, false, false, false, false, false, false, true, true, false, false, false, false, false, false, true, true, false, false, false, false, false, false, false, false, false, false, false, false, true, true],
      [false, false, false, false, false, false, false, false, false, false, false, true, false, false, false, true, false, false, false, false, true, true, false, false, false, false, false, false, false, false, false, false, false, false, true, true],
      [true, true, false, false, false, false, false, false, false, false, true, false, false, false, false, false, true, false, false, false, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
      [true, true, false, false, false, false, false, false, false, false, true, false, false, false, true, false, true, true, false, false, false, false, true, false, true, false, false, false, false, false, false, false, false, false, false, false],
      [false, false, false, false, false, false, false, false, false, false, true, false, false, false, false, false, true, false, false, false, false, false, false, false, true, false, false, false, false, false, false, false, false, false, false, false],
      [false, false, false, false, false, false, false, false, false, false, false, true, false, false, false, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
      [false, false, false, false, false, false, false, false, false, false, false, false, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false]
    ]
  }
];
