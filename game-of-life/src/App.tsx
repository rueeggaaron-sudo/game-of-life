import { useState, useMemo, useEffect } from 'react';
import { useGameOfLife } from './hooks/useGameOfLife';
import { CanvasGrid } from './components/CanvasGrid';
import { Controls } from './components/Controls';
import { Stats } from './components/Stats';
import { IntroScreen } from './components/IntroScreen';
import { MobileControls } from './components/MobileControls';


// Helper to determine interval based on speed level (1, 2, 3)
// We want to be ~75% slower than before.
// Original: 100ms for 1, 2, 3 cells.
// New: Move 1 cell every X ms.
// Level 1: 1 cell / 400ms (was 1 cell / 100ms -> 25% speed)
// Level 2: 1 cell / 200ms (was 2 cells / 100ms -> 25% speed)
// Level 3: 1 cell / 130ms (was 3 cells / 100ms -> ~25% speed)
const getSpeedInterval = (level: number) => {
  switch (level) {
    case 1: return 400;
    case 2: return 200;
    case 3: return 130;
    default: return 400;
  }
};

function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [velocity, setVelocity] = useState({ x: 0, y: 0 });

  const {
    grid,
    generation,
    isRunning,
    setIsRunning,
    setCell,
    step,
    reset,
    randomize,
    loadPattern,
    speed,
    setSpeed,
    shift,
    rule,
    setRule,
  } = useGameOfLife();

  // Mobile Movement Loop - X Axis
  useEffect(() => {
    if (velocity.x === 0) return;
    const speedLevel = Math.abs(velocity.x);
    // Move 1 cell at a time, but vary frequency
    const intervalMs = getSpeedInterval(speedLevel);

    const interval = setInterval(() => {
      shift(Math.sign(velocity.x), 0);
    }, intervalMs);

    return () => clearInterval(interval);
  }, [velocity.x, shift]);

  // Mobile Movement Loop - Y Axis
  useEffect(() => {
    if (velocity.y === 0) return;
    const speedLevel = Math.abs(velocity.y);
    // Move 1 cell at a time, but vary frequency
    const intervalMs = getSpeedInterval(speedLevel);

    const interval = setInterval(() => {
      shift(0, Math.sign(velocity.y));
    }, intervalMs);

    return () => clearInterval(interval);
  }, [velocity.y, shift]);

  const aliveCount = useMemo(() => {
    let count = 0;
    for (const row of grid) {
      for (const cell of row) {
        if (cell) count++;
      }
    }
    return count;
  }, [grid]);

  return (
    // Outer "Void" Container
    <div className="relative w-screen h-screen bg-black text-white overflow-hidden font-sans selection:bg-blue-500/30 flex flex-col p-4 md:p-6 gap-4">

      {/* Intro Screen Overlay (Full Viewport) */}
      {showIntro && <IntroScreen onStart={() => setShowIntro(false)} />}

      {/* Header Section - Fixed Height */}
      <header className="flex flex-col md:flex-row justify-between items-center gap-4 bg-gray-900/50 p-4 rounded-xl border border-gray-800 shrink-0">
        <div className="flex flex-col md:flex-row items-center gap-4">
            <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-green-400 bg-clip-text text-transparent drop-shadow-sm tracking-tight text-center md:text-left">
              Conway's Game of Life
            </h1>
            <div className="bg-gray-800/80 px-4 py-1.5 rounded-full border border-gray-700 text-sm">
              <Stats generation={generation} aliveCount={aliveCount} />
            </div>
        </div>

          <button
          onClick={() => setShowIntro(true)}
          className="text-xs md:text-sm text-gray-400 hover:text-white transition-all border border-gray-800 hover:border-gray-600 bg-gray-900 hover:bg-gray-800 rounded-lg px-3 py-1.5 shadow-sm"
        >
          Über / Regeln
        </button>
      </header>

      {/* Game Grid Area - Takes remaining space */}
      <div className="relative flex-1 bg-gray-950 rounded-xl border border-gray-800/60 shadow-[0_0_60px_-15px_rgba(59,130,246,0.15)] overflow-hidden min-h-0">
          <CanvasGrid grid={grid} setCell={setCell} shift={shift} rule={rule} />
          {/* Mobile Controls Overlay - Only over the grid */}
          <MobileControls velocity={velocity} setVelocity={setVelocity} />
      </div>

      {/* Footer/Controls Section - Fixed Height */}
      <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-800 flex justify-center shrink-0 overflow-x-auto">
            <Controls
              isRunning={isRunning}
              toggleRunning={() => setIsRunning(!isRunning)}
              step={step}
              reset={reset}
              randomize={randomize}
              loadPattern={loadPattern}
              speed={speed}
              setSpeed={setSpeed}
              rule={rule}
              setRule={setRule}
            />
      </div>

    </div>
  );
}

export default App;
