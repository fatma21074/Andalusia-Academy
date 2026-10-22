import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useApi } from "../hooks/useApi";
import { ApiError } from "../services/api";
import { myApplicationsUrl, payApplication } from "../services/enrollment";
import type { Application } from "../types";
import { applicationTitle, formatPrice } from "../utils/format";
import Alert from "../components/Alert";
import Button from "../components/Button";
import PageBanner from "../components/PageBanner";
import { ErrorState, LoadingState } from "../components/StateViews";
import "./Account.css";

export default function Checkout() {
  const { applicationId } = useParams();
  const { data, loading, error, reload } = useApi<Application[]>(myApplicationsUrl());
  const [paid, setPaid] = useState(false);
  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState<string | null>(null);

  // There is no "get one application" endpoint; the user's list always contains it.
  const application = data?.find((a) => String(a.id) === applicationId);

  async function handlePay(target: Application) {
    setPaying(true);
    setPayError(null);
    try {
      await payApplication(target.id);
      setPaid(true);
    } catch (err) {
      setPayError(err instanceof ApiError ? err.message : "Payment failed. Please try again.");
    } finally {
      setPaying(false);
    }
  }

  return (
    <>
      <PageBanner title="Checkout" crumbs={[{ label: "My applications", to: "/my-applications" }, { label: "Checkout" }]} />
      <section className="section">
        <div className="container account">
          {loading && <LoadingState label="Loading your application…" />}
          {error && <ErrorState message={error.message} onRetry={reload} />}
          {!loading && !error && data && !application && (
            <ErrorState message="We couldn't find that application in your account." />
          )}

          {!loading && !error && application && (paid || application.status === "approved") && (
            <EnrolledPanel application={application} justPaid={paid} />
          )}

          {!loading && !error && application && !paid && application.status === "pending" && (
            <div className="checkout">
              <div className="account-card">
                <h2>Order summary</h2>
                <dl className="account-card__list">
                  <div>
                    <dt>{application.courseId ? "Course" : "Program"}</dt>
                    <dd>{applicationTitle(application)}</dd>
                  </div>
                  <div>
                    <dt>Application</dt>
                    <dd>#{application.id}</dd>
                  </div>
                </dl>
                <div className="checkout__total">
                  <span>Total</span>
                  <strong>{formatPrice(application.amount)}</strong>
                </div>
              </div>

              <div className="account-card">
                <h2>Payment</h2>
                {payError && <Alert tone="error">{payError}</Alert>}
                <p className="checkout__note">
                  Payments are simulated for now: no card details are needed and nothing is charged.
                </p>
                <Button variant="primary" onClick={() => handlePay(application)} disabled={paying}>
                  {paying ? "Processing…" : `Pay ${formatPrice(application.amount)}`}
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

function EnrolledPanel({ application, justPaid }: { application: Application; justPaid: boolean }) {
  return (
    <div className="account-card success-panel">
      <div className="success-panel__icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="m5 12 5 5 9-10" />
        </svg>
      </div>
      <h2>{justPaid ? "Payment successful. You're enrolled!" : "You're already enrolled"}</h2>
      <p>
        {applicationTitle(application)} is now in your account.
        {justPaid && " Your enrollment has been confirmed."}
      </p>
      <div className="account-card__actions">
        <Link to="/my-applications" className="btn btn--primary">
          View my applications
        </Link>
        <Link to="/courses" className="btn btn--ghost">
          Browse more courses
        </Link>
      </div>
    </div>
  );
}
