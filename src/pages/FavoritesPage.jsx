import "../styles/Weather.css";
import "../styles/components.css";

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

export default FavoritesPage;
