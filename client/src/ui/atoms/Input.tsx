import { forwardRef } from "react";
import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ invalid = false, className = "", ...rest }, ref) => (
    <input
      ref={ref}
      className={[
        "w-full rounded-xl border bg-surface-2/60 backdrop-blur-sm",
        "px-4 py-2.5 text-ink-100 placeholder:text-ink-500",
        "transition-all duration-200 focus-ring",
        invalid
          ? "border-danger-500/70 ring-1 ring-danger-500/30"
          : "border-white/10 hover:border-white/20",
        className,
      ].join(" ")}
      {...rest}
    />
  ),
);
Input.displayName = "Input";

export default Input;