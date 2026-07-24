import React, { useState } from 'react';
import { Trophy, Search, Flame, Calendar, MapPin, Users, Medal, ChevronRight, Tag } from 'lucide-react';
import ScrollReveal from './ScrollReveal';

export default function LombaSection({ lombas = [], onSelectLomba, onRegisterLomba }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');

  const categories = ['Semua', 'Anak-Anak', 'Remaja', 'Dewasa', 'Umum'];

  const filteredLombas = lombas.filter((lomba) => {
    const matchSearch = lomba.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        lomba.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCategory = selectedCategory === 'Semua' || lomba.kategori === selectedCategory;
    return matchSearch && matchCategory;
  });

  return (
    <section id="panggung-lomba" className="py-12 md:py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* HEADER SECTION */}
        <ScrollReveal direction="pop" delay={0}>
          <div className="flex flex-col items-center text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-wider mb-3">
              <Flame className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>Ajang Adu Ketangkasan</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight flex items-center justify-center gap-2">
              PANGGUNG PERLOMBAAN
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium max-w-xl mt-2">
              Temukan arena bertandingmu, siapkan strateginya, dan raih kemenangannya!
            </p>
          </div>
        </ScrollReveal>

        {/* SEARCH & FILTER BAR */}
        <ScrollReveal direction="up" delay={100}>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10 bg-slate-900/60 backdrop-blur-md p-3 sm:p-4 rounded-2xl border border-slate-800">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Cari nama lomba..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-800/80 border border-slate-700/80 rounded-xl text-xs font-semibold text-slate-200 placeholder-slate-500 focus:outline-none focus:border-rose-500 transition"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                    selectedCategory === cat 
                      ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20' 
                      : 'bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700/80 border border-slate-700/50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* LOMBA GRID - SETIAP KARTU MUNCUL BERURUTAN */}
        {filteredLombas.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-sm font-semibold">
            Tidak ada perlombaan yang cocok dengan pencarianmu.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLombas.map((item, index) => {
              const quotaPercent = Math.min(Math.round(((item.pesertaCount || 0) / (item.maxKuota || 20)) * 100), 100);

              return (
                <ScrollReveal key={item.id || index} direction="pop" delay={(index % 3) * 150}>
                  <div className="group bg-slate-900/80 dark:bg-[#0c1220]/90 border border-slate-800 hover:border-rose-500/40 rounded-2xl overflow-hidden shadow-lg transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between h-full">
                    
                    <div>
                      <div className="relative h-44 w-full overflow-hidden bg-slate-950">
                        {item.image ? (
                          <img 
                            src={item.image} 
                            alt={item.title} 
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-500" 
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-slate-950 text-slate-700">
                            <Trophy className="w-12 h-12 opacity-30 mb-1 text-rose-500" />
                            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-600">Dokumentasi Lomba</span>
                          </div>
                        )}
                        
                        <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-600/90 backdrop-blur-md text-white text-[10px] font-black tracking-wide uppercase shadow-md">
                          <Tag className="w-3 h-3" />
                          <span>{item.kategori || 'Umum'}</span>
                        </div>

                        <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900/90 backdrop-blur-md text-slate-300 border border-slate-700/80 text-[10px] font-bold shadow-md">
                          <Calendar className="w-3 h-3 text-amber-400" />
                          <span>{item.tanggal || '2026-08-17'}</span>
                        </div>
                      </div>

                      <div className="p-5">
                        <h3 className="text-base font-extrabold text-white group-hover:text-rose-400 transition mb-2 line-clamp-1">
                          {item.title}
                        </h3>

                        <p className="text-xs text-slate-400 font-normal line-clamp-2 leading-relaxed mb-4">
                          {item.description || 'Lomba meriah dalam rangka menyemarakkan HUT RI bersama warga RT 06.'}
                        </p>

                        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 mb-4">
                          <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                          <span className="truncate">{item.lokasi || 'Lap. Utama RT 06'}</span>
                        </div>

                        {item.pemenang && item.pemenang.length > 0 && (
                          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 mb-4">
                            <div className="flex items-center gap-1.5 text-[11px] font-black text-amber-400 uppercase tracking-wider mb-2">
                              <Medal className="w-3.5 h-3.5" />
                              <span>Pemenang Resmi</span>
                            </div>
                            <div className="space-y-1">
                              {item.pemenang.map((pem, pIdx) => (
                                <div key={pIdx} className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                                  <span className="text-amber-400 font-extrabold">{pIdx + 1}.</span> {pem}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="space-y-1.5 mb-2">
                          <div className="flex justify-between items-center text-[11px] font-bold">
                            <span className="text-slate-400 flex items-center gap-1">
                              <Users className="w-3 h-3 text-indigo-400" /> Kuota Terisi:
                            </span>
                            <span className="text-slate-200">
                              {item.pesertaCount || 0} / {item.maxKuota || 20} Warga ({quotaPercent}%)
                            </span>
                          </div>
                          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                            <div 
                              className="bg-gradient-to-r from-amber-500 to-rose-500 h-1.5 rounded-full transition-all duration-500" 
                              style={{ width: `${quotaPercent}%` }}
                            />
                          </div>
                        </div>

                      </div>
                    </div>

                    <div className="px-5 pb-5 pt-2 border-t border-slate-800/80 flex items-center justify-between gap-3">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Biaya</span>
                        <span className="text-xs font-extrabold text-emerald-400">
                          {item.biaya || 'Gratis'}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onSelectLomba && onSelectLomba(item)}
                          className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold border border-slate-700/60 transition cursor-pointer"
                        >
                          Detail
                        </button>

                        <button
                          onClick={() => onRegisterLomba && onRegisterLomba(item)}
                          className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-amber-500 hover:opacity-95 text-white text-xs font-extrabold shadow-md transition cursor-pointer flex items-center gap-1"
                        >
                          <span>Ikut Lomba</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
}