import React, { useState, useEffect } from 'react';
import { ArrowRight, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
import FlagID from './FlagID';
import ScrollReveal from './ScrollReveal';
import WavingFlag3D from './WavingFlag3D';
import logoGarudaAsset from '../assets/logo-garuda.png';

export default function Hero({ cmsData, onScrollToLomba, onDaftarClick }) {
  const garudaLogo = cmsData?.logoGaruda || logoGarudaAsset;
  const handleAction = onScrollToLomba || onDaftarClick;

  const bgVideoMerah = cmsData?.bgVideoMerah || '/videos/bg-elemen-merah.mp4';
  const bgVideoPutih = cmsData?.bgVideoPutih || '/videos/bg-elemen-putih.mp4';

  const [activeVideoIndex, setActiveVideoIndex] = useState(0);

  // Switch otomatis setiap 8 detik secara halus
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveVideoIndex((prev) => (prev === 0 ? 1 : 0));
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative pt-4 pb-6 md:pt-6 md:pb-10 overflow-hidden selection:bg-rose-500 selection:text-white bg-[#030712]">
      
      {/* KEYFRAMES ANIMASI GRADIENT RUNNING */}
      <style>{`
        @keyframes flowDownText {
          0% { background-position: 0% 0%; }
          100% { background-position: 0% 200%; }
        }
        
        .animate-running-merah-putih {
          background: linear-gradient(
            180deg, 
            #f43f5e 0%,
            #ffffff 25%,
            #fbbf24 60%,
            #f43f5e 100%
          );
          background-size: 100% 200%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: flowDownText 6s linear infinite;
        }
      `}</style>

      {/* LAYER 1: DUAL VIDEO CROSSFADE BACKGROUND (ALIGNMENT: OBJECT-TOP AGAR LOGO 81 TIDAK TERPOTONG) */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <video
          autoPlay
          loop
          muted
          playsInline
          className={`absolute inset-0 w-full h-full object-cover object-top filter blur-[0.5px] transition-opacity duration-1000 ${
            activeVideoIndex === 0 ? 'opacity-35' : 'opacity-0'
          }`}
        >
          <source src={bgVideoMerah} type="video/mp4" />
        </video>

        <video
          autoPlay
          loop
          muted
          playsInline
          className={`absolute inset-0 w-full h-full object-cover object-top filter blur-[0.5px] transition-opacity duration-1000 ${
            activeVideoIndex === 1 ? 'opacity-25' : 'opacity-0'
          }`}
        >
          <source src={bgVideoPutih} type="video/mp4" />
        </video>
      </div>

      {/* LAYER 2: GLOW LIGHT BEAMS (z-[1]) */}
      <div className="absolute top-[40px] left-1/2 -translate-x-1/2 w-[550px] h-[240px] bg-gradient-to-r from-rose-600/30 via-red-600/20 to-amber-500/20 blur-[120px] rounded-full pointer-events-none z-[1]" />

      {/* LAYER 3: BENDERA 3D BERKIBAR (z-[2]) */}
      <div className="absolute left-1/2 -translate-x-1/2 top-[95px] sm:top-[105px] z-[2] w-[460px] h-[250px] sm:w-[680px] sm:h-[340px] pointer-events-none filter drop-shadow-[0_12px_28px_rgba(0,0,0,0.85)]">
        <WavingFlag3D className="w-full h-full" />
      </div>

      {/* LAYER 4: KONTEN UTAMA RINGKAS & PRESISI (z-10) */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center flex flex-col items-center">
        
        {/* LOGO GARUDA IN FLOATING GLASS CARD */}
        <ScrollReveal delay={50} direction="down">
          <div className="mb-3 sm:mb-4 relative group cursor-pointer">
            <div className="absolute -inset-2.5 bg-gradient-to-r from-rose-600 via-amber-500 to-rose-600 rounded-2xl blur-lg opacity-40 group-hover:opacity-90 transition duration-500 animate-pulse"></div>
            <div className="relative p-2.5 sm:p-3 bg-slate-950/80 border border-rose-500/40 rounded-2xl backdrop-blur-xl shadow-[0_0_20px_rgba(225,29,72,0.3)] flex items-center justify-center transform group-hover:scale-105 transition-transform duration-300">
              <img 
                src={garudaLogo} 
                alt="Logo Garuda Pancasila" 
                className="h-11 sm:h-14 w-auto object-contain filter drop-shadow-[0_0_10px_rgba(245,158,11,0.7)]"
                onError={(e) => { e.target.src = logoGarudaAsset; }}
              />
            </div>
          </div>
        </ScrollReveal>

        {/* MICRO BADGE PILL */}
        <ScrollReveal delay={150}>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-900/90 border border-rose-500/30 backdrop-blur-xl text-slate-100 font-bold text-[11px] sm:text-xs tracking-wider uppercase mb-3 sm:mb-4 shadow-lg shadow-rose-950/40">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
            </span>
            <FlagID className="w-3.5 h-2 rounded-[2px]" />
            <span>{cmsData?.rwDesa || 'RW 01 DESA WUNGU'}</span>
            <span className="text-slate-500">|</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-amber-400 font-extrabold flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400 inline" /> HUT RI KE-81
            </span>
          </div>
        </ScrollReveal>

        {/* HEADLINE: RINGKAS BERSAMA BENDERA 3D */}
        <ScrollReveal delay={250}>
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight mb-4 sm:mb-6 leading-[1.15] select-none">
            <span className="text-white drop-shadow-[0_3px_12px_rgba(0,0,0,0.95)]">
              KOBARKAN SEMANGAT
            </span>
            <br />
            <span className="animate-running-merah-putih font-black inline-block drop-shadow-[0_0_20px_rgba(244,63,94,0.8)] pt-0.5">
              PERSATUAN & KEMERDEKAAN!
            </span>
          </h1>
        </ScrollReveal>

        {/* SUBTITLE: GLASS CARD DENGAN SPASING PROPORSIONAL */}
        <ScrollReveal delay={350}>
          <div className="max-w-xl mx-auto px-5 py-3.5 rounded-xl bg-slate-950/85 border border-slate-800/90 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.8)] mb-5">
            <p className="text-xs sm:text-sm text-slate-200 font-medium leading-relaxed">
              Selamat datang di Portal Resmi Semarak Perlombaan 17 Agustus. Bersama{' '}
              <strong className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-amber-400 font-black">
                {cmsData?.orgName || 'GARDA MUDA RT 06'}
              </strong>{' '}
              dari {cmsData?.rwDesa || 'RW 01 DESA WUNGU'}, mari ukir momen kebersamaan tak terlupakan.
            </p>
          </div>
        </ScrollReveal>

        {/* ACTION BUTTON */}
        <ScrollReveal delay={450}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={handleAction}
              className="group relative inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 text-white font-black text-xs sm:text-sm tracking-wider uppercase shadow-[0_0_25px_rgba(225,29,72,0.5)] hover:shadow-[0_0_40px_rgba(225,29,72,0.8)] hover:scale-[1.02] active:scale-95 transition-all duration-300 overflow-hidden cursor-pointer border border-rose-400/40"
            >
              <FlagID className="w-3.5 h-2.5 shadow-sm rounded-[2px]" />
              <span>Ambil Bagian Sekarang</span>
              <ArrowRight className="w-4 h-4 text-amber-200 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </ScrollReveal>

        {/* TRUST BADGES */}
        <ScrollReveal delay={550}>
          <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-center gap-4 text-[11px] sm:text-xs font-bold text-slate-300">
            <div className="flex items-center justify-center gap-1.5 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800 shadow-sm backdrop-blur-md">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Sistem Pendaftaran Warga</span>
            </div>
            <div className="flex items-center justify-center gap-1.5 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800 shadow-md backdrop-blur-md">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>Presensi & Pass QR Digital</span>
            </div>
          </div>
        </ScrollReveal>

      </div>
    </section>
  );
}