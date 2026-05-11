import React, { useState, useEffect } from 'react';
import { auth, db } from './firebase';
import { onAuthStateChanged, signOut } from "firebase/auth";
import { collection, onSnapshot, query, orderBy, addDoc, serverTimestamp } from "firebase/firestore";
import { 
  LayoutDashboard, Package, LogOut, Radio, 
  ChevronLeft, ChevronRight, Truck, Wrench, Fuel, User, CreditCard, CheckCircle, FileText, AlertCircle
} from 'lucide-react';

import Login from './Login';
import Sidebar from './Sidebar';
import FleetMap from './FleetMap';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [vehicles, setVehicles] = useState([]);
  const [repairs, setRepairs] = useState([]); 
  
  const [activeTab, setActiveTab] = useState('fleet'); 
  const [subTab, setSubTab] = useState('overview'); 
  const [selectedVehicleId, setSelectedVehicleId] = useState(null);
  const [reportVehicle, setReportVehicle] = useState(null);
  const [showSidebar, setShowSidebar] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  
  
  const [showRepairDetails, setShowRepairDetails] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;

    const vQuery = query(collection(db, "vehicles"), orderBy("createdAt", "desc"));
    const unsubVehicles = onSnapshot(vQuery, (snapshot) => {
      setVehicles(snapshot.docs.map(doc => ({ firebaseId: doc.id, ...doc.data() })));
    });

    const rQuery = query(collection(db, "repairs"), orderBy("createdAt", "desc"));
    const unsubRepairs = onSnapshot(rQuery, (snapshot) => {
      setRepairs(snapshot.docs.map(doc => ({ firebaseId: doc.id, ...doc.data() })));
    });

    return () => { unsubVehicles(); unsubRepairs(); };
  }, [user]);

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const data = new FormData(e.target);
    try {
      await addDoc(collection(db, "vehicles"), {
        name: data.get("name"), driver: data.get("driver"), plate: data.get("plate"),
        fuel: Number(data.get("fuel")), status: "Moving", speed: 0,
        lat: -1.286 + (Math.random() - 0.5) * 0.1, lng: 36.817 + (Math.random() - 0.5) * 0.1,
        createdAt: serverTimestamp()
      });
      triggerSuccess("Asset Integrated");
      e.target.reset();
    } catch (err) { console.error(err); }
    setIsSubmitting(false);
  };

  const handleFileRepair = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const data = new FormData(e.target);
    try {
      await addDoc(collection(db, "repairs"), {
        vehicleId: data.get("vehicleId"),
        issue: data.get("issue"),
        reportedBy: user.email,
        status: "Pending",
        createdAt: serverTimestamp()
      });
      triggerSuccess("Repair Logged");
      e.target.reset();
    } catch (err) { console.error(err); }
    setIsSubmitting(false);
  };

  const triggerSuccess = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  if (loading) return <div className="h-screen w-screen bg-[#09090B] flex items-center justify-center text-red-600 font-black uppercase animate-pulse tracking-widest">Initialising Terminal...</div>;
  if (!user) return <Login />;

  return (
    <div className="h-screen w-screen bg-[#09090B] text-white flex overflow-hidden font-sans">
      
      {successMsg && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[100] bg-emerald-500 text-white px-6 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center gap-3 shadow-2xl animate-in slide-in-from-top-full">
          <CheckCircle size={18} /> {successMsg}
        </div>
      )}

      <nav className="w-20 h-full bg-[#0F0F12] flex flex-col items-center py-8 border-r border-white/5 z-50">
        <div className="h-10 w-10 bg-red-600 rounded-xl flex items-center justify-center shadow-lg mb-10"><Radio size={24} /></div>
        <div className="flex flex-col gap-4 flex-1">
          <NavBtn icon={<LayoutDashboard size={20} />} active={activeTab === 'admin'} onClick={() => setActiveTab('admin')} />
          <NavBtn icon={<Package size={20} />} active={activeTab === 'fleet'} onClick={() => setActiveTab('fleet')} />
        </div>
        <NavBtn icon={<LogOut size={20} />} onClick={() => signOut(auth)} danger />
      </nav>

      <main className="flex-1 flex overflow-hidden relative">
        {activeTab === 'fleet' ? (
          <>
            <div className={`transition-all duration-500 ease-in-out flex ${showSidebar ? 'w-80' : 'w-0'}`}>
              <div className="w-80 h-full overflow-hidden">
                <Sidebar vehicles={vehicles} onVehicleSelect={setSelectedVehicleId} onGenerateReport={setReportVehicle} />
              </div>
            </div>
            <button onClick={() => setShowSidebar(!showSidebar)} className="absolute top-1/2 z-40 bg-[#18181B] border border-white/10 p-1.5 rounded-r-xl" style={{ left: showSidebar ? '320px' : '0px', transition: 'left 0.5s ease-in-out' }}>
              {showSidebar ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
            </button>
            <section className="flex-1 relative bg-[#09090B]"><FleetMap vehicles={vehicles} selectedVehicleId={selectedVehicleId} /></section>
          </>
        ) : (
          <div className="flex-1 flex flex-col h-full bg-[#09090B]">
            <div className="px-10 py-6 flex justify-center gap-10 border-b border-white/5 bg-[#09090B]/50 backdrop-blur-md">
              <SubTabBtn active={subTab === 'overview'} onClick={() => setSubTab('overview')}>Overview</SubTabBtn>
              <SubTabBtn active={subTab === 'repair'} onClick={() => setSubTab('repair')}>File Repair</SubTabBtn>
              <SubTabBtn active={subTab === 'register'} onClick={() => setSubTab('register')}>Register Vehicle</SubTabBtn>
            </div>

            <div className="flex-1 flex flex-col items-center p-10 overflow-y-auto no-scrollbar">
              <div className="w-full flex justify-center">
                
                {subTab === 'overview' && (
                  <div className="flex flex-col items-center w-full max-w-2xl gap-8 animate-in fade-in duration-500">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                      <StatCard title="Active Units" value={vehicles.length} color="text-red-500" />
                      
                      {/* Interactive Repairs Card */}
                      <StatCard 
                        title="Repairs Filed" 
                        value={repairs.length} 
                        color="text-blue-500" 
                        onClick={() => setShowRepairDetails(!showRepairDetails)}
                      />
                    </div>

                    {/* Drill-down Detail View */}
                    {showRepairDetails && (
                      <div className="w-full space-y-4 animate-in slide-in-from-top-4 duration-500">
                        <div className="flex items-center gap-2 mb-4">
                          <AlertCircle size={14} className="text-blue-500" />
                          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500 italic">Maintenance Ledger</h3>
                        </div>
                        
                        {repairs.length === 0 ? (
                          <div className="bg-[#121214]/40 border border-white/5 p-8 rounded-[2rem] text-center">
                            <p className="text-gray-500 text-xs italic">All systems operational. No pending maintenance.</p>
                          </div>
                        ) : (
                          repairs.map((r) => (
                            <div key={r.firebaseId} className="bg-[#121214]/60 border border-white/5 p-6 rounded-3xl flex justify-between items-center hover:bg-[#121214] transition-all">
                              <div>
                                <p className="text-white font-bold text-sm tracking-tight">{r.vehicleId}</p>
                                <p className="text-gray-500 text-[11px] mt-1 leading-relaxed max-w-xs">{r.issue}</p>
                              </div>
                              <div className="text-right">
                                <span className="text-[9px] font-black px-3 py-1 bg-blue-500/10 text-blue-500 rounded-full border border-blue-500/20 uppercase tracking-tighter">
                                  {r.status || "Logged"}
                                </span>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                )}

                {subTab === 'repair' && (
                  <GlassForm title="File Repair" subtitle="Maintenance Logging" onSubmit={handleFileRepair}>
                    <InputGroup name="vehicleId" label="Vehicle ID" placeholder="KBA 123L" icon={<Truck size={16}/>} />
                    <InputGroup name="issue" label="Issue Description" placeholder="Brake system failure" icon={<Wrench size={16}/>} />
                    <button disabled={isSubmitting} type="submit" className="w-full bg-red-600 hover:bg-red-500 text-white font-black py-4 rounded-2xl shadow-xl uppercase text-[11px] tracking-widest transition-all">
                      {isSubmitting ? "Logging..." : "Submit Report"}
                    </button>
                  </GlassForm>
                )}

                {subTab === 'register' && (
                  <GlassForm title="Register Unit" subtitle="Fleet Integration" onSubmit={handleRegister}>
                    <InputGroup name="name" label="Vehicle Name" placeholder="Scania R500" icon={<Truck size={16}/>} />
                    <InputGroup name="driver" label="Driver Name" placeholder="Kamau J." icon={<User size={16}/>} />
                    <div className="grid grid-cols-2 gap-4">
                      <InputGroup name="plate" label="Plate" placeholder="KCD 909Z" icon={<CreditCard size={16}/>} />
                      <InputGroup name="fuel" label="Fuel %" placeholder="100" type="number" icon={<Fuel size={16}/>} />
                    </div>
                    <button disabled={isSubmitting} type="submit" className="w-full bg-red-600 hover:bg-red-500 text-white font-black py-4 rounded-2xl shadow-xl uppercase text-[11px] tracking-widest transition-all">
                      {isSubmitting ? "Integrating..." : "Register Asset"}
                    </button>
                  </GlassForm>
                )}
              </div>
            </div>
          </div>
        )}

        {reportVehicle && <TelemetryReport vehicle={reportVehicle} onClose={() => setReportVehicle(null)} />}
      </main>
      <style>{`.no-scrollbar::-webkit-scrollbar { display: none; }`}</style>
    </div>
  );
}

// --- UPDATED STATCARD COMPONENT ---
const StatCard = ({ title, value, color, onClick }) => (
  <div 
    onClick={onClick}
    className={`bg-[#121214]/40 p-10 rounded-[2.5rem] border border-white/5 shadow-2xl backdrop-blur-md w-full transition-all active:scale-95 ${onClick ? 'cursor-pointer hover:border-white/10 hover:bg-[#121214]/60' : ''}`}
  >
    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4 italic">{title}</p>
    <p className={`text-6xl font-black ${color} tracking-tighter`}>{value}</p>
    {onClick && <p className="text-[8px] font-bold text-gray-600 uppercase tracking-[0.2em] mt-4">Click to drill down</p>}
  </div>
);

// --- REST OF COMPONENTS (UNTOUCHED) ---
const TelemetryReport = ({ vehicle, onClose }) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-xl p-6">
    <div className="w-full max-w-[400px] bg-[#121214] border border-white/10 rounded-[2.5rem] p-10 shadow-2xl animate-in zoom-in-95">
      <header className="text-center mb-8">
        <div className="h-14 w-14 bg-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6"><FileText className="text-white" /></div>
        <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">Unit Report</h2>
        <p className="text-gray-500 text-[10px] font-black tracking-[0.2em] uppercase mt-2">Plate: {vehicle.plate}</p>
      </header>
      <div className="space-y-4">
        <ReportRow label="Operator" value={vehicle.driver} />
        <ReportRow label="Velocity" value={`${vehicle.speed} KM/H`} />
        <ReportRow label="Fuel" value={`${vehicle.fuel}%`} />
        <ReportRow label="GPS" value={`${vehicle.lat.toFixed(4)}, ${vehicle.lng.toFixed(4)}`} />
      </div>
      <button onClick={onClose} className="w-full mt-10 bg-red-600 hover:bg-red-500 text-white font-black py-4 rounded-2xl uppercase text-[10px] tracking-widest shadow-xl shadow-red-900/20">Dismiss</button>
    </div>
  </div>
);

const ReportRow = ({ label, value }) => (
  <div className="flex justify-between border-b border-white/5 pb-2 text-[11px] font-black uppercase">
    <span className="text-gray-500 tracking-widest">{label}</span>
    <span className="text-white italic">{value}</span>
  </div>
);

const NavBtn = ({ icon, active, onClick, danger }) => (
  <button onClick={onClick} className={`p-4 rounded-2xl transition-all relative ${active ? 'bg-red-600 text-white shadow-xl shadow-red-900/40' : danger ? 'text-gray-600 hover:text-red-500' : 'text-gray-600 hover:text-white hover:bg-white/5'}`}>{icon} {active && <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-1 h-5 bg-white rounded-full" />}</button>
);

const SubTabBtn = ({ children, active, onClick }) => (
  <button onClick={onClick} className={`text-[11px] font-black uppercase tracking-[0.2em] transition-all pb-2 border-b-2 ${active ? 'text-red-500 border-red-500' : 'text-gray-500 border-transparent hover:text-white'}`}>{children}</button>
);

const GlassForm = ({ title, subtitle, children, onSubmit }) => (
  <form onSubmit={onSubmit} className="w-full max-w-[420px] bg-[#121214]/40 backdrop-blur-2xl border border-white/5 p-10 rounded-[2.5rem] shadow-2xl animate-in zoom-in-95 duration-500"><header className="text-center mb-10"><div className="h-14 w-14 bg-red-600 rounded-2xl flex items-center justify-center shadow-2xl mx-auto mb-6"><span className="text-white font-black text-2xl italic">F</span></div><h2 className="text-2xl font-black text-white uppercase italic">{title}</h2><p className="text-gray-500 text-[10px] font-black tracking-[0.2em] uppercase mt-2">{subtitle}</p></header><div className="space-y-6">{children}</div></form>
);

const InputGroup = ({ label, placeholder, icon, type = "text", name }) => (
  <div className="space-y-2 text-left"><label className="text-[10px] uppercase font-black text-gray-500 tracking-widest ml-1">{label}</label><div className="relative group"><div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-red-500 transition-colors">{icon}</div><input name={name} required type={type} className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 pl-12 pr-6 text-sm text-white focus:outline-none focus:border-red-500/50 transition-all placeholder:text-gray-700 font-medium" placeholder={placeholder} /></div></div>
);

export default App;