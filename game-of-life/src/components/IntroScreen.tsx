interface IntroScreenProps {
  onStart: () => void;
}

export const IntroScreen = ({ onStart }: IntroScreenProps) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-950/80 backdrop-blur-sm p-4 text-white overflow-y-auto">
      <div className="max-w-2xl w-full bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl p-6 md:p-10 relative overflow-hidden">
        {/* Decorative background blob */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <h1 className="relative text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Conway's Game of Life
        </h1>

        <p className="relative text-gray-300 mb-8 leading-relaxed text-lg">
          Welcome to a fascinating universe of cellular automata. The Game of Life, created by mathematician John Conway in 1970, isn't a game in the traditional sense—it's a "zero-player game". Its evolution is determined by its initial state, requiring no further input.
        </p>

        <div className="relative grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-800/50 p-5 rounded-xl border border-gray-700/50 hover:border-gray-600 transition-colors">
            <h3 className="text-lg font-semibold mb-3 text-blue-300 flex items-center gap-2">
              <span className="text-xl">📜</span> The Rules
            </h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex gap-2 items-start">
                <span className="text-green-500 mt-1">●</span>
                <span><strong>Birth:</strong> A dead cell with exactly 3 live neighbors becomes alive.</span>
              </li>
              <li className="flex gap-2 items-start">
                <span className="text-yellow-500 mt-1">●</span>
                <span><strong>Survival:</strong> A live cell with 2 or 3 live neighbors stays alive.</span>
              </li>
              <li className="flex gap-2 items-start">
                <span className="text-red-500 mt-1">●</span>
                <span><strong>Death:</strong> A live cell with &lt;2 or &gt;3 neighbors dies.</span>
              </li>
            </ul>
          </div>

          <div className="bg-gray-800/50 p-5 rounded-xl border border-gray-700/50 hover:border-gray-600 transition-colors">
            <h3 className="text-lg font-semibold mb-3 text-purple-300 flex items-center gap-2">
              <span className="text-xl">✨</span> Why it's fascinating
            </h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              From these simple rules, complex patterns emerge: static blocks, oscillators, and "spaceships" that travel across the grid. It demonstrates how complex behaviors can arise from simple systems (Emergence).
            </p>
          </div>
        </div>

        <div className="relative mb-8 p-4 bg-gray-800/30 rounded-xl border border-gray-700/30">
          <h3 className="text-lg font-semibold mb-2 text-gray-200">How to Play</h3>
          <p className="text-sm text-gray-400 mb-4">
            1. Click on cells to toggle them alive/dead.<br/>
            2. Use the controls to Start, Pause, or Step through generations.<br/>
            3. Experiment with Random patterns or specific shapes.
          </p>
          <a
            href="https://youtu.be/TCLvGLA3WPM?si=-We4-WzZADlUSGRT"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors text-sm font-medium"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>
            Watch Explanation Video
          </a>
        </div>

        <button
          onClick={onStart}
          className="relative w-full py-3.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(59,130,246,0.5)] hover:shadow-[0_0_25px_rgba(59,130,246,0.6)] transform transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          Enter Simulation
        </button>
      </div>
    </div>
  );
};
