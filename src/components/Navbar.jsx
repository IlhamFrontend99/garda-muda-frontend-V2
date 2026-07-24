import React, { useState } from 'react';
import { Sun, Moon, ShieldCheck, LogOut, Menu, X } from 'lucide-react';
import logoGarudaAsset from '../assets/logo-garuda.png';

export default function Navbar({ isAdmin, setIsAdmin, darkMode, setDarkMode, onOpenLogin, cmsData }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const logoGarda = cmsData?.logoGardaMuda || cmsData?.logoGaruda || logoGarudaAsset;
  const logoHutImage = cmsData?.logoHutRi || logoGarudaAsset;
  
  // Path Video Logo Gerak (di folder public/videos/)
  const logoHutVideo = cmsData?.videoLogoHutRi || '/videos/logo-81-motion.mp4';

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-xl dark:bg-[#030712]/90 bg-white/90 border-b dark:border-slate-800/80 border-slate-200/80 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* LOGO COLLAB & BRANDING */}
          <div 
            className="flex items-center gap-2.5 sm:gap-3 cursor-pointer select-none" 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            {/* DUAL COLLAB LOGO CONTAINER (SIMETRIS 1:1 KEDUA KOTAK) */}
            <div className="flex items-center gap-2 shrink-0">
              
              {/* LOGO 1: GARDA MUDA (06) */}
              <div className="relative group shrink-0">
                <div className="absolute -inset-1 bg-gradient-to-r from-rose-600 to-amber-500 rounded-2xl blur-sm opacity-40 group-hover:opacity-80 transition duration-300"></div>
                <div className="relative h-11 sm:h-12 w-16 sm:w-20 p-1 bg-white rounded-xl border border-slate-200 shadow-md flex items-center justify-center overflow-hidden">
                  <img 
                    src={logoGarda} 
                    alt="Logo Garda Muda RT 06" 
                    className="h-full w-full object-contain filter drop-shadow-sm scale-105"
                    onError={(e) => { e.target.src = logoGarudaAsset; }}
                  />
                </div>
              </div>

              {/* SEPARATOR COLLAB ICON (✕) */}
              <span className="text-xs font-black text-rose-500 dark:text-rose-400 select-none px-0.5">
                ✕
              </span>

              {/* LOGO 2: MOTION LOGO HUT RI 81 (DIPERBESAR & DIPERJELAS) */}
              <div className="relative group shrink-0">
                <div className="absolute -inset-1 bg-gradient-to-r from-rose-600 to-amber-500 rounded-2xl blur-sm opacity-40 group-hover:opacity-80 transition duration-300"></div>
                <div className="relative h-11 sm:h-12 w-16 sm:w-20 p-0.5 bg-white rounded-xl border border-slate-200 shadow-md flex items-center justify-center overflow-hidden">
                  <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="h-full w-full object-contain scale-125 filter contrast-110 drop-shadow-sm"
                    onError={(e) => {
                      // Fallback ke gambar jika video tidak ditemukan
                      e.target.style.display = 'none';
                      if (e.target.nextSibling) e.target.nextSibling.style.display = 'block';
                    }}
                  >
                    <source src={logoHutVideo} type="video/mp4" />
                  </video>
                  {/* Fallback Image jika video belum terpasang */}
                  <img 
                    src={logoHutImage} 
                    alt="Logo HUT RI 81" 
                    className="hidden h-full w-full object-contain scale-125 filter contrast-110 drop-shadow-sm"
                    onError={(e) => { e.target.src = logoGarudaAsset; }}
                  />
                </div>
              </div>

            </div>

            {/* TEXT BRANDING */}
            <div className="hidden min-[420px]:flex flex-col">
              <h1 className="text-xs sm:text-base font-black tracking-tight dark:text-white text-slate-900 leading-tight uppercase">
                {cmsData?.orgName || 'GARDA MUDA RT 06'}
              </h1>
              <p className="text-[10px] sm:text-xs font-bold text-slate-500 dark:text-slate-400 tracking-wide flex items-center gap-1">
                <span className="hidden sm:inline">Portal Kemerdekaan Warga •</span>
                <span className="text-rose-600 dark:text-rose-400 font-extrabold">{cmsData?.rwDesa || 'RW 01 DESA WUNGU'}</span>
              </p>
            </div>
          </div>

          {/* ACTION BUTTONS (DESKTOP) */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2.5 rounded-xl dark:bg-slate-900 bg-slate-100 border dark:border-slate-800 border-slate-300 dark:text-amber-400 text-slate-700 hover:scale-105 active:scale-95 transition cursor-pointer shadow-sm"
              title={darkMode ? 'Ubah ke Mode Terang' : 'Ubah ke Mode Gelap'}
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {isAdmin ? (
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-black uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4" /> Admin Pengurus
                </span>
                <button
                  onClick={setIsAdmin}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-rose-600 hover:text-white dark:hover:bg-rose-600 text-slate-700 dark:text-slate-200 text-xs font-bold transition shadow-sm cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" /> Keluar
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenLogin}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white font-black text-xs uppercase tracking-wider shadow-md shadow-rose-500/20 hover:scale-[1.02] active:scale-95 transition cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4" /> Dashboard Admin
              </button>
            )}
          </div>

          {/* MOBILE MENU TOGGLE BUTTON */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-xl dark:bg-slate-900 bg-slate-100 border dark:border-slate-800 border-slate-300 dark:text-amber-400 text-slate-700"
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl dark:bg-slate-900 bg-slate-100 border dark:border-slate-800 border-slate-300 dark:text-white text-slate-900"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* MOBILE DROPDOWN MENU */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t dark:border-slate-800 border-slate-200 dark:bg-[#030712] bg-white px-4 pt-3 pb-5 space-y-3 shadow-2xl">
          <div className="flex flex-col gap-2 pt-1">
            {isAdmin ? (
              <>
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-black uppercase">
                  <ShieldCheck className="w-4 h-4" /> Sesi Admin Aktif
                </div>
                <button
                  onClick={() => { setIsAdmin(); setMobileMenuOpen(false); }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-rose-600 text-white font-bold text-xs uppercase"
                >
                  <LogOut className="w-4 h-4" /> Keluar dari Admin
                </button>
              </>
            ) : (
              <button
                onClick={() => { onOpenLogin(); setMobileMenuOpen(false); }}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-rose-600 to-amber-500 text-white font-black text-xs uppercase tracking-wider shadow-md"
              >
                <ShieldCheck className="w-4 h-4" /> Login Admin Pengurus
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}