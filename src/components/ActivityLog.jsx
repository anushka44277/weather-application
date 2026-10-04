import "../styles/components.css";

const ACTIVITIES = [
  { id: 1, action: "Searched city", detail: "Searched weather for Kathmandu" },
  { id: 2, action: "Logged in", detail: "Successfully logged in to WeatherApp" },
  { id: 3, action: "Viewed forecast", detail: "Checked 7-day forecast for London" },
  { id: 4, action: "Searched city", detail: "Searched weather for New York" },
  { id: 5, action: "Location updated", detail: "Default location set to Tokyo" },
  { id: 6, action: "Viewed highlights", detail: "Checked today's highlights for Paris" },
];

function ActivityLog() {
  return (
    <div className="al-container">
      <h3 className="al-heading">Activity Log</h3>
      {ACTIVITIES.map((a) => (
        <div key={a.id} className="al-item">
          <div className="al-dot" />
          <div className="al-content">
            <p className="al-user">{a.action}</p>
            <p className="al-body">{a.detail}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ActivityLog;
