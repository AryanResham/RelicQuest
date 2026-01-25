import type { ReactNode, ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
  children: ReactNode;
  fullWidth?: boolean;
  glow?: boolean;
}

function Button({
  variant = "primary",
  size = "md",
  children,
  fullWidth = false,
  glow = false,
  className = "",
  ...props
}: ButtonProps) {
  const baseClasses =
    "flex cursor-pointer items-center justify-center overflow-hidden rounded-lg font-bold transition-all";

  const variantClasses = {
    primary: `bg-primary hover:bg-primary/90 text-white ${glow ? "shadow-[0_0_15px_rgba(25,93,230,0.3)]" : ""}`,
    secondary: "bg-[#292e38] hover:bg-primary hover:text-white text-white",
    ghost:
      "bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 text-white",
    outline:
      "bg-transparent border border-[#383d47] text-white hover:bg-[#292e38]",
  };

  const sizeClasses = {
    sm: "h-9 px-4 text-sm min-w-[84px]",
    md: "h-10 px-4 text-sm",
    lg: "h-12 px-6 text-base min-w-[120px]",
  };

  const widthClass = fullWidth ? "w-full" : "";

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${className}`}
      {...props}
    >
      <span className="truncate">{children}</span>
    </button>
  );
}

export default Button;
