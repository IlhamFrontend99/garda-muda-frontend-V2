import React from 'react';
import { Camera, Image as ImageIcon, Maximize2, Trophy } from 'lucide-react';

export default function Showcase3D({ cards = [] }) {
  const defaultItems = cards.length > 0 ? cards : [
    { title: 'Juara Panjat Pinang', category: 'Foto Juara', media: null },
    { title: 'Keseruan Balap Karung', category: 'Dokumentasi', media: null },
    { title: 'Pawai Kemerdekaan RT 06', category: 'Acara Warga', media: null }
  ];

  return (
    <section className="py-6 relative">
      <div className="flex flex-col items-center text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-bold uppercase tracking-wider mb-3">
          <Camera className="w-3.5 h-3.5 text-amber-500" />
          <span>Galeri Karya & Dokumentasi Visual</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          Kepingan Momen Bersejarah
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium max-w-xl mt-2">
          Jejak kebersamaan, tawa, dan perjuangan dalam bingkai dokumentasi abadi warga kita.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {defaultItems.map((item, idx) => {
          const rawTitle = item.title || item.judul || 'Dokumentasi Lomba';
          const cleanTitle = rawTitle.replace(/^\?\?\s*/, ''); // Bersihkan karakter ?? corrupt
          const category = item.category || item.kategori || 'Foto Juara';
          const img = item.media || item.foto || item.image;

          return (
            <div key={idx} className="group relative rounded-2xl overflow-hidden dark:bg-slate-900/80 bg-white border dark:border-slate-800 border-slate-200/90 shadow-md hover:shadow-xl hover:border-amber-500/40 transition duration-300">
              <div className="h-52 w-full overflow-hidden relative dark:bg-slate-950 bg-slate-100 flex items-center justify-center">
                {img ? (
                  <img 
                    src={img} 
                    alt={cleanTitle} 
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500" 
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br dark:from-slate-900 dark:via-slate-950 dark:to-rose-950/20 from-slate-100 to-slate-200 flex flex-col items-center justify-center text-slate-500">
                    <ImageIcon className="w-10 h-10 opacity-30 text-rose-500 mb-2" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                      {category}
                    </span>
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent opacity-80 group-hover:opacity-90 transition duration-300" />
              </div>

              <div className="absolute bottom-0 inset-x-0 p-4 flex items-end justify-between">
                <div>
                  <span className="text-[10px] font-black text-amber-400 uppercase tracking-wider flex items-center gap-1 mb-0.5">
                    <Trophy className="w-3 h-3 text-amber-400" />
                    <span>{category}</span>
                  </span>
                  <h4 className="text-sm font-extrabold text-white group-hover:text-amber-200 transition">
                    {cleanTitle}
                  </h4>
                </div>
                <div className="p-2 rounded-xl bg-slate-800/80 border border-slate-700/80 text-slate-300 opacity-0 group-hover:opacity-100 transition duration-300">
                  <Maximize2 className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}