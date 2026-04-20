import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse } from "@fortawesome/free-solid-svg-icons";
import { Link, useLocation } from "react-router-dom";

const DashFooter = () => {
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
      <p>Current User:</p>
      <p>Status:</p>
    </footer>
  );
};
export default DashFooter;
