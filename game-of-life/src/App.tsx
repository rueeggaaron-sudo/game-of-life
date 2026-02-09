import { useState, useMemo } from 'react';
import { useGameOfLife } from './hooks/useGameOfLife';
import { Grid } from './components/Grid';
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
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center font-sans selection:bg-blue-500/30">
      {showIntro && <IntroScreen onStart={() => setShowIntro(false)} />}

      <header className="w-full px-6 py-4 flex justify-between items-center bg-gray-900/80 backdrop-blur-md border-b border-gray-800 shadow-lg z-20 sticky top-0">
        <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent tracking-tight">
          Conway's Game of Life
        </h1>
        <button
          onClick={() => setShowIntro(true)}
          className="text-xs md:text-sm text-gray-400 hover:text-white transition-colors border border-gray-700 hover:border-gray-500 rounded-lg px-3 py-1.5 bg-gray-800/50"
        >
          Über / Regeln
        </button>
      </header>

      <main className="flex-1 w-full max-w-7xl p-4 flex flex-col items-center justify-start overflow-hidden relative">
        <div className="w-full flex justify-center mb-4 mt-2">
          <Stats generation={generation} aliveCount={aliveCount} />
        </div>

        <div className="flex-1 w-full flex items-center justify-center overflow-hidden">
          <Grid grid={grid} setCell={setCell} />
        </div>

        {/* Spacer for mobile controls */}
        <div className="h-24 md:h-0"></div>
      </main>

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
  );
}

export default App;
