import type { InputHTMLAttributes, ReactNode } from "react";

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: ReactNode;
}

const Checkbox = ({ label, id, className = "", ...rest }: CheckboxProps) => (
  <label
    htmlFor={id}
    className="inline-flex items-center gap-2.5 cursor-pointer text-ink-200 hover:text-white select-none"
  >
    <input
      id={id}
      type="checkbox"
      className={[
        "h-5 w-5 rounded-md border border-white/20 bg-surface-2/60",
        "accent-primary-500 cursor-pointer focus-ring transition-colors",
        className,
      ].join(" ")}
      {...rest}
    />
    {label && <span className="text-sm font-medium">{label}</span>}
  </label>
);

export default Checkbox;