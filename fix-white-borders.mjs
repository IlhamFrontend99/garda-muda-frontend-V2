import fs from 'fs';
import path from 'path';

const cssPath = path.join(process.cwd(), 'src', 'index.css');

const css = `@import "tailwindcss";

/* 1. PEMBASMI BORDER PUTIH GAIB BROWSER */
@layer base {
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  html, body, #root {
    width: 100%;
    min-height: 100vh;
    margin: 0 !important;
    padding: 0 !important;
    overflow-x: hidden;
    overscroll-behavior: none; /* Mematikan pantulan scroll putih */
    @apply dark:bg-[#090d16] bg-slate-50;
  }
}

/* 2. ANIMASI PREMIUM TETAP AMAN */
@keyframes waveFlag {
  0%, 100% { transform: translateY(0px) rotate(0deg) skewY(0deg); }
  25% { transform: translateY(-5px) rotate(-3deg) skewY(-2deg); }
  50% { transform: translateY(3px) rotate(2deg) skewY(1.5deg); }
  75% { transform: translateY(-2px) rotate(-1.5deg) skewY(-1deg); }
}

@keyframes spinSlow {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes gradient-x {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

@keyframes blob {
  0% { transform: translate(0px, 0px) scale(1); }
  33% { transform: translate(30px, -50px) scale(1.1); }
  66% { transform: translate(-20px, 20px) scale(0.9); }
  100% { transform: translate(0px, 0px) scale(1); }
}

@keyframes shimmer {
  100% { transform: translateX(100%); }
}

.animate-waving-flag { animation: waveFlag 3.5s ease-in-out infinite; transform-origin: left center; }
.animate-spin-slow { animation: spinSlow 12s linear infinite; }
.animate-gradient-x { background-size: 200% 200%; animation: gradient-x 4s ease infinite; }
.animate-blob { animation: blob 15s infinite alternate ease-in-out; }
.animation-delay-2000 { animation-delay: 2s; }
.animation-delay-4000 { animation-delay: 4s; }

* { -webkit-tap-highlight-color: transparent; }
.scrollbar-none::-webkit-scrollbar { display: none; }
.scrollbar-none { -ms-overflow-style: none; scrollbar-width: none; }

/* 3. PENGATURAN CETAK LANGSUNG TANPA TAB BARU */
@media print {
  body * { visibility: hidden !important; }
  #printable-ticket, #printable-ticket * { visibility: visible !important; }
  #printable-ticket {
    position: absolute !important;
    left: 50% !important;
    top: 0 !important;
    transform: translateX(-50%) !important;
    width: 100% !important;
    max-width: 420px !important;
    margin: 0 !important;
    padding: 24px !important;
    border: 4px dashed #dc2626 !important;
    background-color: white !important;
    box-shadow: none !important;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }
  .print\\:hidden { display: none !important; }
}`;

fs.writeFileSync(cssPath, css, 'utf8');
console.log('✅ File CSS berhasil diperbarui! Border putih margin telah dihapus 100%!');
