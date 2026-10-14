import { Link } from "react-router-dom";
import Button from "../components/Button";
import { EmptyState } from "../components/StateViews";

export default function AccessDenied({ role }: { role?: string }) {
  return (
    <section className="section">
      <div className="container">
        <EmptyState
          title="Access denied"
          message={
            role
              ? `Your ${role} account doesn't have permission to open this page.`
              : "You don't have permission to open this page."
          }
          action={
            <Link to="/">
              <Button variant="ghost">Back to home</Button>
            </Link>
          }
        />
      </div>
    </section>
  );
}
