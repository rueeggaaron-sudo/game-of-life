interface MobileControlsProps {
  velocity: { x: number; y: number };
  setVelocity: (v: { x: number; y: number }) => void;
}

export const MobileControls = ({ velocity, setVelocity }: MobileControlsProps) => {
  // Helpers to cycle velocity
  // 0 -> 1 -> 2 -> 3 -> 0
  const cycleVelocity = (current: number) => {
    return (current + 1) % 4;
  };

  const handleDirection = (dir: 'up' | 'down' | 'left' | 'right') => {
    const newVel = { ...velocity };
    if (dir === 'up') {
      if (newVel.y > 0) { // Moving Down currently -> Stop
         newVel.y = 0;
      } else {
         const currentSpeed = Math.abs(newVel.y);
         const nextSpeed = cycleVelocity(currentSpeed);
         newVel.y = -nextSpeed; // Negative Y is UP
      }
    }
    if (dir === 'down') {
      if (newVel.y < 0) { // Moving Up currently -> Stop
         newVel.y = 0;
      } else {
         const currentSpeed = newVel.y;
         const nextSpeed = cycleVelocity(currentSpeed);
         newVel.y = nextSpeed;
      }
    }
    if (dir === 'left') {
      if (newVel.x > 0) { // Moving Right currently -> Stop
         newVel.x = 0;
      } else {
         const currentSpeed = Math.abs(newVel.x);
         const nextSpeed = cycleVelocity(currentSpeed);
         newVel.x = -nextSpeed;
      }
    }
    if (dir === 'right') {
      if (newVel.x < 0) { // Moving Left currently -> Stop
         newVel.x = 0;
      } else {
         const currentSpeed = newVel.x;
         const nextSpeed = cycleVelocity(currentSpeed);
         newVel.x = nextSpeed;
      }
    }
    setVelocity(newVel);
  };

  // Render arrows
  const buttonBaseClass = "w-12 h-12 md:w-16 md:h-16 rounded-full backdrop-blur-md shadow-lg flex items-center justify-center transition-all active:scale-95 select-none pointer-events-auto border bg-gray-900/40 hover:bg-gray-800/60 text-gray-400 border-gray-700/50";
  const activeClass = "bg-blue-600/80 text-white border-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.6)]";

  const getArrowClass = (isActive: boolean) => `${buttonBaseClass} ${isActive ? activeClass : ''}`;

  return (
    <div className="absolute inset-0 pointer-events-none z-10">

      {/* Top Center Arrow */}
      <div className="absolute top-36 md:top-8 left-1/2 -translate-x-1/2">
        <button
          className={getArrowClass(velocity.y < 0)}
          onClick={() => handleDirection('up')}
        >
          <div className="flex flex-col items-center justify-center h-full w-full relative">
            <span className="text-xl">▲</span>
            {velocity.y < 0 && <span className="absolute text-[8px] font-bold bottom-1">{Math.abs(velocity.y)}x</span>}
          </div>
        </button>
      </div>

      {/* Bottom Center Arrow */}
      <div className="absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2">
        <button
          className={getArrowClass(velocity.y > 0)}
          onClick={() => handleDirection('down')}
        >
           <div className="flex flex-col items-center justify-center h-full w-full relative">
            <span className="text-xl">▼</span>
            {velocity.y > 0 && <span className="absolute text-[8px] font-bold top-1">{Math.abs(velocity.y)}x</span>}
          </div>
        </button>
      </div>

      {/* Left Center Arrow */}
      <div className="absolute top-1/2 -translate-y-1/2 left-4 md:left-8">
        <button
          className={getArrowClass(velocity.x < 0)}
          onClick={() => handleDirection('left')}
        >
          <div className="flex flex-col items-center justify-center h-full w-full relative">
             <span className="text-xl">◀</span>
             {velocity.x < 0 && <span className="absolute text-[8px] font-bold right-1">{Math.abs(velocity.x)}x</span>}
          </div>
        </button>
      </div>

      {/* Right Center Arrow */}
      <div className="absolute top-1/2 -translate-y-1/2 right-4 md:right-8">
        <button
          className={getArrowClass(velocity.x > 0)}
          onClick={() => handleDirection('right')}
        >
           <div className="flex flex-col items-center justify-center h-full w-full relative">
             <span className="text-xl">▶</span>
             {velocity.x > 0 && <span className="absolute text-[8px] font-bold left-1">{Math.abs(velocity.x)}x</span>}
          </div>
        </button>
      </div>
    </div>
  );
};
