import React, { useEffect } from 'react';
import { CheckCircle2, X } from 'lucide-react';

export default function Toast({ message, onClose }) {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(onClose, 3500);
      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[9999] animate-in slide-in-from-bottom-10 fade-in duration-300">
      <div className="dark:bg-slate-900 bg-white dark:text-white text-slate-900 px-5 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border dark:border-slate-800 border-slate-200">
        <CheckCircle2 className="w-5 h-5 text-emerald-500 animate-pulse" />
        <p className="text-xs sm:text-sm font-bold tracking-wide">{message}</p>
        <button onClick={onClose} className="text-slate-400 hover:text-red-500 transition-colors ml-2">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}