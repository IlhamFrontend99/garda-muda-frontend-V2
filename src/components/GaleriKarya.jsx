import React from 'react';
import { Camera, Sparkles, PlayCircle } from 'lucide-react';

/**
 * GaleriKarya
 * Section "Galeri Karya & Dokumentasi Visual".
 * Menerima `cards` = array kartu (bisa memakai cmsData.cards3D yang sudah ada di App.jsx),
 * masing-masing item bentuknya: { title, category, type: 'image' | 'video', media }.
 * Tidak menambah state baru — murni presentational, jadi aman ditempel di UserDashboard.jsx.
 */
export default function GaleriKarya({ cards = [] }) {
  const items = cards.length > 0 ? cards : [];

  return (
    <section className="max-w-7xl mx-auto px-4 py-4">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] sm:text-[11px] font-black uppercase tracking-widest
          dark:bg-amber-500/10 bg-amber-500/10 dark:text-amber-400 text-amber-600 border dark:border-amber-500/30 border-amber-500/30">
          <Camera className="w-3.5 h-3.5" /> Galeri Karya & Dokumentasi Visual
        </span>
        <h3 className="mt-4 text-2xl sm:text-4xl font-black tracking-tight dark:text-white text-slate-900">
          Kepingan Momen Bersejarah
        </h3>
        <p className="mt-3 text-sm dark:text-slate-300 text-slate-600 leading-relaxed">
          Jejak kebersamaan, tawa, dan perjuangan dalam bingkai dokumentasi abadi warga kita.
        </p>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-14 dark:bg-slate-900/40 bg-white/60 rounded-3xl border dark:border-slate-800/60 border-slate-200/60 backdrop-blur-md shadow-lg">
          <div className="w-14 h-14 mx-auto mb-4 rounded-full flex items-center justify-center dark:bg-slate-800 bg-slate-100 border dark:border-slate-700 border-slate-300">
            <Sparkles className="w-7 h-7 text-amber-500" />
          </div>
          <p className="text-sm font-bold dark:text-slate-300 text-slate-600">
            Dokumentasi akan tampil di sini setelah panitia mengunggahnya.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
          {items.map((item, i) => (
            <div
              key={i}
              className="group relative rounded-2xl overflow-hidden border dark:border-slate-800/70 border-slate-200/70
                dark:bg-slate-900/60 bg-white shadow-md hover:shadow-2xl transition-all duration-500
                hover:-translate-y-1 hover:border-amber-500/40"
            >
              <div className="relative h-36 sm:h-44 overflow-hidden bg-slate-800">
                {item.type === 'video' ? (
                  <>
                    <video
                      src={item.media}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                      muted
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors">
                      <PlayCircle className="w-9 h-9 text-white/90 drop-shadow-lg" />
                    </div>
                  </>
                ) : (
                  <img
                    src={item.media}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>

              <div className="p-3">
                <p className="text-[11px] sm:text-xs font-black dark:text-white text-slate-900 truncate">
                  {item.title}
                </p>
                <span className="inline-block mt-1 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-amber-500">
                  {item.category}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}