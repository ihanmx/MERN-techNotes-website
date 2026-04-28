import type { LabelHTMLAttributes, ReactNode } from "react";

interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  hint?: ReactNode;
}

const Label = ({ hint, className = "", children, ...rest }: LabelProps) => (
  <label
    className={[
      "block text-xs font-semibold uppercase tracking-[0.12em] text-ink-300 mb-1.5",
      className,
    ].join(" ")}
    {...rest}
  >
    {children}
    {hint && (
      <span className="ml-2 normal-case tracking-normal text-ink-500 font-normal">
        {hint}
      </span>
    )}
  </label>
);

export default Label;