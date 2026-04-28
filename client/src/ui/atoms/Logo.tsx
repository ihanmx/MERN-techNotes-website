interface LogoProps {
  size?: number;
  withWordmark?: boolean;
  className?: string;
}

const Logo = ({ size = 36, withWordmark = true, className = "" }: LogoProps) => (
  <div className={`flex items-center gap-2.5 ${className}`}>
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="techNotes logo"
      role="img"
    >
      <defs>
        <linearGradient id="tn-grad" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#06b6d4" />
        </linearGradient>
        <linearGradient id="tn-grad-soft" x1="0" y1="48" x2="48" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#a5b4fc" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#67e8f9" stopOpacity="0.95" />
        </linearGradient>
      </defs>

      {/* Rounded square mark */}
      <rect x="2" y="2" width="44" height="44" rx="12" fill="url(#tn-grad)" />

      {/* Subtle inner highlight */}
      <rect
        x="2"
        y="2"
        width="44"
        height="44"
        rx="12"
        fill="url(#tn-grad-soft)"
        fillOpacity="0.18"
      />

      {/* Notebook lines (left edge) */}
      <rect x="9" y="14" width="2" height="20" rx="1" fill="#ffffff" fillOpacity="0.55" />

      {/* Stylized "N" glyph */}
      <path
        d="M16 33V15h3.4l8.2 11.4V15H31v18h-3.4l-8.2-11.4V33H16Z"
        fill="#ffffff"
      />

      {/* Accent dot — represents the "note" mark */}
      <circle cx="35.5" cy="32.5" r="2.5" fill="#ffffff" />
    </svg>

    {withWordmark && (
      <div className="flex flex-col leading-none">
        <span className="font-extrabold tracking-tight text-ink-100 text-lg sm:text-xl">
          tech<span className="text-secondary-400">Notes</span>
        </span>
        <span className="text-[10px] uppercase tracking-[0.18em] text-ink-400 mt-0.5">
          Repair · Track · Resolve
        </span>
      </div>
    )}
  </div>
);

export default Logo;
