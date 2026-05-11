import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { FaCog, FaBell, FaUser } from "react-icons/fa";

// Assets
import carPng from "./assets/car.png";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

// ---------------- SAFE LEAFLET SETUP ----------------
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: icon,
  shadowUrl: iconShadow,
});

// ---------------- CUSTOM RED CAR ICON ----------------
const carIcon = L.icon({
  iconUrl: carPng,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16],
});

// ---------------- MAP PAN COMPONENT ----------------
function MapPan({ position }) {
  const map = useMap();
  useEffect(() => {
    if (!position || !map) return;
    map.flyTo(position, 14, { duration: 1 });
  }, [position, map]);
  return null;
}

// ---------------- UI COMPONENTS ----------------
function SidebarRail({ onSelect }) {
  return (
    <div style={railStyle}>
      <div style={{ color: "#EF4444", fontWeight: "bold", marginBottom: '20px' }}>RC</div>
      <div style={{ flex: 1 }} />
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <FaCog style={iconStyle} onClick={() => onSelect("overview")} />
        <FaBell style={iconStyle} onClick={() => onSelect("repairs")} />
        <FaUser style={iconStyle} onClick={() => onSelect("register")} />
      </div>
    </div>
  );
}

function TopBar({ activePage, setActivePage }) {
  const pages = [
    { key: "overview", label: "Overview" },
    // { key: "repairs", label: "File Repair" },
    // { key: "fleet", label: "Fleet Status" },
    // { key: "register", label: "Register Vehicle" },
  ];

  return (
    <div style={topBarStyle}>
      {pages.map((p) => (
        <div
          key={p.key}
          onClick={() => setActivePage(p.key)}
          style={{
            marginRight: "20px",
            cursor: "pointer",
            color: activePage === p.key ? "#EF4444" : "#fff",
            fontWeight: activePage === p.key ? "bold" : "normal"
          }}
        >
          {p.label}
        </div>
      ))}
    </div>
  );
}

// ---------------- MAIN COMPONENT ----------------
// Accept 'vehicles' as a prop from App.jsx
export default function FleetMap({ vehicles = [] }) {
  const [activePage, setActivePage] = useState("fleet");
  const [selectedVehicleId, setSelectedVehicleId] = useState(null);

  const hq = [-1.2921, 36.8219];

  // FIND SELECTED VEHICLE IN THE LIVE ARRAY
  const selectedVehicleData = vehicles.find((v) => v.firebaseId === selectedVehicleId);

  const selectedPos = selectedVehicleData?.lat && selectedVehicleData?.lng
      ? [selectedVehicleData.lat, selectedVehicleData.lng]
      : null;

  return (
    <>
      {/* SIDEBAR AND TOPBAR ALWAYS VISIBLE */}
      <SidebarRail onSelect={setActivePage} />
      <TopBar activePage={activePage} setActivePage={setActivePage} />

      {/* MAP VIEW - ACTIVE ON 'FLEET' PAGE */}
      {activePage === "fleet" && (
        <div style={{ position: "fixed", inset: 0, zIndex: 0 }}>
          <MapContainer
            center={hq}
            zoom={13}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />

            {selectedPos && <MapPan position={selectedPos} />}

            <Marker position={hq}>
              <Popup>HQ Nairobi</Popup>
            </Marker>

            {/* LIVE VEHICLE RENDERING */}
            {vehicles.map((v) => (
                <Marker
                  key={v.firebaseId} // Using Firestore ID for stable keys
                  position={[v.lat, v.lng]}
                  icon={carIcon}
                  eventHandlers={{
                    click: () => setSelectedVehicleId(v.firebaseId),
                  }}
                >
                  <Popup>
                    <div style={{ color: '#111' }}>
                      <strong style={{ color: '#EF4444' }}>{v.plate}</strong><br/>
                      Driver: {v.driver}<br/>
                      Speed: {v.speed || 0} km/h
                    </div>
                  </Popup>
                </Marker>
              ))}
          </MapContainer>
        </div>
      )}

      {/* OTHER PAGES PLACEHOLDERS */}
      {activePage !== "fleet" && (
         <div style={pageStyle}>
            <h2 style={{ textTransform: 'uppercase', letterSpacing: '2px' }}>
              {activePage.replace(/([A-Z])/g, ' $1')}
            </h2>
            <p style={{ color: '#666' }}>Terminal access granted. Interface operational.</p>
         </div>
      )}
    </>
  );
}

// ---------------- STYLES ----------------
const railStyle = { position: "fixed", left: 0, top: 0, width: "60px", height: "100vh", background: "#111", display: "flex", flexDirection: "column", alignItems: "center", padding: "12px", zIndex: 10, borderRight: "1px solid #222" };
const topBarStyle = { position: "fixed", top: 0, left: "60px", right: 0, height: "60px", background: "#111", display: "flex", alignItems: "center", padding: "0 20px", zIndex: 10, borderBottom: "1px solid #222" };
const pageStyle = { position: "fixed", top: "100px", left: "100px", right: "20px", color: "white", zIndex: 10 };
const iconStyle = { color: "white", cursor: "pointer", fontSize: "18px" };