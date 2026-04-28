import type { ReactNode } from "react";

type AlertTone = "danger" | "warning" | "info" | "success";

interface AlertProps {
  tone?: AlertTone;
  children: ReactNode;
  className?: string;
}

const tones: Record<AlertTone, string> = {
  danger:
    "bg-danger-500/10 text-danger-400 border-danger-500/30",
  warning:
    "bg-warning-500/10 text-warning-400 border-warning-500/30",
  info:
    "bg-primary-500/10 text-primary-300 border-primary-500/30",
  success:
    "bg-success-500/10 text-success-400 border-success-500/30",
};

const Alert = ({ tone = "danger", children, className = "" }: AlertProps) => (
  <div
    role="alert"
    className={[
      "rounded-xl border px-4 py-3 text-sm font-medium",
      tones[tone],
      className,
    ].join(" ")}
  >
    {children}
  </div>
);

export default Alert;