// src/App.jsx
import { useState, useEffect } from "react";
import "leaflet/dist/leaflet.css";
import "./App.css";

import { translations } from "./translations";
import Navbar from "./componets/Navbar";
import Home from "./componets/Home";
import Mapview from "./componets/Mapview";
import ParcelsTable from "./componets/ParcelsTable";
import About from "./componets/About";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

function App() {
  const [activeTab, setActiveTab] = useState("home");
  const [selectedParcel, setSelectedParcel] = useState(null);
  const [parcels, setParcels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lang, setLang] = useState("kz"); // "kz" or "ru"

  const t = translations[lang];

  useEffect(() => {
    fetch(`${API_URL}/api/parcels`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setParcels(data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setError(t.errorTitle);
        setLoading(false);
      });
  }, [t.errorTitle]);

  const handleSelectFromTable = (parcel) => {
    setSelectedParcel(parcel);
    setActiveTab("map");
  };

  return (
    <div className="app">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        lang={lang}
        setLang={setLang}
        t={t}
      />

      <main className="main-content">
        {loading && (
          <div className="state-message loading-state">
            <div className="spinner"></div>
            <p>{t.loading}</p>
          </div>
        )}

        {error && (
          <div className="state-message error-state">
            <p>⚠️ {error}</p>
          </div>
        )}

        {!loading && !error && (
          <>
            {activeTab === "home" && (
              <Home
                setActiveTab={setActiveTab}
                totalParcels={parcels.length}
                t={t}
              />
            )}
            {activeTab === "map" && (
              <Mapview
                parcels={parcels}
                selectedParcel={selectedParcel}
                setSelectedParcel={setSelectedParcel}
                lang={lang}
                t={t}
              />
            )}
            {activeTab === "parcels" && (
              <ParcelsTable
                parcels={parcels}
                onSelectParcel={handleSelectFromTable}
                lang={lang}
                t={t}
              />
            )}
            {activeTab === "about" && <About t={t} />}
          </>
        )}
      </main>
    </div>
  );
}

export default App;