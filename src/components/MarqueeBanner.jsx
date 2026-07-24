import React from 'react';

export default function MarqueeBanner({
  text = 'Selamat datang di Portal Resmi Semarak Perlombaan 17 Agustus. Bersama GARDA MUDA RT 06 dari RW 01 DESA WUNGU, mari ukir momen kebersamaan tak terlupakan.',
  cmsData
}) {
  const rawText = cmsData?.marqueeText || text;

  // Pembersih Teks Murni Anti-Error (Menghapus emoji flag & tulisan ID)
  const displayText = rawText
    .replace(/🇮🇩/g, '')
    .replace(/\s*ID\b/gi, '')
    .replace(/\s+/g, ' ')
    .trim();

  return (
    <div className="relative w-full overflow-hidden py-2 bg-rose-950/60 dark:bg-slate-950/95 text-white border-y border-rose-500/30 dark:border-slate-800/80 backdrop-blur-md shadow-lg -mt-10 sm:-mt-14 relative z-20">
      
      {/* FADE GRADIENT SIDE EDGES */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-12 sm:w-20 z-10 bg-gradient-to-r from-[#030712] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-12 sm:w-20 z-10 bg-gradient-to-l from-[#030712] to-transparent" />

      {/* RUNNING MARQUEE CONTAINER */}
      <div className="flex w-max animate-marquee whitespace-nowrap">
        {[0, 1].map((rep) => (
          <div key={rep} className="flex items-center gap-4 pr-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold tracking-wide
                  bg-white/10 dark:bg-rose-950/60 border border-white/15 dark:border-rose-500/40 text-slate-100 shadow-sm"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse shrink-0" />
                <span>{displayText}</span>
              </span>
            ))}
          </div>
        ))}
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 28s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-marquee { animation: none; }
        }
      `}</style>
    </div>
  );
}