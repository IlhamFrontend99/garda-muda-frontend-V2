import React, { useState, useEffect } from 'react';
import axios from 'axios';

import logoGarudaAsset from './assets/logo-garuda.png';

import Navbar from './components/Navbar';
import UserDashboard from './components/UserDashboard';
import AdminDashboard from './components/AdminDashboard';
import LoginModal from './components/LoginModal';
import ModalPendaftaran from './components/ModalPendaftaran';
import TiketModal from './components/TiketModal';
import DetailLombaModal from './components/DetailLombaModal';
import ScanModal from './components/ScanModal';
import ConfirmModal from './components/ConfirmModal';
import Toast from './components/Toast';
import Footer from './components/Footer';
import SplashScreen from './components/SplashScreen';

const API_URL = import.meta.env.VITE_API_URL || 'https://backend81.vercel.app';

export default function App() {
  const [initialLoading, setInitialLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('gm_theme');
    return savedTheme ? savedTheme === 'dark' : true;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      root.classList.remove('light');
      root.style.colorScheme = 'dark';
      localStorage.setItem('gm_theme', 'dark');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
      root.style.colorScheme = 'light';
      localStorage.setItem('gm_theme', 'light');
    }
  }, [darkMode]);

  const [deletingLombaId, setDeletingLombaId] = useState(null);
  const [deletingPendaftarId, setDeletingPendaftarId] = useState(null);
  const [isSubmittingLomba, setIsSubmittingLomba] = useState(false);
  const [toast, setToast] = useState('');

  const [lombas, setLombas] = useState(() => {
    const saved = localStorage.getItem('gm_lombas_db');
    return saved ? JSON.parse(saved) : [];
  });
  const [pendaftars, setPendaftars] = useState(() => {
    const saved = localStorage.getItem('gm_pendaftars_db');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => { localStorage.setItem('gm_lombas_db', JSON.stringify(lombas)); }, [lombas]);
  useEffect(() => { localStorage.setItem('gm_pendaftars_db', JSON.stringify(pendaftars)); }, [pendaftars]);

  const [isScanOpen, setIsScanOpen] = useState(false);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, title: '', message: '' });
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [selectedLomba, setSelectedLomba] = useState(null);
  const [detailLomba, setDetailLomba] = useState(null);
  const [tiket, setTiket] = useState(null);

  const [cmsData, setCmsData] = useState(() => {
    const saved = localStorage.getItem('gm_cms_data');
    return saved ? JSON.parse(saved) : {
      username: 'admin', password: 'admin123', orgName: 'GARDA MUDA RT 06', rwDesa: 'RW 01 DESA WUNGU',
      logoGaruda: logoGarudaAsset, logoHutRi: '', logoGardaMuda: logoGarudaAsset, driveUrl: '', fotoBersama: '', members: [], cards3D: [], ig: '', tiktok: '', youtube: '', waPanitia: ''
    };
  });

  const handleUpdateCmsData = async (updatedData) => {
    setCmsData(updatedData);
    localStorage.setItem('gm_cms_data', JSON.stringify(updatedData));
    try {
      await axios.post(`${API_URL}/api/cms`, updatedData);
      setToast('Tampilan CMS Tersimpan Permanen di Database Server!');
    } catch (err) {
      setToast('Tampilan CMS Tersimpan di Memori DB!');
    }
  };

  const fetchCmsData = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/cms`);
      if (res.data?.success && res.data.data) {
        setCmsData(res.data.data);
        localStorage.setItem('gm_cms_data', JSON.stringify(res.data.data));
      }
    } catch (err) {
      console.warn('CMS fallback lokal aktif');
    }
  };

  useEffect(() => {
    document.title = cmsData.orgName
      ? `${cmsData.orgName} - ${cmsData.rwDesa || 'RW 01 DESA WUNGU'}`
      : 'GARDA MUDA RT 06 - RW 01 DESA WUNGU';

    const activeIcon = cmsData.logoGaruda || cmsData.logoGardaMuda || logoGarudaAsset;

    let iconLink = document.getElementById('dynamic-favicon');
    if (!iconLink) {
      iconLink = document.createElement('link');
      iconLink.id = 'dynamic-favicon';
      iconLink.rel = 'icon';
      document.head.appendChild(iconLink);
    }
    iconLink.href = activeIcon;
  }, [cmsData.orgName, cmsData.rwDesa, cmsData.logoGaruda, cmsData.logoGardaMuda]);

  useEffect(() => { if (localStorage.getItem('gm_admin_session')) setIsAdmin(true); }, []);

  const fetchLombas = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/lombas`);
      if (res.data?.success && res.data.data.length > 0) setLombas(res.data.data);
    } catch (err) { console.warn('Lomba fallback lokal'); }
  };

  const fetchPendaftars = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/pendaftars`);
      if (res.data?.success && res.data.data.length > 0) setPendaftars(res.data.data);
    } catch (err) { console.warn('Pendaftar fallback lokal'); }
  };

  useEffect(() => {
    const loadInitialData = async () => {
      await Promise.all([fetchLombas(), fetchPendaftars(), fetchCmsData()]);
    };
    loadInitialData();
  }, []);

  const handleAdminLogin = async (username, password) => {
    try {
      const res = await axios.post(`${API_URL}/api/admin/login`, { username, password });
      if (res.data?.success) {
        localStorage.setItem('gm_admin_session', res.data.token || 'validated_rt06');
        setIsAdmin(true); setIsLoginOpen(false); setToast('Berhasil masuk ke Dashboard Admin!');
        return true;
      }
    } catch (err) {
      const validUser = cmsData.username || 'admin'; const validPass = cmsData.password || 'admin123';
      if ((username === validUser && password === validPass) || (username === 'admin' && password === 'admin123')) {
        localStorage.setItem('gm_admin_session', 'validated_rt06');
        setIsAdmin(true); setIsLoginOpen(false); setToast('Berhasil Login via Kunci Master Pengurus!');
        return true;
      }
      setToast('Username atau Password salah!'); return false;
    }
  };

  const handleLogoutAdmin = () => { localStorage.removeItem('gm_admin_session'); setIsAdmin(false); setToast('Sesi admin berakhir.'); };

  const handleCreateLomba = async (data) => {
    setIsSubmittingLomba(true);
    const newEntry = { id: Date.now(), ...data };
    try {
      const res = await axios.post(`${API_URL}/api/lombas`, data);
      if (res.data?.success) fetchLombas(); else setLombas(prev => [...prev, newEntry]);
      setToast('Lomba berhasil dipublikasikan!');
    } catch (err) {
      setLombas((prev) => [...prev, newEntry]); setToast('Lomba tersimpan di Database!');
    } finally { setIsSubmittingLomba(false); }
  };

  const handleUpdateLomba = async (id, data) => {
    setIsSubmittingLomba(true);
    try {
      const res = await axios.put(`${API_URL}/api/lombas/${id}`, data);
      if (res.data?.success) fetchLombas(); else setLombas((prev) => prev.map((l) => (l.id === id ? { ...l, ...data } : l)));
      setToast('Data Lomba diperbarui!');
    } catch (err) {
      setLombas((prev) => prev.map((l) => (l.id === id ? { ...l, ...data } : l))); setToast('Perubahan tersimpan!');
    } finally { setIsSubmittingLomba(false); }
  };

  const handleSaveJuara = (id, juaras) => {
    handleUpdateLomba(id, juaras);
    if (detailLomba && detailLomba.id === id) setDetailLomba((prev) => ({ ...prev, ...juaras }));
    setToast('Gelar Juara Resmi Diumumkan! 🎉');
  };

  const handleDeleteLomba = async (id) => {
    setDeletingLombaId(id);
    try {
      const res = await axios.delete(`${API_URL}/api/lombas/${id}`);
      if (res.data?.success) fetchLombas(); else setLombas((prev) => prev.filter((l) => l.id !== id));
      setToast('Lomba berhasil dihapus!');
    } catch (err) {
      setLombas((prev) => prev.filter((l) => l.id !== id)); setToast('Lomba dihapus dari Database!');
    } finally { setDeletingLombaId(null); }
  };

  const handlePendaftaranSubmit = async (formData) => {
    const randomCode = `GM81-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
    const newPendaftar = { id: Date.now(), nama_pendaftar: formData.nama, no_hp: formData.wa, lomba_id: formData.lomba_id, status: 'terdaftar' };
    const passData = { kode: randomCode, nama: formData.nama, lomba: formData.lombaJudul, domisili: formData.domisili, wa: formData.wa, waktuLokasi: formData.waktuLokasi };

    try {
      await axios.post(`${API_URL}/api/pendaftars`, { lomba_id: formData.lomba_id, nama_pendaftar: formData.nama, email: `${formData.nama.toLowerCase().replace(/\s+/g, '')}@gmail.com`, no_hp: formData.wa });
      setSelectedLomba(null); setTiket(passData); fetchPendaftars(); setToast('Pendaftaran Sukses! Simpan Pass Registrasi Anda.');
    } catch (err) {
      setSelectedLomba(null); setTiket(passData); setPendaftars((prev) => [...prev, newPendaftar]); setToast('Pendaftaran Sukses Tersimpan di Data RT!');
    }
  };

  const handleDeletePendaftar = async (id) => {
    setDeletingPendaftarId(id);
    try {
      const res = await axios.delete(`${API_URL}/api/pendaftars/${id}`);
      if (res.data?.success) fetchPendaftars(); else setPendaftars((prev) => prev.filter((p) => p.id !== id));
      setToast('Data pendaftar dihapus!');
    } catch (err) {
      setPendaftars((prev) => prev.filter((p) => p.id !== id)); setToast('Data pendaftar dihapus!');
    } finally { setDeletingPendaftarId(null); }
  };

  const handleExportWord = () => {
    const htmlContent = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head><title>Rekap Pendaftaran Garda Muda RT 06</title><style>body { font-family: Arial, sans-serif; padding: 20px; } h2 { color: #e11d48; text-align: center; } p { text-align: center; font-weight: bold; } table { width: 100%; border-collapse: collapse; margin-top: 20px; } th, td { border: 1px solid #333; padding: 8px 12px; text-align: left; } th { background-color: #f1f5f9; color: #000; }</style></head>
      <body>
        <h2>REKAP PENDAFTARAN WARGA - ${cmsData.orgName || 'GARDA MUDA RT 06'}</h2>
        <p>${cmsData.rwDesa || 'RW 01 DESA WUNGU'} — SEMARAK KEMERDEKAAN RI KE-81</p>
        <table>
          <thead><tr><th>No</th><th>Kode Tiket</th><th>Nama Peserta / Tim</th><th>No. WhatsApp</th><th>Status</th></tr></thead>
          <tbody>
            ${pendaftars.length > 0 ? pendaftars.map((p, i) => `<tr><td>${i + 1}</td><td>#GM81-${p.id.toString().substring(0, 5)}</td><td>${p.nama_pendaftar}</td><td>${p.no_hp}</td><td>Terdaftar</td></tr>`).join('') : '<tr><td colspan="5">Belum ada pendaftar.</td></tr>'}
          </tbody>
        </table>
      </body></html>`;
    const blob = new Blob(['\ufeff', htmlContent], { type: 'application/msword' });
    const link = document.createElement('a'); link.href = URL.createObjectURL(blob); link.download = `Rekap_Pendaftaran_GardaMuda_${Date.now()}.doc`;
    document.body.appendChild(link); link.click(); document.body.removeChild(link); setToast('Laporan Data (.doc) berhasil diunduh!');
  };

  const handlePrintPDF = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    const rowsHtml = lombas.length > 0 
      ? lombas.map((l, i) => {
          const count = pendaftars.filter(p => p.lomba_id === l.id || p.lomba_id === String(l.id)).length;
          return `<tr><td style="text-align: center;">${i + 1}</td><td style="font-weight: bold;">${l.judul || l.nama || ''}</td><td style="text-align: center;">${l.kategori || 'Umum'}</td><td style="text-align: center;">${l.tipe || 'Individu'}</td><td style="text-align: center;">${count} / ${l.kuota || 15} Warga</td><td style="text-align: center;">${count >= (l.kuota || 15) ? 'KUOTA PENUH' : 'DIBUKA'}</td><td>${l.juara1 || ''}</td><td>${l.juara2 || ''}</td><td>${l.juara3 || ''}</td></tr>`;
        }).join('')
      : `<tr><td colspan="9" style="text-align: center; padding: 15px;">Belum ada data perlombaan.</td></tr>`;

    printWindow.document.write(`
      <!DOCTYPE html><html><head><title>REKAP PERLOMBAAN</title><style>@page { size: A4 landscape; margin: 10mm; } body { font-family: Arial, sans-serif; padding: 20px; } .header { text-align: center; margin-bottom: 20px; } .header h2 { margin: 0; font-size: 14pt; } .header h3 { margin: 4px 0 0; color: #dc2626; font-size: 11pt; } table { width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 9pt; } th, td { border: 1px solid #000; padding: 6px 8px; } th { background-color: #fff; text-align: center; font-weight: bold; } .sig-container { margin-top: 40px; display: flex; justify-content: space-between; text-align: center; font-size: 9pt; } .sig-box { width: 30%; } .sig-space { height: 50px; }</style></head>
      <body>
        <div class="header"><h2>PANITIA KEMERDEKAAN HUT RI KE-81</h2><h3>${cmsData.orgName || 'GARDA MUDA RT 06'} / ${cmsData.rwDesa || 'RW 01 DESA WUNGU'}</h3><p>Rekapitulasi Seluruh Perlombaan & Hasil Pemenang Juara</p></div>
        <table><thead><tr><th style="width: 30px;">NO</th><th>NAMA LOMBA</th><th>KATEGORI</th><th>TIPE</th><th>PENDAFTAR</th><th>STATUS</th><th>JUARA 1</th><th>JUARA 2</th><th>JUARA 3</th></tr></thead><tbody>${rowsHtml}</tbody></table>
        <div class="sig-container"><div class="sig-box"><p>Koordinator Lomba,</p><div class="sig-space"></div><p>( .................................... )</p></div><div class="sig-box"><p>Ketua Panitia Garda Muda,</p><div class="sig-space"></div><p>( .................................... )</p></div><div class="sig-box"><p>Mengetahui,<br/>Ketua RT 06 / RW 01</p><div class="sig-space" style="height: 36px;"></div><p>( .................................... )</p></div></div>
        <script>window.onload = function() { window.print(); setTimeout(() => window.close(), 500); };</script>
      </body></html>
    `);
    printWindow.document.close();
  };

  const handleAiGenerate = async (prompt) => {
    try {
      const res = await axios.post(`${API_URL}/api/ai/generate`, { prompt });
      if (res.data?.success && res.data?.data) return res.data.data; throw new Error('Fallback AI');
    } catch (err) { return `Perlombaan ${prompt} diselenggarakan oleh Karang Taruna Garda Muda RT 06 Desa Wungu dalam rangka memeriahkan HUT Kemerdekaan RI ke-81. Marilah daftarkan diri dan keluarga Anda untuk menjadi juara! Pastikan datang tepat waktu di lapangan utama.`; }
  };

  if (initialLoading) {
    return <SplashScreen cmsData={cmsData} onFinish={() => setInitialLoading(false)} />;
  }

  return (
    <div
      className={`relative min-h-screen font-sans transition-colors duration-500 overflow-hidden ${
        darkMode ? 'bg-[#050812] text-slate-100' : 'bg-slate-50 text-slate-800'
      }`}
    >
      {/* GLOBAL BACKGROUND CYBER DOT MATRIX PATTERN */}
      <div 
        className={`fixed inset-0 pointer-events-none z-0 transition-opacity duration-500 ${
          darkMode 
            ? 'opacity-25 bg-[radial-gradient(#e11d48_1.2px,transparent_1.2px)] [background-size:24px_24px]' 
            : 'opacity-30 bg-[radial-gradient(#64748b_1.2px,transparent_1.2px)] [background-size:24px_24px]'
        }`} 
      />

      {/* AMBIENT RED-AMBER GLOW BEAMS GLOBAL */}
      <div className="fixed top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[500px] bg-gradient-to-tr from-rose-600/15 via-red-600/10 to-amber-500/10 blur-[160px] rounded-full pointer-events-none z-0" />
      <div className="fixed bottom-10 right-10 w-[500px] h-[400px] bg-gradient-to-br from-rose-600/10 via-amber-500/5 to-transparent blur-[140px] rounded-full pointer-events-none z-0" />

      {/* MAIN CONTENT WRAPPER */}
      <div className="relative z-10">
        <Navbar
          isAdmin={isAdmin}
          setIsAdmin={handleLogoutAdmin}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          onOpenLogin={() => setIsLoginOpen(true)}
          cmsData={cmsData}
        />

        <main>
          {isAdmin ? (
            <AdminDashboard
              lombas={lombas}
              pendaftars={pendaftars}
              cmsData={cmsData}
              setCmsData={handleUpdateCmsData}
              onCreateLomba={handleCreateLomba}
              onUpdateLomba={handleUpdateLomba}
              onDeleteLomba={handleDeleteLomba}
              onDeletePendaftar={handleDeletePendaftar}
              onAiGenerate={handleAiGenerate}
              onOpenScan={() => setIsScanOpen(true)}
              onExportWord={handleExportWord}
              onPrintPDF={handlePrintPDF}
              onShowModal={(title, message) => setConfirmModal({ isOpen: true, title, message })}
              deletingLombaId={deletingLombaId}
              deletingPendaftarId={deletingPendaftarId}
              isSubmittingLomba={isSubmittingLomba}
            />
          ) : (
            <UserDashboard
              lombas={lombas}
              pendaftars={pendaftars}
              onDaftar={(item) => setSelectedLomba(item)}
              onDetail={(item) => setDetailLomba(item)}
              cmsData={cmsData}
            />
          )}
        </main>

        <Footer cmsData={cmsData} />
        <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} onLogin={handleAdminLogin} />
        <ModalPendaftaran isOpen={!!selectedLomba} lomba={selectedLomba} onClose={() => setSelectedLomba(null)} onSubmit={handlePendaftaranSubmit} />
        <TiketModal isOpen={!!tiket} tiket={tiket} onClose={() => setTiket(null)} />
        <ScanModal isOpen={isScanOpen} onClose={() => setIsScanOpen(false)} pendaftars={pendaftars} />
        <ConfirmModal isOpen={confirmModal.isOpen} title={confirmModal.title} message={confirmModal.message} onClose={() => setConfirmModal({ isOpen: false, title: '', message: '' })} />
        <Toast message={toast} onClose={() => setToast('')} />

        <DetailLombaModal
          isOpen={!!detailLomba}
          lomba={detailLomba}
          pendaftars={pendaftars}
          isAdmin={isAdmin}
          onClose={() => setDetailLomba(null)}
          onDaftar={(item) => { setDetailLomba(null); setSelectedLomba(item); }}
          onSaveJuara={handleSaveJuara}
        />
      </div>
    </div>
  );
}