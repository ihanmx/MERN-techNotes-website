interface SpinnerProps {
  size?: number;
  className?: string;
  label?: string;
}

const Spinner = ({ size = 28, className = "", label }: SpinnerProps) => (
  <div
    role="status"
    aria-live="polite"
    className={`inline-flex items-center gap-3 text-ink-300 ${className}`}
  >
    <span
      className="inline-block rounded-full border-2 border-white/15 border-t-primary-400 animate-spin"
      style={{ width: size, height: size }}
    />
    {label && <span className="text-sm font-medium">{label}</span>}
  </div>
);

export default Spinner;