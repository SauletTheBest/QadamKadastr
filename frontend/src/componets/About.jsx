// src/componets/About.jsx
export default function About({ t }) {
  return (
    <div className="about-container">
      <h2>{t.aboutTitle}</h2>
      
      <div className="info-card">
        <div className="info-icon">🏛️</div>
        <div>
          <h3>{t.about1Title}</h3>
          <p>{t.about1Desc}</p>
        </div>
      </div>

      <div className="info-card">
        <div className="info-icon">🔢</div>
        <div>
          <h3>{t.about2Title}</h3>
          <p>{t.about2Desc}</p>
          <ul className="cadastre-breakdown">
            <li><strong>01</strong> — {t.about2Item1}</li>
            <li><strong>001</strong> — {t.about2Item2}</li>
            <li><strong>001</strong> — {t.about2Item3}</li>
            <li><strong>005</strong> — {t.about2Item4}</li>
          </ul>
        </div>
      </div>

      <div className="info-card">
        <div className="info-icon">🛰️</div>
        <div>
          <h3>{t.about3Title}</h3>
          <p>{t.about3Desc}</p>
        </div>
      </div>
    </div>
  );
}