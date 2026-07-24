import React, { useRef, useState, useEffect } from 'react';
import html2canvas from 'html2canvas';
import { Printer, Download, X } from 'lucide-react';

export default function TiketModal({ isOpen, tiket, onClose }) {
  if (!isOpen || !tiket) return null;

  const ticketRef = useRef(null);
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);

  const kodeTiket = tiket.kode || 'GM81-PASS';

  // Konversi QR Code ke Base64 Data URL untuk mencegah bug CORS gambar kosong di html2canvas
  useEffect(() => {
    const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=280x280&data=${encodeURIComponent(kodeTiket)}&color=dc2626&bgcolor=ffffff`;
    
    fetch(qrApiUrl)
      .then((res) => res.blob())
      .then((blob) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setQrDataUrl(reader.result);
        };
        reader.readAsDataURL(blob);
      })
      .catch(() => {
        setQrDataUrl(qrApiUrl);
      });
  }, [kodeTiket]);

  // Download PNG Pixel-Perfect (Pembersih OKLCH Total dari CSS Stylesheet)
  const handleDownloadImage = async () => {
    if (!ticketRef.current) return;
    setIsDownloading(true);

    try {
      const canvas = await html2canvas(ticketRef.current, {
        scale: 3, // High Resolution 3x HD
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        onclone: (clonedDoc) => {
          // SANITIZER: Netralkan seluruh fungsi warna oklch(...) di tag <style> sebelum parsed oleh html2canvas
          const styleEls = clonedDoc.querySelectorAll('style');
          styleEls.forEach((s) => {
            if (s.textContent) {
              s.textContent = s.textContent.replace(/oklch\([^)]+\)/gi, 'rgb(220, 38, 38)');
            }
          });

          const allEls = clonedDoc.querySelectorAll('*');
          allEls.forEach((el) => {
            const style = el.getAttribute('style');
            if (style && style.includes('oklch')) {
              el.setAttribute('style', style.replace(/oklch\([^)]+\)/gi, 'rgb(220, 38, 38)'));
            }
          });
        },
      });

      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      link.download = `Pass_Registrasi_${kodeTiket}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Gagal mengunduh pass:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  // Cetak Pass (Popup Print Window Rapi)
  const handlePrint = () => {
    setIsPrinting(true);
    try {
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        alert('Mohon izinkan pop-up browser untuk mencetak pass.');
        setIsPrinting(false);
        return;
      }

      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Pass Registrasi #${kodeTiket}</title>
            <style>
              @page { size: auto; margin: 0; }
              body { font-family: 'Segoe UI', Roboto, Arial, sans-serif; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; background: #f8fafc; }
              .ticket-card { width: 380px; padding: 28px; border: 4px dashed #dc2626; border-radius: 24px; background: #ffffff; box-shadow: 0 10px 25px rgba(0,0,0,0.1); text-align: center; }
              .header { background: #dc2626; color: #ffffff; padding: 14px; border-radius: 16px; margin-bottom: 20px; }
              .header h2 { margin: 0; font-size: 18px; text-transform: uppercase; font-weight: 900; letter-spacing: 0.5px; }
              .header p { margin: 3px 0 0; font-size: 10px; font-weight: 700; opacity: 0.9; letter-spacing: 1px; }
              .row { display: flex; justify-content: space-between; border-bottom: 1px solid #f1f5f9; padding: 9px 0; font-size: 12px; }
              .label { color: #dc2626; font-weight: 800; text-transform: uppercase; }
              .val { color: #0f172a; font-weight: 900; text-transform: uppercase; text-align: right; }
              .qr-box { margin-top: 20px; padding: 14px; background: #fff1f2; border: 2px solid #fecdd3; border-radius: 18px; display: inline-block; }
              .qr-box img { width: 170px; height: 170px; display: block; margin: 0 auto; border-radius: 10px; }
              .code { margin-top: 10px; display: inline-block; padding: 4px 14px; background: #ffffff; border: 1.5px solid #fda4af; border-radius: 8px; color: #dc2626; font-weight: 900; font-size: 12px; letter-spacing: 1.5px; }
            </style>
          </head>
          <body>
            <div class="ticket-card">
              <div class="header">
                <h2>GARDA MUDA RT 06</h2>
                <p>PASS REGISTRASI LOMBA HUT RI KE-81</p>
              </div>
              <div class="row"><span class="label">Nama Peserta:</span><span class="val">${tiket.nama}</span></div>
              <div class="row"><span class="label">Lomba Diikuti:</span><span class="val">${tiket.lomba}</span></div>
              <div class="row"><span class="label">Domisili RT/RW:</span><span class="val">${tiket.domisili || 'RT 06 / RW 01'}</span></div>
              <div class="row"><span class="label">No. WhatsApp:</span><span class="val">${tiket.wa}</span></div>
              <div class="row"><span class="label">Waktu & Lokasi:</span><span class="val">${tiket.waktuLokasi}</span></div>
              <div class="qr-box">
                <img src="${qrDataUrl}" alt="QR Code" />
                <div class="code">#${kodeTiket}</div>
              </div>
            </div>
            <script>
              window.onload = function() {
                window.print();
                setTimeout(() => window.close(), 500);
              };
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    } catch (err) {
      console.error('Gagal mencetak:', err);
    } finally {
      setIsPrinting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-fadeIn overflow-y-auto">
      
      {/* MODAL CONTAINER */}
      <div className="relative w-full max-w-md my-auto pt-2 pb-4">
        
        {/* TOMBOL CLOSE (X) ELEGAN DENGAN LUCIDE-REACT */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-0 right-0 -mt-2 -mr-2 sm:-mt-3 sm:-mr-3 w-9 h-9 flex items-center justify-center rounded-full bg-slate-900 border-2 border-rose-500 text-white font-bold hover:bg-rose-600 hover:scale-110 active:scale-95 transition-all shadow-xl cursor-pointer z-30"
          aria-label="Tutup modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* KARTU PAS REGISTRASI */}
        <div
          ref={ticketRef}
          style={{ backgroundColor: '#ffffff', borderColor: '#dc2626' }}
          className="w-full text-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border-4 border-dashed relative overflow-hidden"
        >
          {/* HEADER PASS */}
          <div 
            style={{ backgroundColor: '#dc2626', color: '#ffffff' }}
            className="text-center py-3.5 px-4 rounded-2xl mb-6 shadow-md"
          >
            <h2 className="text-lg sm:text-xl font-black uppercase tracking-wide leading-none">
              GARDA MUDA RT 06
            </h2>
            <p 
              style={{ color: '#fecdd3' }}
              className="text-[10px] sm:text-[11px] font-bold tracking-widest uppercase mt-1"
            >
              PASS REGISTRASI LOMBA HUT RI KE-81
            </p>
          </div>

          {/* DETAIL DATA PESERTA */}
          <div className="space-y-3 text-xs sm:text-sm font-semibold mb-6">
            
            <div style={{ borderColor: '#f1f5f9' }} className="flex justify-between items-center border-b pb-2">
              <span style={{ color: '#dc2626' }} className="font-extrabold uppercase shrink-0">
                Nama Peserta:
              </span>
              <span style={{ color: '#0f172a' }} className="font-black text-right uppercase break-words ml-2">
                {tiket.nama}
              </span>
            </div>

            <div style={{ borderColor: '#f1f5f9' }} className="flex justify-between items-center border-b pb-2">
              <span style={{ color: '#dc2626' }} className="font-extrabold uppercase shrink-0">
                Lomba Diikuti:
              </span>
              <span style={{ color: '#0f172a' }} className="font-black text-right uppercase break-words ml-2">
                {tiket.lomba}
              </span>
            </div>

            <div style={{ borderColor: '#f1f5f9' }} className="flex justify-between items-center border-b pb-2">
              <span style={{ color: '#dc2626' }} className="font-extrabold uppercase shrink-0">
                Domisili RT/RW:
              </span>
              <span style={{ color: '#0f172a' }} className="font-black text-right ml-2">
                {tiket.domisili || 'RT 06 / RW 01'}
              </span>
            </div>

            <div style={{ borderColor: '#f1f5f9' }} className="flex justify-between items-center border-b pb-2">
              <span style={{ color: '#dc2626' }} className="font-extrabold uppercase shrink-0">
                No. WhatsApp:
              </span>
              <span style={{ color: '#0f172a' }} className="font-black text-right ml-2">
                {tiket.wa}
              </span>
            </div>

            <div style={{ borderColor: '#f1f5f9' }} className="flex justify-between items-center border-b pb-2">
              <span style={{ color: '#dc2626' }} className="font-extrabold uppercase shrink-0">
                Waktu & Lokasi:
              </span>
              <span style={{ color: '#0f172a' }} className="font-black text-right text-[11px] sm:text-xs ml-2">
                {tiket.waktuLokasi}
              </span>
            </div>

          </div>

          {/* QR CODE CONTAINER */}
          <div className="flex flex-col items-center justify-center pt-1">
            <div 
              style={{ backgroundColor: '#fff1f2', borderColor: '#fecdd3' }}
              className="p-3.5 border-2 rounded-2xl shadow-inner flex flex-col items-center justify-center"
            >
              {qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt={`QR Code Tiket ${kodeTiket}`}
                  className="w-40 h-40 sm:w-44 sm:h-44 object-contain rounded-lg"
                  crossOrigin="anonymous"
                />
              ) : (
                <div 
                  style={{ backgroundColor: '#ffe4e6', color: '#e11d48' }}
                  className="w-40 h-40 sm:w-44 sm:h-44 animate-pulse rounded-lg flex items-center justify-center text-xs font-bold"
                >
                  Memuat QR...
                </div>
              )}
              
              <span 
                style={{ backgroundColor: '#ffffff', color: '#dc2626', borderColor: '#fda4af' }}
                className="mt-3 px-3.5 py-1 border rounded-lg font-black text-xs sm:text-sm tracking-widest shadow-sm"
              >
                #{kodeTiket}
              </span>
            </div>
          </div>

        </div>

        {/* ACTION BUTTONS */}
        <div className="mt-4 flex items-center gap-3">
          
          {/* TOMBOL CETAK PASS */}
          <button
            type="button"
            onClick={handlePrint}
            disabled={isPrinting || isDownloading}
            className="flex-1 py-3.5 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-white font-extrabold text-xs uppercase tracking-wider transition shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isPrinting ? (
              <>
                <svg className="animate-spin w-4 h-4 text-amber-400 shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Mencetak...</span>
              </>
            ) : (
              <>
                <Printer className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Cetak Pass</span>
              </>
            )}
          </button>

          {/* TOMBOL DOWNLOAD GAMBAR */}
          <button
            type="button"
            onClick={handleDownloadImage}
            disabled={isDownloading || isPrinting}
            className="flex-1 py-3.5 px-4 rounded-2xl bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 hover:from-rose-500 hover:to-amber-400 active:scale-95 text-white font-extrabold text-xs uppercase tracking-wider transition shadow-lg shadow-rose-600/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isDownloading ? (
              <>
                <svg className="animate-spin w-4 h-4 text-white shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Menyimpan PNG...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4 text-white shrink-0" />
                <span>Download Gambar</span>
              </>
            )}
          </button>

        </div>

      </div>
    </div>
  );
}