import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileCirclePlus,
  faFilePen,
  faUserGear,
  faUserPlus,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { PulseLoader } from "react-spinners";
import { useSendLogoutMutation } from "../features/auth/authApiSlice";
import useAuth from "../hooks/useAuth";

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

  if (isLoading) return <p>Logging Out...</p>;
  if (isError) return <p>Error: {getErrorMessage(error)}</p>;

  const dashClass =
    !DASH_REGEX.test(pathname) &&
    !NOTES_REGEX.test(pathname) &&
    !USERS_REGEX.test(pathname)
      ? "dash-header__container--small"
      : "";

  const newNoteButton = NOTES_REGEX.test(pathname) ? (
    <Link to="/dash/notes/new" className="icon-button" title="New Note">
      <FontAwesomeIcon icon={faFileCirclePlus} />
    </Link>
  ) : null;

  const newUserButton = USERS_REGEX.test(pathname) ? (
    <Link to="/dash/users/new" className="icon-button" title="New User">
      <FontAwesomeIcon icon={faUserPlus} />
    </Link>
  ) : null;

  const userButton =
    (isManager || isAdmin) &&
    !USERS_REGEX.test(pathname) &&
    pathname.includes("/dash") ? (
      <Link to="/dash/users" className="icon-button" title="Users">
        <FontAwesomeIcon icon={faUserGear} />
      </Link>
    ) : null;

  const notesButton =
    !NOTES_REGEX.test(pathname) && pathname.includes("/dash") ? (
      <Link to="/dash/notes" className="icon-button" title="Notes">
        <FontAwesomeIcon icon={faFilePen} />
      </Link>
    ) : null;

  const logoutButton = (
    <button className="icon-button" title="Logout" onClick={onLogoutClick}>
      <FontAwesomeIcon icon={faRightFromBracket} />
    </button>
  );

  const buttonContent = isLoading ? (
    <PulseLoader color="#FFF" />
  ) : (
    <>
      {newNoteButton}
      {newUserButton}
      {notesButton}
      {userButton}
      {logoutButton}
    </>
  );

  return (
    <header className="dash-header">
      <div className={`dash-header__container ${dashClass}`}>
        <Link to="/dash">
          <h1 className="dash-header__title">techNotes</h1>
        </Link>
        <nav className="dash-header__nav">{buttonContent}</nav>
      </div>
    </header>
  );
};

export default DashHeader;
