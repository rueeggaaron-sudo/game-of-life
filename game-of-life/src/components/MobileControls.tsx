interface MobileControlsProps {
  velocity: { x: number; y: number };
  setVelocity: (v: { x: number; y: number }) => void;
}

export const MobileControls = ({ velocity, setVelocity }: MobileControlsProps) => {

  const handleDirection = (dir: 'up' | 'down' | 'left' | 'right') => {
    // Current Velocity
    let vx = velocity.x;
    let vy = velocity.y;

    // Cycle: 0 -> 1 -> 2 -> 3 -> 0
    // But handling directions.

    if (dir === 'up') {
        // If moving down, stop. If moving up, increase speed or loop to 0.
        if (vy > 0) { vy = 0; }
        else {
            const speed = Math.abs(vy);
            const next = (speed + 1) % 4;
            vy = -next; // Up is negative Y
        }
    } else if (dir === 'down') {
        if (vy < 0) { vy = 0; }
        else {
            const speed = Math.abs(vy);
            const next = (speed + 1) % 4;
            vy = next;
        }
    } else if (dir === 'left') {
        if (vx > 0) { vx = 0; }
        else {
            const speed = Math.abs(vx);
            const next = (speed + 1) % 4;
            vx = -next;
        }
    } else if (dir === 'right') {
        if (vx < 0) { vx = 0; }
        else {
            const speed = Math.abs(vx);
            const next = (speed + 1) % 4;
            vx = next;
        }
    }

    setVelocity({ x: vx, y: vy });
  };

  const buttonBaseClass = "w-10 h-10 md:w-12 md:h-12 rounded-full backdrop-blur-md shadow-lg flex items-center justify-center transition-all active:scale-95 select-none pointer-events-auto border bg-gray-900/60 hover:bg-gray-800/80 text-gray-300 border-gray-700/50 cursor-pointer";
  const activeClass = "bg-blue-600/80 text-white border-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.6)]";

  const getArrowClass = (isActive: boolean) => `${buttonBaseClass} ${isActive ? activeClass : ''}`;

  return (
    <div className="absolute inset-0 pointer-events-none z-[50] overflow-hidden">
        {/*
            Positioning Logic:
            - Top arrow: Top edge, centered horizontally.
            - Bottom arrow: Bottom edge, centered horizontally.
            - Left arrow: Left edge, centered vertically.
            - Right arrow: Right edge, centered vertically.

            "Closer to window edge": minimize margin/padding (e.g., top-2 instead of top-8).
        */}

        {/* Top Arrow */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 pointer-events-auto">
             <button onClick={() => handleDirection('up')} className={getArrowClass(velocity.y < 0)}>
                <span className="text-lg">▲</span>
                {velocity.y < 0 && <span className="absolute -bottom-3 text-[9px] font-bold text-blue-300">{Math.abs(velocity.y)}x</span>}
             </button>
        </div>

        {/* Bottom Arrow */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 pointer-events-auto">
             <button onClick={() => handleDirection('down')} className={getArrowClass(velocity.y > 0)}>
                <span className="text-lg">▼</span>
                {velocity.y > 0 && <span className="absolute -top-3 text-[9px] font-bold text-blue-300">{Math.abs(velocity.y)}x</span>}
             </button>
        </div>

        {/* Left Arrow */}
        <div className="absolute top-1/2 left-2 -translate-y-1/2 pointer-events-auto">
             <button onClick={() => handleDirection('left')} className={getArrowClass(velocity.x < 0)}>
                <span className="text-lg">◀</span>
                {velocity.x < 0 && <span className="absolute -right-3 text-[9px] font-bold text-blue-300">{Math.abs(velocity.x)}x</span>}
             </button>
        </div>

        {/* Right Arrow */}
        <div className="absolute top-1/2 right-2 -translate-y-1/2 pointer-events-auto">
             <button onClick={() => handleDirection('right')} className={getArrowClass(velocity.x > 0)}>
                <span className="text-lg">▶</span>
                {velocity.x > 0 && <span className="absolute -left-3 text-[9px] font-bold text-blue-300">{Math.abs(velocity.x)}x</span>}
             </button>
        </div>

    </div>
  );
};
