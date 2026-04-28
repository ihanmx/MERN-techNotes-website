import type { ReactNode } from "react";

type BadgeTone =
  | "primary"
  | "secondary"
  | "success"
  | "danger"
  | "warning"
  | "neutral";

interface BadgeProps {
  tone?: BadgeTone;
  children: ReactNode;
  className?: string;
  dot?: boolean;
}

const tones: Record<BadgeTone, { wrap: string; dot: string }> = {
  primary: {
    wrap: "bg-primary-500/15 text-primary-300 border-primary-400/30",
    dot: "bg-primary-400",
  },
  secondary: {
    wrap: "bg-secondary-500/15 text-secondary-300 border-secondary-400/30",
    dot: "bg-secondary-400",
  },
  success: {
    wrap: "bg-success-500/15 text-success-400 border-success-500/30",
    dot: "bg-success-400",
  },
  danger: {
    wrap: "bg-danger-500/15 text-danger-400 border-danger-500/30",
    dot: "bg-danger-400",
  },
  warning: {
    wrap: "bg-warning-500/15 text-warning-400 border-warning-500/40",
    dot: "bg-warning-400",
  },
  neutral: {
    wrap: "bg-white/5 text-ink-300 border-white/15",
    dot: "bg-ink-400",
  },
};

const Badge = ({ tone = "neutral", children, className = "", dot = false }: BadgeProps) => {
  const t = tones[tone];
  return (
    <span
      className={[
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5",
        "text-xs font-semibold tracking-wide",
        t.wrap,
        className,
      ].join(" ")}
    >
      {dot && (
        <span className={`h-1.5 w-1.5 rounded-full ${t.dot} animate-pulse`} />
      )}
      {children}
    </span>
  );
};

export default Badge;