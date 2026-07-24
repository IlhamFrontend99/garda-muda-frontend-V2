import React, { useState, useEffect } from 'react';
import { ShieldCheck, Cookie } from 'lucide-react';

export default function CookieBanner() {
  const [accepted, setAccepted] = useState(true);

  useEffect(() => {
    const consent = localStorage.getItem('gm_cookie_consent');
    if (!consent) setAccepted(false);
  }, []);

  const handleAccept = () => {
    localStorage.setItem('gm_cookie_consent', 'accepted_v1');
    setAccepted(true);
  };

  if (accepted) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md z-[90] bg-slate-900/95 border border-red-800/60 text-slate-200 p-4 rounded-2xl shadow-2xl backdrop-blur-xl flex flex-col gap-3">
      <div className="flex items-start gap-3">
        <div className="p-2 bg-red-950/80 border border-red-700/50 rounded-xl text-red-400 shrink-0">
          <Cookie className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
            Sesi & Keamanan Cookie Web <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          </h4>
          <p className="text-[11px] text-slate-400 leading-relaxed mt-0.5">
            Kami menggunakan cookie sesi lokal untuk menjaga keamanan autentikasi pengurus RT 06 dan menyimpan preferensi tampilan web kamu.
          </p>
        </div>
      </div>
      <div className="flex justify-end gap-2 pt-1 border-t border-slate-800">
        <button
          onClick={handleAccept}
          className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl text-xs transition shadow-md shadow-red-900/40"
        >
          Setujui & Lanjutkan
        </button>
      </div>
    </div>
  );
}