import React, { useState } from 'react';
import { X, Lock, User, Loader2, ShieldCheck } from 'lucide-react';

export default function LoginModal({ isOpen, onClose, onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Mulai loading
    const success = await onLogin(username, password);
    setIsLoading(false); // Selesai loading
    if (success) {
      setUsername('');
      setPassword('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-sm rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative">
        <div className="flex justify-between items-center border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2 text-white">
            <ShieldCheck className="w-5 h-5 text-red-500" />
            <h3 className="text-lg font-black">Login Admin Garda Muda</h3>
          </div>
          <button onClick={onClose} className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded-full transition text-slate-300 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <p className="text-[11px] font-bold text-slate-400">Masukkan akun pengurus RT 06</p>
          
          <div className="space-y-3">
            <div className="relative">
              <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-red-500 transition"
              />
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-red-500 transition"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} disabled={isLoading} className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs transition disabled:opacity-50">
              Batal
            </button>
            <button type="submit" disabled={isLoading} className="flex-1 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-black rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-red-900/40 transition active:scale-95 disabled:opacity-50 touch-manipulation">
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Masuk Dashboard'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}