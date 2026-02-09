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
    <div className="flex flex-wrap gap-4 p-3 md:p-4 bg-gray-900/80 backdrop-blur-md border border-gray-700/50 items-center justify-center shadow-2xl rounded-t-2xl md:rounded-2xl md:mb-8 mx-auto max-w-fit">

      {/* Group 1: Playback */}
      <div className="flex gap-2">
        <button
          onClick={toggleRunning}
          className={`px-4 py-2 md:px-5 md:py-2.5 rounded-lg font-bold transition-all transform active:scale-95 flex items-center gap-2 ${
            isRunning
              ? 'bg-red-500/10 text-red-400 border border-red-500/50 hover:bg-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.3)]'
              : 'bg-green-500/10 text-green-400 border border-green-500/50 hover:bg-green-500/20 shadow-[0_0_15px_rgba(34,197,94,0.3)]'
          }`}
        >
          {isRunning ? (
            <>
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" /> <span className="hidden sm:inline">Pause</span>
            </>
          ) : (
            <>
              <span className="w-0 h-0 border-t-[5px] border-t-transparent border-l-[8px] border-l-green-400 border-b-[5px] border-b-transparent ml-1" /> <span className="hidden sm:inline">Start</span>
            </>
          )}
        </button>
        <button
          onClick={step}
          disabled={isRunning}
          className="px-3 py-2 md:px-4 md:py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-lg transition-colors border border-gray-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          title="Einzelschritt"
        >
          <span className="sm:hidden">Step</span>
          <span className="hidden sm:inline">Schritt</span>
        </button>
      </div>

      <div className="h-8 w-[1px] bg-gray-700/50 hidden md:block mx-1"></div>

      {/* Group 2: Actions */}
      <div className="flex gap-2">
        <button
          onClick={randomize}
          className="px-3 py-2 md:px-4 md:py-2.5 bg-blue-500/10 text-blue-400 border border-blue-500/30 hover:bg-blue-500/20 rounded-lg transition-colors font-medium"
          title="Zufälliges Muster"
        >
          <span className="sm:hidden">Rand</span>
          <span className="hidden sm:inline">Zufall</span>
        </button>
        <button
          onClick={reset}
          className="px-3 py-2 md:px-4 md:py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-lg transition-colors border border-gray-700 font-medium"
          title="Feld leeren"
        >
          <span className="sm:hidden">Clear</span>
          <span className="hidden sm:inline">Leeren</span>
        </button>
      </div>

      <div className="h-8 w-[1px] bg-gray-700/50 hidden md:block mx-1"></div>

      {/* Group 3: Settings */}
      <div className="flex gap-4 items-center">
        {/* Speed Control */}
        <div className="flex flex-col items-center min-w-[100px] md:min-w-[140px]">
          <div className="flex justify-between w-full text-[10px] md:text-xs text-gray-400 mb-1.5 px-1">
            <span>Tempo</span>
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

        {/* Grid Size Control */}
        <div className="flex flex-col items-start">
          <label className="text-[10px] text-gray-400 mb-1 ml-1">Größe</label>
          <select
            value={`${rows}x${cols}`}
            onChange={(e) => {
              const [r, c] = e.target.value.split('x').map(Number);
              setGridSize(r, c);
            }}
            className="bg-gray-800 text-gray-200 border border-gray-700 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-1.5 min-w-[80px] md:min-w-[100px] cursor-pointer hover:border-gray-600 transition-colors"
          >
            <option value="20x20">Klein</option>
            <option value="50x50">Mittel</option>
            <option value="100x100">Groß</option>
            <option value="200x200">Riesig</option>
            <option value="500x500">Gigantisch</option>
          </select>
        </div>

        {/* Presets Dropdown */}
        <div className="flex flex-col items-start">
          <label className="text-[10px] text-gray-400 mb-1 ml-1">Muster</label>
          <select
            onChange={(e) => {
              const patternName = e.target.value;
              const pattern = patterns.find(p => p.name === patternName);
              if (pattern) {
                loadPattern(pattern);
              }
              e.target.value = "";
            }}
            className="bg-gray-800 text-gray-200 border border-gray-700 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-1.5 min-w-[80px] md:min-w-[100px] cursor-pointer hover:border-gray-600 transition-colors"
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
    </div>
  );
};
