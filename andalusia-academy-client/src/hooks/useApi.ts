import { useEffect, useState } from "react";
import { ApiError, getJson } from "../services/api";

interface Settled<T> {
  path: string;
  attempt: number;
  data?: T;
  error?: ApiError;
}

/**
 * GET `path` and track loading / error state.
 * - Pass `null` to skip the request.
 * - While a new path loads, `data` keeps the previous result so lists don't flash empty.
 *   Detail pages should check `loading` before using `data`.
 */
export function useApi<T>(path: string | null) {
  const [attempt, setAttempt] = useState(0);
  const [settled, setSettled] = useState<Settled<T> | null>(null);

  useEffect(() => {
    if (path === null) return;
    const controller = new AbortController();

    getJson<T>(path, controller.signal)
      .then((data) => setSettled({ path, attempt, data }))
      .catch((err: unknown) => {
        if (controller.signal.aborted) return;
        setSettled({
          path,
          attempt,
          error: err instanceof ApiError ? err : new ApiError(0, "Unexpected error."),
        });
      });

    return () => controller.abort();
  }, [path, attempt]);

  const isCurrent = path !== null && settled?.path === path && settled.attempt === attempt;

  return {
    data: path === null ? undefined : settled?.data,
    error: isCurrent ? (settled?.error ?? null) : null,
    loading: path !== null && !isCurrent,
    reload: () => setAttempt((n) => n + 1),
  };
}
