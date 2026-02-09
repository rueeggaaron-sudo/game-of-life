interface StatsProps {
  generation: number;
  aliveCount: number;
}

export const Stats = ({ generation, aliveCount }: StatsProps) => {
  return (
    <div className="flex gap-8 justify-center items-center text-sm font-mono text-gray-400">
      <div className="flex flex-col items-center">
        <span className="text-[10px] uppercase tracking-wider text-gray-500">Generation</span>
        <span className="text-lg font-bold text-blue-400">{generation}</span>
      </div>
      <div className="w-[1px] h-6 bg-gray-700"></div>
      <div className="flex flex-col items-center">
        <span className="text-[10px] uppercase tracking-wider text-gray-500">Lebende Zellen</span>
        <span className="text-lg font-bold text-green-400">{aliveCount}</span>
      </div>
    </div>
  );
};
