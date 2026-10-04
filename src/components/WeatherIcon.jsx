import "../styles/components.css";

function WeatherIcon({ code, size = 48 }) {
  const s = size;

  if (code === 0) return (
    <svg width={s} height={s} viewBox="0 0 64 64" className="wi wi-sunny">
      <circle cx="32" cy="32" r="12" fill="#FFB703" />
      {[0,45,90,135,180,225,270,315].map((deg, i) => (
        <line key={i}
          x1="32" y1="8" x2="32" y2="14"
          stroke="#FFB703" strokeWidth="3" strokeLinecap="round"
          transform={`rotate(${deg} 32 32)`}
        />
      ))}
    </svg>
  );

  if (code <= 3) return (
    <svg width={s} height={s} viewBox="0 0 64 64" className="wi wi-partly-cloudy">
      <circle cx="26" cy="28" r="10" fill="#FFB703" />
      <ellipse cx="36" cy="36" rx="16" ry="10" fill="#94a3b8" />
      <ellipse cx="24" cy="38" rx="12" ry="8" fill="#cbd5e1" />
    </svg>
  );

  if (code <= 48) return (
    <svg width={s} height={s} viewBox="0 0 64 64" className="wi wi-foggy">
      <ellipse cx="32" cy="24" rx="18" ry="10" fill="#94a3b8" />
      {[20,28,36,44].map((y, i) => (
        <line key={i} x1="12" y1={y + 16} x2="52" y2={y + 16}
          stroke="#cbd5e1" strokeWidth="3" strokeLinecap="round" />
      ))}
    </svg>
  );

  if (code <= 67) return (
    <svg width={s} height={s} viewBox="0 0 64 64" className="wi wi-rainy">
      <ellipse cx="32" cy="22" rx="18" ry="10" fill="#64748b" />
      <ellipse cx="20" cy="26" rx="12" ry="8" fill="#94a3b8" />
      {[[22,38,30,50],[30,36,38,48],[38,40,46,52],[26,44,34,56]].map(([x1,y1,x2,y2], i) => (
        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
          stroke="#4FACFE" strokeWidth="2.5" strokeLinecap="round"
          className={`wi-drop wi-drop-${i}`} />
      ))}
    </svg>
  );

  if (code <= 77) return (
    <svg width={s} height={s} viewBox="0 0 64 64" className="wi wi-snowy">
      <ellipse cx="32" cy="22" rx="18" ry="10" fill="#94a3b8" />
      {[[22,38],[32,42],[42,38],[27,50],[37,50]].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="3" fill="white" stroke="#cbd5e1" strokeWidth="1"
          className={`wi-flake wi-flake-${i}`} />
      ))}
    </svg>
  );

  if (code <= 82) return (
    <svg width={s} height={s} viewBox="0 0 64 64" className="wi wi-showers">
      <ellipse cx="32" cy="20" rx="20" ry="11" fill="#475569" />
      {[[20,34,24,44],[30,32,34,42],[40,34,44,44],[25,42,29,52],[35,40,39,50]].map(([x1,y1,x2,y2], i) => (
        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
          stroke="#4FACFE" strokeWidth="2.5" strokeLinecap="round"
          className={`wi-drop wi-drop-${i}`} />
      ))}
    </svg>
  );

  // Thunderstorm
  return (
    <svg width={s} height={s} viewBox="0 0 64 64" className="wi wi-thunder">
      <ellipse cx="32" cy="20" rx="20" ry="11" fill="#334155" />
      <polygon points="34,30 26,44 32,44 28,56 42,38 34,38" fill="#FFB703" className="wi-bolt" />
    </svg>
  );
}

export default WeatherIcon;
