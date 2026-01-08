import React from 'react';

const Sidebar = () => {
  // Mock Data: This simulates what the database will eventually send us
  const vehicles = [
    { id: 'KBA 123L', driver: 'Kamau J.', status: 'Moving', speed: 65, fuel: 80 },
    { id: 'KCD 909Z', driver: 'Atieno M.', status: 'Idle', speed: 0, fuel: 45 },
    { id: 'KDE 454P', driver: 'Ochieng B.', status: 'Maintenance', speed: 0, fuel: 10 },
  ];

  return (
    <div className="h-full w-80 bg-slate-900 border-r border-slate-700 flex flex-col shadow-2xl z-20 relative">
      
      {/* Sidebar Header */}
      <div className="p-5 border-b border-slate-800">
        <h2 className="text-white text-lg font-bold tracking-wider uppercase flex items-center gap-2">
          <span className="text-blue-500 text-2xl">⚡</span> 
          Active Fleet
        </h2>
        <p className="text-slate-400 text-xs mt-1 font-mono">Total Units: {vehicles.length}</p>
      </div>

      {/* Vehicle List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {vehicles.map((vehicle) => (
          <div 
            key={vehicle.id} 
            className="bg-slate-800 p-4 rounded-lg border border-slate-700 hover:border-blue-500 hover:bg-slate-750 transition-all cursor-pointer group"
          >
            {/* Vehicle Header */}
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-white font-bold font-mono">{vehicle.id}</h3>
              {/* Status Badge */}
              <span className={`text-[10px] px-2 py-0.5 rounded uppercase font-bold tracking-wide
                ${vehicle.status === 'Moving' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : ''}
                ${vehicle.status === 'Idle' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : ''}
                ${vehicle.status === 'Maintenance' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : ''}
              `}>
                {vehicle.status}
              </span>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-y-2 text-xs text-slate-400 mb-3">
              <div>Driver: <span className="text-slate-200">{vehicle.driver}</span></div>
              <div className="text-right">Speed: <span className="text-slate-200">{vehicle.speed} km/h</span></div>
            </div>

            {/* Fuel Bar */}
            <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full ${vehicle.fuel < 20 ? 'bg-red-500' : 'bg-blue-500'}`} 
                style={{ width: `${vehicle.fuel}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-[10px] text-slate-500 mt-1">
              <span>Fuel Level</span>
              <span>{vehicle.fuel}%</span>
            </div>
          </div>
        ))}
      </div>

      {/* Sidebar Footer */}
      <div className="p-4 bg-slate-950 border-t border-slate-800">
        <button className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2 rounded text-sm font-bold uppercase tracking-wider transition-colors shadow-lg shadow-blue-900/20">
          + Add Vehicle
        </button>
      </div>
    </div>
  );
};

export default Sidebar;