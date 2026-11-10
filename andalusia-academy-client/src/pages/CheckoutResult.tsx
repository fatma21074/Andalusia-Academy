import { Link, useSearchParams } from "react-router-dom";
import PageBanner from "../components/PageBanner";
import "./Account.css";

/** Where Kashier sends the learner back to (via the API callback): /checkout/result?paymentId=…&status=… */
export default function CheckoutResult() {
  const [params] = useSearchParams();
  const succeeded = params.get("status") === "success";

  return (
    <>
      <PageBanner
        title="Payment"
        crumbs={[
          { label: "My payments", to: "/my-payments" },
          { label: "Result" },
        ]}
      />
      <section className="section">
        <div className="container account">
          <div className="account-card success-panel" role="status">
            <h2>
              {succeeded
                ? "Payment successful. You're enrolled!"
                : "Payment did not go through"}
            </h2>
            <p>
              {succeeded
                ? "Your enrollment has been confirmed and the course is now in your account."
                : "Nothing was charged, or the payment could not be confirmed. You can try again from your applications."}
            </p>
            <div className="account-card__actions">
              {succeeded ? (
                <>
                  <Link to="/my-courses" className="btn btn--primary">
                    Go to my courses
                  </Link>
                  <Link to="/my-payments" className="btn btn--ghost">
                    View my payments
                  </Link>
                </>
              ) : (
                <Link to="/my-applications" className="btn btn--primary">
                  Back to my applications
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
