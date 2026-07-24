import React, { useState } from 'react';
import { QrCode, CheckCircle2, XCircle, Search, RefreshCw } from 'lucide-react';

export default function ScanModal({ isOpen, onClose, pendaftars = [], onCheckIn }) {
  const [ticketInput, setTicketInput] = useState('');
  const [scanResult, setScanResult] = useState(null);

  if (!isOpen) return null;

  const handleVerify = (code) => {
    const searchCode = code || ticketInput;
    if (!searchCode) return;

    // Cari pendaftar berdasarkan ID / Kode Tiket
    const found = pendaftars.find(
      (p) => `TIKET-GM81-00${p.id}`.toLowerCase() === searchCode.trim().toLowerCase() || String(p.id) === searchCode.trim()
    );

    if (found) {
      setScanResult({ success: true, data: found });
      if (onCheckIn) onCheckIn(found.id);
    } else {
      setScanResult({ success: false, message: 'Tiket tidak ditemukan di database warga!' });
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl p-6 space-y-5 shadow-2xl relative">
        <div className="flex justify-between items-center border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/30">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">Scan QR & Check-In</h3>
              <p className="text-[10px] text-slate-400">Verifikasi kehadiran peserta di lokasi</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white font-bold text-sm">✕</button>
        </div>

        {/* Viewport Scanner Visual */}
        <div className="relative h-44 bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden flex flex-col items-center justify-center p-4 text-center">
          <div className="absolute inset-x-8 h-0.5 bg-red-500 shadow-[0_0_15px_#ef4444] animate-pulse"></div>
          <QrCode className="w-16 h-16 text-slate-700 mb-2 animate-bounce" />
          <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">Arahkan Kamera / Masukkan Kode Tiket</p>
        </div>

        {/* Input Manual Kode Tiket */}
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">Verifikasi Manual Kode Tiket</label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Misal: TIKET-GM81-001"
                value={ticketInput}
                onChange={(e) => setTicketInput(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-red-500 font-mono"
              />
            </div>
            <button
              onClick={() => handleVerify()}
              className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl text-xs transition shadow-lg shadow-red-900/40"
            >
              Cek Tiket
            </button>
          </div>
        </div>

        {/* Result Verification */}
        {scanResult && (
          <div className={`p-4 rounded-xl border flex items-start gap-3 ${scanResult.success ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300' : 'bg-red-950/60 border-red-500/50 text-red-300'}`}>
            {scanResult.success ? <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" /> : <XCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />}
            <div className="text-xs space-y-1">
              {scanResult.success ? (
                <>
                  <p className="font-extrabold text-white">PESERTA DITERIMA & CHECK-IN!</p>
                  <p>Nama: <strong className="text-white">{scanResult.data.nama_pendaftar}</strong></p>
                  <p>WhatsApp: <span className="font-mono">{scanResult.data.no_hp}</span></p>
                </>
              ) : (
                <p className="font-bold">{scanResult.message}</p>
              )}
            </div>
          </div>
        )}

        <button onClick={onClose} className="w-full py-2.5 bg-slate-800 text-slate-300 rounded-xl text-xs font-bold hover:text-white transition">
          Tutup Scanner
        </button>
      </div>
    </div>
  );
}