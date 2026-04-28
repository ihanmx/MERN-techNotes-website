import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const Welcome = () => {
  const date = new Date();
  const today = new Intl.DateTimeFormat("en-US", {
    dateStyle: "full",
    timeStyle: "long",
  }).format(date);

  const { isAdmin, isManager } = useAuth();

  return (
    <section className="welcome">
      <p>{today}</p>
      <h1>Welcome!</h1>

      <p>
        <Link to="/dash/notes">View techNotes</Link>
      </p>
      <p>
        <Link to="/dash/notes/new">Add New techNote</Link>
      </p>

      {(isAdmin || isManager) && (
        <p>
          <Link to="/dash/users">View User Settings</Link>
        </p>
      )}
      {(isAdmin || isManager) && (
        <p>
          <Link to="/dash/users/new">Add New User</Link>
        </p>
      )}
    </section>
  );
};

export default Welcome;
