// src/componets/Navbar.jsx
export default function Navbar({ activeTab, setActiveTab, lang, setLang, t }) {
  const navItems = [
    { id: "home", label: t.home },
    { id: "map", label: t.map },
    { id: "parcels", label: t.parcels },
    { id: "about", label: t.about },
  ];

  const toggleLanguage = () => {
    setLang(lang === "kz" ? "ru" : "kz");
  };

  return (
    <header className="header">
      <div className="logo-section" onClick={() => setActiveTab("home")} style={{ cursor: "pointer" }}>
        <div className="logo-icon">🗺️</div>
        <div>
          <h1>{t.title}</h1>
          <span className="subtitle">{t.subtitle}</span>
        </div>
      </div>

      <div className="nav-right">
        <nav>
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`nav-btn ${activeTab === item.id ? "active" : ""}`}
              onClick={() => setActiveTab(item.id)}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <button className="lang-toggle-btn" onClick={toggleLanguage} title="Тілді ауыстыру / Сменить язык">
          {lang === "kz" ? "🇰🇿 ҚАЗ" : "🇷🇺 РУС"}
        </button>
      </div>
    </header>
  );
}