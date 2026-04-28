import { forwardRef } from "react";
import type { SelectHTMLAttributes } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  invalid?: boolean;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ invalid = false, className = "", multiple, ...rest }, ref) => (
    <select
      ref={ref}
      multiple={multiple}
      className={[
        "w-full rounded-xl border bg-surface-2/60 backdrop-blur-sm",
        "px-4 py-2.5 text-ink-100",
        "transition-all duration-200 focus-ring",
        multiple ? "min-h-[110px]" : "",
        invalid
          ? "border-danger-500/70 ring-1 ring-danger-500/30"
          : "border-white/10 hover:border-white/20",
        className,
      ].join(" ")}
      {...rest}
    />
  ),
);
Select.displayName = "Select";

export default Select;