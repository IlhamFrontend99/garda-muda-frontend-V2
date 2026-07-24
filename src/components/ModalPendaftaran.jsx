import React, { useState } from 'react';
import FlagID from './FlagID';

export default function ModalPendaftaran({ isOpen, lomba, onClose, onSubmit }) {
  if (!isOpen || !lomba) return null;

  const [nama, setNama] = useState('');
  const [wa, setWa] = useState('');
  const [domisili, setDomisili] = useState('RT 06 / RW 01');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nama.trim() || !wa.trim()) return;

    onSubmit({
      lomba_id: lomba.id,
      lombaJudul: lomba.judul || lomba.nama,
      nama,
      wa,
      domisili,
      waktuLokasi: `${lomba.tanggal_pelaksanaan || '17 Agustus 2026'} (${lomba.lokasi || 'Lapangan Utama RT 06'})`
    });

    setNama('');
    setWa('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden">
        
        {/* Header Modal */}
        <div className="p-6 bg-gradient-to-r from-rose-600 to-rose-500 text-white relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-black/20 hover:bg-black/40 text-white transition-all z-10 cursor-pointer"
            aria-label="Tutup modal"
          >
            ✕
          </button>
          
          {/* PR-10 Mencegah Judul Menimpa Tombol X */}
          <div className="pr-10">
            <div className="flex items-center gap-2 mb-1.5">
              <FlagID />
              <span className="text-xs font-bold uppercase tracking-wider text-rose-100">
                Formulir Pendaftaran Lomba
              </span>
            </div>
            <h2 className="text-xl font-black leading-tight break-words">
              {lomba.judul || lomba.nama}
            </h2>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">
              Nama Peserta / Tim <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: Budi Santoso / Tim RT 06 A"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-500 font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">
              Nomor WhatsApp <span className="text-rose-500">*</span>
            </label>
            <input
              type="tel"
              required
              placeholder="Contoh: 081234567890"
              value={wa}
              onChange={(e) => setWa(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-500 font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">
              Domisili RT / RW
            </label>
            <input
              type="text"
              value={domisili}
              onChange={(e) => setDomisili(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-500 font-medium"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-rose-600 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white font-extrabold text-sm shadow-lg shadow-rose-500/25 transition-all transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              <FlagID />
              <span>Dapatkan Pass Registrasi →</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}