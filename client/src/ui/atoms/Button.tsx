import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

const base =
  "inline-flex items-center justify-center gap-2 font-semibold rounded-xl " +
  "transition-all duration-200 ease-out select-none focus-ring " +
  "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none";

const variants: Record<Variant, string> = {
  primary:
    "bg-linear-to-r from-primary-600 to-primary-500 text-white shadow-md " +
    "hover:from-primary-500 hover:to-primary-400 hover:-translate-y-0.5 hover:shadow-lg " +
    "active:translate-y-0",
  secondary:
    "bg-linear-to-r from-secondary-600 to-secondary-500 text-white shadow-md " +
    "hover:from-secondary-500 hover:to-secondary-400 hover:-translate-y-0.5 hover:shadow-lg " +
    "active:translate-y-0",
  ghost:
    "bg-white/5 text-ink-100 border border-white/10 backdrop-blur-sm " +
    "hover:bg-white/10 hover:border-white/20 hover:-translate-y-0.5",
  danger:
    "bg-linear-to-r from-danger-600 to-danger-500 text-white shadow-md " +
    "hover:from-danger-500 hover:to-danger-400 hover:-translate-y-0.5 hover:shadow-lg",
};

const sizes: Record<Size, string> = {
  sm: "text-sm px-3 py-1.5",
  md: "text-sm px-4 py-2.5",
  lg: "text-base px-5 py-3",
};

const Button = ({
  variant = "primary",
  size = "md",
  fullWidth = false,
  leftIcon,
  rightIcon,
  className = "",
  children,
  type = "button",
  ...rest
}: ButtonProps) => (
  <button
    type={type}
    className={[
      base,
      variants[variant],
      sizes[size],
      fullWidth ? "w-full" : "",
      className,
    ].join(" ")}
    {...rest}
  >
    {leftIcon && <span className="shrink-0">{leftIcon}</span>}
    {children}
    {rightIcon && <span className="shrink-0">{rightIcon}</span>}
  </button>
);

export default Button;