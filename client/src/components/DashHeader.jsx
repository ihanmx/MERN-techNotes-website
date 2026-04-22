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
import { PulseLoader } from "react-spinners";

const DASH_REGEX = /^\/dash(\/)?$/;
const NOTES_REGEX = /^\/dash\/notes(\/)?$/;
const USERS_REGEX = /^\/dash\/users(\/)?$/;

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

  if (isError) return <p>Error: {error.data?.message}</p>;

  let dashClass = null;
  if (
    !DASH_REGEX.test(pathname) &&
    !NOTES_REGEX.test(pathname) &&
    !USERS_REGEX.test(pathname)
  ) {
    dashClass = "dash-header__container--small";
  }

  let newNoteButton = null;
  if (NOTES_REGEX.test(pathname)) {
    newNoteButton = (
      <Link to="/dash/notes/new" className="icon-button" title="New Note">
        <FontAwesomeIcon icon={faFileCirclePlus} />
      </Link>
    );
  }

  let newUserButton = null;
  if (USERS_REGEX.test(pathname)) {
    newUserButton = (
      <Link to="/dash/users/new" className="icon-button" title="New User">
        <FontAwesomeIcon icon={faUserPlus} />
      </Link>
    );
  }

  let userButton = null;
  if (isManager || isAdmin) {
    if (!USERS_REGEX.test(pathname) && pathname.includes("/dash")) {
      userButton = (
        <Link to="/dash/users" className="icon-button" title="Users">
          <FontAwesomeIcon icon={faUserGear} />
        </Link>
      );
    }
  }

  let notesButton = null;
  if (!NOTES_REGEX.test(pathname) && pathname.includes("/dash")) {
    notesButton = (
      <Link to="/dash/notes" className="icon-button" title="Notes">
        <FontAwesomeIcon icon={faFilePen} />
      </Link>
    );
  }

  const logoutButton = (
    <button className="icon-button" title="Logout" onClick={onLogoutClick}>
      <FontAwesomeIcon icon={faRightFromBracket} />
    </button>
  );

  let buttonContent;
  if (isLoading) {
    buttonContent = <PulseLoader color={"#FFF"} />;
  } else {
    buttonContent = (
      <>
        {newNoteButton}
        {newUserButton}
        {notesButton}
        {userButton}
        {logoutButton}
      </>
    );
  }

  const content = (
    <header className="dash-header">
      <div className={`dash-header__container ${dashClass}`}>
        <Link to="/dash">
          <h1 className="dash-header__title">techNotes</h1>
        </Link>
        <nav className="dash-header__nav">
          {/* add more buttons later */}
          {buttonContent}
        </nav>
      </div>
    </header>
  );

  return content;
};
export default DashHeader;
