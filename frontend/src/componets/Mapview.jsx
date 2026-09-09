// src/componets/Mapview.jsx
import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Polygon, Popup, useMap } from "react-leaflet";

function MapFlyTo({ selectedParcel }) {
  const map = useMap();
  useEffect(() => {
    if (selectedParcel && selectedParcel.coordinates?.length > 0) {
      const [lat, lng] = selectedParcel.coordinates[0];
      map.flyTo([lat, lng], 18, { duration: 1.2 });
    }
  }, [selectedParcel, map]);
  return null;
}

export default function Mapview({ parcels, selectedParcel, setSelectedParcel, lang, t }) {
  const [mapSearch, setMapSearch] = useState("");

  const filteredParcels = parcels.filter((p) => {
    const query = mapSearch.toLowerCase();
    const cad = p.cadastralNumber?.toLowerCase() || "";
    const addr = (lang === "kz" ? p.addressKz : p.addressRu)?.toLowerCase() || "";
    return cad.includes(query) || addr.includes(query);
  });

  const getStatusColor = (status) => {
    if (!status) return "#2196f3";
    if (status.includes("Жеке") || status.includes("Частная")) return "#27ae60"; // Green
    if (status.includes("Мемлекеттік") || status.includes("Гос")) return "#2980b9"; // Blue
    if (status.includes("Рәсімделуде") || status.includes("оформлении")) return "#e67e22"; // Orange
    if (status.includes("Бос") || status.includes("Свободный")) return "#7f8c8d"; // Gray
    return "#3498db";
  };

  return (
    <div className="map-page">
      <div className="map-header-bar">
        <div>
          <h2>{t.mapTitle}</h2>
          <p className="map-subtitle">{t.selectParcelHint}</p>
        </div>
        <div className="map-search-wrapper">
          <input
            type="text"
            className="map-search-input"
            placeholder={t.mapSearchPlaceholder}
            value={mapSearch}
            onChange={(e) => setMapSearch(e.target.value)}
          />
          {mapSearch && (
            <button className="clear-search-btn" onClick={() => setMapSearch("")}>×</button>
          )}
        </div>
      </div>

      <div className="map-viewport-wrapper">
        <MapContainer
          center={[50.9859, 71.2889]}
          zoom={16}
          style={{ height: "650px", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <MapFlyTo selectedParcel={selectedParcel} />

          {filteredParcels.map((parcel) => {
            const isSelected = selectedParcel?.id === parcel.id;
            const status = lang === "kz" ? parcel.statusKz : parcel.statusRu;
            const color = getStatusColor(status);

            return (
              <Polygon
                key={parcel.id}
                positions={parcel.coordinates}
                pathOptions={{
                  color: isSelected ? "#e74c3c" : color,
                  fillColor: isSelected ? "#e74c3c" : color,
                  fillOpacity: isSelected ? 0.75 : 0.45,
                  weight: isSelected ? 4 : 2,
                }}
                eventHandlers={{
                  click: () => setSelectedParcel(parcel),
                }}
              >
                {/* In-Map Leaflet Speech-Bubble Popup */}
                <Popup>
                  <div className="leaflet-popup-card">
                    <span className="popup-badge" style={{ backgroundColor: color }}>
                      {status}
                    </span>
                    <h4>{parcel.cadastralNumber}</h4>
                    <p className="popup-address">
                      {lang === "kz" ? parcel.addressKz : parcel.addressRu}
                    </p>
                    <p className="popup-area">
                      <strong>{t.area}:</strong> {parcel.area}
                    </p>
                  </div>
                </Popup>
              </Polygon>
            );
          })}
        </MapContainer>

        {/* Floating GIS Side Drawer on Top of Map */}
        {selectedParcel && (
          <aside className="gis-floating-panel">
            <button
              className="close-drawer-btn"
              onClick={() => setSelectedParcel(null)}
              title={t.close}
            >
              ×
            </button>

            <div className="panel-header">
              <span
                className="status-pill"
                style={{
                  backgroundColor: getStatusColor(
                    lang === "kz" ? selectedParcel.statusKz : selectedParcel.statusRu
                  ),
                }}
              >
                {lang === "kz" ? selectedParcel.statusKz : selectedParcel.statusRu}
              </span>
              <h3>{selectedParcel.cadastralNumber}</h3>
            </div>

            <div className="panel-content">
              <div className="detail-item">
                <span className="detail-label">{t.address}</span>
                <span className="detail-value">
                  {lang === "kz" ? selectedParcel.addressKz : selectedParcel.addressRu}
                </span>
              </div>

              <div className="detail-item">
                <span className="detail-label">{t.area}</span>
                <span className="detail-value bold">{selectedParcel.area}</span>
              </div>

              <div className="detail-item">
                <span className="detail-label">{t.purpose}</span>
                <span className="detail-value">
                  {lang === "kz" ? selectedParcel.purposeKz : selectedParcel.purposeRu}
                </span>
              </div>

              <div className="detail-item">
                <span className="detail-label">{t.status}</span>
                <span className="detail-value">
                  {lang === "kz" ? selectedParcel.statusKz : selectedParcel.statusRu}
                </span>
              </div>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}