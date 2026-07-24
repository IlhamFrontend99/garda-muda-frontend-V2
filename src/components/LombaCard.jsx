import React from 'react';
import { Calendar, MapPin, Users, Award, Medal, ChevronRight, Tag, Trophy } from 'lucide-react';

export default function LombaCard({ item, pendaftarCount = 0, onDaftar, onDetail, isAdmin = false, onEdit, onDelete, deletingId }) {
  const kuota = item.kuota || item.maxKuota || 15;
  const count = pendaftarCount || item.pesertaCount || 0;
  const percent = Math.min(Math.round((count / kuota) * 100), 100);

  const judulLomba = item.judul || item.nama || item.title || 'Lomba Kemerdekaan';
  const gambarLomba = item.gambar || item.image;
  const tglLomba = item.tanggal_pelaksanaan || item.tanggal || '17 Agustus 2026';
  const lokasiLomba = item.lokasi || 'Lapangan Utama RT 06';

  const hasWinners = item.juara1 || item.juara2 || item.juara3;

  return (
    <div className="group bg-slate-900/90 dark:bg-[#0c1220]/95 border border-slate-800 hover:border-rose-500/50 rounded-3xl overflow-hidden shadow-xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between h-full relative">
      
      <div>
        {/* COVER IMAGE CONTAINER */}
        <div className="relative h-48 w-full overflow-hidden bg-slate-950">
          {gambarLomba ? (
            <img 
              src={gambarLomba} 
              alt={judulLomba} 
              className="w-full h-full object-cover group-hover:scale-105 transition duration-500" 
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-rose-950/20 to-slate-950 text-slate-700">
              <Trophy className="w-12 h-12 text-rose-500/50 mb-1" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Arena Kemerdekaan</span>
            </div>
          )}

          {/* BADGES */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-600/90 backdrop-blur-md text-white text-[10px] font-black tracking-wide uppercase shadow-md">
            <Tag className="w-3 h-3" />
            <span>{item.kategori || 'Umum'}</span>
          </div>

          <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900/90 backdrop-blur-md text-slate-300 border border-slate-700/80 text-[10px] font-bold shadow-md">
            <Calendar className="w-3 h-3 text-amber-400" />
            <span>{tglLomba}</span>
          </div>
        </div>

        {/* CARD BODY */}
        <div className="p-5 space-y-3.5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-extrabold text-amber-500 uppercase tracking-wider">
                {item.tipe || 'Individu'}
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-black text-white group-hover:text-rose-400 transition leading-snug line-clamp-1">
              {judulLomba}
            </h3>
          </div>

          <p className="text-xs text-slate-400 font-medium line-clamp-2 leading-relaxed">
            {item.deskripsi || item.description || 'Saksikan dan ikuti semarak perlombaan HUT RI ke-81 warga RT 06.'}
          </p>

          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
            <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
            <span className="truncate">{lokasiLomba}</span>
          </div>

          {/* BLOCK PODIUM JUARA WARGA */}
          {hasWinners && (
            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/25 space-y-2">
              <p className="text-[10px] font-black text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-amber-400" />
                <span>Pengesahan Juara Resmi:</span>
              </p>

              <div className="grid grid-cols-3 gap-1.5">
                {/* JUARA 1 */}
                <div className="flex flex-col items-center text-center p-1.5 bg-slate-900/80 rounded-xl border border-yellow-500/30">
                  {item.foto_juara1 ? (
                    <img src={item.foto_juara1} alt="Juara 1" className="w-7 h-7 rounded-full object-cover border border-yellow-400 mb-1" />
                  ) : (
                    <Medal className="w-5 h-5 text-yellow-400 mb-0.5" />
                  )}
                  <span className="text-[9px] font-black text-amber-400 uppercase">🥇 1</span>
                  <span className="text-[10px] font-extrabold text-white truncate w-full">{item.juara1 || '—'}</span>
                </div>

                {/* JUARA 2 */}
                <div className="flex flex-col items-center text-center p-1.5 bg-slate-900/80 rounded-xl border border-slate-400/30">
                  {item.foto_juara2 ? (
                    <img src={item.foto_juara2} alt="Juara 2" className="w-7 h-7 rounded-full object-cover border border-slate-300 mb-1" />
                  ) : (
                    <Medal className="w-5 h-5 text-slate-300 mb-0.5" />
                  )}
                  <span className="text-[9px] font-black text-slate-300 uppercase">🥈 2</span>
                  <span className="text-[10px] font-extrabold text-white truncate w-full">{item.juara2 || '—'}</span>
                </div>

                {/* JUARA 3 */}
                <div className="flex flex-col items-center text-center p-1.5 bg-slate-900/80 rounded-xl border border-amber-700/30">
                  {item.foto_juara3 ? (
                    <img src={item.foto_juara3} alt="Juara 3" className="w-7 h-7 rounded-full object-cover border border-amber-600 mb-1" />
                  ) : (
                    <Medal className="w-5 h-5 text-amber-600 mb-0.5" />
                  )}
                  <span className="text-[9px] font-black text-amber-600 uppercase">🥉 3</span>
                  <span className="text-[10px] font-extrabold text-white truncate w-full">{item.juara3 || '—'}</span>
                </div>
              </div>
            </div>
          )}

          {/* PROGRESS BAR KUOTA */}
          <div className="space-y-1">
            <div className="flex justify-between items-center text-[11px] font-extrabold">
              <span className="text-slate-400 flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-indigo-400" /> Kuota Terisi:
              </span>
              <span className="text-slate-200 font-mono">
                {count} / {kuota} ({percent}%)
              </span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden p-0.5 border border-slate-700/50">
              <div 
                className="bg-gradient-to-r from-amber-500 via-rose-500 to-red-600 h-full rounded-full transition-all duration-500" 
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* CARD FOOTER */}
      <div className="px-5 pb-5 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-3">
        <div>
          <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500 block">Status Arena</span>
          <span className="text-xs font-black text-emerald-400">
            {count >= kuota ? 'KUOTA PENUH' : 'DIBUKA'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onDetail && onDetail(item)}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 text-xs font-extrabold border border-slate-700/60 transition cursor-pointer"
          >
            Detail
          </button>

          <button
            type="button"
            onClick={() => onDaftar && onDaftar(item)}
            disabled={count >= kuota}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 hover:from-rose-500 hover:to-amber-400 active:scale-95 text-white text-xs font-black shadow-lg shadow-rose-600/25 transition cursor-pointer flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>Daftar</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

    </div>
  );
}