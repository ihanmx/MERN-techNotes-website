import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faUser, faShieldHalved } from "@fortawesome/free-solid-svg-icons";
import { Link, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const DashFooter = () => {
  const { username, status } = useAuth();
  const { pathname } = useLocation();

  const showHome = pathname !== "/dash";

  return (
    <footer className="sticky bottom-0 z-20 border-t border-white/10 bg-surface-1/70 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {showHome && (
            <Link
              to="/dash"
              title="Home"
              aria-label="Home"
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-ink-200 hover:text-white hover:bg-white/10 hover:-translate-y-0.5 transition-all focus-ring"
            >
              <FontAwesomeIcon icon={faHouse} />
            </Link>
          )}
          <span className="text-xs text-ink-500 hidden sm:inline">
            © {new Date().getFullYear()} techNotes
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-4 text-sm">
          <span className="inline-flex items-center gap-2 text-ink-300">
            <FontAwesomeIcon
              icon={faUser}
              className="text-secondary-400 text-xs"
            />
            <span className="font-medium text-ink-100">{username || "—"}</span>
          </span>
          <span className="hidden sm:inline-block w-px h-4 bg-white/10" />
          <span className="inline-flex items-center gap-2 text-ink-300">
            <FontAwesomeIcon
              icon={faShieldHalved}
              className="text-primary-400 text-xs"
            />
            <span className="font-medium text-ink-100">{status || "—"}</span>
          </span>
        </div>
      </div>
    </footer>
  );
};

export default DashFooter;