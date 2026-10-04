import "../../styles/Weather.css";

function getGreeting() {
  const h = new Date().getHours();
  return h < 12 ? "Morning" : h < 18 ? "Afternoon" : "Evening";
}

function Dashboard({ user, weather, setActive, favorites, history, onCitySelect, locationWeather, locationStatus, notifications }) {
  const time = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
  const displayWeather = weather || locationWeather;

  return (
    <div className="wd-section">
      <div className="db-greeting">
        <h2>Good {getGreeting()}, {user.firstName}</h2>
        <p>{time}</p>
      </div>

      <div className="db-grid">
        <div className="db-card db-weather">
          <p className="db-label">Location</p>
          <p className="db-value db-val-sm">
            {locationStatus === "loading" && "Detecting..."}
            {locationStatus === "denied" && "Permission denied"}
            {locationStatus === "unavailable" && "Location unavailable"}
            {locationStatus === "done" && locationWeather?.city}
            {locationStatus === "idle" && "—"}
          </p>
        </div>
        <div className="db-card db-weather">
          <p className="db-label">Temperature</p>
          <p className="db-value">{displayWeather ? `${displayWeather.temperature}°C` : "—"}</p>
        </div>
        <div className="db-card db-weather">
          <p className="db-label">Condition</p>
          <p className="db-value db-val-sm">{displayWeather?.condition || "—"}</p>
        </div>
        <div className="db-card">
          <p className="db-label">Favorites</p>
          <p className="db-value">{favorites.length}</p>
        </div>
        <div className="db-card">
          <p className="db-label">Recent Searches</p>
          <p className="db-value">{history.length}</p>
        </div>
        <div className="db-card">
          <p className="db-label">Notifications</p>
          <p className="db-value">{notifications}</p>
        </div>
      </div>

      {favorites.length > 0 && (
        <div className="db-section-block">
          <h3 className="db-section-title">Favorite Cities</h3>
          <div className="db-chip-row">
            {favorites.map((city) => (
              <button key={city} className="db-chip" onClick={() => { onCitySelect(city); setActive("Weather"); }}>{city}</button>
            ))}
          </div>
        </div>
      )}

      {history.length > 0 && (
        <div className="db-section-block">
          <h3 className="db-section-title">Recent Searches</h3>
          <div className="db-chip-row">
            {history.map((city) => (
              <button key={city} className="db-chip db-chip-secondary" onClick={() => { onCitySelect(city); setActive("Weather"); }}>{city}</button>
            ))}
          </div>
        </div>
      )}

      {!displayWeather && (
        <div className="db-card db-cta" onClick={() => setActive("Weather")}>
          <p className="db-label">No weather data yet</p>
          <p className="db-value">Search a city in Weather →</p>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
