import { useState, useMemo, useEffect } from 'react';
import { useGameOfLife } from './hooks/useGameOfLife';
import { CanvasGrid } from './components/CanvasGrid';
import { SphereGrid } from './components/SphereGrid';
import { Controls } from './components/Controls';
import { Stats } from './components/Stats';
import { IntroScreen } from './components/IntroScreen';
import { MobileControls } from './components/MobileControls';


// Helper to determine interval based on speed level (1, 2, 3) AND simulation speed
const getSpeedInterval = (level: number, baseSpeed: number) => {
  // Base requirement:
  // Level 1: 1 cell per baseSpeed ms (1:1 with simulation)
  // Level 2: 1.5x faster -> baseSpeed / 1.5
  // Level 3: 2x faster -> baseSpeed / 2.0

  switch (level) {
    case 1: return baseSpeed;
    case 2: return baseSpeed / 1.5;
    case 3: return baseSpeed / 2.0;
    default: return baseSpeed;
  }
};

function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [velocity, setVelocity] = useState({ x: 0, y: 0 });
  const [viewMode, setViewMode] = useState<'flat' | 'sphere'>('flat');

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
    setIsWrapped,
  } = useGameOfLife();

  const toggleView = () => {
    if (viewMode === 'flat') {
      setViewMode('sphere');
      setIsWrapped(true);
    } else {
      setViewMode('flat');
      setIsWrapped(false);
    }
  };

  // Mobile Movement Loop - X Axis
  useEffect(() => {
    if (velocity.x === 0) return;
    const speedLevel = Math.abs(velocity.x);
    // Dynamically calculate interval based on current simulation speed
    const intervalMs = getSpeedInterval(speedLevel, speed);

    const interval = setInterval(() => {
      shift(Math.sign(velocity.x), 0);
    }, intervalMs);

    return () => clearInterval(interval);
  }, [velocity.x, shift, speed]); // Added speed dependency

  // Mobile Movement Loop - Y Axis
  useEffect(() => {
    if (velocity.y === 0) return;
    const speedLevel = Math.abs(velocity.y);
    const intervalMs = getSpeedInterval(speedLevel, speed);

    const interval = setInterval(() => {
      shift(0, Math.sign(velocity.y));
    }, intervalMs);

    return () => clearInterval(interval);
  }, [velocity.y, shift, speed]); // Added speed dependency

  // Enhanced Toggle Running to also stop movement
  const handleToggleRunning = () => {
    if (isRunning) {
      // If stopping, also stop movement
      setVelocity({ x: 0, y: 0 });
    }
    setIsRunning(!isRunning);
  };

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
    // Use w-full and h-screen. removed max-w constraint implicitly by not adding it.
    // px-4 md:px-8 ensures some padding but allows full width usage.
    <div className="relative w-full h-screen bg-black text-white overflow-hidden font-sans selection:bg-blue-500/30 flex flex-col p-4 md:p-6 gap-4">

      {/* Intro Screen Overlay (Full Viewport) */}
      {showIntro && <IntroScreen onStart={() => setShowIntro(false)} />}

      {/* Header Section - Fixed Height */}
      <header className="flex flex-col md:flex-row justify-between items-center gap-4 bg-gray-900/50 p-4 rounded-xl border border-gray-800 shrink-0 w-full">
        <div className="flex flex-col md:flex-row items-center gap-4">
            <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-green-400 bg-clip-text text-transparent drop-shadow-sm tracking-tight text-center md:text-left">
              Conway's Game of Life
            </h1>
            <div className="bg-gray-800/80 px-4 py-1.5 rounded-full border border-gray-700 text-sm">
              <Stats generation={generation} aliveCount={aliveCount} />
            </div>
        </div>

          <div className="flex gap-2">
            <button
              onClick={toggleView}
              className="text-xs md:text-sm text-blue-400 hover:text-blue-300 transition-all border border-blue-900/50 hover:border-blue-700 bg-blue-950/30 hover:bg-blue-900/50 rounded-lg px-3 py-1.5 shadow-sm cursor-pointer"
            >
              {viewMode === 'flat' ? '3D Sphäre' : '2D Raster'}
            </button>
            <button
              onClick={() => setShowIntro(true)}
              className="text-xs md:text-sm text-gray-400 hover:text-white transition-all border border-gray-800 hover:border-gray-600 bg-gray-900 hover:bg-gray-800 rounded-lg px-3 py-1.5 shadow-sm cursor-pointer"
            >
              Über / Regeln
            </button>
          </div>
      </header>

      {/* Game Grid Area - Takes remaining space */}
      <div className="relative flex-1 w-full bg-gray-950 rounded-xl border border-gray-800/60 shadow-[0_0_60px_-15px_rgba(59,130,246,0.15)] overflow-hidden min-h-0">
          {viewMode === 'flat' ? (
            <CanvasGrid grid={grid} setCell={setCell} shift={shift} rule={rule} />
          ) : (
            <SphereGrid grid={grid} setCell={setCell} />
          )}
          {/* Mobile Controls Overlay - Only over the grid */}
          <MobileControls velocity={velocity} setVelocity={setVelocity} />
      </div>

      {/* Footer/Controls Section - Fixed Height */}
      <div className="w-full bg-gray-900/50 p-4 rounded-xl border border-gray-800 flex justify-center shrink-0 overflow-x-auto">
            <Controls
              isRunning={isRunning}
              toggleRunning={handleToggleRunning}
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
