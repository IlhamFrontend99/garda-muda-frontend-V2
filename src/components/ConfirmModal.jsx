import React from 'react';
import { CheckCircle2, ShieldAlert } from 'lucide-react';

export default function ConfirmModal({ isOpen, onClose, title, message, type = 'success' }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-sm rounded-2xl p-6 text-center space-y-4 shadow-2xl">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto border ${type === 'success' ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-400' : 'bg-red-950/80 border-red-500/50 text-red-400'}`}>
          {type === 'success' ? <CheckCircle2 className="w-7 h-7" /> : <ShieldAlert className="w-7 h-7" />}
        </div>

        <div>
          <h3 className="text-base font-extrabold text-white">{title || 'Notifikasi'}</h3>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">{message}</p>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-extrabold rounded-xl text-xs transition shadow-lg shadow-red-900/40"
        >
          Selesai & Lanjutkan
        </button>
      </div>
    </div>
  );
}