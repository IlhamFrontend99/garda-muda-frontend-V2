import React from 'react';

export default function FlagID({ className = "w-5 h-3.5 inline-block rounded-[3px] shadow-sm border border-black/10 dark:border-white/20 overflow-hidden shrink-0 align-middle" }) {
  return (
    <svg viewBox="0 0 3 2" className={className} style={{ display: 'inline-block', verticalAlign: 'middle' }}>
      <rect width="3" height="1" fill="#e11d48" />
      <rect y="1" width="3" height="1" fill="#ffffff" />
    </svg>
  );
}