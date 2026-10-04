import "../styles/components.css";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function WeatherCard({ data, convert }) {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  const fmt = convert || ((c) => `${c}°C`);

  return (
    <div className="wc-container">

      {/* Main Card */}
      <div className="wc-main">
        <div className="wc-top">
          <div>
            <h2 className="wc-city">{data.city}</h2>
            <p className="wc-date">{today}</p>
            <p className="wc-condition">{data.condition}</p>
          </div>
          <div className="wc-right">
            <div className="wc-temp">{fmt(data.temperature)}</div>
          </div>
        </div>
        <div className="wc-sub">
          <span>High: {fmt(data.tempMax)}</span>
          <span>Low: {fmt(data.tempMin)}</span>
          <span>Feels like: {fmt(data.feelsLike)}</span>
          <span>Humidity: {data.humidity}%</span>
          <span>Wind: {data.windspeed} km/h</span>
        </div>
      </div>

      {/* 7-Day Forecast */}
      <div className="wc-forecast">
        <h3>7-Day Forecast</h3>
        <div className="wc-forecast-list">
          {data.daily.map((d, i) => (
            <div key={d.date} className="wc-forecast-item">
              <span className="wc-day">{i === 0 ? "Today" : DAYS[new Date(d.date).getDay()]}</span>
              <span className="wc-flabel">{d.condition}</span>
              <span className="wc-ftemp">{fmt(d.temp)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Highlights */}
      <div className="wc-highlights">
        <h3>Today's Highlights</h3>
        <div className="wc-highlights-grid">
          <div className="wc-highlight-card">
            <p className="wc-hl-label">Rain Chance</p>
            <p className="wc-hl-value">{data.rainChance}%</p>
          </div>
          <div className="wc-highlight-card">
            <p className="wc-hl-label">Humidity</p>
            <p className="wc-hl-value">{data.humidity}%</p>
          </div>
          <div className="wc-highlight-card">
            <p className="wc-hl-label">Wind Speed</p>
            <p className="wc-hl-value">{data.windspeed} km/h</p>
          </div>
          <div className="wc-highlight-card">
            <p className="wc-hl-label">Sunrise</p>
            <p className="wc-hl-value">{data.sunrise}</p>
          </div>
          <div className="wc-highlight-card">
            <p className="wc-hl-label">Sunset</p>
            <p className="wc-hl-value">{data.sunset}</p>
          </div>
          <div className="wc-highlight-card">
            <p className="wc-hl-label">Feels Like</p>
            <p className="wc-hl-value">{fmt(data.feelsLike)}</p>
          </div>
        </div>
      </div>

    </div>
  );
}

export default WeatherCard;
