export default function PublishedPill({ published }: { published: boolean }) {
  return (
    <span className={`status-pill ${published ? "" : "status-pill--muted"}`}>
      {published ? "Published" : "Hidden"}
    </span>
  );
}