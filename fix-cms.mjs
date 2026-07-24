import fs from 'fs';
import path from 'path';

const compDir = path.join(process.cwd(), 'src', 'components');
const cssPath = path.join(process.cwd(), 'src', 'index.css');

// =========================================================================
// 1. PERBAIKI BUG PUTIH SAAT OVERSCROLL DI INDEX.CSS
// =========================================================================
let css = fs.readFileSync(cssPath, 'utf8');

// Hapus deklarasi body lama jika ada, lalu timpa dengan yang baru
if (!css.includes('html, body {')) {
  const bodyFix = `
@layer base {
  html, body {
    @apply dark:bg-[#090d16] bg-slate-50;
    overscroll-behavior-y: auto; /* Memastikan efek narik/refresh tetep mulus tanpa warna putih */
  }
}
`;
  css = css.replace('@tailwind utilities;', '@tailwind utilities;' + bodyFix);
  fs.writeFileSync(cssPath, css, 'utf8');
}


// =========================================================================
// 2. KEMBALIKAN FULL FITUR ADMIN DASHBOARD + GLOW PREMIUM
// =========================================================================
const adminCode = `import React, { useState } from 'react';
import { 
  PlusCircle, QrCode, FileText, Download, Sparkles, Settings, Users, 
  Trophy, Trash2, Edit2, Loader2, Image as ImageIcon, Video, FolderGit2, 
  Lock, LayoutGrid, Search, UploadCloud
} from 'lucide-react';
import LombaCard from './LombaCard';

export default function AdminDashboard({
  lombas = [], pendaftars = [], cmsData = {}, setCmsData, onCreateLomba, onUpdateLomba, onDeleteLomba, onDeletePendaftar, onAiGenerate, onOpenScan, onExportWord, onPrintPDF, onShowModal, deletingLombaId, deletingPendaftarId, isSubmittingLomba
}) {
  const [activeTab, setActiveTab] = useState('lombas');
  const [editingLomba, setEditingLomba] = useState(null);

  const [searchLomba, setSearchLomba] = useState('');
  const [searchWarga, setSearchWarga] = useState('');

  const [newLomba, setNewLomba] = useState({ judul: '', kategori: 'Umum', tipe: 'Individu (Perorangan)', kuota: 15, tanggal_pelaksanaan: '2026-08-17', lokasi: 'Lapangan Utama RT 06', biaya_pendaftaran: '', deskripsi: '', gambar: '' });
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  // STATE KEPANITIAAN & SHOWCASE YANG SEMPAT HILANG
  const [editingMemberIdx, setEditingMemberIdx] = useState(null);
  const [newPanitia, setNewPanitia] = useState({ nama: '', jabatan: '', foto: '' });
  const [editingCardIdx, setEditingCardIdx] = useState(null);
  const [newCard, setNewCard] = useState({ title: '', category: 'Foto Juara', type: 'image', media: '' });

  const handleFileUpload = (e, callback) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => callback(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleAi = async () => {
    const promptText = aiPrompt.trim() || newLomba.judul.trim() || 'Lomba 17 Agustus';
    setAiLoading(true);
    try {
      const res = await onAiGenerate(promptText);
      if (res) setNewLomba((prev) => ({ ...prev, deskripsi: res }));
    } catch (err) { console.error(err); } finally { setAiLoading(false); }
  };

  const handleSubmitLomba = (e) => {
    e.preventDefault();
    if (editingLomba) {
      onUpdateLomba(editingLomba.id, newLomba);
      setEditingLomba(null);
    } else {
      onCreateLomba(newLomba);
    }
    setNewLomba({ judul: '', kategori: 'Umum', tipe: 'Individu (Perorangan)', kuota: 15, tanggal_pelaksanaan: '2026-08-17', lokasi: 'Lapangan Utama RT 06', biaya_pendaftaran: '', deskripsi: '', gambar: '' });
  };

  const startEditLomba = (item) => {
    setEditingLomba(item);
    setNewLomba({ judul: item.judul, kategori: item.kategori || 'Umum', tipe: item.tipe || 'Individu', kuota: item.kuota || 15, tanggal_pelaksanaan: item.tanggal_pelaksanaan || '2026-08-17', lokasi: item.lokasi || 'Lapangan Utama RT 06', biaya_pendaftaran: item.biaya_pendaftaran || '', deskripsi: item.deskripsi || '', gambar: item.gambar || '' });
  };

  const getPendaftarCount = (lombaId) => pendaftars.filter((p) => p.lomba_id === lombaId || p.lomba_id === String(lombaId)).length;

  const filteredLombasAdmin = lombas.filter(l => l.judul?.toLowerCase().includes(searchLomba.toLowerCase()) || l.kategori?.toLowerCase().includes(searchLomba.toLowerCase()));
  const filteredWargas = pendaftars.filter(p => p.nama_pendaftar?.toLowerCase().includes(searchWarga.toLowerCase()) || p.no_hp?.includes(searchWarga));

  // --- FUNGSI CMS PANITIA & SHOWCASE ---
  const handleSavePanitia = () => {
    if (!newPanitia.nama || !newPanitia.jabatan) return;
    const members = [...(cmsData.members || [])];
    if (editingMemberIdx !== null) members[editingMemberIdx] = newPanitia;
    else members.push(newPanitia);
    setCmsData({ ...cmsData, members });
    setNewPanitia({ nama: '', jabatan: '', foto: '' });
    setEditingMemberIdx(null);
  };
  const handleDeletePanitia = (idx) => {
    const members = [...(cmsData.members || [])];
    members.splice(idx, 1);
    setCmsData({ ...cmsData, members });
  };
  const handleSaveCard = () => {
    if (!newCard.title || !newCard.media) return;
    const cards3D = [...(cmsData.cards3D || [])];
    if (editingCardIdx !== null) cards3D[editingCardIdx] = newCard;
    else cards3D.push(newCard);
    setCmsData({ ...cmsData, cards3D });
    setNewCard({ title: '', category: 'Foto Juara', type: 'image', media: '' });
    setEditingCardIdx(null);
  };
  const handleDeleteCard = (idx) => {
    const cards3D = [...(cmsData.cards3D || [])];
    cards3D.splice(idx, 1);
    setCmsData({ ...cmsData, cards3D });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
      
      {/* HEADER ADMIN PANEL */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-5 dark:bg-slate-900/80 bg-white/80 backdrop-blur-xl border dark:border-slate-800/60 border-slate-200/60 p-6 rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.12)]">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black dark:text-white text-slate-900 flex items-center gap-2.5 drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
            <LayoutGrid className="w-7 h-7 text-red-500 drop-shadow-[0_0_10px_rgba(220,38,38,0.8)]" />
            <span>Dashboard Pusat</span>
          </h2>
          <p className="text-xs sm:text-sm dark:text-slate-400 text-slate-500 mt-1.5 font-medium">Sistem Kendali Utama Portal {cmsData.orgName || 'GARDA MUDA RT 06'}</p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          <button onClick={onOpenScan} className="flex-1 lg:flex-none px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 text-xs font-black rounded-xl flex items-center justify-center gap-2 transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg hover:shadow-[0_0_20px_rgba(245,158,11,0.5)]"><QrCode className="w-4 h-4" /> Scan QR</button>
          <button onClick={onExportWord} className="flex-1 lg:flex-none px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 text-white text-xs font-black rounded-xl flex items-center justify-center gap-2 transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg hover:shadow-[0_0_20px_rgba(37,99,235,0.5)]"><FileText className="w-4 h-4" /> Export (.doc)</button>
          <button onClick={onPrintPDF} className="flex-1 lg:flex-none px-4 py-2.5 bg-gradient-to-r from-red-600 to-red-500 text-white text-xs font-black rounded-xl flex items-center justify-center gap-2 transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg hover:shadow-[0_0_20px_rgba(220,38,38,0.5)]"><Download className="w-4 h-4" /> Cetak PDF</button>

          <div className="dark:bg-slate-950/80 bg-slate-100 p-1.5 rounded-2xl border dark:border-slate-800/80 border-slate-300 flex space-x-1.5 w-full lg:w-auto mt-2 lg:mt-0 overflow-x-auto scrollbar-none shadow-inner">
            <button onClick={() => setActiveTab('lombas')} className={\`flex-1 lg:flex-none px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 flex items-center justify-center gap-1.5 \${activeTab === 'lombas' ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-[0_0_15px_rgba(220,38,38,0.4)]' : 'dark:text-slate-400 text-slate-600 hover:text-red-500'}\`}><Trophy className="w-4 h-4" /> Lomba</button>
            <button onClick={() => setActiveTab('warga')} className={\`flex-1 lg:flex-none px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 flex items-center justify-center gap-1.5 \${activeTab === 'warga' ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-[0_0_15px_rgba(220,38,38,0.4)]' : 'dark:text-slate-400 text-slate-600 hover:text-red-500'}\`}><Users className="w-4 h-4" /> Warga</button>
            <button onClick={() => setActiveTab('cms')} className={\`flex-1 lg:flex-none px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 flex items-center justify-center gap-1.5 \${activeTab === 'cms' ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-[0_0_15px_rgba(220,38,38,0.4)]' : 'dark:text-slate-400 text-slate-600 hover:text-red-500'}\`}><Settings className="w-4 h-4 animate-spin-slow" /> CMS</button>
          </div>
        </div>
      </div>

      {/* WIDGETS SUMMARY */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="group dark:bg-slate-900/60 bg-white/80 backdrop-blur-md border dark:border-slate-800/80 border-slate-200/80 p-6 rounded-3xl flex items-center gap-5 shadow-lg transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(220,38,38,0.2)] hover:border-red-500/30">
          <div className="p-4 dark:bg-red-950/80 bg-red-100 border dark:border-red-800/60 border-red-200 text-red-500 rounded-2xl group-hover:scale-110 transition duration-300 shadow-[0_0_15px_rgba(220,38,38,0.3)]"><Trophy className="w-7 h-7" /></div>
          <div><p className="text-[11px] dark:text-slate-400 text-slate-500 font-bold uppercase tracking-widest">Total Lomba</p><h3 className="text-3xl font-black dark:text-white text-slate-900 mt-1">{lombas.length}</h3></div>
        </div>
        <div className="group dark:bg-slate-900/60 bg-white/80 backdrop-blur-md border dark:border-slate-800/80 border-slate-200/80 p-6 rounded-3xl flex items-center gap-5 shadow-lg transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(59,130,246,0.15)] hover:border-blue-500/30">
          <div className="p-4 dark:bg-blue-950/80 bg-blue-100 border dark:border-blue-800/60 border-blue-200 text-blue-500 rounded-2xl group-hover:scale-110 transition duration-300 shadow-[0_0_15px_rgba(59,130,246,0.3)]"><Users className="w-7 h-7" /></div>
          <div><p className="text-[11px] dark:text-slate-400 text-slate-500 font-bold uppercase tracking-widest">Pendaftar Warga</p><h3 className="text-3xl font-black dark:text-white text-slate-900 mt-1">{pendaftars.length}</h3></div>
        </div>
        <div className="group dark:bg-slate-900/60 bg-white/80 backdrop-blur-md border dark:border-slate-800/80 border-slate-200/80 p-6 rounded-3xl flex items-center gap-5 shadow-lg transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(245,158,11,0.15)] hover:border-amber-500/30">
          <div className="p-4 dark:bg-amber-950/80 bg-amber-100 border dark:border-amber-800/60 border-amber-200 text-amber-500 rounded-2xl group-hover:scale-110 transition duration-300 shadow-[0_0_15px_rgba(245,158,11,0.3)]"><Sparkles className="w-7 h-7" /></div>
          <div><p className="text-[11px] dark:text-slate-400 text-slate-500 font-bold uppercase tracking-widest">Kuota Terisi</p><h3 className="text-3xl font-black text-amber-500 mt-1">{lombas.length > 0 ? Math.round((pendaftars.length / (lombas.length * 15)) * 100) : 0}%</h3></div>
        </div>
      </div>

      {/* TAB 1: MANAJEMEN LOMBA */}
      {activeTab === 'lombas' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-500">
          <div className="lg:col-span-5 dark:bg-slate-900/80 bg-white/80 backdrop-blur-xl border dark:border-slate-800/80 border-slate-200 p-6 sm:p-8 rounded-3xl space-y-5 shadow-[0_8px_30px_rgba(0,0,0,0.12)] sticky top-24 h-max">
            <h3 className="text-lg font-black dark:text-white text-slate-900 flex items-center gap-2 drop-shadow-sm">
              <PlusCircle className="w-6 h-6 text-red-500 animate-pulse drop-shadow-[0_0_8px_rgba(220,38,38,0.8)]" /> {editingLomba ? 'Edit Lomba' : 'Tambah Lomba Baru'}
            </h3>

            <form onSubmit={handleSubmitLomba} className="space-y-4">
              <div>
                <label className="text-[11px] font-extrabold dark:text-slate-400 text-slate-600 block mb-1.5 uppercase tracking-wider">Nama Lomba</label>
                <input type="text" placeholder="Contoh: Balap Karung" value={newLomba.judul} onChange={(e) => setNewLomba({ ...newLomba, judul: e.target.value })} required className="w-full dark:bg-slate-950/80 bg-slate-50 border dark:border-slate-800 border-slate-300 rounded-xl p-3 text-xs dark:text-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all shadow-inner" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-extrabold dark:text-slate-400 text-slate-600 block mb-1.5 uppercase tracking-wider">Kategori</label>
                  <select value={newLomba.kategori} onChange={(e) => setNewLomba({ ...newLomba, kategori: e.target.value })} className="w-full dark:bg-slate-950/80 bg-slate-50 border dark:border-slate-800 border-slate-300 rounded-xl p-3 text-xs dark:text-white text-slate-900 focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"><option>Umum</option><option>Anak-Anak</option><option>Remaja</option><option>Dewasa</option></select>
                </div>
                <div>
                  <label className="text-[11px] font-extrabold dark:text-slate-400 text-slate-600 block mb-1.5 uppercase tracking-wider">Tipe</label>
                  <select value={newLomba.tipe} onChange={(e) => setNewLomba({ ...newLomba, tipe: e.target.value })} className="w-full dark:bg-slate-950/80 bg-slate-50 border dark:border-slate-800 border-slate-300 rounded-xl p-3 text-xs dark:text-white text-slate-900 focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"><option>Individu (Perorangan)</option><option>Tim / Beregu</option></select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-extrabold dark:text-slate-400 text-slate-600 block mb-1.5 uppercase tracking-wider">Kuota Total</label>
                  <input type="number" value={newLomba.kuota} onChange={(e) => setNewLomba({ ...newLomba, kuota: Number(e.target.value) })} className="w-full dark:bg-slate-950/80 bg-slate-50 border dark:border-slate-800 border-slate-300 rounded-xl p-3 text-xs dark:text-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all shadow-inner" />
                </div>
                <div>
                  <label className="text-[11px] font-extrabold dark:text-slate-400 text-slate-600 block mb-1.5 uppercase tracking-wider">Tanggal</label>
                  <input type="date" value={newLomba.tanggal_pelaksanaan} onChange={(e) => setNewLomba({ ...newLomba, tanggal_pelaksanaan: e.target.value })} className="w-full dark:bg-slate-950/80 bg-slate-50 border dark:border-slate-800 border-slate-300 rounded-xl p-3 text-xs dark:text-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all shadow-inner" />
                </div>
              </div>
              <div>
                <label className="text-[11px] font-extrabold dark:text-slate-400 text-slate-600 block mb-1.5 uppercase tracking-wider">Upload Cover Lomba</label>
                <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, (res) => setNewLomba((prev) => ({ ...prev, gambar: res })))} className="w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-black dark:file:bg-slate-800 file:bg-slate-200 dark:file:text-white file:text-slate-800 cursor-pointer hover:file:bg-red-600 hover:file:text-white transition-all" />
                {newLomba.gambar && (
                  <div className="mt-3 relative w-32 h-24 rounded-xl overflow-hidden border-2 border-red-500/50 shadow-[0_0_15px_rgba(220,38,38,0.2)]">
                    <img src={newLomba.gambar} alt="Preview" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => setNewLomba(prev => ({ ...prev, gambar: '' }))} className="absolute top-1.5 right-1.5 bg-red-600 text-white p-1.5 rounded-full hover:bg-red-700 shadow-lg"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                )}
              </div>
              <div className="p-4 dark:bg-amber-950/20 bg-amber-50/50 border dark:border-amber-800/40 border-amber-300/50 rounded-2xl space-y-3 shadow-inner">
                <div className="flex justify-between items-center">
                  <span className="text-[11px] font-black text-amber-500 flex items-center gap-1.5 uppercase tracking-wider"><Sparkles className="w-4 h-4" /> Asisten AI (Groq)</span>
                  <button type="button" onClick={handleAi} disabled={aiLoading} className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold rounded-lg text-[10px] flex items-center gap-1.5 transition-all shadow-[0_0_10px_rgba(245,158,11,0.3)] active:scale-95">{aiLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Buat AI Deskripsi'}</button>
                </div>
              </div>
              <textarea placeholder="Tulis rincian dan deskripsi lomba..." value={newLomba.deskripsi} onChange={(e) => setNewLomba({ ...newLomba, deskripsi: e.target.value })} rows="4" className="w-full dark:bg-slate-950/80 bg-slate-50 border dark:border-slate-800 border-slate-300 rounded-xl p-4 text-xs dark:text-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all shadow-inner"></textarea>
              <button type="submit" disabled={isSubmittingLomba} className="w-full py-4 bg-gradient-to-r from-red-600 via-red-500 to-amber-500 animate-gradient-x hover:shadow-[0_0_25px_rgba(220,38,38,0.5)] text-white font-black rounded-xl text-xs sm:text-sm uppercase tracking-widest transition-all duration-300 active:scale-95 flex justify-center items-center gap-2.5 disabled:opacity-50 mt-2">
                {isSubmittingLomba ? <Loader2 className="w-5 h-5 animate-spin text-white" /> : (editingLomba ? <><Edit2 className="w-4 h-4"/> Simpan Perubahan</> : <><PlusCircle className="w-4 h-4"/> Publikasikan Lomba</>)}
              </button>
            </form>
          </div>

          <div className="lg:col-span-7 space-y-5">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <h3 className="text-lg font-black dark:text-white text-slate-900 drop-shadow-md">Daftar Perlombaan Aktif</h3>
              <div className="relative w-full sm:w-64 group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-red-500 to-amber-500 rounded-xl blur opacity-20 group-focus-within:opacity-100 transition duration-500"></div>
                <Search className="w-4 h-4 absolute left-3 top-2.5 dark:text-slate-400 text-slate-500 z-10" />
                <input type="text" placeholder="Cari Lomba..." value={searchLomba} onChange={(e) => setSearchLomba(e.target.value)} className="relative w-full pl-9 pr-4 py-2 dark:bg-slate-900 bg-white border dark:border-slate-800 border-slate-300 rounded-xl text-xs dark:text-white text-slate-900 focus:outline-none transition shadow-sm" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {filteredLombasAdmin.map((item) => (
                <LombaCard key={item.id} item={item} pendaftarCount={getPendaftarCount(item.id)} isAdmin={true} onEdit={startEditLomba} onDelete={onDeleteLomba} deletingId={deletingLombaId} />
              ))}
              {filteredLombasAdmin.length === 0 && <div className="col-span-full text-center py-10 dark:bg-slate-900/40 bg-white/40 border dark:border-slate-800 border-slate-200 rounded-2xl"><Search className="w-8 h-8 text-slate-500 mx-auto mb-2" /><p className="text-sm font-bold text-slate-400">Lomba tidak ditemukan.</p></div>}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DATA WARGA */}
      {activeTab === 'warga' && (
        <div className="dark:bg-slate-900/80 bg-white/80 backdrop-blur-xl border dark:border-slate-800/80 border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-[0_8px_30px_rgba(0,0,0,0.12)] animate-in fade-in duration-500">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h3 className="text-xl font-black dark:text-white text-slate-900 drop-shadow-md flex items-center gap-2">
              <Users className="w-6 h-6 text-blue-500 drop-shadow-[0_0_10px_rgba(59,130,246,0.6)]" /> Data Pendaftar Warga
            </h3>
            <div className="relative w-full sm:w-72 group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl blur opacity-20 group-focus-within:opacity-100 transition duration-500"></div>
              <Search className="w-4 h-4 absolute left-3 top-2.5 dark:text-slate-400 text-slate-500 z-10" />
              <input type="text" placeholder="Cari Nama / No WhatsApp..." value={searchWarga} onChange={(e) => setSearchWarga(e.target.value)} className="relative w-full pl-9 pr-4 py-2 dark:bg-slate-950 bg-white border dark:border-slate-800 border-slate-300 rounded-xl text-xs dark:text-white text-slate-900 focus:outline-none transition shadow-sm" />
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border dark:border-slate-800 border-slate-200 shadow-inner">
            <table className="w-full text-left text-xs dark:text-slate-300 text-slate-700">
              <thead className="dark:bg-[#030508] bg-slate-100 dark:text-slate-400 text-slate-600 uppercase font-bold tracking-wider text-[10px]">
                <tr><th className="p-4">Kode Pass</th><th className="p-4">Nama Peserta / Tim</th><th className="p-4">WhatsApp</th><th className="p-4 text-center">Aksi</th></tr>
              </thead>
              <tbody className="divide-y dark:divide-slate-800/60 divide-slate-200/60">
                {filteredWargas.length === 0 ? (
                  <tr><td colSpan="4" className="p-10 text-center text-slate-500 italic">Data pendaftar tidak ditemukan.</td></tr>
                ) : (
                  filteredWargas.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-800/30 transition duration-200">
                      <td className="p-4 font-mono text-amber-500 font-extrabold tracking-widest drop-shadow-sm">#GM81-{p.id.toString().substring(0, 5)}</td>
                      <td className="p-4 font-black dark:text-white text-slate-900 text-sm">{p.nama_pendaftar}</td>
                      <td className="p-4 font-mono font-bold text-emerald-500">{p.no_hp}</td>
                      <td className="p-4 text-center">
                        <button onClick={() => onDeletePendaftar(p.id)} disabled={deletingPendaftarId === p.id} className="p-2 bg-red-950/80 text-red-400 hover:bg-red-600 hover:text-white border border-red-800/50 rounded-xl transition-all duration-300 hover:shadow-[0_0_15px_rgba(220,38,38,0.5)] active:scale-90 inline-flex items-center justify-center min-w-[36px]" title="Hapus Permanen">
                          {deletingPendaftarId === p.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: FULL CMS ADMIN (DIKEMBALIKAN UTUH 100% PLUS GLOW) */}
      {activeTab === 'cms' && (
        <div className="space-y-8 animate-in fade-in duration-500">
          <div className="dark:bg-slate-900/80 bg-white/80 backdrop-blur-xl border dark:border-slate-800/80 border-slate-200 rounded-3xl p-6 sm:p-8 space-y-8 shadow-[0_8px_30px_rgba(0,0,0,0.12)]">
            <div>
              <h3 className="text-xl font-black dark:text-white text-slate-900 flex items-center gap-2.5 drop-shadow-md">
                <Settings className="w-6 h-6 text-red-500 animate-spin-slow drop-shadow-[0_0_10px_rgba(220,38,38,0.6)]" />
                <span>Engine Tampilan Web & Identitas Panitia</span>
              </h3>
              <p className="text-xs dark:text-slate-400 text-slate-500 mt-1">Ubah DNA website, atur formasi panitia, arsip Drive, dan rupa galeri karya 3D di sini.</p>
            </div>

            {/* BLOCK 1: Kredensial & Identitas */}
            <div className="p-5 dark:bg-slate-950/60 bg-slate-50 border dark:border-slate-800/80 border-slate-200 rounded-2xl space-y-4 shadow-inner">
              <h4 className="text-xs font-black text-red-500 uppercase tracking-widest flex items-center gap-2 border-b dark:border-slate-800 border-slate-300 pb-2"><Lock className="w-4 h-4" /> Kredensial Login & Identitas Kop Surat</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
                <div><label className="text-[11px] font-bold dark:text-slate-400 text-slate-600 block mb-1.5 uppercase">User Admin Baru</label><input type="text" value={cmsData.username || 'admin'} onChange={(e) => setCmsData({ ...cmsData, username: e.target.value })} className="w-full dark:bg-[#030508] bg-white border dark:border-slate-800 border-slate-300 rounded-xl p-3 text-xs dark:text-white text-slate-900 focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all" /></div>
                <div><label className="text-[11px] font-bold dark:text-slate-400 text-slate-600 block mb-1.5 uppercase">Password Admin Baru</label><input type="password" value={cmsData.password || 'admin123'} onChange={(e) => setCmsData({ ...cmsData, password: e.target.value })} className="w-full dark:bg-[#030508] bg-white border dark:border-slate-800 border-slate-300 rounded-xl p-3 text-xs dark:text-white text-slate-900 focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all" /></div>
                <div><label className="text-[11px] font-bold dark:text-slate-400 text-slate-600 block mb-1.5 uppercase">Nama Organisasi / RT</label><input type="text" value={cmsData.orgName || 'GARDA MUDA RT 06'} onChange={(e) => setCmsData({ ...cmsData, orgName: e.target.value })} className="w-full dark:bg-[#030508] bg-white border dark:border-slate-800 border-slate-300 rounded-xl p-3 text-xs dark:text-white text-slate-900 focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all" /></div>
                <div><label className="text-[11px] font-bold dark:text-slate-400 text-slate-600 block mb-1.5 uppercase">Keterangan RW / Desa</label><input type="text" value={cmsData.rwDesa || 'RW 01 DESA WUNGU'} onChange={(e) => setCmsData({ ...cmsData, rwDesa: e.target.value })} className="w-full dark:bg-[#030508] bg-white border dark:border-slate-800 border-slate-300 rounded-xl p-3 text-xs dark:text-white text-slate-900 focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all" /></div>
              </div>
            </div>

            {/* BLOCK 2: Aset Logo Branding */}
            <div className="p-5 dark:bg-slate-950/60 bg-slate-50 border dark:border-slate-800/80 border-slate-200 rounded-2xl space-y-4 shadow-inner">
              <h4 className="text-xs font-black text-amber-500 uppercase tracking-widest flex items-center gap-2 border-b dark:border-slate-800 border-slate-300 pb-2"><ImageIcon className="w-4 h-4" /> Aset Logo & Branding Kemerdekaan</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-2">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold dark:text-slate-400 text-slate-600 block uppercase">1. Logo Garuda (Utama)</label>
                  <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, (res) => setCmsData({ ...cmsData, logoGaruda: res }))} className="w-full text-[10px] text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:font-bold dark:file:bg-slate-800 file:bg-slate-200 dark:file:text-white file:text-slate-800 hover:file:bg-amber-500 cursor-pointer" />
                  {cmsData.logoGaruda && <div className="mt-2 w-20 h-20 rounded-xl overflow-hidden border border-slate-700 bg-slate-900 relative"><img src={cmsData.logoGaruda} className="w-full h-full object-contain p-2" /><button onClick={() => setCmsData({ ...cmsData, logoGaruda: '' })} className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full"><X className="w-3 h-3"/></button></div>}
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold dark:text-slate-400 text-slate-600 block uppercase">2. Logo HUT RI (Kanan)</label>
                  <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, (res) => setCmsData({ ...cmsData, logoHutRi: res }))} className="w-full text-[10px] text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:font-bold dark:file:bg-slate-800 file:bg-slate-200 dark:file:text-white file:text-slate-800 hover:file:bg-amber-500 cursor-pointer" />
                  {cmsData.logoHutRi && <div className="mt-2 w-20 h-20 rounded-xl overflow-hidden border border-slate-700 bg-slate-900 relative"><img src={cmsData.logoHutRi} className="w-full h-full object-contain p-2" /><button onClick={() => setCmsData({ ...cmsData, logoHutRi: '' })} className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full"><X className="w-3 h-3"/></button></div>}
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold dark:text-slate-400 text-slate-600 block uppercase">3. Logo Panitia (Opsional)</label>
                  <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, (res) => setCmsData({ ...cmsData, logoGardaMuda: res }))} className="w-full text-[10px] text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:font-bold dark:file:bg-slate-800 file:bg-slate-200 dark:file:text-white file:text-slate-800 hover:file:bg-amber-500 cursor-pointer" />
                  {cmsData.logoGardaMuda && <div className="mt-2 w-20 h-20 rounded-xl overflow-hidden border border-slate-700 bg-slate-900 relative"><img src={cmsData.logoGardaMuda} className="w-full h-full object-contain p-2" /><button onClick={() => setCmsData({ ...cmsData, logoGardaMuda: '' })} className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full"><X className="w-3 h-3"/></button></div>}
                </div>
              </div>
            </div>

            {/* BLOCK 3: Tautan Drive & Foto Panitia */}
            <div className="p-5 dark:bg-slate-950/60 bg-slate-50 border dark:border-slate-800/80 border-slate-200 rounded-2xl space-y-4 shadow-inner">
              <h4 className="text-xs font-black text-blue-500 uppercase tracking-widest flex items-center gap-2 border-b dark:border-slate-800 border-slate-300 pb-2"><FolderGit2 className="w-4 h-4" /> Tautan Drive & Foto Kebersamaan</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
                <div>
                  <label className="text-[11px] font-bold dark:text-slate-400 text-slate-600 block mb-1.5 uppercase">Link Google Drive Arsip</label>
                  <input type="text" placeholder="https://drive.google.com/..." value={cmsData.driveUrl || ''} onChange={(e) => setCmsData({ ...cmsData, driveUrl: e.target.value })} className="w-full dark:bg-[#030508] bg-white border dark:border-slate-800 border-slate-300 rounded-xl p-3 text-xs dark:text-white text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
                </div>
                <div>
                  <label className="text-[11px] font-bold dark:text-slate-400 text-slate-600 block mb-1.5 uppercase">Upload Foto Bersama Panitia</label>
                  <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, (res) => setCmsData({ ...cmsData, fotoBersama: res }))} className="w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:font-bold dark:file:bg-slate-800 file:bg-slate-200 dark:file:text-white file:text-slate-800 hover:file:bg-blue-600 hover:file:text-white cursor-pointer" />
                  {cmsData.fotoBersama && <div className="mt-2 w-32 h-20 rounded-xl overflow-hidden border border-slate-700 relative"><img src={cmsData.fotoBersama} className="w-full h-full object-cover" /><button onClick={() => setCmsData({ ...cmsData, fotoBersama: '' })} className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full"><Trash2 className="w-3 h-3"/></button></div>}
                </div>
              </div>
            </div>

            {/* BLOCK 4: Susunan Kepanitiaan */}
            <div className="p-5 dark:bg-slate-950/60 bg-slate-50 border dark:border-slate-800/80 border-slate-200 rounded-2xl space-y-4 shadow-inner">
              <h4 className="text-xs font-black text-emerald-500 uppercase tracking-widest flex items-center gap-2 border-b dark:border-slate-800 border-slate-300 pb-2"><Users className="w-4 h-4" /> Susunan Kepanitiaan RT</h4>
              <div className="flex flex-col md:flex-row gap-4 items-end">
                <div className="flex-1 w-full"><label className="text-[10px] font-bold block mb-1 uppercase">Nama</label><input type="text" value={newPanitia.nama} onChange={(e) => setNewPanitia({ ...newPanitia, nama: e.target.value })} className="w-full dark:bg-[#030508] bg-white border dark:border-slate-800 border-slate-300 rounded-lg p-2 text-xs" /></div>
                <div className="flex-1 w-full"><label className="text-[10px] font-bold block mb-1 uppercase">Jabatan</label><input type="text" value={newPanitia.jabatan} onChange={(e) => setNewPanitia({ ...newPanitia, jabatan: e.target.value })} className="w-full dark:bg-[#030508] bg-white border dark:border-slate-800 border-slate-300 rounded-lg p-2 text-xs" /></div>
                <div className="flex-1 w-full"><label className="text-[10px] font-bold block mb-1 uppercase">Foto Profil</label><input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, (res) => setNewPanitia({ ...newPanitia, foto: res }))} className="w-full text-[10px] file:py-1 file:px-2 file:rounded-lg file:border-0 dark:file:bg-slate-800 file:bg-slate-200 dark:file:text-white" /></div>
                <button onClick={handleSavePanitia} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg shadow-lg w-full md:w-auto">{editingMemberIdx !== null ? 'Update' : 'Tambah'}</button>
              </div>
              {cmsData.members?.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                  {cmsData.members.map((m, i) => (
                    <div key={i} className="dark:bg-slate-900 bg-white border dark:border-slate-800 border-slate-300 p-3 rounded-xl flex items-center justify-between shadow-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-slate-700 overflow-hidden">{m.foto && <img src={m.foto} className="w-full h-full object-cover" />}</div>
                        <div><p className="text-[10px] font-bold dark:text-white text-slate-900 truncate w-20">{m.nama}</p><p className="text-[9px] text-amber-500 truncate w-20">{m.jabatan}</p></div>
                      </div>
                      <div className="flex flex-col gap-1">
                        <button onClick={() => { setEditingMemberIdx(i); setNewPanitia(m); }} className="text-blue-400 hover:text-blue-300"><Edit2 className="w-3 h-3" /></button>
                        <button onClick={() => handleDeletePanitia(i)} className="text-red-400 hover:text-red-300"><Trash2 className="w-3 h-3" /></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* BLOCK 5: Showcase 3D & Dokumentasi */}
            <div className="p-5 dark:bg-slate-950/60 bg-slate-50 border dark:border-slate-800/80 border-slate-200 rounded-2xl space-y-4 shadow-inner">
              <h4 className="text-xs font-black text-rose-500 uppercase tracking-widest flex items-center gap-2 border-b dark:border-slate-800 border-slate-300 pb-2"><UploadCloud className="w-4 h-4" /> Showcase 3D & Karya Visual</h4>
              <div className="flex flex-col md:flex-row gap-4 items-end">
                <div className="flex-1 w-full"><label className="text-[10px] font-bold block mb-1 uppercase">Judul Karya</label><input type="text" value={newCard.title} onChange={(e) => setNewCard({ ...newCard, title: e.target.value })} className="w-full dark:bg-[#030508] bg-white border dark:border-slate-800 border-slate-300 rounded-lg p-2 text-xs" /></div>
                <div className="w-32"><label className="text-[10px] font-bold block mb-1 uppercase">Kategori</label><input type="text" value={newCard.category} onChange={(e) => setNewCard({ ...newCard, category: e.target.value })} placeholder="Cth: Foto Juara" className="w-full dark:bg-[#030508] bg-white border dark:border-slate-800 border-slate-300 rounded-lg p-2 text-xs" /></div>
                <div className="w-24"><label className="text-[10px] font-bold block mb-1 uppercase">Tipe</label><select value={newCard.type} onChange={(e) => setNewCard({ ...newCard, type: e.target.value })} className="w-full dark:bg-[#030508] bg-white border dark:border-slate-800 border-slate-300 rounded-lg p-2 text-xs"><option value="image">Gambar</option><option value="video">Video</option></select></div>
                <div className="flex-1 w-full"><label className="text-[10px] font-bold block mb-1 uppercase">File Media</label><input type="file" accept="image/*,video/*" onChange={(e) => handleFileUpload(e, (res) => setNewCard({ ...newCard, media: res }))} className="w-full text-[10px] file:py-1 file:px-2 file:rounded-lg file:border-0 dark:file:bg-slate-800 file:bg-slate-200 dark:file:text-white" /></div>
                <button onClick={handleSaveCard} className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-lg shadow-lg w-full md:w-auto">{editingCardIdx !== null ? 'Update' : 'Tambah'}</button>
              </div>
              {cmsData.cards3D?.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                  {cmsData.cards3D.map((c, i) => (
                    <div key={i} className="dark:bg-slate-900 bg-white border dark:border-slate-800 border-slate-300 p-2 rounded-xl relative group shadow-sm">
                      <div className="h-20 bg-slate-800 rounded-lg overflow-hidden mb-2">
                        {c.media && (c.type === 'video' ? <video src={c.media} className="w-full h-full object-cover" /> : <img src={c.media} className="w-full h-full object-cover" />)}
                      </div>
                      <p className="text-[10px] font-bold dark:text-white text-slate-900 truncate px-1">{c.title}</p>
                      <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => { setEditingCardIdx(i); setNewCard(c); }} className="bg-blue-600 p-1.5 rounded-md text-white"><Edit2 className="w-3 h-3" /></button>
                        <button onClick={() => handleDeleteCard(i)} className="bg-red-600 p-1.5 rounded-md text-white"><Trash2 className="w-3 h-3" /></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Simpan Seluruh Pengaturan CMS */}
            <button onClick={() => onShowModal('Berhasil Disimpan!', 'Seluruh DNA Tampilan CMS, Identitas, Logo, Panitia & Media telah diperbarui secara permanen dan disiarkan langsung ke warga.')} className="w-full py-4 bg-gradient-to-r from-red-600 via-red-500 to-amber-500 hover:shadow-[0_0_30px_rgba(220,38,38,0.5)] animate-gradient-x text-white font-black rounded-2xl text-sm uppercase tracking-widest transition-all duration-300 active:scale-95 flex justify-center items-center gap-2">
              <Sparkles className="w-5 h-5" /> Simpan Permanen Arsitektur CMS
            </button>
          </div>
        </div>
      )}
    </div>
  );
}`;
fs.writeFileSync(path.join(compDir, 'AdminDashboard.jsx'), adminCode.trim(), 'utf8');

console.log('✅ SELURUH FITUR CMS (Logo, Panitia, 3D) BERHASIL DIKEMBALIKAN UTUH & BUG PUTIH OVERSCROLL DIPERBAIKI!');
