import { useState, useMemo } from 'react';
import { useGameOfLife } from './hooks/useGameOfLife';
import { CanvasGrid } from './components/CanvasGrid';
import { Controls } from './components/Controls';
import { Stats } from './components/Stats';
import { IntroScreen } from './components/IntroScreen';

function App() {
  const [showIntro, setShowIntro] = useState(true);
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
    rows,
    cols,
    setGridSize,
  } = useGameOfLife();

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
    <div className="relative w-screen h-screen bg-black text-white overflow-hidden font-sans selection:bg-blue-500/30 flex items-center justify-center p-1 md:p-8">

      {/* Intro Screen Overlay (Full Viewport) */}
      {showIntro && <IntroScreen onStart={() => setShowIntro(false)} />}

      {/* "Immersive Window" Game Container */}
      <div className="relative w-full h-full bg-gray-950 rounded-xl md:rounded-3xl border border-gray-800/60 shadow-[0_0_60px_-15px_rgba(59,130,246,0.15)] overflow-hidden flex flex-col">

        {/* 1. Canvas Layer (Background of the Window) */}
        <div className="absolute inset-0 z-0">
          <CanvasGrid grid={grid} setCell={setCell} />
        </div>

        {/* 2. UI Overlay Layer */}
        <div className="absolute inset-0 z-10 pointer-events-none flex flex-col justify-between p-4 md:p-6">

          {/* Top Section: Header & Stats */}
          <div className="flex flex-col items-center w-full gap-4">

            {/* Header Row */}
            <header className="relative w-full flex justify-center items-start pointer-events-auto">
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-green-400 bg-clip-text text-transparent drop-shadow-sm text-center tracking-tight">
                Conway's Game of Life
              </h1>

              {/* About Button (Absolute Top-Right of Container) */}
              <button
                onClick={() => setShowIntro(true)}
                className="absolute right-0 top-0 text-xs md:text-sm text-gray-400 hover:text-white transition-all border border-gray-800 hover:border-gray-600 bg-gray-900/50 hover:bg-gray-800/80 backdrop-blur-sm rounded-lg px-3 py-1.5 shadow-sm"
                title="Über / Regeln"
              >
                <span className="hidden md:inline">Über / Regeln</span>
                <span className="md:hidden">?</span>
              </button>
            </header>

            {/* Stats Badge */}
            <div className="pointer-events-auto bg-gray-900/60 backdrop-blur-md border border-gray-800/50 rounded-full px-6 py-2 shadow-xl hover:bg-gray-900/80 transition-colors">
              <Stats generation={generation} aliveCount={aliveCount} />
            </div>
          </div>

          {/* Bottom Section: Controls */}
          <div className="w-full flex justify-center pointer-events-auto pb-2 md:pb-4">
             <Controls
                isRunning={isRunning}
                toggleRunning={() => setIsRunning(!isRunning)}
                step={step}
                reset={reset}
                randomize={randomize}
                loadPattern={loadPattern}
                speed={speed}
                setSpeed={setSpeed}
                rows={rows}
                cols={cols}
                setGridSize={setGridSize}
              />
          </div>

        </div>
      </div>
    </div>
  );
}

export default App;
