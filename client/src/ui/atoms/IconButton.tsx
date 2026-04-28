import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { Link } from "react-router-dom";

type Tone = "default" | "primary" | "secondary" | "danger";

interface CommonProps {
  tone?: Tone;
  label?: string;
  children: ReactNode;
  className?: string;
}

interface AsButton
  extends CommonProps,
    Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children" | "className"> {
  to?: undefined;
}

interface AsLink
  extends CommonProps,
    Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "children" | "className"> {
  to: string;
}

type IconButtonProps = AsButton | AsLink;

const tones: Record<Tone, string> = {
  default:
    "text-ink-200 hover:text-white hover:bg-white/10 border-white/10 hover:border-white/20",
  primary:
    "text-primary-300 hover:text-white hover:bg-primary-500/30 border-primary-400/30 hover:border-primary-400/60",
  secondary:
    "text-secondary-300 hover:text-white hover:bg-secondary-500/30 border-secondary-400/30 hover:border-secondary-400/60",
  danger:
    "text-danger-400 hover:text-white hover:bg-danger-500/30 border-danger-400/30 hover:border-danger-400/60",
};

const IconButton = (props: IconButtonProps) => {
  const { tone = "default", label, children, className = "" } = props;
  const classes = [
    "inline-flex h-10 w-10 items-center justify-center rounded-xl border bg-white/5",
    "backdrop-blur-sm transition-all duration-200 ease-out",
    "hover:-translate-y-0.5 hover:shadow-md focus-ring",
    "disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0",
    tones[tone],
    className,
  ].join(" ");

  if ("to" in props && props.to !== undefined) {
    const { to, label: _l, tone: _t, children: _c, className: _cn, ...rest } = props;
    return (
      <Link to={to} className={classes} title={label} aria-label={label} {...rest}>
        {children}
      </Link>
    );
  }

  const { label: _l, tone: _t, children: _c, className: _cn, to: _to, ...rest } =
    props as AsButton;
  return (
    <button
      type="button"
      className={classes}
      title={label}
      aria-label={label}
      {...rest}
    >
      {children}
    </button>
  );
};

export default IconButton;