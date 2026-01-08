import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import fleetData from './mockFleet';
import { FaCog, FaBell, FaUser } from 'react-icons/fa';
import carPng from './assets/car.png'; // fleet car icon

// ----- LEAFLET ICON FIX -----
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

L.Marker.prototype.options.icon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// ----- CAR ICON -----
const carIcon = L.icon({
  iconUrl: carPng,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

// ----- PULSE ICON -----
const pulseIcon = L.divIcon({
  className: '',
  html: '<div class="pulse-marker"></div>',
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

// ----- MAP PAN HELPER -----
function MapPan({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) map.flyTo(position, 14, { duration: 1 });
  }, [position, map]);
  return null;
}

// ----- SIDEBAR RAIL -----
function SidebarRail({ onSelect }) {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        height: '100vh',
        width: '60px',
        background: '#111',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px 0',
        zIndex: 10,
      }}
    >
      <div style={{ color: '#EF4444', fontWeight: 'bold', fontSize: '20px' }}>RC</div>
      <div style={{ flex: 1 }}></div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center' }}>
        <FaCog size={24} style={{ cursor: 'pointer', color: '#fff' }} onClick={() => onSelect('settings')} />
        <FaBell size={24} style={{ cursor: 'pointer', color: '#fff' }} onClick={() => onSelect('notifications')} />
        <FaUser size={24} style={{ cursor: 'pointer', color: '#fff' }} onClick={() => onSelect('profile')} />
      </div>
    </div>
  );
}

// ----- TOP BAR -----
function TopBar({ activePage, onSelect }) {
  const pages = [
    { key: 'overview', label: 'Overview' },
    { key: 'repairs', label: 'File Repair' },
    { key: 'fleet', label: 'Fleet Status' },
    { key: 'register', label: 'Register Vehicle' },
  ];

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: '60px', // leave space for rail
        right: 0,
        height: '60px',
        background: '#111',
        display: 'flex',
        alignItems: 'center',
        padding: '0 20px',
        zIndex: 10,
        borderBottom: '1px solid #333',
      }}
    >
      {pages.map(page => (
        <div
          key={page.key}
          onClick={() => onSelect(page.key)}
          style={{
            marginRight: '24px',
            cursor: 'pointer',
            color: activePage === page.key ? '#EF4444' : '#fff',
            fontWeight: activePage === page.key ? 'bold' : 'normal',
          }}
        >
          {page.label}
        </div>
      ))}
    </div>
  );
}

// ----- MAIN SIDEBAR -----
function MainSidebar({ selectedVehicle, setSelectedVehicle }) {
  return (
    <div
      style={{
        position: 'fixed',
        top: '80px',
        left: '80px',
        width: '260px',
        zIndex: 10,
        background: '#111',
        color: 'white',
        padding: '16px',
        borderRadius: '12px',
        maxHeight: '80vh',
        overflowY: 'auto',
      }}
    >
      <h2 style={{ fontWeight: 'bold', marginBottom: '12px', fontSize: '18px' }}>Fleet Dashboard</h2>
      {fleetData.map(v => {
        const isActive = selectedVehicle === v.id;
        return (
          <div
            key={v.id}
            onClick={() => setSelectedVehicle(v.id)}
            style={{
              padding: '12px',
              marginBottom: '12px',
              borderRadius: '10px',
              cursor: 'pointer',
              background: isActive ? '#EF4444' : '#1f1f1f',
              boxShadow: isActive ? '0 0 12px rgba(239,68,68,0.6)' : 'none',
            }}
          >
            <strong style={{ fontSize: '16px' }}>{v.name}</strong>
            <div style={{ fontSize: '12px', marginTop: '4px', lineHeight: '1.4' }}>
              Driver: {v.driver}<br />
              Speed: {v.speed} km/h<br />
              Fuel: {v.fuel}%<br />
              Status: {v.status}
            </div>
            <div style={{ marginTop: '6px', height: '6px', borderRadius: '3px', background: '#333' }}>
              <div
                style={{
                  width: `${v.fuel}%`,
                  height: '100%',
                  borderRadius: '3px',
                  background: isActive ? '#fff' : '#EF4444',
                  transition: 'width 0.3s',
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ----- FLEET MAP COMPONENT -----
export default function FleetMap() {
  const hqPosition = [-1.2921, 36.8219];
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [activePage, setActivePage] = useState('overview');

  const selectedPos = selectedVehicle
    ? [fleetData.find(v => v.id === selectedVehicle).lat, fleetData.find(v => v.id === selectedVehicle).lng]
    : null;

  return (
    <>
      {/* MAP */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
        <MapContainer center={hqPosition} zoom={13} scrollWheelZoom style={{ height: '100vh', width: '100vw' }}>
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution="&copy; OpenStreetMap contributors"
          />
          {selectedPos && <MapPan position={selectedPos} />}
          <Marker position={hqPosition}>
            <Popup>HQ – Nairobi Control</Popup>
          </Marker>
          {fleetData.map(vehicle => (
            <React.Fragment key={vehicle.id}>
              <Marker position={[vehicle.lat, vehicle.lng]} icon={pulseIcon} />
              <Marker
                position={[vehicle.lat, vehicle.lng]}
                icon={carIcon}
                eventHandlers={{ click: () => setSelectedVehicle(vehicle.id) }}
              >
                <Popup>
                  <strong>{vehicle.name}</strong>
                  <br />
                  Driver: {vehicle.driver}
                  <br />
                  Speed: {vehicle.speed} km/h
                  <br />
                  Fuel: {vehicle.fuel}%
                  <br />
                  Status: {vehicle.status}
                </Popup>
              </Marker>
            </React.Fragment>
          ))}
        </MapContainer>
      </div>

      {/* UI Layers */}
      <SidebarRail onSelect={page => console.log('Rail clicked:', page)} />
      <TopBar activePage={activePage} onSelect={setActivePage} />
      <MainSidebar selectedVehicle={selectedVehicle} setSelectedVehicle={setSelectedVehicle} />

      {/* Pulse Marker CSS */}
      <style>
        {`
          .pulse-marker {
            width: 16px;
            height: 16px;
            background: rgba(239, 68, 68, 0.9);
            border-radius: 50%;
            box-shadow: 0 0 0 rgba(239, 68, 68, 0.6);
            animation: pulse 1.8s infinite;
          }
          @keyframes pulse {
            0% { box-shadow: 0 0 0 0 rgba(239,68,68,0.7); }
            70% { box-shadow: 0 0 0 18px rgba(239,68,68,0); }
            100% { box-shadow: 0 0 0 0 rgba(239,68,68,0); }
          }
        `}
      </style>
    </>
  );
}
