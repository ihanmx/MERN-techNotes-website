import { Outlet, Link } from "react-router-dom";
import { useEffect } from "react";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { useRefreshMutation } from "./authApiSlice";
import usePersist from "../../hooks/usePersist";
import { useAppSelector } from "../../app/hooks";
import { selectCurrentToken } from "./authSlice";

const getErrorMessage = (error: unknown): string => {
  if (
    typeof error === "object" &&
    error !== null &&
    "data" in error &&
    typeof (error as FetchBaseQueryError).data === "object" &&
    (error as FetchBaseQueryError).data !== null &&
    "message" in ((error as FetchBaseQueryError).data as object)
  ) {
    return String(
      ((error as FetchBaseQueryError).data as { message: unknown }).message,
    );
  }
  return "Session expired.";
};

const PersistLogin = () => {
  const [persist] = usePersist();
  const token = useAppSelector(selectCurrentToken);
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
        {getErrorMessage(error)} <Link to="/login"> Please login again</Link>
      </p>
    );
  }
  if (isSuccess) return <Outlet />;
  return <p>Loading...</p>;
};

export default PersistLogin;
