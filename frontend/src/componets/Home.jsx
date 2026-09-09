// src/componets/Home.jsx
export default function Home({ setActiveTab, totalParcels, t }) {
  return (
    <div className="home-container">
      <section className="hero-section">
        <div className="hero-badge">🏛️ ҚОСШЫ ҚАЛАСЫ • ТАЙТӨБЕ АУЫЛЫ</div>
        <h2>{t.heroTitle}</h2>
        <p className="hero-description">{t.heroDesc}</p>

        <div className="hero-actions">
          <button className="primary-btn" onClick={() => setActiveTab("map")}>
            {t.openMap}
          </button>
          <button className="secondary-btn" onClick={() => setActiveTab("parcels")}>
            {t.viewRegistry}
          </button>
        </div>
      </section>

      {/* Statistics Cards */}
      <section className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">🏡</div>
          <span className="stat-num">{totalParcels || 20}</span>
          <span className="stat-label">{t.statRegistered}</span>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🛰️</div>
          <span className="stat-num">WGS84</span>
          <span className="stat-label">{t.statCoords}</span>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📍</div>
          <span className="stat-num">Тайтөбе</span>
          <span className="stat-label">{t.statRegion}</span>
        </div>
      </section>
    </div>
  );
}