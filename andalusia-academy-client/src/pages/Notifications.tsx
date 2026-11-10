import AsyncView from "../components/dashboard/AsyncView";
import PageBanner from "../components/PageBanner";
import { useApi } from "../hooks/useApi";
import { myNotificationsUrl } from "../services/notifications";
import type { AppNotification } from "../types";
import { formatDate } from "../utils/format";
import "./Notifications.css";

export default function Notifications() {
  const notifications = useApi<AppNotification[]>(myNotificationsUrl());

  return (
    <>
      <PageBanner title="Notifications" crumbs={[{ label: "Notifications" }]} />
      <section className="section">
        <div className="container notifications">
          <AsyncView
            query={notifications}
            loadingLabel="Loading your notifications…"
            empty={{
              title: "No notifications yet",
              message:
                "Updates about your account and courses will appear here.",
            }}
          >
            {(list) => (
              <ul className="notifications__list">
                {[...list]
                  .sort((a, b) => b.sentAt.localeCompare(a.sentAt))
                  .map((n) => (
                    <li key={n.id} className="notifications__item">
                      <div className="notifications__head">
                        <strong>{n.subject}</strong>
                        <time dateTime={n.sentAt}>{formatDate(n.sentAt)}</time>
                      </div>
                      <p>{n.message}</p>
                      <span className="notifications__type">{n.type}</span>
                    </li>
                  ))}
              </ul>
            )}
          </AsyncView>
        </div>
      </section>
    </>
  );
}
