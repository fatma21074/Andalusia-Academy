import { Link } from "react-router-dom";
import { useApi } from "../hooks/useApi";
import { myApplicationsUrl, myPaymentsUrl } from "../services/enrollment";
import type { Application, Payment } from "../types";
import { applicationTitle, formatDate, formatPrice } from "../utils/format";
import Badge from "../components/Badge";
import Button from "../components/Button";
import PageBanner from "../components/PageBanner";
import { EmptyState, ErrorState, LoadingState } from "../components/StateViews";
import "./Account.css";

export default function MyPayments() {
  const payments = useApi<Payment[]>(myPaymentsUrl());
  // Payments only carry an applicationId; the applications list gives us the course/program title.
  const applications = useApi<Application[]>(myApplicationsUrl());

  const loading = payments.loading || applications.loading;
  const error = payments.error ?? applications.error;
  const titleFor = (applicationId: number) => {
    const application = applications.data?.find((a) => a.id === applicationId);
    return application ? applicationTitle(application) : `Application #${applicationId}`;
  };

  function retry() {
    payments.reload();
    applications.reload();
  }

  return (
    <>
      <PageBanner title="My Payments" crumbs={[{ label: "My payments" }]} />
      <section className="section">
        <div className="container account">
          {loading && <LoadingState label="Loading your payments…" />}
          {error && <ErrorState message={error.message} onRetry={retry} />}

          {!loading && !error && payments.data && payments.data.length === 0 && (
            <EmptyState
              title="No payments yet"
              message="Payments appear here after you pay for an application."
              action={
                <Link to="/my-applications">
                  <Button variant="ghost">View my applications</Button>
                </Link>
              }
            />
          )}

          {!loading && !error && payments.data && payments.data.length > 0 && (
            <table className="data-table">
              <thead>
                <tr>
                  <th scope="col">For</th>
                  <th scope="col">Amount</th>
                  <th scope="col">Method</th>
                  <th scope="col">Status</th>
                  <th scope="col">Paid on</th>
                </tr>
              </thead>
              <tbody>
                {payments.data.map((payment) => (
                  <tr key={payment.id}>
                    <td data-label="For">
                      <span className="data-table__title">{titleFor(payment.applicationId)}</span>
                    </td>
                    <td data-label="Amount" className="data-table__amount">
                      {formatPrice(payment.amount)}
                    </td>
                    <td data-label="Method">{payment.method ?? "—"}</td>
                    <td data-label="Status">
                      <Badge label={payment.status === "paid" ? "Paid" : payment.status} tone="accent" />
                    </td>
                    <td data-label="Paid on">{payment.paidAt ? formatDate(payment.paidAt) : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </>
  );
}
