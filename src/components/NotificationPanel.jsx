import { useEffect, useState, useCallback } from "react";
import { getNotifications, getWeatherNotifications } from "../api/notificationApi";
import { formatTime } from "../utils/formatTime";
import "../styles/components.css";

const REFRESH_INTERVAL = 10000;

function NotificationPanel({ weather, onCountChange }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [read, setRead] = useState({});

  const fetchNotifications = useCallback(async () => {
    try {
      const data = await getNotifications();
      const weatherAlerts = weather ? getWeatherNotifications(weather) : [];
      const merged = [...weatherAlerts, ...data];
      setNotifications(merged);
      if (onCountChange) onCountChange(merged.length);
      setError("");
    } catch (err) {
      setError("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  }, [weather]);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const markRead = (id) => setRead((prev) => ({ ...prev, [id]: true }));
  const unreadCount = notifications.filter((n) => !read[n.id]).length;

  if (loading) return <div className="np-container"><p className="np-status">Loading...</p></div>;

  return (
    <div className="np-container">
      <div className="np-header">
        <h3>Notifications</h3>
        {unreadCount > 0 && <span className="np-badge">{unreadCount}</span>}
      </div>
      {error && <p className="np-status np-error">{error}</p>}
      {!error && notifications.length === 0 && (
        <p className="np-status">No notifications yet.</p>
      )}
      {notifications.map((item, index) => (
        <div
          key={`${item.id}-${index}`}
          className={`np-item ${read[`${item.id}-${index}`] ? "np-read" : "np-unread"}`}
          onClick={() => markRead(`${item.id}-${index}`)}
        >
          <h4 className="np-title">{item.title}</h4>
          <p className="np-body">{item.message}</p>
          <small className="np-time">{formatTime(item.createdAt)}</small>
        </div>
      ))}
    </div>
  );
}

export default NotificationPanel;
