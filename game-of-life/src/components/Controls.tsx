import { patterns, type Pattern } from '../game/patterns';

interface ControlsProps {
  isRunning: boolean;
  toggleRunning: () => void;
  step: () => void;
  reset: () => void;
  randomize: () => void;
  loadPattern: (pattern: Pattern) => void;
  speed: number;
  setSpeed: (speed: number) => void;
  rows: number;
  cols: number;
  setGridSize: (rows: number, cols: number) => void;
}

export const Controls = ({
  isRunning,
  toggleRunning,
  step,
  reset,
  randomize,
  loadPattern,
  speed,
  setSpeed,
  rows,
  cols,
  setGridSize,
}: ControlsProps) => {
  return (
    <div className="flex flex-wrap gap-4 p-4 bg-gray-900/90 backdrop-blur border-t border-gray-800 items-center justify-center w-full shadow-[0_-4px_20px_rgba(0,0,0,0.3)] z-50 fixed bottom-0 left-0 right-0 md:relative md:border-t-0 md:bg-transparent md:shadow-none md:pb-8">
      <div className="flex gap-2">
        <button
          onClick={toggleRunning}
          className={`px-5 py-2.5 rounded-lg font-bold transition-all transform active:scale-95 flex items-center gap-2 ${
            isRunning
              ? 'bg-red-500/10 text-red-400 border border-red-500/50 hover:bg-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.3)]'
              : 'bg-green-500/10 text-green-400 border border-green-500/50 hover:bg-green-500/20 shadow-[0_0_15px_rgba(34,197,94,0.3)]'
          }`}
        >
          {isRunning ? (
            <>
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" /> Pause
            </>
          ) : (
            <>
              <span className="w-0 h-0 border-t-[5px] border-t-transparent border-l-[8px] border-l-green-400 border-b-[5px] border-b-transparent ml-1" /> Start
            </>
          )}
        </button>
        <button
          onClick={step}
          disabled={isRunning}
          className="px-4 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-lg transition-colors border border-gray-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          Schritt
        </button>
      </div>

      <div className="h-8 w-[1px] bg-gray-800 hidden md:block mx-2"></div>

      <div className="flex gap-2">
        <button
          onClick={randomize}
          className="px-4 py-2.5 bg-blue-500/10 text-blue-400 border border-blue-500/30 hover:bg-blue-500/20 rounded-lg transition-colors font-medium"
        >
          Zufall
        </button>
        <button
          onClick={reset}
          className="px-4 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-lg transition-colors border border-gray-700 font-medium"
        >
          Leeren
        </button>
      </div>

      <div className="h-8 w-[1px] bg-gray-800 hidden md:block mx-2"></div>

      {/* Speed Control */}
      <div className="flex flex-col items-center min-w-[140px]">
        <div className="flex justify-between w-full text-xs text-gray-400 mb-1.5 px-1">
          <span>Geschw.</span>
          <span className="font-mono text-gray-300">{speed}ms</span>
        </div>
        <input
          type="range"
          min="50"
          max="1000"
          step="50"
          value={speed}
          onChange={(e) => setSpeed(Number(e.target.value))}
          className="w-full h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-blue-500 hover:accent-blue-400 transition-all"
        />
      </div>

      <div className="h-8 w-[1px] bg-gray-800 hidden md:block mx-2"></div>

      {/* Grid Size Control */}
      <div className="flex flex-col items-start">
        <label className="text-xs text-gray-400 mb-1 ml-1">Rastergröße</label>
        <select
          value={`${rows}x${cols}`}
          onChange={(e) => {
            const [r, c] = e.target.value.split('x').map(Number);
            setGridSize(r, c);
          }}
          className="bg-gray-800 text-gray-200 border border-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2 min-w-[120px] cursor-pointer hover:border-gray-600 transition-colors"
        >
          <option value="20x20">Klein (20x20)</option>
          <option value="50x50">Mittel (50x50)</option>
          <option value="100x100">Groß (100x100)</option>
          <option value="200x200">Riesig (200x200)</option>
          <option value="500x500">Gigantisch (500x500)</option>
        </select>
      </div>

      <div className="h-8 w-[1px] bg-gray-800 hidden md:block mx-2"></div>

      {/* Presets Dropdown */}
      <div className="flex flex-col items-start">
        <label className="text-xs text-gray-400 mb-1 ml-1">Muster</label>
        <select
          onChange={(e) => {
            const patternName = e.target.value;
            const pattern = patterns.find(p => p.name === patternName);
            if (pattern) {
              loadPattern(pattern);
            }
            // Reset select to default option
            e.target.value = "";
          }}
          className="bg-gray-800 text-gray-200 border border-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2 min-w-[120px] cursor-pointer hover:border-gray-600 transition-colors"
        >
          <option value="" disabled selected>Wählen...</option>
          {patterns.map((p) => (
            <option key={p.name} value={p.name}>
              {p.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
