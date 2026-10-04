import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "../styles/components.css";

// Fix default marker icons broken by Vite's asset handling
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Flies map to new center whenever coords change
function MapController({ lat, lon }) {
  const map = useMap();
  const prev = useRef(null);

  useEffect(() => {
    if (lat == null || lon == null) return;
    const key = `${lat},${lon}`;
    if (prev.current === key) return;
    prev.current = key;
    map.flyTo([lat, lon], 10, { duration: 1.2 });
  }, [lat, lon, map]);

  return null;
}

// Handles map click → reverse geocode → load weather
function ClickHandler({ onLocationClick, loading }) {
  useMapEvents({
    click: (e) => {
      if (loading) return;
      onLocationClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

function WeatherMap({ weather, locationWeather, onLocationClick, loading }) {
  const activeWeather = weather || locationWeather;
  const center = activeWeather ? [activeWeather.lat, activeWeather.lon] : [20, 0];
  const zoom = activeWeather ? 10 : 2;

  return (
    <div className="wmap-container">
      <div className="wmap-header">
        <h3 className="wmap-title">Interactive Map</h3>
        <p className="wmap-hint">Click anywhere on the map to load weather for that location</p>
      </div>
      <div className={`wmap-wrap ${loading ? "wmap-loading" : ""}`}>
        <MapContainer
          center={center}
          zoom={zoom}
          className="wmap-leaflet"
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <MapController
            lat={activeWeather?.lat}
            lon={activeWeather?.lon}
          />

          <ClickHandler onLocationClick={onLocationClick} loading={loading} />

          {activeWeather && (
            <Marker position={[activeWeather.lat, activeWeather.lon]}>
              <Popup>
                <strong>{activeWeather.city}</strong><br />
                {activeWeather.temperature}°C · {activeWeather.condition}
              </Popup>
            </Marker>
          )}
        </MapContainer>

        {loading && (
          <div className="wmap-overlay">
            <span>Loading weather...</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default WeatherMap;
