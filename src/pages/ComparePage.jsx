import { useState } from "react";
import { fetchWeather } from "../api/weatherApi";
import WeatherIcon from "../components/WeatherIcon";
import "../styles/Weather.css";
import "../styles/components.css";

const ROWS = [
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
              {dataA ? <><WeatherIcon code={dataA.weathercode} size={32} /><span>{dataA.city}</span></> : <span className="cmp-empty-col">—</span>}
            </div>
            <div className="cmp-cell cmp-city-col">
              {dataB ? <><WeatherIcon code={dataB.weathercode} size={32} /><span>{dataB.city}</span></> : <span className="cmp-empty-col">—</span>}
            </div>
          </div>
          {ROWS.map(({ label, key, fmt: fmtFlag, unit }) => {
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

export default ComparePage;
