import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { selectCurrentToken } from "../features/auth/authSlice";
import { notesApiSlice } from "../features/notes/notesApiSlice";
import { usersApiSlice } from "../features/users/usersApiSlice";

const Prefetch = () => {
  const token = useAppSelector(selectCurrentToken);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!token) return;
    dispatch(
      notesApiSlice.util.prefetch("getNotes", undefined, { force: true }),
    );
    dispatch(
      usersApiSlice.util.prefetch("getUsers", undefined, { force: true }),
    );
  }, [token, dispatch]);

  return <Outlet />;
};

export default Prefetch;
