import { useState } from "react";
import { ApiError } from "../services/api";
import { useNotice } from "./useNotice";

/** Runs a save/delete action with a busy flag, an error message and an auto-dismissing success notice. */
export function useActionRunner() {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useNotice();

  async function run(
    action: () => Promise<void>,
    success: string,
    fallback: string,
  ): Promise<boolean> {
    setSaving(true);
    setError("");
    setNotice("");
    try {
      await action();
      setNotice(success);
      return true;
    } catch (e) {
      setError(e instanceof ApiError ? e.message : fallback);
      return false;
    } finally {
      setSaving(false);
    }
  }

  return { saving, error, notice, run };
}
