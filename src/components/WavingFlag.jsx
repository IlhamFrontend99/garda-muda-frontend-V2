import React from 'react';

export default function WavingFlag({ className = "w-36 h-24 sm:w-48 sm:h-32" }) {
  return (
    <div className={`relative group inline-flex items-center justify-center p-2 rounded-2xl bg-slate-900/80 border border-red-500/40 backdrop-blur-md shadow-[0_0_30px_rgba(225,29,72,0.35)] hover:border-red-500/60 hover:shadow-[0_0_40px_rgba(225,29,72,0.5)] transition-all duration-300 ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-tr from-red-600/30 via-transparent to-amber-500/20 rounded-2xl pointer-events-none"></div>

      {/* Kain Bendera Merah Putih Berkibar Tanpa Tiang */}
      <div className="relative w-full h-full rounded-xl overflow-hidden shadow-lg animate-waving-flag flex flex-col border border-red-500/30">
        <div className="h-1/2 bg-gradient-to-r from-red-700 via-red-600 to-red-500 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
        </div>
        <div className="h-1/2 bg-gradient-to-r from-slate-100 via-white to-slate-200 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-black/5 via-transparent to-black/10"></div>
        </div>
      </div>
    </div>
  );
}