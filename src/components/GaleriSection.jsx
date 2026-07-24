import React from 'react';
import { Camera, Image as ImageIcon, Maximize2, Trophy } from 'lucide-react';
import ScrollReveal from './ScrollReveal';

export default function GaleriSection({ items = [] }) {
  const defaultItems = items.length > 0 ? items : [
    { title: 'Juara Panjat Pinang', category: 'Foto Juara', image: null },
    { title: 'Keseruan Balap Karung', category: 'Dokumentasi', image: null },
    { title: 'Pawai Kemerdekaan RT 06', category: 'Acara Warga', image: null }
  ];

  return (
    <section className="py-12 md:py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* HEADER SECTION */}
        <ScrollReveal direction="pop" delay={0}>
          <div className="flex flex-col items-center text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-wider mb-3">
              <Camera className="w-3.5 h-3.5 text-amber-400" />
              <span>Galeri Karya & Dokumentasi Visual</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Kepingan Momen Bersejarah
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium max-w-xl mt-2">
              Jejak kebersamaan, tawa, dan perjuangan dalam bingkai dokumentasi abadi warga kita.
            </p>
          </div>
        </ScrollReveal>

        {/* GRID GALERI */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {defaultItems.map((item, idx) => (
            <ScrollReveal key={idx} direction="pop" delay={(idx % 3) * 150}>
              <div className="group relative rounded-2xl overflow-hidden bg-slate-900/80 border border-slate-800 shadow-lg hover:border-amber-500/40 transition duration-300">
                <div className="h-52 w-full overflow-hidden relative bg-slate-950 flex items-center justify-center">
                  {item.image ? (
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500" 
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-slate-900 via-slate-950 to-rose-950/20 flex flex-col items-center justify-center text-slate-700">
                      <ImageIcon className="w-10 h-10 opacity-30 text-rose-500 mb-2" />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-600">
                        {item.category || 'Dokumentasi Visual'}
                      </span>
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent opacity-80 group-hover:opacity-90 transition duration-300" />
                </div>

                <div className="absolute bottom-0 inset-x-0 p-4 flex items-end justify-between">
                  <div>
                    <span className="text-[10px] font-black text-amber-400 uppercase tracking-wider flex items-center gap-1 mb-0.5">
                      <Trophy className="w-3 h-3 text-amber-400" />
                      <span>{item.category || 'Foto Juara'}</span>
                    </span>
                    <h4 className="text-sm font-extrabold text-white group-hover:text-amber-200 transition">
                      {item.title}
                    </h4>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-800/80 border border-slate-700/80 text-slate-300 opacity-0 group-hover:opacity-100 transition duration-300">
                    <Maximize2 className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

      </div>
    </section>
  );
}