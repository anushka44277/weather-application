import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchWeather, fetchWeatherByCoords } from "../api/weatherApi";
import WeatherCard from "../components/WeatherCard";
import WeatherMap from "../components/WeatherMap";
import NotificationPanel from "../components/NotificationPanel";
import ActivityLog from "../components/ActivityLog";
import ErrorBoundary from "../components/ErrorBoundary";
import UserProfileCard from "../components/UserProfileCard";
import { useUserStorage } from "../hooks/useUserStorage";
import { useGeolocation } from "../hooks/useGeolocation";
import { useDarkMode } from "../hooks/useDarkMode";
import { useUnit } from "../hooks/useUnit";
import "../styles/Weather.css";
import "../styles/components.css";

// ─────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────

const NAV_ITEMS = ["Dashboard", "Weather", "Favorites", "Compare", "Settings", "Help"];

const COMPARE_ROWS = [
  { label: "Temperature", key: "temperature", fmt: true },
  { label: "Feels Like",  key: "feelsLike",   fmt: true },
  { label: "High",        key: "tempMax",      fmt: true },
  { label: "Low",         key: "tempMin",      fmt: true },
  { label: "Humidity",    key: "humidity",     unit: "%" },
  { label: "Wind Speed",  key: "windspeed",    unit: " km/h" },
  { label: "Condition",   key: "condition" },
  { label: "Rain Chance", key: "rainChance",   unit: "%" },
  { label: "Sunrise",     key: "sunrise" },
  { label: "Sunset",      key: "sunset" },
];

const FAQS = [
  { q: "How do I search for weather?", a: "Type a city name in the search bar and press Search." },
  { q: "How do I save a favorite city?", a: "Search a city, then click 'Add to Favorites' above the weather card." },
  { q: "How do I set a default city?", a: "Go to Settings or click 'Set as Default' on the Weather page. It loads automatically on next login." },
  { q: "How do I compare cities?", a: "Go to Compare in the sidebar and search two cities to see them side by side." },
  { q: "How do I switch between °C and °F?", a: "Click the °C / °F button in the top bar or go to Settings." },
  { q: "How do I enable dark mode?", a: "Click the Dark button in the top bar or toggle it in Settings." },
  { q: "How often does weather data update?", a: "Weather data is fetched fresh every time you search a city." },
  { q: "How often do notifications update?", a: "Notifications auto-refresh every 10 seconds." },
  { q: "How do I logout?", a: "Click the Logout button at the bottom of the left sidebar." },
];

function getGreeting() {
  const h = new Date().getHours();
  return h < 12 ? "Morning" : h < 18 ? "Afternoon" : "Evening";
}

// ─────────────────────────────────────────────────────────────
// DASHBOARD PAGE
// ─────────────────────────────────────────────────────────────

function Dashboard({ user, weather, setActive, favorites, history, onCitySelect, locationWeather, locationStatus, notifications, convert }) {
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
          <p className="db-value">{displayWeather ? convert(displayWeather.temperature) : "—"}</p>
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

// ─────────────────────────────────────────────────────────────
// WEATHER PAGE
// ─────────────────────────────────────────────────────────────

function WeatherPage({ weather, loading, error, city, setCity, handleSearch, favorites, addFavorite, removeFavorite, setDefaultCity, defaultCity, history, onCitySelect, onMapClick, locationWeather, convert, lastUpdated }) {
  const isFav = weather && favorites.includes(weather.city);

  return (
    <div className="wd-content">
      <form onSubmit={handleSearch} className="wd-search-inline">
        <input type="text" placeholder="Search city..." value={city} onChange={(e) => setCity(e.target.value)} required />
        <button type="submit">Search</button>
      </form>

      {history.length > 0 && (
        <div className="db-chip-row" style={{ marginBottom: 16 }}>
          {history.map((c) => (
            <button key={c} className="db-chip db-chip-secondary" onClick={() => onCitySelect(c)}>{c}</button>
          ))}
        </div>
      )}

      {loading && <p className="wd-status">Loading...</p>}
      {error && <p className="wd-status wd-error">{error}</p>}

      {weather && (
        <div className="wp-actions">
          <button className={`wp-btn-fav ${isFav ? "wp-btn-fav-active" : ""}`} onClick={() => isFav ? removeFavorite(weather.city) : addFavorite(weather.city)}>
            {isFav ? "Favorited" : "Add to Favorites"}
          </button>
          <button className={`wp-btn-default ${defaultCity === weather.city ? "wp-btn-default-active" : ""}`} onClick={() => setDefaultCity(weather.city)}>
            {defaultCity === weather.city ? "Default City" : "Set as Default"}
          </button>
          {lastUpdated && <span className="wp-updated">Updated {lastUpdated}</span>}
        </div>
      )}

      {weather
        ? <ErrorBoundary><WeatherCard data={weather} convert={convert} /></ErrorBoundary>
        : !loading && !error && <p className="wd-status">Search a city to see the forecast.</p>
      }

      <ErrorBoundary>
        <WeatherMap weather={weather} locationWeather={locationWeather} onLocationClick={onMapClick} loading={loading} />
      </ErrorBoundary>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// FAVORITES PAGE
// ─────────────────────────────────────────────────────────────

function FavoritesPage({ favorites, removeFavorite, onCitySelect, setActive, defaultCity, setDefaultCity }) {
  return (
    <div className="wd-section">
      <h2>Favorite Cities</h2>
      {favorites.length === 0 ? (
        <div className="pg-empty">
          <p>No favorite cities yet.</p>
          <button className="db-chip" onClick={() => setActive("Weather")}>Search a city to add</button>
        </div>
      ) : (
        <div className="fav-list">
          {favorites.map((city) => (
            <div key={city} className="fav-item">
              <div className="fav-info">
                <p className="fav-name">{city}</p>
                {defaultCity === city && <span className="fav-badge">Default</span>}
              </div>
              <div className="fav-actions">
                <button className="fav-btn fav-btn-load" onClick={() => { onCitySelect(city); setActive("Weather"); }}>Load Weather</button>
                <button className="fav-btn fav-btn-default" onClick={() => setDefaultCity(city)} disabled={defaultCity === city}>
                  {defaultCity === city ? "Default" : "Set Default"}
                </button>
                <button className="fav-btn fav-btn-remove" onClick={() => removeFavorite(city)}>Remove</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// COMPARE PAGE
// ─────────────────────────────────────────────────────────────

function ComparePage({ convert }) {
  const [cityA, setCityA] = useState("");
  const [cityB, setCityB] = useState("");
  const [dataA, setDataA] = useState(null);
  const [dataB, setDataB] = useState(null);
  const [loadingA, setLoadingA] = useState(false);
  const [loadingB, setLoadingB] = useState(false);
  const [errorA, setErrorA] = useState("");
  const [errorB, setErrorB] = useState("");

  const fmt = convert || ((c) => `${c}°C`);

  const search = async (cityName, setData, setLoading, setError) => {
    if (!cityName.trim()) return;
    setLoading(true); setError(""); setData(null);
    try { setData(await fetchWeather(cityName)); }
    catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  const winner = (key) => {
    if (!dataA || !dataB) return null;
    const a = dataA[key], b = dataB[key];
    if (typeof a !== "number") return null;
    return a > b ? "A" : b > a ? "B" : "tie";
  };

  return (
    <div className="wd-section">
      <h2>Compare Cities</h2>
      <div className="cmp-search-row">
        <div className="cmp-search-col">
          <form className="wd-search-inline" onSubmit={(e) => { e.preventDefault(); search(cityA, setDataA, setLoadingA, setErrorA); }}>
            <input placeholder="City A..." value={cityA} onChange={(e) => setCityA(e.target.value)} required />
            <button type="submit">Search</button>
          </form>
          {errorA && <p className="wd-status wd-error">{errorA}</p>}
        </div>
        <div className="cmp-vs">VS</div>
        <div className="cmp-search-col">
          <form className="wd-search-inline" onSubmit={(e) => { e.preventDefault(); search(cityB, setDataB, setLoadingB, setErrorB); }}>
            <input placeholder="City B..." value={cityB} onChange={(e) => setCityB(e.target.value)} required />
            <button type="submit">Search</button>
          </form>
          {errorB && <p className="wd-status wd-error">{errorB}</p>}
        </div>
      </div>

      {(loadingA || loadingB) && <p className="wd-status">Loading...</p>}

      {(dataA || dataB) && (
        <div className="cmp-table">
          <div className="cmp-header">
            <div className="cmp-cell cmp-label-col" />
            <div className="cmp-cell cmp-city-col">
              {dataA ? <span>{dataA.city}</span> : <span className="cmp-empty-col">—</span>}
            </div>
            <div className="cmp-cell cmp-city-col">
              {dataB ? <span>{dataB.city}</span> : <span className="cmp-empty-col">—</span>}
            </div>
          </div>
          {COMPARE_ROWS.map(({ label, key, fmt: fmtFlag, unit }) => {
            const w = winner(key);
            return (
              <div key={key} className="cmp-row">
                <div className="cmp-cell cmp-label-col">{label}</div>
                <div className={`cmp-cell ${w === "A" ? "cmp-win" : ""}`}>
                  {dataA ? (fmtFlag ? fmt(dataA[key]) : `${dataA[key]}${unit || ""}`) : "—"}
                </div>
                <div className={`cmp-cell ${w === "B" ? "cmp-win" : ""}`}>
                  {dataB ? (fmtFlag ? fmt(dataB[key]) : `${dataB[key]}${unit || ""}`) : "—"}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {!dataA && !dataB && !loadingA && !loadingB && (
        <p className="wd-status">Search two cities above to compare their weather.</p>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// SETTINGS PAGE
// ─────────────────────────────────────────────────────────────

function SettingsPage({ dark, toggleDark, unit, toggleUnit, defaultCity, setDefaultCity, clearHistory, history }) {
  const [newDefault, setNewDefault] = useState(defaultCity || "");
  const [saved, setSaved] = useState(false);

  const handleSaveDefault = (e) => {
    e.preventDefault();
    if (newDefault.trim()) {
      setDefaultCity(newDefault.trim());
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  return (
    <div className="wd-section">
      <h2>Settings</h2>

      <div className="stg-group">
        <h3 className="stg-title">Appearance</h3>
        <div className="stg-row">
          <div>
            <p className="stg-label">Dark Mode</p>
            <p className="stg-sub">Switch between light and dark theme</p>
          </div>
          <button className={`stg-toggle ${dark ? "stg-toggle-on" : ""}`} onClick={toggleDark}>
            <span className="stg-knob" />
          </button>
        </div>
        <div className="stg-row">
          <div>
            <p className="stg-label">Temperature Unit</p>
            <p className="stg-sub">Currently showing in °{unit}</p>
          </div>
          <button className="stg-btn" onClick={toggleUnit}>Switch to °{unit === "C" ? "F" : "C"}</button>
        </div>
      </div>

      <div className="stg-group">
        <h3 className="stg-title">Default City</h3>
        <p className="stg-sub" style={{ marginBottom: 12 }}>This city loads automatically when you log in.</p>
        <form className="stg-form" onSubmit={handleSaveDefault}>
          <input value={newDefault} onChange={(e) => setNewDefault(e.target.value)} placeholder="Enter city name..." />
          <button type="submit">Save</button>
        </form>
        {defaultCity && <p className="stg-current">Current default: <strong>{defaultCity}</strong></p>}
        {saved && <p className="stg-saved">Saved!</p>}
      </div>

      <div className="stg-group">
        <h3 className="stg-title">Search History</h3>
        <p className="stg-sub">{history.length} cities in your history.</p>
        <button className="stg-btn stg-btn-danger" onClick={clearHistory} disabled={history.length === 0}>
          Clear History
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// HELP PAGE
// ─────────────────────────────────────────────────────────────

function HelpPage() {
  return (
    <div className="wd-section">
      <h2>Help</h2>
      <div className="wd-faq">
        {FAQS.map((faq, i) => (
          <div key={i} className="wd-faq-item">
            <p className="wd-faq-q">{faq.q}</p>
            <p className="wd-faq-a">{faq.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// MAIN LAYOUT
// ─────────────────────────────────────────────────────────────

function Weather() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [active, setActive] = useState("Dashboard");
  const [notifCount, setNotifCount] = useState(0);
  const [lastUpdated, setLastUpdated] = useState("");
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const { favorites, addFavorite, removeFavorite, history, addHistory, clearHistory, defaultCity, setDefaultCity } = useUserStorage(user.username);
  const { locationWeather, locationStatus } = useGeolocation();
  const { dark, toggle: toggleDark } = useDarkMode();
  const { unit, toggle: toggleUnit, convert } = useUnit();

  useEffect(() => {
    if (defaultCity) loadCity(defaultCity);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const loadCity = async (cityName) => {
    setLoading(true); setError(""); setWeather(null); setCity(cityName);
    try {
      const data = await fetchWeather(cityName);
      setWeather(data);
      addHistory(data.city);
      setLastUpdated(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  const handleSearch = async (e) => { e.preventDefault(); await loadCity(city); };

  const handleMapClick = async (lat, lon) => {
    setLoading(true); setError(""); setWeather(null);
    try {
      const data = await fetchWeatherByCoords(lat, lon);
      setWeather(data); setCity(data.city);
      addHistory(data.city);
      setLastUpdated(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const renderContent = () => {
    switch (active) {
      case "Dashboard":
        return <Dashboard user={user} weather={weather} setActive={setActive} favorites={favorites}
          history={history} onCitySelect={loadCity} locationWeather={locationWeather}
          locationStatus={locationStatus} notifications={notifCount} convert={convert} />;
      case "Weather":
        return <WeatherPage weather={weather} loading={loading} error={error} city={city}
          setCity={setCity} handleSearch={handleSearch} favorites={favorites}
          addFavorite={addFavorite} removeFavorite={removeFavorite} setDefaultCity={setDefaultCity}
          defaultCity={defaultCity} history={history} onCitySelect={loadCity}
          onMapClick={handleMapClick} locationWeather={locationWeather}
          convert={convert} lastUpdated={lastUpdated} />;
      case "Favorites":
        return <FavoritesPage favorites={favorites} removeFavorite={removeFavorite}
          onCitySelect={loadCity} setActive={setActive}
          defaultCity={defaultCity} setDefaultCity={setDefaultCity} />;
      case "Compare":
        return <ComparePage convert={convert} />;
      case "Settings":
        return <SettingsPage dark={dark} toggleDark={toggleDark} unit={unit} toggleUnit={toggleUnit}
          defaultCity={defaultCity} setDefaultCity={setDefaultCity}
          clearHistory={clearHistory} history={history} />;
      case "Help":
        return <HelpPage />;
      default:
        return null;
    }
  };

  return (
    <div className={`wd-layout${dark ? " wd-dark" : ""}`}>

      <aside className="wd-sidebar">
        <ErrorBoundary><UserProfileCard user={user} /></ErrorBoundary>
        <h2 className="wd-logo">WeatherApp</h2>
        <nav className="wd-nav">
          {NAV_ITEMS.map((label) => (
            <button key={label} className={`wd-nav-item ${active === label ? "wd-nav-active" : ""}`} onClick={() => setActive(label)}>
              {label}
            </button>
          ))}
        </nav>
        <button className="wd-logout" onClick={handleLogout}>Logout</button>
      </aside>

      <div className="wd-main">
        <div className="wd-topbar">
          <h3 className="wd-page-title">{active}</h3>

        </div>
        <div className="wd-content">{renderContent()}</div>
      </div>

      <aside className="wd-right">
        <ErrorBoundary><NotificationPanel weather={weather} onCountChange={setNotifCount} /></ErrorBoundary>
        <ErrorBoundary><ActivityLog /></ErrorBoundary>
      </aside>

    </div>
  );
}

export default Weather;
