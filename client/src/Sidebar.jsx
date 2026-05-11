import React from 'react';
import { Search, MapPin, Fuel, Gauge, FileText } from 'lucide-react';

const Sidebar = ({ vehicles, onVehicleSelect, onGenerateReport }) => {
  return (
    <div className="h-full flex flex-col bg-[#0F1014] text-white font-sans border-r border-white/5">
      {/* Header */}
      <div className="p-6 border-b border-white/5">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-8 w-8 bg-red-600 rounded-lg flex items-center justify-center">
            <MapPin size={18} />
          </div>
          <h2 className="text-sm font-black uppercase tracking-widest italic">Live Fleet</h2>
        </div>

        {/* Search */}
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-red-500 transition-colors" size={14} />
          <input 
            type="text" 
            placeholder="Search Terminal ID..."
            className="w-full bg-black/40 border border-white/5 rounded-xl py-3 pl-10 pr-4 text-[11px] uppercase tracking-wider focus:outline-none focus:border-red-500/50 transition-all"
          />
        </div>
      </div>

      {/* Vehicle List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
        {vehicles.map((vehicle) => (
          <div 
            key={vehicle.firebaseId}
            onClick={() => onVehicleSelect(vehicle.firebaseId)}
            className="bg-[#121214]/60 p-5 rounded-[1.5rem] border border-white/5 hover:border-red-500/30 transition-all cursor-pointer group"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-black tracking-tighter italic text-white leading-none">
                  {vehicle.plate || vehicle.id}
                </h3>
                <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mt-1">
                  Driver: <span className="text-gray-300">{vehicle.driver}</span>
                </p>
              </div>
              <span className={`text-[8px] font-black px-2 py-1 rounded-md uppercase tracking-widest ${
                vehicle.status === 'Moving' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'
              }`}>
                {vehicle.status}
              </span>
            </div>

            {/* Fuel Bar */}
            <div className="space-y-2 mb-4">
              <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-gray-500">
                <div className="flex items-center gap-1">
                  <Fuel size={10} /> Fuel Reserve
                </div>
                <span>{vehicle.fuel}%</span>
              </div>
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-1000 ${vehicle.fuel < 20 ? 'bg-red-500' : 'bg-blue-500'}`}
                  style={{ width: `${vehicle.fuel}%` }}
                />
              </div>
            </div>

            <div className="flex justify-between items-center text-[10px] font-black uppercase text-gray-500 tracking-tighter">
               <div className="flex items-center gap-1">
                 <Gauge size={12} /> Speed: <span className="text-white">{vehicle.speed || 0} KM/H</span>
               </div>
            </div>

            {/* Generate Report Button */}
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onGenerateReport(vehicle);
              }}
              className="w-full mt-4 bg-white/5 hover:bg-red-600 group-hover:bg-red-600/20 text-gray-500 group-hover:text-white text-[9px] font-black uppercase py-3 rounded-xl transition-all border border-white/5 flex items-center justify-center gap-2"
            >
              <FileText size={12} /> Generate Telemetry Report
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;