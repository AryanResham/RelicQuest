interface StatCardProps {
  label: string;
  value: string | number;
  className?: string;
}

export default function StatCard({ label, value, className = '' }: StatCardProps) {
  return (
    <div className={`bg-[var(--card-dark)] p-4 rounded-xl border border-[var(--border)] ${className}`}>
      <p className="text-xs text-[var(--text-muted)] uppercase font-bold tracking-wider mb-1">
        {label}
      </p>
      <p className="text-2xl font-bold text-white">{value}</p>
    </div>
  );
}
