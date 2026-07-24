import React, { useState } from 'react';
import Hero from './Hero';
import LombaCard from './LombaCard';
import Showcase3D from './Showcase3D';
import PanitiaAndDrive from './PanitiaAndDrive';
import MarqueeBanner from './MarqueeBanner';
import ScrollReveal from './ScrollReveal';
import { Search, Flame } from 'lucide-react';

export default function UserDashboard({ lombas = [], pendaftars = [], onDaftar, onDetail, cmsData = {} }) {
  const [selectedKategori, setSelectedKategori] = useState('Semua');
  const [searchTerm, setSearchTerm] = useState('');

  const kategoris = ['Semua', 'Anak-Anak', 'Remaja', 'Dewasa', 'Umum'];

  const filteredLombas = lombas.filter((l) => {
    const matchCategory = selectedKategori === 'Semua' || (l.kategori || 'Umum').toLowerCase() === selectedKategori.toLowerCase();
    const matchSearch = l.judul?.toLowerCase().includes(searchTerm.toLowerCase()) || l.deskripsi?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCategory && matchSearch;
  });

  const getPendaftarCount = (lombaId) => pendaftars.filter(p => p.lomba_id === lombaId || p.lomba_id === String(lombaId)).length;

  return (
    <div className="space-y-12 sm:space-y-14 pb-16 relative z-10">
      
      {/* HERO SECTION */}
      <Hero onDaftarClick={() => {
        const el = document.getElementById('daftar-lomba');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }} cmsData={cmsData} />

      {/* MARQUEE BANNER */}
      <MarqueeBanner />

      {/* PANGGUNG PERLOMBAAN */}
      <section id="daftar-lomba" className="max-w-7xl mx-auto px-4 space-y-6">
        
        {/* Header & Filter */}
        <ScrollReveal direction="up" delay={0}>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h3 className="text-2xl sm:text-3xl font-black dark:text-white text-slate-900 uppercase tracking-tight flex items-center gap-2">
                Panggung Perlombaan <Flame className="w-6 h-6 text-amber-500 animate-pulse" />
              </h3>
              <p className="dark:text-slate-300 text-slate-600 text-sm mt-1.5">
                Temukan arena bertandingmu, siapkan strateginya, dan raih kemenangannya!
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
              {/* Search Box */}
              <div className="relative w-full sm:w-64 group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-red-500 to-amber-500 rounded-xl blur opacity-20 group-focus-within:opacity-100 transition duration-500" />
                <Search className="w-4 h-4 absolute left-3 top-2.5 dark:text-slate-400 text-slate-500 z-10" />
                <input
                  type="text" 
                  placeholder="Temukan Lomba..." 
                  value={searchTerm} 
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="relative w-full pl-9 pr-4 py-2 dark:bg-slate-900 bg-white border dark:border-slate-700 border-slate-300
                    rounded-xl text-xs dark:text-white text-slate-900 dark:placeholder:text-slate-500 placeholder:text-slate-400
                    focus:outline-none focus:ring-2 focus:ring-red-500/30 transition shadow-sm"
                />
              </div>

              {/* Category Buttons */}
              <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1 w-full sm:w-auto">
                {kategoris.map((kat) => (
                  <button
                    key={kat} 
                    onClick={() => setSelectedKategori(kat)}
                    className={`px-5 py-2 rounded-xl text-xs font-bold transition-all duration-300 shrink-0 border ${
                      selectedKategori === kat
                        ? 'bg-gradient-to-r from-red-600 to-red-700 text-white border-red-500 shadow-[0_0_15px_rgba(220,38,38,0.4)]'
                        : 'dark:bg-slate-900/70 bg-white border dark:border-slate-700 border-slate-300 dark:text-slate-300 text-slate-700 hover:border-amber-500 hover:text-amber-500 backdrop-blur-sm'
                    }`}
                  >
                    {kat}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* List Lomba / Empty State */}
        {filteredLombas.length === 0 ? (
          <ScrollReveal direction="pop" delay={100}>
            <div className="text-center py-16 dark:bg-slate-900/40 bg-white rounded-3xl border dark:border-slate-800/50 border-slate-200 backdrop-blur-md shadow-xl">
              <div className="w-16 h-16 dark:bg-slate-800 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 border dark:border-slate-700 border-slate-300 shadow-inner">
                <Search className="w-8 h-8 text-amber-500" />
              </div>
              <h4 className="text-lg font-black dark:text-white text-slate-900">Arena Belum Tersedia</h4>
              <p className="text-sm dark:text-slate-400 text-slate-500 mt-1 max-w-md mx-auto">
                Wah, sepertinya panitia belum membuka arena untuk kategori ini. Coba jelajahi kategori "Semua" atau gunakan kata kunci lain.
              </p>
            </div>
          </ScrollReveal>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLombas.map((item, idx) => (
              <ScrollReveal key={item.id} direction="pop" delay={(idx % 3) * 150}>
                <LombaCard 
                  item={item} 
                  pendaftarCount={getPendaftarCount(item.id)} 
                  onDaftar={onDaftar} 
                  onDetail={onDetail} 
                />
              </ScrollReveal>
            ))}
          </div>
        )}
      </section>

      {/* SHOWCASE 3D / GALERI VISUAL */}
      <ScrollReveal direction="pop" delay={100}>
        <div className="max-w-7xl mx-auto px-4">
          <Showcase3D cards={cmsData.cards3D || []} />
        </div>
      </ScrollReveal>

      {/* PANITIA & ARSIP GOOGLE DRIVE */}
      <ScrollReveal direction="pop" delay={100}>
        <div className="max-w-7xl mx-auto px-4">
          <PanitiaAndDrive 
            members={cmsData.members || []} 
            driveUrl={cmsData.driveUrl} 
            fotoBersama={cmsData.fotoBersama} 
          />
        </div>
      </ScrollReveal>

    </div>
  );
}
