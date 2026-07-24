import React from 'react';
import { Users, HardDrive, ExternalLink, Award } from 'lucide-react';
import ScrollReveal from './ScrollReveal';

export default function PanitiaDriveSection({ cmsData }) {
  const panitiaList = cmsData?.panitia || [
    { name: 'Ilham Eka Saputra', role: 'Ketua Panitia', photo: null }
  ];

  const driveUrl = cmsData?.driveUrl || 'https://drive.google.com';

  return (
    <section className="py-12 md:py-16 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* LEFT: TIM PENGGERAK GARDA MUDA */}
          <div className="lg:col-span-2">
            <ScrollReveal direction="pop" delay={0}>
              <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md shadow-xl h-full flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-rose-400 text-xs font-black uppercase tracking-wider mb-2">
                    <Users className="w-4 h-4" />
                    <span>Tim Penggerak Garda Muda</span>
                  </div>
                  <p className="text-xs text-slate-400 font-medium mb-6">
                    Mengenal lebih dekat para pahlawan di balik layar keseruan acara kita.
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {panitiaList.map((p, idx) => (
                      <ScrollReveal key={idx} direction="pop" delay={100 + idx * 120}>
                        <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 flex flex-col items-center text-center group hover:border-rose-500/40 transition">
                          <div className="w-12 h-12 rounded-full bg-slate-800 border border-slate-700/80 flex items-center justify-center overflow-hidden mb-2 shadow-inner">
                            {p.photo ? (
                              <img src={p.photo} alt={p.name} className="w-full h-full object-cover" />
                            ) : (
                              <Award className="w-6 h-6 text-amber-400" />
                            )}
                          </div>
                          <span className="text-xs font-extrabold text-white group-hover:text-rose-400 transition truncate w-full">
                            {p.name}
                          </span>
                          <span className="text-[10px] font-semibold text-rose-400/90 truncate w-full mt-0.5">
                            {p.role}
                          </span>
                        </div>
                      </ScrollReveal>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* RIGHT: ARSIP DIGITAL GOOGLE DRIVE */}
          <div className="lg:col-span-1">
            <ScrollReveal direction="pop" delay={200}>
              <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md shadow-xl h-full flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-4">
                    <HardDrive className="w-5 h-5" />
                  </div>

                  <h3 className="text-lg font-black text-white mb-2">
                    Arsip Digital Google Drive
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed font-medium mb-6">
                    Pusat akses seluruh aset dokumen, foto resolusi tinggi, dan video mentah hasil tangkapan momen perlombaan.
                  </p>
                </div>

                <a
                  href={driveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs tracking-wide shadow-lg shadow-indigo-600/25 transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Buka Arsip Drive</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </ScrollReveal>
          </div>

        </div>
      </div>
    </section>
  );
}