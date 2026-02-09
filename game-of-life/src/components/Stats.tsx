interface StatsProps {
  generation: number;
  aliveCount: number;
}

export const Stats = ({ generation, aliveCount }: StatsProps) => {
  return (
    <div className="flex gap-8 justify-center items-center text-sm font-mono text-gray-400 mb-4 p-3 bg-gray-900/50 rounded-lg border border-gray-800/50 backdrop-blur-sm">
      <div className="flex flex-col items-center">
        <span className="text-xs uppercase tracking-wider text-gray-500">Generation</span>
        <span className="text-xl font-bold text-blue-400">{generation}</span>
      </div>
      <div className="w-[1px] h-8 bg-gray-800"></div>
      <div className="flex flex-col items-center">
        <span className="text-xs uppercase tracking-wider text-gray-500">Lebende Zellen</span>
        <span className="text-xl font-bold text-green-400">{aliveCount}</span>
      </div>
    </div>
  );
};
