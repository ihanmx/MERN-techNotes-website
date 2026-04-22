import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { selectCurrentToken } from "../features/auth/authSlice";
import { notesApiSlice } from "../features/notes/notesApiSlice";
import { usersApiSlice } from "../features/users/usersApiSlice";

const Prefetch = () => {
  const token = useSelector(selectCurrentToken);
  const dispatch = useDispatch();

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

//RTK Query's cache is reference-counted. An endpoint's data stays in the cache only while at least one component is subscribed to it. Normally, calling useGetUsersQuery() in a component implicitly creates a subscription; unmounting removes it; when the count hits zero, the data is evicted after keepUnusedDataFor seconds.

//to avoid this

//No loading spinners — data is already cached when pages mount.
// Cache survives navigation — notes → users → notes stays instant, no refetch.
// Central control — polling/refetch options live in one place, not duplicated per componen

// initiate vs prefetch
// initiate = "I want this data and I'm holding onto it."

// Fires the request + creates a subscription (keeps data in cache).
// You must call .unsubscribe() to release it.
// More code, more lifecycle to manage.
// prefetch = "Load this into the cache now, I don't care after that."

// Fires the request, no subscription.
// Data follows normal cache rules (keepUnusedDataFor, default 60s).
// Zero cleanup.
// Analogy
// initiate = renting a parking spot — you keep it until you leave.
// prefetch = dropping a package off — it sits there until someone picks it up or it expires.
// For a "warm the cache before user needs it" component like yours, prefetch is the right tool.
