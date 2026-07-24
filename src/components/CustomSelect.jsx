import React from 'react';
import { ChevronDown } from 'lucide-react';

export default function CustomSelect({ options, value, onChange, className = "" }) {
  return (
    <div className="relative inline-block w-full">
      <select
        value={value}
        onChange={onChange}
        className={`w-full appearance-none bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white font-medium focus:outline-none focus:border-red-500 cursor-pointer transition pr-9 ${className}`}
      >
        {options.map((opt) => (
          <option key={typeof opt === 'object' ? opt.value : opt} value={typeof opt === 'object' ? opt.value : opt} className="bg-slate-950 text-white">
            {typeof opt === 'object' ? opt.label : opt}
          </option>
        ))}
      </select>
      <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-3.5 pointer-events-none" />
    </div>
  );
}