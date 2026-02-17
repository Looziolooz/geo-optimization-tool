'use client';

export default function ScoreRing({ score, size = 64, label }: { score: number; size?: number; label?: string }) {
  const color = score >= 70 ? '#10b981' : score >= 40 ? '#f59e0b' : '#ef4444';
  const r = (size - 6) / 2;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="-rotate-90" width={size} height={size}>
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#1e293b" strokeWidth={4} />
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={4}
            strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round"
            className="transition-all duration-700" />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-white font-bold"
          style={{ fontSize: size > 50 ? '1rem' : '0.75rem' }}>{score}</span>
      </div>
      {label && <span className="text-surface-500 text-[10px] text-center">{label}</span>}
    </div>
  );
}
