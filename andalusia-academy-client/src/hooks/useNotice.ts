import { useEffect, useState } from "react";

/** A success message that clears itself after `ms` milliseconds. */
export function useNotice(ms = 4000) {
  const [notice, setNotice] = useState("");

  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(""), ms);
    return () => window.clearTimeout(timer);
  }, [notice, ms]);

  return [notice, setNotice] as const;
}
