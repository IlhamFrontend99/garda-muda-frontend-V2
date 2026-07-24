import React from 'react';
import { Heart } from 'lucide-react';
import ScrollReveal from './ScrollReveal';

export default function Footer({ cmsData }) {
  const getWaUrl = (num) => {
    if (!num) return '#';
    let clean = num.replace(/\D/g, '');
    if (clean.startsWith('0')) clean = '62' + clean.slice(1);
    return `https://wa.me/${clean}?text=Halo%20Panitia%20Garda%20Muda%20RT%2006%20Wungu,%20saya%20ingin%20bertanya%20informasi%20perlombaan.`;
  };

  const getIgUrl = (ig) => {
    if (!ig) return '#';
    if (ig.startsWith('http')) return ig;
    const clean = ig.replace('@', '').trim();
    return `https://instagram.com/${clean}`;
  };

  const getTiktokUrl = (tt) => {
    if (!tt) return '#';
    if (tt.startsWith('http')) return tt;
    const clean = tt.startsWith('@') ? tt : `@${tt.trim()}`;
    return `https://tiktok.com/${clean}`;
  };

  const getYtUrl = (yt) => {
    if (!yt) return '#';
    if (yt.startsWith('http')) return yt;
    return `https://youtube.com/@${yt.replace('@', '').trim()}`;
  };

  const waNumber = cmsData?.waPanitia || cmsData?.wa;
  const igHandle = cmsData?.ig || cmsData?.instagram;
  const ttHandle = cmsData?.tiktok;
  const ytChannel = cmsData?.youtube;

  const hasSocials = waNumber || igHandle || ttHandle || ytChannel;

  return (
    <footer className="py-12 border-t dark:border-slate-800 border-slate-200 dark:bg-[#050810]/95 bg-slate-50 relative overflow-hidden text-center z-10">
      
      {/* KEYFRAMES DETAK JANTUNG */}
      <style>{`
        @keyframes heartBeatPulse {
          0% { transform: scale(1); }
          14% { transform: scale(1.28); }
          28% { transform: scale(1); }
          42% { transform: scale(1.22); }
          70% { transform: scale(1); }
          100% { transform: scale(1); }
        }
        .animate-heartbeat {
          display: inline-block;
          animation: heartBeatPulse 1.4s infinite ease-in-out;
        }
      `}</style>

      {/* Ambient Red Glow Bottom */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-28 bg-rose-600/5 blur-3xl pointer-events-none -z-10" />

      <ScrollReveal direction="pop" delay={100}>
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center justify-center gap-6">
          
          {/* MEDIA SOSIAL & KONTAK PANITIA */}
          {hasSocials && (
            <div className="flex flex-col items-center gap-3">
              <span className="text-[11px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
                Media Sosial & Kontak Resmi Panitia
              </span>

              <div className="flex flex-wrap items-center justify-center gap-3">
                {waNumber && (
                  <a
                    href={getWaUrl(waNumber)}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-extrabold flex items-center gap-2 transition hover:scale-105 shadow-sm cursor-pointer"
                    title="Hubungi WhatsApp Panitia"
                  >
                    <svg className="w-4 h-4 fill-emerald-600 dark:fill-emerald-400" viewBox="0 0 24 24">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                    </svg>
                    <span>WA Panitia ({waNumber})</span>
                  </a>
                )}

                {igHandle && (
                  <a
                    href={getIgUrl(igHandle)}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-extrabold flex items-center gap-2 transition hover:scale-105 shadow-sm cursor-pointer"
                    title="Buka Instagram Resmi"
                  >
                    <svg className="w-4 h-4 fill-rose-600 dark:fill-rose-400" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                    <span>{igHandle}</span>
                  </a>
                )}

                {ttHandle && (
                  <a
                    href={getTiktokUrl(ttHandle)}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-600 dark:text-cyan-400 text-xs font-extrabold flex items-center gap-2 transition hover:scale-105 shadow-sm cursor-pointer"
                    title="Buka TikTok Resmi"
                  >
                    <svg className="w-4 h-4 fill-cyan-600 dark:fill-cyan-400" viewBox="0 0 24 24">
                      <path d="M12.525 2.25c.105 1.5.855 3.015 2.1 3.96 1.2 1.005 2.7 1.395 4.23 1.395V11c-1.845-.045-3.615-.645-5.025-1.74-.015 3.39.015 6.78-.015 10.17-.12 2.37-1.44 4.545-3.525 5.565-2.085 1.02-4.635.825-6.525-.495-1.89-1.32-2.82-3.66-2.355-5.91.465-2.25 2.355-3.99 4.635-4.335.54-.075 1.095-.06 1.635.03v3.705c-.39-.15-.81-.21-1.23-.165-1.02.09-1.89.84-2.115 1.845-.225 1.005.21 2.055 1.08 2.565.87.51 1.965.405 2.73-.255.675-.6 1.005-1.485.99-2.37V2.25h3.84z"/>
                    </svg>
                    <span>{ttHandle}</span>
                  </a>
                )}

                {ytChannel && (
                  <a
                    href={getYtUrl(ytChannel)}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 rounded-xl bg-red-600/10 hover:bg-red-600/20 border border-red-600/30 text-red-600 dark:text-red-500 text-xs font-extrabold flex items-center gap-2 transition hover:scale-105 shadow-sm cursor-pointer"
                    title="Buka Channel YouTube"
                  >
                    <svg className="w-4 h-4 fill-red-600 dark:fill-red-500" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                    <span>{ytChannel}</span>
                  </a>
                )}
              </div>
            </div>
          )}

          {hasSocials && <div className="w-full max-w-sm h-px dark:bg-slate-800 bg-slate-300 my-1" />}

          <div>
            <div className="font-black text-sm tracking-wider dark:text-white text-slate-900 uppercase mb-1">
              {cmsData?.orgName || 'GARDA MUDA RT 06'}
            </div>
            <p className="text-xs font-semibold dark:text-slate-400 text-slate-600">
              {cmsData?.rwDesa || 'RW 01 DESA WUNGU'} — Semarak Kemerdekaan RI ke-81
            </p>
          </div>

          <div className="flex items-center justify-center gap-1.5 text-xs font-bold dark:text-slate-400 text-slate-600">
            <span>© 2026 Hak Cipta Dilindungi. Dibuat dengan</span>
            <span className="animate-heartbeat mx-0.5 inline-flex items-center justify-center">
              <Heart className="w-4 h-4 text-rose-500 fill-rose-500 filter drop-shadow-[0_0_8px_rgba(244,63,94,0.6)]" />
            </span>
            <span>untuk Warga.</span>
          </div>

        </div>
      </ScrollReveal>
    </footer>
  );
}