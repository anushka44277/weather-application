import "../styles/components.css";

function FavoriteCities({ favorites, onSelect, onRemove }) {
  if (!favorites.length) return (
    <div className="fc-container">
      <h3 className="fc-heading">Favorite Cities</h3>
      <p className="fc-empty">No favorites yet. Add a city to save it.</p>
    </div>
  );

  return (
    <div className="fc-container">
      <h3 className="fc-heading">Favorite Cities</h3>
      {favorites.map((city) => (
        <div key={city} className="fc-item">
          <span className="fc-city" onClick={() => onSelect(city)}>{city}</span>
          <button className="fc-remove" onClick={() => onRemove(city)} title="Remove">✕</button>
        </div>
      ))}
    </div>
  );
}

export default FavoriteCities;
