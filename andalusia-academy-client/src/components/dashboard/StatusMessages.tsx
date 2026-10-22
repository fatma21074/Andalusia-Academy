import { useEffect, useRef } from "react";
import Alert from "../Alert";

interface StatusMessagesProps {
  error: string;
  notice: string;
}

/** Live region for form results. Focus moves here after a submit so keyboard and screen-reader users hear the outcome. */
export default function StatusMessages({ error, notice }: StatusMessagesProps) {
  const region = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (error || notice) region.current?.focus();
  }, [error, notice]);

  return (
    <div ref={region} tabIndex={-1} aria-live="polite" className="dashboard__messages">
      {error && <Alert tone="error">{error}</Alert>}
      {notice && <Alert tone="success">{notice}</Alert>}
    </div>
  );
}
