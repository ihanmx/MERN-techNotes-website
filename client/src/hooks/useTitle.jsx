import { useEffect } from "react";

const useTitle = (title) => {
  //     With the prev/restore pattern, the title behaves like a stack:

  // Mount pushes the new title.
  // Unmount pops back to whatever was there before.
  useEffect(() => {
    const prevTitle = document.title;
    document.title = title;

    return () => (document.title = prevTitle);
  }, [title]);
};

export default useTitle;
