// src/componets/ParcelsTable.jsx
import { useState } from "react";

export default function ParcelsTable({ parcels, onSelectParcel, lang, t }) {
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = parcels.filter((p) => {
    const query = searchTerm.toLowerCase();
    const cad = p.cadastralNumber?.toLowerCase() || "";
    const addr = (lang === "kz" ? p.addressKz : p.addressRu)?.toLowerCase() || "";
    return cad.includes(query) || addr.includes(query);
  });

  const getStatusBadgeClass = (status) => {
    if (!status) return "badge-default";
    if (status.includes("Жеке") || status.includes("Частная")) return "badge-private";
    if (status.includes("Мемлекеттік") || status.includes("Гос")) return "badge-state";
    if (status.includes("Рәсімделуде") || status.includes("оформлении")) return "badge-pending";
    if (status.includes("Бос") || status.includes("Свободный")) return "badge-vacant";
    return "badge-default";
  };

  return (
    <div className="table-page">
      <div className="table-header-block">
        <div>
          <h2>{t.tableTitle}</h2>
          <p className="results-count">
            {t.resultsFound} <strong>{filtered.length}</strong> / {parcels.length}
          </p>
        </div>

        {/* Search Input */}
        <div className="search-bar">
          <input
            type="text"
            placeholder={t.searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button className="clear-btn" onClick={() => setSearchTerm("")}>
              {t.clear}
            </button>
          )}
        </div>
      </div>

      {/* Modern Table */}
      <div className="table-wrapper">
        <table className="custom-table">
          <thead>
            <tr>
              <th>{t.num}</th>
              <th>{t.cadNumber}</th>
              <th>{t.address}</th>
              <th>{t.area}</th>
              <th>{t.purpose}</th>
              <th>{t.status}</th>
              <th>{t.action}</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: "center", padding: "40px", color: "#888" }}>
                  Ешқандай учаске табылмады / Ничего не найдено
                </td>
              </tr>
            ) : (
              filtered.map((parcel, index) => {
                const status = lang === "kz" ? parcel.statusKz : parcel.statusRu;
                return (
                  <tr key={parcel.id}>
                    <td>{index + 1}</td>
                    <td>
                      <code className="cad-badge">{parcel.cadastralNumber}</code>
                    </td>
                    <td>{lang === "kz" ? parcel.addressKz : parcel.addressRu}</td>
                    <td className="bold">{parcel.area}</td>
                    <td>{lang === "kz" ? parcel.purposeKz : parcel.purposeRu}</td>
                    <td>
                      <span className={`table-status-badge ${getStatusBadgeClass(status)}`}>
                        {status}
                      </span>
                    </td>
                    <td>
                      <button
                        className="view-map-btn"
                        onClick={() => onSelectParcel(parcel)}
                      >
                        {t.viewOnMap}
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}