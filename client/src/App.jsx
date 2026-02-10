import React, { useState } from 'react';
import FleetMap from './FleetMap';
import { LayoutDashboard, Package, Mail, FileText, Settings, User, MapPin, Phone, MessageSquare } from 'lucide-react';

function App() {
  const [activeId, setActiveId] = useState('ORD-14398-91751');

  // Mock Data matching the design
  const orders = [
    { id: 'ORD-14398-91751', from: 'London', status: 'On The Way', active: false },
    { id: 'ORD-14398-91752', from: 'Warsaw', status: 'On The Way', active: true, progress: 81, driver: 'Adam Brady', price: '$430' },
    { id: 'ORD-14398-98625', from: 'Marseilles', status: 'Received', active: false },
    { id: 'ORD-14398-09284', from: 'Antwerpen', status: 'Received', active: false },
  ];

  return (
    <div className="h-screen w-screen bg-[#0F1014] text-white overflow-hidden relative font-sans">
      
      {/* LAYER 0: The Map Wallpaper */}
      <div className="absolute inset-0 z-0 opacity-80">
        <FleetMap />
      </div>

      {/* LAYER 1: The UI Overlay */}
      <div className="absolute inset-0 z-10 flex pointer-events-none">
        
        {/* A. The Navigation Rail (Far Left) */}
        <div className="w-16 h-full bg-[#18181B] flex flex-col items-center py-6 gap-8 pointer-events-auto border-r border-[#27272A]">
          <div className="text-red-500 mb-4"><div className="h-8 w-8 bg-red-600 rounded-lg flex items-center justify-center font-bold">⚡</div></div>
          <NavIcon icon={<LayoutDashboard size={20} />} active />
          <NavIcon icon={<Package size={20} />} />
          <NavIcon icon={<Mail size={20} />} />
          <NavIcon icon={<FileText size={20} />} />
          <div className="mt-auto flex flex-col gap-6">
            <NavIcon icon={<Settings size={20} />} />
            <div className="h-8 w-8 bg-gray-600 rounded-full overflow-hidden border-2 border-gray-500">
               {/* Placeholder Avatar */}
               <img src="https://i.pravatar.cc/100?img=33" alt="User" />
            </div>
          </div>
        </div>

        {/* B. The Floating Tracking List */}
        <div className="w-96 h-full p-6 pointer-events-auto flex flex-col">
          <h1 className="text-2xl font-bold mb-6 drop-shadow-md">Delivery Tracking</h1>
          
          <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar">
            {orders.map((order) => (
              order.active ? (
                // THE ACTIVE RED CARD
                <div key={order.id} className="bg-[#B91C1C] text-white p-5 rounded-3xl shadow-2xl shadow-red-900/50 relative overflow-hidden">
                   <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="text-red-200 text-xs font-medium">Package from {order.from}</p>
                        <p className="text-xs opacity-70">Order ID #{order.id}</p>
                      </div>
                      <span className="bg-white text-red-600 text-[10px] font-bold px-2 py-1 rounded-full">ON THE WAY</span>
                   </div>

                   {/* Progress Bar */}
                   <div className="mt-4 mb-2">
                     <div className="flex justify-between text-xs mb-1 font-bold">
                       <span>{order.progress}%</span>
                     </div>
                     <div className="w-full bg-red-800 h-1.5 rounded-full">
                       <div className="bg-white h-1.5 rounded-full" style={{ width: `${order.progress}%` }}></div>
                     </div>
                   </div>

                   {/* Stats Grid */}
                   <div className="grid grid-cols-3 gap-2 mt-4 text-[10px] opacity-90">
                      <div><p className="opacity-60">Customer</p><p className="font-bold">Castorama</p></div>
                      <div><p className="opacity-60">Weight</p><p className="font-bold">2.8 kg</p></div>
                      <div><p className="opacity-60">Price</p><p className="font-bold">{order.price}</p></div>
                   </div>

                   {/* Driver Section */}
                   <div className="mt-4 pt-4 border-t border-white/20 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img src="https://i.pravatar.cc/100?img=11" className="w-8 h-8 rounded-full border border-white" />
                        <div>
                          <p className="text-sm font-bold">{order.driver}</p>
                          <p className="text-[10px] opacity-75">Driver</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button className="bg-white/20 p-2 rounded-full hover:bg-white/40"><MessageSquare size={14} /></button>
                        <button className="bg-white/20 p-2 rounded-full hover:bg-white/40"><Phone size={14} /></button>
                      </div>
                   </div>
                </div>
              ) : (
                // STANDARD INACTIVE CARD
                <div key={order.id} className="bg-[#18181B] hover:bg-[#27272A] p-4 rounded-2xl border border-[#27272A] transition-colors cursor-pointer group">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-gray-200 text-sm font-medium">Package from {order.from}</p>
                      <p className="text-gray-500 text-xs mt-1">Order ID #{order.id}</p>
                    </div>
                    <span className={`text-[10px] px-2 py-1 rounded-full font-bold ${order.status === 'Received' ? 'bg-blue-500/10 text-blue-400' : 'bg-red-500/10 text-red-400'}`}>
                      {order.status.toUpperCase()}
                    </span>
                  </div>
                </div>
              )
            ))}
          </div>
        </div>

        {/* C. The Bottom Right Widget (Floating) */}
        <div className="absolute bottom-6 right-6 w-96 bg-[#18181B] p-5 rounded-3xl border border-[#27272A] shadow-2xl pointer-events-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-sm">Order ID #14398-91751</h3>
            <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">ON THE WAY</span>
          </div>
          <div className="grid grid-cols-4 gap-4 text-xs">
            <div><p className="text-gray-500">From</p><p className="font-bold">Warsaw, PL</p></div>
            <div><p className="text-gray-500">To</p><p className="font-bold">Berlin, DE</p></div>
            <div><p className="text-gray-500">Kms Left</p><p className="font-bold">620</p></div>
            <div><p className="text-gray-500">Last Stop</p><p className="font-bold">3 hours</p></div>
          </div>
        </div>
      </div>

    </div>
  );
}

// Simple Helper for the Sidebar Icons
const NavIcon = ({ icon, active }) => (
  <div className={`p-3 rounded-xl cursor-pointer transition-all ${active ? 'bg-red-500/10 text-red-500' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}>
    {icon}
  </div>
);

export default App;
