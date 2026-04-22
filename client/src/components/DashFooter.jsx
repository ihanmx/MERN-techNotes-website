import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse } from "@fortawesome/free-solid-svg-icons";
import { Link, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const DashFooter = () => {
  const { username, status } = useAuth();
  const { pathname } = useLocation();

  const goHomeButton =
    pathname !== "/dash" ? (
      <Link to="/dash" className="dash-footer__button icon-button" title="Home">
        <FontAwesomeIcon icon={faHouse} />
      </Link>
    ) : null;

  return (
    <footer className="dash-footer">
      {goHomeButton}
      <p>Current User: {username}</p>
      <p>Status: {status}</p>
    </footer>
  );
};
export default DashFooter;
