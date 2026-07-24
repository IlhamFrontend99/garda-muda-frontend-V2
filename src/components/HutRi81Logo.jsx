import React from 'react';

export default function HutRi81Logo({ className = "w-11 h-11" }) {
  return (
    <div className={`relative flex items-center justify-center bg-gradient-to-br from-red-600 via-red-700 to-amber-500 rounded-2xl p-[2px] shadow-[0_0_20px_rgba(225,29,72,0.3)] ${className}`}>
      <div className="w-full h-full bg-[#0b0f19] rounded-[14px] flex flex-col items-center justify-center border border-red-500/30 p-1 text-center">
        <span className="text-[8px] font-black tracking-widest text-red-500 leading-none">HUT RI</span>
        <span className="text-base font-black text-white leading-none tracking-tighter my-0.5">81</span>
        <span className="text-[6px] text-amber-400 font-bold leading-none">1945-2026</span>
      </div>
    </div>
  );
}