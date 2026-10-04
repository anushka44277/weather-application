import WeatherCard from "../components/WeatherCard";
import WeatherMap from "../components/WeatherMap";
import ErrorBoundary from "../components/ErrorBoundary";
import "../styles/Weather.css";

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

export default WeatherPage;
