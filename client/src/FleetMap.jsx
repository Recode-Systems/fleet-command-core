import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import fleetData from './mockFleet';

// --- HQ Marker ---
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// --- Car Icons ---
let carIcon = L.icon({
  iconUrl: '/src/assets/car.png', // regular fleet car
  iconSize: [30, 30],
  iconAnchor: [15, 15]
});
let selectedCarIcon = L.icon({
  iconUrl: '/src/assets/car-selected.png', // highlighted fleet car
  iconSize: [36, 36],
  iconAnchor: [18, 18]
});

// --- Helper to pan map ---
function MapPan({ position }) {
  const map = useMap();
  if (position) {
    map.setView(position, map.getZoom(), { animate: true });
  }
  return null;
}

const FleetMap = () => {
  const hqPosition = [-1.2921, 36.8219];
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  // get coordinates of selected vehicle
  const selectedPos = selectedVehicle
    ? [
        fleetData.find(v => v.id === selectedVehicle).lat,
        fleetData.find(v => v.id === selectedVehicle).lng
      ]
    : null;

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, right: 0, display: 'flex' }}>
      
      {/* Sidebar */}
      <div className="w-64 bg-slate-900 p-4 text-white flex-shrink-0 overflow-y-auto border-r border-slate-700">
        <h2 className="text-lg font-bold mb-4">Fleet Dashboard</h2>
        {fleetData.map(vehicle => (
          <div
            key={vehicle.id}
            onClick={() => setSelectedVehicle(vehicle.id)}
            className={`p-2 mb-2 rounded-lg cursor-pointer ${
              selectedVehicle === vehicle.id ? 'bg-blue-600' : 'bg-slate-800'
            }`}
          >
            <p className="font-bold">{vehicle.name}</p>
            <p className="text-xs">Driver: {vehicle.driver}</p>
            <p className="text-xs">Speed: {vehicle.speed} km/h</p>
            <p className="text-xs">Fuel: {vehicle.fuel}%</p>
            <p className="text-xs">Status: {vehicle.status}</p>
          </div>
        ))}
      </div>

      {/* Map */}
      <div style={{ flex: 1, position: 'relative' }}>
        <MapContainer
          center={hqPosition}
          zoom={13}
          scrollWheelZoom={true}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />

          {/* Pan to selected vehicle */}
          {selectedPos && <MapPan position={selectedPos} />}

          {/* HQ Marker */}
          <Marker position={hqPosition}>
            <Popup>
              <div className="text-white font-bold">
                HQ: Nairobi Control <br /> System Active.
              </div>
            </Popup>
          </Marker>

          {/* Fleet Markers */}
          {fleetData.map(vehicle => (
            <Marker
              key={vehicle.id}
              position={[vehicle.lat, vehicle.lng]}
              icon={vehicle.id === selectedVehicle ? selectedCarIcon : carIcon}
              eventHandlers={{
                click: () => setSelectedVehicle(vehicle.id)
              }}
            >
              <Popup>
                <div className="text-white font-mono">
                  <strong>{vehicle.name}</strong><br />
                  Driver: {vehicle.driver}<br />
                  Speed: {vehicle.speed} km/h<br />
                  Fuel: {vehicle.fuel}%<br />
                  Status: {vehicle.status}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        {/* Live Status Panel */}
        <div className="absolute top-4 right-4 z-[1000] bg-slate-800/90 p-4 rounded-lg border border-slate-600 shadow-xl backdrop-blur-sm">
          <h2 className="text-blue-400 text-xs uppercase font-bold tracking-widest mb-2">
            Live Status
          </h2>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-white text-sm font-mono">System Online</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FleetMap;
