import React, { useState } from 'react';
import { auth, db } from './firebase'; 
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore"; 
import { Lock, Mail, User, ArrowRight, RotateCcw } from 'lucide-react';

const Login = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '', username: '' });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (isRegistering) {
        // 1. Create Auth Account
        const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        const user = userCredential.user;

        // 2. Add to Database (Firestore)
        await setDoc(doc(db, "users", user.uid), {
          username: formData.username,
          email: formData.email,
          role: "operator",
          createdAt: new Date()
        });
      } else {
        // Standard Login
        await signInWithEmailAndPassword(auth, formData.email, formData.password);
      }
    } catch (err) {
      setError(err.message.includes("auth/email-already-in-use") 
        ? "Terminal ID already registered." 
        : "Authentication failed. Check credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen bg-[#09090B] flex items-center justify-center relative font-sans">
      <div className="w-full max-w-[400px] z-10 px-6">
        <div className="bg-[#121214]/40 backdrop-blur-2xl border border-white/5 p-10 rounded-[2.5rem] shadow-2xl animate-in fade-in zoom-in-95 duration-500">
          
          <div className="flex flex-col items-center mb-8">
            <div className="h-16 w-16 bg-red-600 rounded-2xl flex items-center justify-center shadow-2xl mb-6 shadow-red-900/20">
              <span className="font-black text-2xl text-white italic">F</span>
            </div>
            <h1 className="text-2xl font-black text-white uppercase italic tracking-tighter">
              {isRegistering ? "New Operator" : "Fleet Command"}
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <p className="text-red-500 text-[10px] font-black text-center bg-red-500/10 py-3 rounded-xl uppercase tracking-widest">{error}</p>}
            
            {isRegistering && (
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-black text-gray-500 tracking-widest ml-1">Operator Name</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-red-500" size={16} />
                  <input 
                    type="text"
                    required
                    placeholder="Commander John"
                    className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 pl-12 pr-6 text-sm text-white focus:border-red-500/50 outline-none transition-all"
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-[10px] uppercase font-black text-gray-500 tracking-widest ml-1">Terminal ID (Email)</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-red-500" size={16} />
                <input 
                  type="email"
                  required
                  placeholder="admin@fleet.gov"
                  className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 pl-12 pr-6 text-sm text-white focus:border-red-500/50 outline-none transition-all"
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase font-black text-gray-500 tracking-widest ml-1">Access Key</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-red-500" size={16} />
                <input 
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 pl-12 pr-6 text-sm text-white focus:border-red-500/50 outline-none transition-all"
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-500 text-white font-black py-4 rounded-2xl mt-4 transition-all uppercase text-[11px] tracking-widest flex justify-center items-center gap-2 active:scale-95 shadow-xl shadow-red-900/20"
            >
              {loading ? "Processing..." : isRegistering ? "Initialize Account" : "Initialize System"}
              {!loading && <ArrowRight size={16} />}
            </button>
          </form>

          <div className="mt-8 text-center">
            <button 
              onClick={() => setIsRegistering(!isRegistering)}
              className="text-[10px] font-black text-gray-500 uppercase tracking-widest hover:text-red-500 transition-colors flex items-center justify-center gap-2 mx-auto"
            >
              <RotateCcw size={12} />
              {isRegistering ? "Return to Login" : "Request New Access"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;