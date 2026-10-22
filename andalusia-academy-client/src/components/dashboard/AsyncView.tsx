import type { ReactNode } from "react";
import type { ApiError } from "../../services/api";
import { EmptyState, ErrorState, LoadingState } from "../StateViews";

interface AsyncViewProps<T> {
  query: { data?: T; error: ApiError | null; loading: boolean; reload: () => void };
  loadingLabel: string;
  empty: { title: string; message?: string };
  isEmpty?: (data: T) => boolean;
  children: (data: T) => ReactNode;
}

/** Shows the loading, error or empty state until real data is there, so a list never claims "No items" too early. */
export default function AsyncView<T>({ query, loadingLabel, empty, isEmpty, children }: AsyncViewProps<T>) {
  if (query.loading) return <LoadingState label={loadingLabel} />;
  if (query.error) return <ErrorState message={query.error.message} onRetry={query.reload} />;
  if (query.data === undefined) return null;

  const nothingToShow = isEmpty ? isEmpty(query.data) : Array.isArray(query.data) && query.data.length === 0;
  if (nothingToShow) return <EmptyState title={empty.title} message={empty.message} />;

  return <>{children(query.data)}</>;
}
