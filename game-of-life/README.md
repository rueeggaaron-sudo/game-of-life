# Conway's Game of Life

A clean, responsive, and interactive implementation of Conway's Game of Life built with React, TypeScript, and Tailwind CSS.

This project demonstrates cellular automata where complex patterns emerge from simple rules.

## Features

- **Interactive Grid:** Click cells to toggle them alive or dead.
- **Responsive Layout:** Works on desktop and mobile devices.
- **Controls:**
  - Play / Pause simulation.
  - Single Step mode.
  - Reset / Clear grid.
  - Randomize grid.
  - Adjustable Speed (50ms - 1000ms).
  - Grid Size Presets (Small, Medium, Large).
- **Statistics:** Generation counter and Alive cell population.
- **Intro Screen:** Explanation of rules and "Emergence".

## The Rules

1.  **Birth:** A dead cell with exactly 3 live neighbors becomes a live cell.
2.  **Survival:** A live cell with 2 or 3 live neighbors stays alive.
3.  **Death:** A live cell with fewer than 2 or more than 3 live neighbors dies.

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm

### Installation

1.  Clone the repository:
    ```bash
    git clone <repository-url>
    cd game-of-life
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Start the development server:
    ```bash
    npm run dev
    ```
    Open [http://localhost:5173](http://localhost:5173) in your browser.

## Building for Production

To create a production-ready build:

```bash
npm run build
```

The output will be in the `dist` directory.

## Deployment

This project is built with Vite and can be easily deployed to static hosting providers.

### Vercel (Recommended)
1.  Import the project from GitHub.
2.  Framework Preset: **Vite**.
3.  Deploy.

### Netlify
1.  Import from Git.
2.  Build command: `npm run build`.
3.  Publish directory: `dist`.

### GitHub Pages
1.  Update `vite.config.ts` with `base: '/repo-name/'`.
2.  Run build and push `dist` folder to `gh-pages` branch (or use a workflow).

## Video Reference

This project was built based on the requirements from:
[Video Link](https://youtu.be/TCLvGLA3WPM?si=-We4-WzZADlUSGRT)

## Technologies Used

- React 19
- TypeScript
- Vite
- Tailwind CSS v4
