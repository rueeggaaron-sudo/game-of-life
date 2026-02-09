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
    <div className="relative w-screen h-screen bg-gray-950 text-white overflow-hidden font-sans selection:bg-blue-500/30">
      {showIntro && <IntroScreen onStart={() => setShowIntro(false)} />}

      {/* Background Grid - Full Screen */}
      <div className="absolute inset-0 z-0">
        <CanvasGrid grid={grid} setCell={setCell} />
      </div>

      {/* Floating Header */}
      <header className="absolute top-0 left-0 right-0 z-20 pointer-events-none px-6 py-4 flex justify-between items-start bg-gradient-to-b from-gray-900/90 to-transparent pb-12">
        <div className="pointer-events-auto">
          <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent tracking-tight drop-shadow-sm">
            Conway's Game of Life
          </h1>
        </div>
        <button
          onClick={() => setShowIntro(true)}
          className="pointer-events-auto text-xs md:text-sm text-gray-400 hover:text-white transition-colors border border-gray-700 hover:border-gray-500 rounded-lg px-3 py-1.5 bg-gray-900/80 backdrop-blur shadow-lg"
        >
          Über / Regeln
        </button>
      </header>

      {/* Floating Stats - Centered Top (below header title on mobile, centered on desktop) */}
      <div className="absolute top-16 left-1/2 transform -translate-x-1/2 z-20 pointer-events-none w-full flex justify-center px-4">
        <div className="pointer-events-auto bg-gray-900/70 backdrop-blur rounded-full px-4 py-1 border border-gray-800 shadow-xl">
          <Stats generation={generation} aliveCount={aliveCount} />
        </div>
      </div>

      {/* Floating Controls - Bottom */}
      <div className="absolute bottom-0 left-0 right-0 z-30 pointer-events-none">
        <div className="pointer-events-auto">
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
  );
}

export default App;
