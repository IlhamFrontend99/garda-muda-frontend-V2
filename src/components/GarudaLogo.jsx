import React from 'react';
import logoGarudaAsset from '../assets/logo-garuda.png';

export default function Garudalogo({ src, className = "w-10 h-10 object-contain inline-block" }) {
  // Jika ada src dari CMS Branding (cmsData.logoGaruda), gunakan itu. Jika tidak, gunakan logo asset default.
  const activeLogo = src || logoGarudaAsset;

  return (
    <img
      src={activeLogo}
      alt="Logo Garuda Pancasila"
      className={className}
      onError={(e) => {
        // Fallback jika URL CMS error/broken
        e.target.onerror = null;
        e.target.src = logoGarudaAsset;
      }}
    />
  );
}