import { store } from "../../../app/store";
import { notesApiSlice } from "../notes/notesApiSlice";
import { usersApiSlice } from "../users/usersApiSlice";
import { useEffect } from "react";
import { Outlet } from "react-router-dom";

const Prefetch = () => {
  useEffect(() => {
    console.log("subscribing");
    //manual subsicribtion
    const notes = store.dispatch(notesApiSlice.endpoints.getNotes.initiate());
    const users = store.dispatch(usersApiSlice.endpoints.getUsers.initiate());

    //cleanup
    return () => {
      console.log("unsubscribing");
      notes.unsubscribe();
      users.unsubscribe();
    };
  }, []);
  return <Outlet />;
};

export default Prefetch;

//RTK Query's cache is reference-counted. An endpoint's data stays in the cache only while at least one component is subscribed to it. Normally, calling useGetUsersQuery() in a component implicitly creates a subscription; unmounting removes it; when the count hits zero, the data is evicted after keepUnusedDataFor seconds.

//to avoid this

//No loading spinners — data is already cached when pages mount.
// Cache survives navigation — notes → users → notes stays instant, no refetch.
// Central control — polling/refetch options live in one place, not duplicated per componen
