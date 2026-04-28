import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileCirclePlus,
  faFilePen,
  faUserGear,
  faUserPlus,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useSendLogoutMutation } from "../features/auth/authApiSlice";
import useAuth from "../hooks/useAuth";
import { Logo, IconButton, Spinner, Alert } from "../ui";

const DASH_REGEX = /^\/dash(\/)?$/;
const NOTES_REGEX = /^\/dash\/notes(\/)?$/;
const USERS_REGEX = /^\/dash\/users(\/)?$/;

const getErrorMessage = (err: unknown): string => {
  if (
    typeof err === "object" &&
    err !== null &&
    "data" in err &&
    typeof err.data === "object" &&
    err.data !== null &&
    "message" in err.data
  ) {
    return String(err.data.message);
  }
  return "Logout failed";
};

const DashHeader = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { isManager, isAdmin } = useAuth();
  const [sendLogout, { isLoading, isError, error }] = useSendLogoutMutation();

  const onLogoutClick = async () => {
    try {
      await sendLogout().unwrap();
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  if (isLoading)
    return (
      <header className="sticky top-0 z-30 border-b border-white/10 bg-surface-1/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-3">
          <Spinner label="Logging out..." />
        </div>
      </header>
    );

  if (isError)
    return (
      <header className="sticky top-0 z-30 border-b border-white/10 bg-surface-1/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-3">
          <Alert tone="danger">{getErrorMessage(error)}</Alert>
        </div>
      </header>
    );

  const newNoteButton = NOTES_REGEX.test(pathname) ? (
    <IconButton to="/dash/notes/new" tone="secondary" label="New Note">
      <FontAwesomeIcon icon={faFileCirclePlus} />
    </IconButton>
  ) : null;

  const newUserButton = USERS_REGEX.test(pathname) ? (
    <IconButton to="/dash/users/new" tone="secondary" label="New User">
      <FontAwesomeIcon icon={faUserPlus} />
    </IconButton>
  ) : null;

  const userButton =
    (isManager || isAdmin) &&
    !USERS_REGEX.test(pathname) &&
    pathname.includes("/dash") ? (
      <IconButton to="/dash/users" label="Users">
        <FontAwesomeIcon icon={faUserGear} />
      </IconButton>
    ) : null;

  const notesButton =
    !NOTES_REGEX.test(pathname) && pathname.includes("/dash") ? (
      <IconButton to="/dash/notes" label="Notes">
        <FontAwesomeIcon icon={faFilePen} />
      </IconButton>
    ) : null;

  const logoutButton = (
    <IconButton tone="danger" label="Logout" onClick={onLogoutClick}>
      <FontAwesomeIcon icon={faRightFromBracket} />
    </IconButton>
  );

  // Suppress unused-var lint when no dashClass branch is needed
  void DASH_REGEX;

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-surface-1/70 backdrop-blur-xl shadow-[0_4px_24px_-12px_rgba(0,0,0,0.6)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between gap-3">
          <Link
            to="/dash"
            className="group inline-flex items-center transition-transform duration-200 hover:-translate-y-0.5"
            aria-label="Go to dashboard"
          >
            <Logo size={36} />
          </Link>

          <nav className="flex items-center gap-2" aria-label="Primary actions">
            {newNoteButton}
            {newUserButton}
            {notesButton}
            {userButton}
            <span className="hidden sm:inline-block w-px h-7 bg-white/10 mx-1" />
            {logoutButton}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default DashHeader;