import { Link } from "react-router-dom";
import { useApi } from "../hooks/useApi";
import { myApplicationsUrl } from "../services/enrollment";
import type { Application } from "../types";
import { applicationTitle, formatDate, formatPrice } from "../utils/format";
import ApplicationStatusBadge from "../components/ApplicationStatusBadge";
import Button from "../components/Button";
import PageBanner from "../components/PageBanner";
import { EmptyState, ErrorState, LoadingState } from "../components/StateViews";
import "./Account.css";

export default function MyApplications() {
  const { data, loading, error, reload } = useApi<Application[]>(myApplicationsUrl());

  return (
    <>
      <PageBanner title="My Applications" crumbs={[{ label: "My applications" }]} />
      <section className="section">
        <div className="container account">
          {loading && <LoadingState label="Loading your applications…" />}
          {error && <ErrorState message={error.message} onRetry={reload} />}

          {!loading && !error && data && data.length === 0 && (
            <EmptyState
              title="No applications yet"
              message="When you apply to a course or program, it shows up here."
              action={
                <Link to="/courses">
                  <Button variant="primary">Browse courses</Button>
                </Link>
              }
            />
          )}

          {!loading && !error && data && data.length > 0 && (
            <table className="data-table">
              <thead>
                <tr>
                  <th scope="col">Application</th>
                  <th scope="col">Applied</th>
                  <th scope="col">Amount</th>
                  <th scope="col">Status</th>
                  <th scope="col">
                    <span className="sr-only">Action</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.map((application) => (
                  <tr key={application.id}>
                    <td data-label="Application">
                      <div>
                        <span className="data-table__title">{applicationTitle(application)}</span>
                        <span className="data-table__sub">{application.courseId ? "Course" : "Program"}</span>
                      </div>
                    </td>
                    <td data-label="Applied">{formatDate(application.appliedAt)}</td>
                    <td data-label="Amount" className="data-table__amount">
                      {formatPrice(application.amount)}
                    </td>
                    <td data-label="Status">
                      <ApplicationStatusBadge status={application.status} />
                    </td>
                    <td data-label="Action">
                      {application.status === "pending" && (
                        <Link to={`/checkout/${application.id}`} className="btn btn--primary">
                          Pay now
                        </Link>
                      )}
                    </td>
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
