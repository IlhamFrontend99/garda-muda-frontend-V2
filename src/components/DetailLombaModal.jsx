import React from 'react';
import { X, Calendar, MapPin, Users, Award, Medal, Trophy, CheckCircle2 } from 'lucide-react';

export default function DetailLombaModal({ isOpen, lomba, pendaftars = [], onClose, onDaftar }) {
  if (!isOpen || !lomba) return null;

  const count = pendaftars.filter(p => p.lomba_id === lomba.id || p.lomba_id === String(lomba.id)).length;
  const kuota = lomba.kuota || lomba.maxKuota || 15;

  const judulLomba = lomba.judul || lomba.nama || lomba.title || 'Detail Lomba';
  const gambarLomba = lomba.gambar || lomba.image;
  const tglLomba = lomba.tanggal_pelaksanaan || lomba.tanggal || '17 Agustus 2026';
  const lokasiLomba = lomba.lokasi || 'Lapangan Utama RT 06';

  // Fallback membaca nama & foto juara dari berbagai format database
  const j1 = lomba.juara1 || lomba.juara_1 || '';
  const fj1 = lomba.foto_juara1 || lomba.fotoJuara1 || lomba.foto_1 || '';

  const j2 = lomba.juara2 || lomba.juara_2 || '';
  const fj2 = lomba.foto_juara2 || lomba.fotoJuara2 || lomba.foto_2 || '';

  const j3 = lomba.juara3 || lomba.juara_3 || '';
  const fj3 = lomba.foto_juara3 || lomba.fotoJuara3 || lomba.foto_3 || '';

  const hasWinners = j1 || j2 || j3;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-8">

        {/* Tombol X (Close) */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 z-[60] w-10 h-10 flex items-center justify-center rounded-full bg-slate-950/70 border border-slate-700 text-slate-300 font-bold hover:scale-110 active:scale-95 transition shadow-lg cursor-pointer"
          aria-label="Tutup Detail"
        >
          <X className="w-5 h-5" />
        </button>

        {/* HERO IMAGE */}
        <div className="relative h-64 sm:h-72 w-full bg-slate-950 overflow-hidden">
          {gambarLomba ? (
            <img src={gambarLomba} alt={judulLomba} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-rose-950/40 via-slate-900 to-slate-950">
              <Trophy className="w-16 h-16 text-rose-500/60 mb-2" />
              <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Panggung Utama RT 06</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />

          <div className="absolute bottom-4 left-6 right-6">
            <span className="px-3 py-1 rounded-lg bg-rose-600 text-white text-[10px] font-black uppercase tracking-wider shadow-md">
              {lomba.kategori || 'Umum'} • {lomba.tipe || 'Individu'}
            </span>
            <h2 className="text-xl sm:text-3xl font-black text-white mt-1.5 leading-tight">
              {judulLomba}
            </h2>
          </div>
        </div>

        {/* MODAL CONTENT */}
        <div className="p-6 sm:p-8 space-y-6">

          {/* META INFO */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-semibold">
            <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-2xl flex items-center gap-2.5">
              <Calendar className="w-4 h-4 text-rose-500 shrink-0" />
              <div><p className="text-[10px] text-slate-500 uppercase font-extrabold">Waktu</p><p className="text-slate-200 font-bold">{tglLomba}</p></div>
            </div>
            <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-2xl flex items-center gap-2.5">
              <MapPin className="w-4 h-4 text-amber-500 shrink-0" />
              <div><p className="text-[10px] text-slate-500 uppercase font-extrabold">Lokasi Arena</p><p className="text-slate-200 font-bold truncate">{lokasiLomba}</p></div>
            </div>
            <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-2xl flex items-center gap-2.5">
              <Users className="w-4 h-4 text-emerald-500 shrink-0" />
              <div><p className="text-[10px] text-slate-500 uppercase font-extrabold">Peserta Terisi</p><p className="text-slate-200 font-bold">{count} / {kuota} Warga</p></div>
            </div>
          </div>

          {/* DESKRIPSI */}
          <div className="space-y-2">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">Deskripsi Perlombaan</h4>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium bg-slate-950/40 p-4 rounded-2xl border border-slate-800/80">
              {lomba.deskripsi || lomba.description || 'Lomba meriah dalam rangka memeriahkan HUT RI ke-81.'}
            </p>
          </div>

          {/* PENGESAHAN JUARA RESMI DENGAN AVATAR FOTO PEMENANG (DIPERKECIL) */}
          {hasWinners && (
            <div className="p-3.5 rounded-2xl bg-amber-500/10 border-2 border-amber-500/30 space-y-2.5">
              <h4 className="text-xs font-black text-amber-400 uppercase tracking-wider flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400" />
                <span>Pengesahan Pemenang Juara Resmi</span>
              </h4>

              <div className="grid grid-cols-3 gap-2">
                {/* JUARA 1 */}
                <div className="p-2 bg-slate-950/90 rounded-xl border border-yellow-500/40 flex flex-col items-center text-center">
                  {fj1 ? (
                    <img src={fj1} alt="Foto Juara 1" className="w-9 h-9 rounded-full object-cover border-2 border-yellow-400 mb-1 shadow-md" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-yellow-500/20 border border-yellow-500/40 flex items-center justify-center text-yellow-400 mb-1">
                      <Medal className="w-4 h-4"/>
                    </div>
                  )}
                  <span className="px-1.5 py-0.5 rounded-full text-[7px] font-black bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 uppercase mb-0.5 leading-tight whitespace-nowrap">
                    🥇 JUARA 1
                  </span>
                  <p className="text-[10px] font-black text-white truncate w-full leading-tight">{j1 || '—'}</p>
                </div>

                {/* JUARA 2 */}
                <div className="p-2 bg-slate-950/90 rounded-xl border border-slate-400/40 flex flex-col items-center text-center">
                  {fj2 ? (
                    <img src={fj2} alt="Foto Juara 2" className="w-9 h-9 rounded-full object-cover border-2 border-slate-300 mb-1 shadow-md" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-slate-400/20 border border-slate-400/40 flex items-center justify-center text-slate-300 mb-1">
                      <Medal className="w-4 h-4"/>
                    </div>
                  )}
                  <span className="px-1.5 py-0.5 rounded-full text-[7px] font-black bg-slate-400/20 text-slate-300 border border-slate-400/30 uppercase mb-0.5 leading-tight whitespace-nowrap">
                    🥈 JUARA 2
                  </span>
                  <p className="text-[10px] font-black text-white truncate w-full leading-tight">{j2 || '—'}</p>
                </div>

                {/* JUARA 3 */}
                <div className="p-2 bg-slate-950/90 rounded-xl border border-amber-600/40 flex flex-col items-center text-center">
                  {fj3 ? (
                    <img src={fj3} alt="Foto Juara 3" className="w-9 h-9 rounded-full object-cover border-2 border-amber-600 mb-1 shadow-md" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-amber-600/20 border border-amber-600/40 flex items-center justify-center text-amber-500 mb-1">
                      <Medal className="w-4 h-4"/>
                    </div>
                  )}
                  <span className="px-1.5 py-0.5 rounded-full text-[7px] font-black bg-amber-600/20 text-amber-500 border border-amber-600/30 uppercase mb-0.5 leading-tight whitespace-nowrap">
                    🥉 JUARA 3
                  </span>
                  <p className="text-[10px] font-black text-white truncate w-full leading-tight">{j3 || '—'}</p>
                </div>
              </div>
            </div>
          )}

          {/* ACTION BUTTON */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => onDaftar(lomba)}
              disabled={count >= kuota}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white font-black text-xs sm:text-sm uppercase tracking-wider shadow-lg shadow-rose-600/30 transition duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>{count >= kuota ? 'Kuota Warga Telah Penuh' : 'Daftar Ikut Perlombaan Ini'}</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}