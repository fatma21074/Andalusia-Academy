import { useNavigate } from "react-router-dom";
import { useApi } from "../hooks/useApi";
import { useAuth } from "../auth/useAuth";
import { profileUrl } from "../services/auth";
import type { UserProfile } from "../types";
import Button from "../components/Button";
import PageBanner from "../components/PageBanner";
import { ErrorState, LoadingState } from "../components/StateViews";
import "./Account.css";

export default function Profile() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { data: profile, loading, error, reload } = useApi<UserProfile>(profileUrl());

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <>
      <PageBanner title="My Profile" crumbs={[{ label: "Profile" }]} />
      <section className="section">
        <div className="container account">
          {loading && <LoadingState label="Loading your profile…" />}
          {error && <ErrorState message={error.message} onRetry={reload} />}
          {!loading && !error && profile && (
            <div className="account-card">
              <h2>
                {profile.firstName} {profile.lastName}
              </h2>
              <dl className="account-card__list">
                <div>
                  <dt>Email</dt>
                  <dd>{profile.email}</dd>
                </div>
                <div>
                  <dt>Role</dt>
                  <dd>{profile.role}</dd>
                </div>
                <div>
                  <dt>Phone</dt>
                  <dd>{profile.phoneNumber || "—"}</dd>
                </div>
                <div>
                  <dt>Country</dt>
                  <dd>{profile.country || "—"}</dd>
                </div>
              </dl>
              <div className="account-card__actions">
                <Button variant="ghost" onClick={handleLogout}>
                  Sign out
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
