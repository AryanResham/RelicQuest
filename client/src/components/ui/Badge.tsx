type BadgeVariant = 'primary' | 'success' | 'warning' | 'error' | 'info';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  icon?: React.ReactNode;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  primary: 'bg-primary/10 text-primary border-primary/20',
  success: 'bg-green-500/20 text-green-500 border-green-500/20',
  warning: 'bg-yellow-500/20 text-yellow-500 border-yellow-500/20',
  error: 'bg-red-500/20 text-red-500 border-red-500/20',
  info: 'bg-blue-400/20 text-blue-400 border-blue-400/20',
};

export default function Badge({ children, variant = 'primary', icon, className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border uppercase ${variantStyles[variant]} ${className}`}
    >
      {icon}
      {children}
    </span>
  );
}
