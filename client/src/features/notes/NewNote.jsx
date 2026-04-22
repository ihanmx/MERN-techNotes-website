import { useSelector } from "react-redux";
import { selectAllUsers } from "../users/usersApiSlice";
import NewNoteForm from "./NewNoteForm";

const NewNote = () => {
  const users = useSelector(selectAllUsers);

  const content = users?.length ? (
    <NewNoteForm users={users} />
  ) : (
    <p>Not Currently Available </p>
  );

  return content;
};
export default NewNote;

// The core distinction
// Query hook (useGetNotesQuery)	Selector (useSelector(selectAllNotes))
// Subscribes to the endpoint	✅ Yes — keeps data alive in cache	❌ No — just reads existing cache
// Triggers a fetch if no data	✅ Yes	❌ No — returns whatever's there (or empty)
// Returns status flags	✅ isLoading, isError, error, isFetching	❌ Just the data
// Re-renders on status changes	✅ Yes	Only on data changes
// Supports polling / refetch options	✅ Yes	❌ No
// When to use which
// Use the query hook when the component owns the data fetch
// Signs:

// You need to show a loading spinner or error message.
// You want polling, refetch-on-focus, or refetch-on-mount.
// You want to be sure the data is fresh when the component mounts.
// Your NotesList is exactly this — it's the page responsible for showing the list, so it drives the fetch lifecycle.

// Use a selector when the data is already fetched by someone else
// Signs:

// You only need to read one specific piece (e.g. a single note by id).
// You're inside a child component rendered by a parent that already subscribed.
// You don't care about loading states — if data isn't there yet, you just render nothing.
// Your Note.jsx is exactly this — it receives noteId and does useSelector(state => selectNoteById(state, noteId)). The parent NotesList already owns the subscription; Note just reads one row.

// Your app's actual pattern

// Prefetch              ← kicks off subscriptions (warms cache)
//   └─ DashLayout
//       └─ NotesList     ← uses useGetNotesQuery (owns UI state, polling)
//           └─ Note      ← uses useSelector(selectNoteById) (just reads)
// Both Prefetch and NotesList subscribe to the same endpoint. RTK Query is smart — it dedupes them. One network request, two subscribers. When NotesList unmounts (navigation), Prefetch's subscription keeps the cache alive.

// The rule of thumb
// If this component would break (show nothing useful) without the data, and no one above it guarantees the data is there — use the query hook. Otherwise, use a selector.

// Why not always use the query hook?
// You could — it's not wrong. But:

// Every call creates a subscription (cheap but not free).
// In a deep tree, 20 components each calling useGetNotesQuery() creates 20 subscribers and 20 re-renders on every state change.
// Selectors are more surgical — selectNoteById only re-renders that one component when that one note changes. The query hook re-renders on any change to the notes data.
// For something like a table row, selectors give better render performance.
