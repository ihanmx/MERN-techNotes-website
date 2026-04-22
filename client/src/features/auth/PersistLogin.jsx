import { Outlet, Link } from "react-router-dom";
import { useEffect } from "react";
import { useRefreshMutation } from "./authApiSlice";
import usePersist from "../../hooks/usePersist";
import { useSelector } from "react-redux";
import { selectCurrentToken } from "./authSlice";

const PersistLogin = () => {
  const [persist] = usePersist();
  const token = useSelector(selectCurrentToken);
  const [refresh, { isLoading, isError, error, isSuccess, isUninitialized }] =
    useRefreshMutation();

  useEffect(() => {
    if (!token && persist) {
      refresh();
    }
  }, [token, persist, refresh]);

  if (!persist) return <Outlet />;
  if (token) return <Outlet />;
  if (isLoading || isUninitialized) return <p>Loading...</p>;
  if (isError) {
    return (
      <p className="errmsg">
        {error?.data?.message ?? "Session expired."}{" "}
        <Link to="/login"> Please login again</Link>
      </p>
    );
  }
  if (isSuccess) return <Outlet />;
  return <p>Loading...</p>;
};

export default PersistLogin;
