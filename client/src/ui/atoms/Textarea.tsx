import { forwardRef } from "react";
import type { TextareaHTMLAttributes } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ invalid = false, className = "", rows = 6, ...rest }, ref) => (
    <textarea
      ref={ref}
      rows={rows}
      className={[
        "w-full rounded-xl border bg-surface-2/60 backdrop-blur-sm",
        "px-4 py-3 text-ink-100 placeholder:text-ink-500 resize-y min-h-[160px]",
        "transition-all duration-200 focus-ring leading-relaxed",
        invalid
          ? "border-danger-500/70 ring-1 ring-danger-500/30"
          : "border-white/10 hover:border-white/20",
        className,
      ].join(" ")}
      {...rest}
    />
  ),
);
Textarea.displayName = "Textarea";

export default Textarea;