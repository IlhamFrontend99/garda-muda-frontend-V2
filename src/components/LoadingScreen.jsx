import React, { useEffect, useState } from 'react';
import { Flame, ShieldCheck, Sparkles, Cpu, Radio } from 'lucide-react';

export default function SplashScreen({ onFinish, cmsData }) {
  const [progress, setProgress] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setIsFadingOut(true);
          setTimeout(() => {
            if (onFinish) onFinish();
          }, 700);
          return 100;
        }
        return Math.min(prev + 4, 100);
      });
    }, 35);

    return () => clearInterval(timer);
  }, [onFinish]);

  const getStatusText = (prog) => {
    if (prog < 25) return 'INITIALIZING SYSTEM KEMERDEKAAN...';
    if (prog < 50) return 'MEMUAT ARENA & DOKUMENTASI 3D...';
    if (prog < 80) return 'MENGHUBUNGKAN DATA WARGA RT 06...';
    if (prog < 100) return 'MENGINSIALISASI PORTAL RESMI...';
    return 'PORTAL KEMERDEKAAN SIAP!';
  };

  const garudaLogo = cmsData?.logoGaruda || "https://upload.wikimedia.org/wikipedia/commons/9/90/National_emblem_of_Indonesia_Garuda_Pancasila.svg";

  return (
    <div
      className={`fixed inset-0 z-[99999] bg-[#030611] text-white flex flex-col items-center justify-center p-4 overflow-hidden select-none transition-all duration-700 ease-in-out ${
        isFadingOut ? 'opacity-0 scale-105 filter blur-lg' : 'opacity-100 scale-100'
      }`}
    >
      {/* HUD CYBER GRID & AMBIENT BEAMS */}
      <div className="absolute inset-0 opacity-25 bg-[radial-gradient(#e11d48_1.2px,transparent_1.2px)] [background-size:20px_20px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-rose-600/30 via-red-600/20 to-amber-500/20 blur-[150px] rounded-full pointer-events-none" />

      {/* ROTATING NEON ORBIT RINGS */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 sm:w-96 sm:h-96 border border-rose-500/20 rounded-full animate-[spin_12s_linear_infinite] pointer-events-none border-dashed" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 sm:w-72 sm:h-72 border border-amber-500/20 rounded-full animate-[spin_8s_linear_infinite_reverse] pointer-events-none" />

      {/* MAIN CONTAINER */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-lg w-full px-4">
        
        {/* 3D GLASS EMBLEM CARD WITH INTENSE NEON AURA */}
        <div className="relative mb-7 group">
          <div className="absolute -inset-4 bg-gradient-to-r from-rose-600 via-red-500 to-amber-500 rounded-3xl blur-2xl opacity-70 animate-pulse" />
          <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-3xl bg-[#090d1a]/90 border-2 border-rose-500/70 shadow-[0_0_50px_rgba(225,29,72,0.6)] flex items-center justify-center p-5 backdrop-blur-2xl">
            <img
              src={garudaLogo}
              alt="Garuda Pancasila Emblem"
              className="w-full h-full object-contain drop-shadow-[0_0_20px_rgba(245,158,11,0.9)] transform group-hover:scale-105 transition duration-500"
            />
          </div>
        </div>

        {/* PILL BADGE HUT RI */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-950/80 border border-rose-500/50 text-rose-300 text-xs font-black uppercase tracking-widest mb-4 shadow-xl shadow-rose-950/80 backdrop-blur-md">
          <Flame size={14} className="text-amber-400 animate-bounce" />
          <span>HUT REPUBLIK INDONESIA KE-81</span>
          <Sparkles size={13} className="text-amber-400" />
        </div>

        {/* TYPOGRAPHY BRANDING */}
        <div className="space-y-1.5 mb-8">
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white uppercase leading-none">
            {cmsData?.orgName ? (
              cmsData.orgName
            ) : (
              <>GARDA MUDA <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-red-500 to-amber-400">RT 06</span></>
            )}
          </h1>
          <p className="text-amber-400/90 text-xs sm:text-sm font-extrabold tracking-[0.3em] uppercase font-mono">
            {cmsData?.rwDesa || 'RW 01 DESA WUNGU'} • SEMARAK KEMERDEKAAN
          </p>
        </div>

        {/* HIGH-TECH HUD PROGRESS CONTAINER */}
        <div className="w-full max-w-sm bg-slate-950/80 p-4 rounded-2xl border border-slate-800/90 shadow-2xl backdrop-blur-md space-y-3">
          <div className="flex items-center justify-between text-[11px] font-mono font-bold text-slate-300">
            <span className="flex items-center gap-1.5 text-rose-400">
              <Radio className="w-3.5 h-3.5 animate-pulse" />
              <span className="truncate">{getStatusText(progress)}</span>
            </span>
            <span className="text-amber-400 font-black text-xs">{progress}%</span>
          </div>

          {/* PROGRESS BAR */}
          <div className="w-full h-2.5 bg-slate-900 border border-slate-800 rounded-full overflow-hidden p-0.5 shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-rose-600 via-red-500 to-amber-400 rounded-full shadow-[0_0_16px_rgba(244,63,94,0.9)] transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* VERIFIED STATUS */}
          <div className="pt-1 flex items-center justify-between text-[10px] font-mono text-slate-400 border-t border-slate-800/60">
            <span className="flex items-center gap-1 text-emerald-400 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" /> VERIFIED PORTAL
            </span>
            <span className="flex items-center gap-1 text-slate-500">
              <Cpu className="w-3 h-3 text-indigo-400" /> SYSTEM ONLINE
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}