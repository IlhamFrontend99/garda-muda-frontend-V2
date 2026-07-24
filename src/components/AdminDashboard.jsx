import React, { useState } from 'react';
import { 
  PlusCircle, QrCode, FileText, Download, Sparkles, Settings, Users, 
  Trophy, Trash2, Edit2, Loader2, Image as ImageIcon, Video, FolderGit2, 
  Lock, LayoutGrid, Search, UploadCloud, X, Share2, MessageCircle, CheckSquare, Square, Printer, CheckCircle2, UserCheck,
  Calendar, MapPin, Award, Medal
} from 'lucide-react';

const InstagramIcon = (props) => (
  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const YoutubeIcon = (props) => (
  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
  </svg>
);

export default function AdminDashboard({
  lombas = [], pendaftars = [], cmsData = {}, setCmsData, onCreateLomba, onUpdateLomba, onDeleteLomba, onDeletePendaftar, onAiGenerate, onOpenScan, onExportWord, onPrintPDF, onShowModal, deletingLombaId, deletingPendaftarId, isSubmittingLomba
}) {
  const [activeTab, setActiveTab] = useState('lombas');
  const [editingLomba, setEditingLomba] = useState(null);

  const [searchLomba, setSearchLomba] = useState('');
  const [searchWarga, setSearchWarga] = useState('');
  
  const [activeAbsensiLombaId, setActiveAbsensiLombaId] = useState(() => {
    return lombas.length > 0 ? lombas[0].id : 'all';
  });

  const [newLomba, setNewLomba] = useState({ 
    judul: '', kategori: 'Umum', tipe: 'Individu (Perorangan)', kuota: 15, 
    tanggal_pelaksanaan: '2026-08-17', lokasi: 'Lapangan Utama RT 06', 
    biaya_pendaftaran: '', deskripsi: '', gambar: '', 
    juara1: '', foto_juara1: '',
    juara2: '', foto_juara2: '',
    juara3: '', foto_juara3: '' 
  });

  const [aiPrompt, setAiPrompt] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [isSavingCms, setIsSavingCms] = useState(false);

  const [attendance, setAttendance] = useState({});

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
    } catch (err) { 
      console.error(err); 
    } finally { 
      setAiLoading(false); 
    }
  };

  // HANDLER SUBMIT FULL CRUD DATABASE-READY (LENGKAP FOTO JUARA)
  const handleSubmitLomba = (e) => {
    e.preventDefault();
    
    const payloadLomba = {
      ...newLomba,
      judul: newLomba.judul,
      nama: newLomba.judul,
      kategori: newLomba.kategori,
      tipe: newLomba.tipe,
      kuota: Number(newLomba.kuota) || 15,
      tanggal_pelaksanaan: newLomba.tanggal_pelaksanaan,
      lokasi: newLomba.lokasi,
      deskripsi: newLomba.deskripsi,
      gambar: newLomba.gambar,
      juara1: newLomba.juara1 || '',
      foto_juara1: newLomba.foto_juara1 || '',
      juara2: newLomba.juara2 || '',
      foto_juara2: newLomba.foto_juara2 || '',
      juara3: newLomba.juara3 || '',
      foto_juara3: newLomba.foto_juara3 || ''
    };

    if (editingLomba) {
      if (typeof onUpdateLomba === 'function') {
        onUpdateLomba(editingLomba.id, payloadLomba);
      }
      setEditingLomba(null);
    } else {
      if (typeof onCreateLomba === 'function') {
        onCreateLomba(payloadLomba);
      }
    }

    // Reset Form
    setNewLomba({ 
      judul: '', kategori: 'Umum', tipe: 'Individu (Perorangan)', kuota: 15, 
      tanggal_pelaksanaan: '2026-08-17', lokasi: 'Lapangan Utama RT 06', 
      biaya_pendaftaran: '', deskripsi: '', gambar: '', 
      juara1: '', foto_juara1: '',
      juara2: '', foto_juara2: '',
      juara3: '', foto_juara3: '' 
    });
  };

  // MEMULAI EDIT LOMBA / INPUT JUARA & FOTO
  const startEditLomba = (item) => {
    setEditingLomba(item);
    setNewLomba({ 
      judul: item.judul || item.nama || '', 
      kategori: item.kategori || 'Umum', 
      tipe: item.tipe || 'Individu (Perorangan)', 
      kuota: item.kuota || 15, 
      tanggal_pelaksanaan: item.tanggal_pelaksanaan || item.tanggal || '2026-08-17', 
      lokasi: item.lokasi || 'Lapangan Utama RT 06', 
      biaya_pendaftaran: item.biaya_pendaftaran || '', 
      deskripsi: item.deskripsi || '', 
      gambar: item.gambar || '',
      juara1: item.juara1 || '',
      foto_juara1: item.foto_juara1 || '',
      juara2: item.juara2 || '',
      foto_juara2: item.foto_juara2 || '',
      juara3: item.juara3 || '',
      foto_juara3: item.foto_juara3 || ''
    });
    
    const formElement = document.getElementById('form-lomba-admin');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleGoToPresensi = (lombaId) => {
    setActiveAbsensiLombaId(lombaId);
    setActiveTab('warga');
  };

  const toggleAbsensi = (pendaftarId) => {
    setAttendance((prev) => ({
      ...prev,
      [pendaftarId]: !prev[pendaftarId]
    }));
  };

  const getPendaftarCount = (lombaId) => pendaftars.filter((p) => p.lomba_id === lombaId || p.lomba_id === String(lombaId)).length;

  const filteredLombasAdmin = lombas.filter(l => (l.judul || l.nama)?.toLowerCase().includes(searchLomba.toLowerCase()) || l.kategori?.toLowerCase().includes(searchLomba.toLowerCase()));
  
  const selectedLombaObj = lombas.find(l => String(l.id) === String(activeAbsensiLombaId));

  const pendaftarsCurrentLomba = pendaftars.filter(p => {
    if (activeAbsensiLombaId === 'all') return true;
    return String(p.lomba_id) === String(activeAbsensiLombaId);
  });

  const filteredWargas = pendaftarsCurrentLomba.filter(p => 
    p.nama_pendaftar?.toLowerCase().includes(searchWarga.toLowerCase()) || p.no_hp?.includes(searchWarga)
  );

  const countHadirCurrentLomba = pendaftarsCurrentLomba.filter(p => attendance[p.id] || p.status === 'hadir').length;

  const handlePrintAbsensiLomba = () => {
    const namaLombaJudul = selectedLombaObj ? (selectedLombaObj.judul || selectedLombaObj.nama) : 'SELURUH PERLOMBAAN WARGA';
    const tglLomba = selectedLombaObj ? (selectedLombaObj.tanggal_pelaksanaan || selectedLombaObj.tanggal || '17 Agustus 2026') : '17 Agustus 2026';
    const lokasiLomba = selectedLombaObj ? (selectedLombaObj.lokasi || 'Lapangan Utama RT 06') : 'Wilayah RT 06';

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const rowsHtml = filteredWargas.length > 0
      ? filteredWargas.map((p, i) => {
          const isHadir = attendance[p.id] || p.status === 'hadir';
          return `
            <tr>
              <td style="text-align: center; padding: 8px;">${i + 1}</td>
              <td style="font-family: monospace; font-weight: bold; text-align: center;">#GM81-${p.id.toString().substring(0, 5)}</td>
              <td style="font-weight: bold; padding: 8px;">${p.nama_pendaftar}</td>
              <td style="text-align: center; font-family: monospace;">${p.no_hp}</td>
              <td style="text-align: center; font-weight: bold; color: ${isHadir ? '#059669' : '#dc2626'};">
                ${isHadir ? '✓ HADIR' : '— BELUM'}
              </td>
              <td style="height: 38px; text-align: center; vertical-align: middle; font-size: 8pt; color: #94a3b8; border: 1px solid #000;">
                [ PARAF / TTD ]
              </td>
            </tr>
          `;
        }).join('')
      : `<tr><td colspan="6" style="text-align: center; padding: 25px; font-style: italic;">Belum ada peserta terdaftar untuk perlombaan ini.</td></tr>`;

    printWindow.document.write(`
      <!DOCTYPE html><html><head><title>ABSENSI - ${namaLombaJudul}</title>
      <style>
        @page { size: A4 portrait; margin: 12mm; }
        body { font-family: Arial, sans-serif; padding: 10px; color: #0f172a; }
        .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 15px; }
        .header h2 { margin: 0; font-size: 15pt; font-weight: 900; }
        .header h3 { margin: 3px 0 0; color: #dc2626; font-size: 11pt; }
        .header p { margin: 4px 0 0; font-size: 9pt; color: #334155; }
        .meta-box { margin-bottom: 15px; font-size: 9.5pt; background: #f8fafc; padding: 10px; border: 1px solid #cbd5e1; border-radius: 6px; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 9.5pt; }
        th, td { border: 1px solid #000; }
        th { background-color: #e2e8f0; padding: 8px; font-weight: bold; text-align: center; }
        .sig-container { margin-top: 35px; display: flex; justify-content: space-between; text-align: center; font-size: 9pt; }
        .sig-box { width: 30%; }
        .sig-space { height: 48px; }
      </style></head>
      <body>
        <div class="header">
          <h2>PANITIA KEMERDEKAAN HUT RI KE-81</h2>
          <h3>${cmsData.orgName || 'GARDA MUDA RT 06'} / ${cmsData.rwDesa || 'RW 01 DESA WUNGU'}</h3>
          <p>LEMBAR PRESENSI & TANDA TANGAN PESERTA FISIK</p>
        </div>

        <div class="meta-box">
          <strong>CABANG LOMBA:</strong> ${namaLombaJudul.toUpperCase()} <br/>
          <strong>TANGGAL & LOKASI:</strong> ${tglLomba} | ${lokasiLomba} <br/>
          <strong>TOTAL PESERTA TERDAFTAR:</strong> ${filteredWargas.length} Warga
        </div>

        <table>
          <thead>
            <tr>
              <th style="width: 30px;">NO</th>
              <th style="width: 90px;">KODE PASS</th>
              <th>NAMA PESERTA / TIM</th>
              <th style="width: 110px;">NO. WHATSAPP</th>
              <th style="width: 85px;">PRESENSI</th>
              <th style="width: 130px;">PARAF / TTD FISIK</th>
            </tr>
          </thead>
          <tbody>${rowsHtml}</tbody>
        </table>

        <div class="sig-container">
          <div class="sig-box"><p>Koordinator Lomba,</p><div class="sig-space"></div><p>( .................................... )</p></div>
          <div class="sig-box"><p>Ketua Panitia Garda Muda,</p><div class="sig-space"></div><p>( .................................... )</p></div>
          <div class="sig-box"><p>Mengetahui,<br/>Ketua RT 06 / RW 01</p><div class="sig-space" style="height: 34px;"></div><p>( .................................... )</p></div>
        </div>
        <script>window.onload = function() { window.print(); setTimeout(() => window.close(), 500); };</script>
      </body></html>
    `);
    printWindow.document.close();
  };

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

  const handleSaveAllCms = () => {
    setIsSavingCms(true);
    setTimeout(() => {
      setCmsData(cmsData);
      setIsSavingCms(false);
      onShowModal('Berhasil Disimpan!', 'Seluruh DNA Tampilan CMS, Identitas, Logo, Panitia, Media 3D & Sosmed telah diperbarui secara permanen.');
    }, 400);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 relative z-10 animate-in fade-in duration-500 overflow-x-hidden">
      
      {/* HEADER PANEL ADMIN */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-5 dark:bg-slate-900 bg-white border dark:border-slate-800 border-slate-200 p-6 sm:p-7 rounded-3xl shadow-md">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black dark:text-white text-slate-900 flex items-center gap-2.5">
            <LayoutGrid className="w-7 h-7 text-red-500 animate-pulse" />
            <span>Dashboard Pusat Admin</span>
          </h2>
          <p className="text-xs sm:text-sm dark:text-slate-400 text-slate-600 mt-1 font-semibold">
            Sistem Kendali Utama CRUD Portal {cmsData.orgName || 'GARDA MUDA RT 06'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
          <button 
            onClick={onOpenScan} 
            className="flex-1 lg:flex-none px-4 py-2.5 bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 text-xs font-black rounded-xl flex items-center justify-center gap-2 transition-all duration-200 shadow-md hover:shadow-amber-500/20 cursor-pointer"
          >
            <QrCode className="w-4 h-4" /> Scan QR / Check-In
          </button>
          
          <button 
            onClick={onExportWord} 
            className="flex-1 lg:flex-none px-4 py-2.5 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white text-xs font-extrabold rounded-xl flex items-center justify-center gap-2 transition-all duration-200 shadow-md hover:shadow-blue-500/20 cursor-pointer"
          >
            <FileText className="w-4 h-4" /> Export (.doc)
          </button>
          
          <button 
            onClick={onPrintPDF} 
            className="flex-1 lg:flex-none px-4 py-2.5 bg-red-600 hover:bg-red-500 active:scale-95 text-white text-xs font-extrabold rounded-xl flex items-center justify-center gap-2 transition-all duration-200 shadow-md hover:shadow-red-500/20 cursor-pointer"
          >
            <Download className="w-4 h-4" /> Cetak PDF All
          </button>

          {/* TAB NAVIGATOR BUTTONS */}
          <div className="dark:bg-slate-950 bg-slate-100 p-1.5 rounded-2xl border dark:border-slate-800 border-slate-300 flex space-x-1.5 w-full lg:w-auto mt-2 lg:mt-0 overflow-x-auto scrollbar-none shadow-inner">
            <button 
              onClick={() => setActiveTab('lombas')} 
              className={`flex-1 lg:flex-none px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 active:scale-95 cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'lombas' 
                  ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-md' 
                  : 'dark:text-slate-400 text-slate-700 hover:text-red-600 hover:bg-slate-200/50 dark:hover:bg-slate-800/50'
              }`}
            >
              <Trophy className="w-4 h-4" /> Kelola Lomba ({lombas.length})
            </button>
            
            <button 
              onClick={() => setActiveTab('warga')} 
              className={`flex-1 lg:flex-none px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 active:scale-95 cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'warga' 
                  ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-md' 
                  : 'dark:text-slate-400 text-slate-700 hover:text-red-600 hover:bg-slate-200/50 dark:hover:bg-slate-800/50'
              }`}
            >
              <UserCheck className="w-4 h-4" /> Presensi Per Lomba ({pendaftars.length})
            </button>
            
            <button 
              onClick={() => setActiveTab('cms')} 
              className={`flex-1 lg:flex-none px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 active:scale-95 cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'cms' 
                  ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-md' 
                  : 'dark:text-slate-400 text-slate-700 hover:text-red-600 hover:bg-slate-200/50 dark:hover:bg-slate-800/50'
              }`}
            >
              <Settings className="w-4 h-4" /> CMS Tampilan
            </button>
          </div>
        </div>
      </div>

      {/* STATISTIK RINGKASAN */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="dark:bg-slate-900 bg-white border dark:border-slate-800 border-slate-200 p-6 rounded-3xl shadow-md hover:border-red-500/50 transition-all duration-300">
          <div className="flex items-center gap-4">
            <div className="p-3.5 dark:bg-red-500/20 bg-red-100 text-red-600 dark:text-red-400 rounded-2xl"><Trophy className="w-6 h-6" /></div>
            <div>
              <p className="text-xs dark:text-slate-400 text-slate-600 font-extrabold uppercase tracking-wider">Total Cabang Lomba</p>
              <h3 className="text-3xl font-black dark:text-white text-slate-900 mt-0.5">{lombas.length}</h3>
            </div>
          </div>
        </div>

        <div className="dark:bg-slate-900 bg-white border dark:border-slate-800 border-slate-200 p-6 rounded-3xl shadow-md hover:border-blue-500/50 transition-all duration-300">
          <div className="flex items-center gap-4">
            <div className="p-3.5 dark:bg-blue-500/20 bg-blue-100 text-blue-600 dark:text-blue-400 rounded-2xl"><Users className="w-6 h-6" /></div>
            <div>
              <p className="text-xs dark:text-slate-400 text-slate-600 font-extrabold uppercase tracking-wider">Total Warga Terdaftar</p>
              <h3 className="text-3xl font-black dark:text-white text-slate-900 mt-0.5">{pendaftars.length}</h3>
            </div>
          </div>
        </div>

        <div className="dark:bg-slate-900 bg-white border dark:border-slate-800 border-slate-200 p-6 rounded-3xl shadow-md hover:border-amber-500/50 transition-all duration-300">
          <div className="flex items-center gap-4">
            <div className="p-3.5 dark:bg-amber-500/20 bg-amber-100 text-amber-600 dark:text-amber-400 rounded-2xl"><Sparkles className="w-6 h-6" /></div>
            <div>
              <p className="text-xs dark:text-slate-400 text-slate-600 font-extrabold uppercase tracking-wider">Rata-rata Kuota Terisi</p>
              <h3 className="text-3xl font-black text-amber-600 dark:text-amber-400 mt-0.5">
                {lombas.length > 0 ? Math.round((pendaftars.length / (lombas.length * 15)) * 100) : 0}%
              </h3>
            </div>
          </div>
        </div>
      </div>

      {/* TAB 1: MANAJEMEN LOMBA & INPUT JUARA */}
      {activeTab === 'lombas' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-in fade-in duration-500">
          
          {/* FORM TAMBAH / EDIT LOMBA & FOTO JUARA */}
          <div id="form-lomba-admin" className="lg:col-span-5 dark:bg-slate-900 bg-white border dark:border-slate-800 border-slate-200 p-6 sm:p-7 rounded-3xl space-y-5 shadow-md lg:sticky lg:top-24 lg:self-start h-fit z-10">
            <div className="flex justify-between items-center border-b dark:border-slate-800 border-slate-200 pb-3">
              <h3 className="text-lg font-black dark:text-white text-slate-900 flex items-center gap-2">
                {editingLomba ? <Award className="w-6 h-6 text-amber-500 animate-bounce" /> : <PlusCircle className="w-6 h-6 text-red-600" />}
                <span>{editingLomba ? 'Input Pemenang & Foto / Edit' : 'Tambah Lomba Baru'}</span>
              </h3>
              {editingLomba && (
                <button 
                  type="button" 
                  onClick={() => { 
                    setEditingLomba(null); 
                    setNewLomba({ judul: '', kategori: 'Umum', tipe: 'Individu (Perorangan)', kuota: 15, tanggal_pelaksanaan: '2026-08-17', lokasi: 'Lapangan Utama RT 06', biaya_pendaftaran: '', deskripsi: '', gambar: '', juara1: '', foto_juara1: '', juara2: '', foto_juara2: '', juara3: '', foto_juara3: '' }); 
                  }} 
                  className="text-xs font-bold text-red-500 hover:text-red-400 hover:underline transition cursor-pointer"
                >
                  ✕ Batal Edit
                </button>
              )}
            </div>

            <form onSubmit={handleSubmitLomba} className="space-y-4">
              <div>
                <label className="text-xs font-extrabold dark:text-slate-300 text-slate-700 block mb-1.5 uppercase">Nama Lomba</label>
                <input type="text" placeholder="Contoh: Balap Karung Helm" value={newLomba.judul} onChange={(e) => setNewLomba({ ...newLomba, judul: e.target.value })} required className="w-full dark:bg-slate-950 bg-slate-50 border dark:border-slate-800 border-slate-300 rounded-xl p-3 text-xs font-semibold dark:text-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500/50" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-extrabold dark:text-slate-300 text-slate-700 block mb-1.5 uppercase">Kategori</label>
                  <select value={newLomba.kategori} onChange={(e) => setNewLomba({ ...newLomba, kategori: e.target.value })} className="w-full dark:bg-slate-950 bg-slate-50 border dark:border-slate-800 border-slate-300 rounded-xl p-3 text-xs font-semibold dark:text-white text-slate-900"><option>Umum</option><option>Anak-Anak</option><option>Remaja</option><option>Dewasa</option></select>
                </div>
                <div>
                  <label className="text-xs font-extrabold dark:text-slate-300 text-slate-700 block mb-1.5 uppercase">Tipe</label>
                  <select value={newLomba.tipe} onChange={(e) => setNewLomba({ ...newLomba, tipe: e.target.value })} className="w-full dark:bg-slate-950 bg-slate-50 border dark:border-slate-800 border-slate-300 rounded-xl p-3 text-xs font-semibold dark:text-white text-slate-900"><option>Individu (Perorangan)</option><option>Tim / Beregu</option></select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-extrabold dark:text-slate-300 text-slate-700 block mb-1.5 uppercase">Kuota Total</label>
                  <input type="number" min="1" value={newLomba.kuota} onChange={(e) => setNewLomba({ ...newLomba, kuota: Number(e.target.value) })} className="w-full dark:bg-slate-950 bg-slate-50 border dark:border-slate-800 border-slate-300 rounded-xl p-3 text-xs font-semibold dark:text-white text-slate-900" />
                </div>
                <div>
                  <label className="text-xs font-extrabold dark:text-slate-300 text-slate-700 block mb-1.5 uppercase">Tanggal</label>
                  <input type="date" value={newLomba.tanggal_pelaksanaan} onChange={(e) => setNewLomba({ ...newLomba, tanggal_pelaksanaan: e.target.value })} className="w-full dark:bg-slate-950 bg-slate-50 border dark:border-slate-800 border-slate-300 rounded-xl p-3 text-xs font-semibold dark:text-white text-slate-900" />
                </div>
              </div>

              {/* INPUT HASIL JUARA & UPLOAD FOTO PEMENANG (HANYA SAAT EDIT) */}
              {editingLomba && (
                <div className="p-4 dark:bg-amber-950/20 bg-amber-50 border-2 dark:border-amber-800/60 border-amber-300 rounded-2xl space-y-4 animate-fadeIn">
                  <p className="text-xs font-black uppercase text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-amber-500" /> Pengesahan Hasil & Foto Dokumentasi Juara
                  </p>
                  
                  {/* JUARA 1 */}
                  <div className="space-y-2 p-3 bg-white dark:bg-slate-900 rounded-xl border border-amber-300/50 shadow-sm">
                    <label className="text-[11px] font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1 uppercase">
                      <Medal className="w-4 h-4 text-yellow-500 shrink-0" /> JUARA 1 (EMAS)
                    </label>
                    <input type="text" placeholder="Nama pemenang Juara 1" value={newLomba.juara1} onChange={(e) => setNewLomba({ ...newLomba, juara1: e.target.value })} className="w-full dark:bg-slate-950 bg-slate-50 border dark:border-slate-800 border-slate-300 rounded-lg p-2 text-xs font-semibold text-slate-900 dark:text-white" />
                    
                    <div className="pt-1">
                      <label className="text-[10px] font-extrabold text-slate-500 uppercase block mb-1">Foto Juara 1</label>
                      <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, (res) => setNewLomba((prev) => ({ ...prev, foto_juara1: res })))} className="w-full text-xs text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg p-1.5 file:mr-2 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-[10px] file:font-black file:bg-amber-500 file:text-slate-950 hover:file:bg-amber-400 cursor-pointer shadow-inner" />
                      {newLomba.foto_juara1 && (
                        <div className="mt-2 relative w-16 h-16 rounded-xl overflow-hidden border border-yellow-500">
                          <img src={newLomba.foto_juara1} alt="Juara 1" className="w-full h-full object-cover" />
                          <button type="button" onClick={() => setNewLomba((prev) => ({ ...prev, foto_juara1: '' }))} className="absolute top-0.5 right-0.5 bg-rose-600 text-white p-0.5 rounded-full"><X className="w-3 h-3"/></button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* JUARA 2 */}
                  <div className="space-y-2 p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-300/50 shadow-sm">
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1 uppercase">
                      <Medal className="w-4 h-4 text-slate-400 shrink-0" /> JUARA 2 (PERAK)
                    </label>
                    <input type="text" placeholder="Nama pemenang Juara 2" value={newLomba.juara2} onChange={(e) => setNewLomba({ ...newLomba, juara2: e.target.value })} className="w-full dark:bg-slate-950 bg-slate-50 border dark:border-slate-800 border-slate-300 rounded-lg p-2 text-xs font-semibold text-slate-900 dark:text-white" />
                    
                    <div className="pt-1">
                      <label className="text-[10px] font-extrabold text-slate-500 uppercase block mb-1">Foto Juara 2</label>
                      <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, (res) => setNewLomba((prev) => ({ ...prev, foto_juara2: res })))} className="w-full text-xs text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg p-1.5 file:mr-2 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-[10px] file:font-black file:bg-slate-600 file:text-white hover:file:bg-slate-500 cursor-pointer shadow-inner" />
                      {newLomba.foto_juara2 && (
                        <div className="mt-2 relative w-16 h-16 rounded-xl overflow-hidden border border-slate-400">
                          <img src={newLomba.foto_juara2} alt="Juara 2" className="w-full h-full object-cover" />
                          <button type="button" onClick={() => setNewLomba((prev) => ({ ...prev, foto_juara2: '' }))} className="absolute top-0.5 right-0.5 bg-rose-600 text-white p-0.5 rounded-full"><X className="w-3 h-3"/></button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* JUARA 3 */}
                  <div className="space-y-2 p-3 bg-white dark:bg-slate-900 rounded-xl border border-amber-600/30 shadow-sm">
                    <label className="text-[11px] font-bold text-amber-700 dark:text-amber-500 flex items-center gap-1 uppercase">
                      <Medal className="w-4 h-4 text-amber-600 shrink-0" /> JUARA 3 (PERUNGGU)
                    </label>
                    <input type="text" placeholder="Nama pemenang Juara 3" value={newLomba.juara3} onChange={(e) => setNewLomba({ ...newLomba, juara3: e.target.value })} className="w-full dark:bg-slate-950 bg-slate-50 border dark:border-slate-800 border-slate-300 rounded-lg p-2 text-xs font-semibold text-slate-900 dark:text-white" />
                    
                    <div className="pt-1">
                      <label className="text-[10px] font-extrabold text-slate-500 uppercase block mb-1">Foto Juara 3</label>
                      <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, (res) => setNewLomba((prev) => ({ ...prev, foto_juara3: res })))} className="w-full text-xs text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg p-1.5 file:mr-2 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-[10px] file:font-black file:bg-amber-700 file:text-white hover:file:bg-amber-600 cursor-pointer shadow-inner" />
                      {newLomba.foto_juara3 && (
                        <div className="mt-2 relative w-16 h-16 rounded-xl overflow-hidden border border-amber-600">
                          <img src={newLomba.foto_juara3} alt="Juara 3" className="w-full h-full object-cover" />
                          <button type="button" onClick={() => setNewLomba((prev) => ({ ...prev, foto_juara3: '' }))} className="absolute top-0.5 right-0.5 bg-rose-600 text-white p-0.5 rounded-full"><X className="w-3 h-3"/></button>
                        </div>
                      )}
                    </div>
                  </div>

                </div>
              )}

              <div>
                <label className="text-xs font-extrabold dark:text-slate-300 text-slate-700 block mb-1.5 uppercase">Upload Cover Lomba</label>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={(e) => handleFileUpload(e, (res) => setNewLomba((prev) => ({ ...prev, gambar: res })))} 
                  className="w-full text-xs text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl p-2 file:mr-3 file:py-1.5 file:px-3.5 file:rounded-lg file:border-0 file:text-xs file:font-black file:bg-red-600 file:text-white hover:file:bg-red-500 cursor-pointer transition-all shadow-inner"
                />
                {newLomba.gambar && (
                  <div className="mt-3 relative w-28 h-20 rounded-xl overflow-hidden border border-red-500/50">
                    <img src={newLomba.gambar} alt="Preview" className="w-full h-full object-cover" />
                    <button 
                      type="button" 
                      onClick={() => setNewLomba(prev => ({ ...prev, gambar: '' }))} 
                      className="absolute top-1 right-1 bg-red-600 hover:bg-red-500 active:scale-95 text-white p-1 rounded-full transition cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>

              <div className="p-3.5 dark:bg-amber-950/20 bg-amber-50 border dark:border-amber-800/40 border-amber-200 rounded-2xl space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-black text-amber-600 dark:text-amber-400 flex items-center gap-1.5 uppercase">
                    <Sparkles className="w-4 h-4 text-amber-500 animate-spin" /> Asisten AI (Groq)
                  </span>
                  <button 
                    type="button" 
                    onClick={handleAi} 
                    disabled={aiLoading} 
                    className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-extrabold rounded-lg text-[10px] flex items-center gap-1.5 transition-all shadow cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {aiLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                    <span>{aiLoading ? 'Memproses...' : 'Buat AI Deskripsi'}</span>
                  </button>
                </div>
              </div>

              <textarea placeholder="Tulis rincian dan deskripsi lomba..." value={newLomba.deskripsi} onChange={(e) => setNewLomba({ ...newLomba, deskripsi: e.target.value })} rows="3" className="w-full dark:bg-slate-950 bg-slate-50 border dark:border-slate-800 border-slate-300 rounded-xl p-3 text-xs font-semibold dark:text-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500/50"></textarea>
              
              <button 
                type="submit" 
                disabled={isSubmittingLomba} 
                className="w-full py-3.5 bg-gradient-to-r from-red-600 via-rose-600 to-amber-500 hover:from-red-500 hover:to-amber-400 active:scale-95 text-white font-black rounded-xl text-xs uppercase tracking-wider shadow-lg shadow-red-600/25 transition-all duration-200 flex justify-center items-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmittingLomba ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Menyimpan ke Database...</span>
                  </>
                ) : (editingLomba ? <><Edit2 className="w-4 h-4"/> Simpan Hasil Juara & Foto</> : <><PlusCircle className="w-4 h-4"/> Publikasikan Lomba Baru</>)}
              </button>
            </form>
          </div>

          {/* KATALOG KARTU MANAGEMENT ADMIN DENGAN THUMBNAIL FOTO JUARA */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-slate-100 dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
              <div>
                <h3 className="text-lg font-black dark:text-white text-slate-900">Katalog Manajemen Lomba</h3>
                <p className="text-xs text-slate-500 font-semibold">Total {filteredLombasAdmin.length} perlombaan dikelola</p>
              </div>
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 absolute left-3 top-2.5 dark:text-slate-400 text-slate-500" />
                <input type="text" placeholder="Cari Lomba..." value={searchLomba} onChange={(e) => setSearchLomba(e.target.value)} className="w-full pl-9 pr-4 py-2 dark:bg-slate-950 bg-white border dark:border-slate-700 border-slate-300 rounded-xl text-xs dark:text-white text-slate-900 focus:outline-none shadow-sm" />
              </div>
            </div>

            {/* LIST KARTU ADMIN LOMBA */}
            <div className="space-y-4">
              {filteredLombasAdmin.map((item) => {
                const pCount = getPendaftarCount(item.id);
                const kuota = item.kuota || 15;
                const percent = Math.min(Math.round((pCount / kuota) * 100), 100);

                return (
                  <div 
                    key={item.id} 
                    className="dark:bg-slate-900 bg-white border-2 dark:border-slate-800 border-slate-200 rounded-3xl p-5 shadow-lg hover:border-red-500/50 transition duration-300 space-y-4"
                  >
                    {/* HEADER INFO */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                      <div className="flex items-center gap-3">
                        {item.gambar ? (
                          <img src={item.gambar} alt={item.judul || item.nama} className="w-14 h-14 rounded-2xl object-cover border border-red-500/30 shrink-0" />
                        ) : (
                          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-500 to-amber-500 flex items-center justify-center text-white shrink-0">
                            <Trophy className="w-7 h-7" />
                          </div>
                        )}
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 border border-rose-300 dark:border-rose-800">
                              {item.kategori || 'Umum'}
                            </span>
                            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                              {item.tipe || 'Individu'}
                            </span>
                          </div>
                          <h4 className="text-base font-black dark:text-white text-slate-900 leading-snug">
                            {item.judul || item.nama}
                          </h4>
                        </div>
                      </div>

                      {/* BADGE KUOTA PESERTA */}
                      <div className="w-full sm:w-auto bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-2.5 rounded-2xl text-right shrink-0">
                        <p className="text-[10px] font-extrabold uppercase text-slate-500 dark:text-slate-400">Pendaftar Terisi</p>
                        <p className="text-xs font-black text-amber-600 dark:text-amber-400">
                          {pCount} / {kuota} Warga <span className="text-[10px] text-slate-400">({percent}%)</span>
                        </p>
                      </div>
                    </div>

                    {/* DETAIL TANGGAL & LOKASI */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300 pt-1 border-t dark:border-slate-800 border-slate-100">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                        <span>{item.tanggal_pelaksanaan || item.tanggal || '17 Agustus 2026'}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        <span className="truncate">{item.lokasi || 'Lapangan Utama RT 06'}</span>
                      </div>
                    </div>

                    {/* DISPLAY HASIL JUARA DENGAN AVATAR FOTO */}
                    {(item.juara1 || item.juara2 || item.juara3) ? (
                      <div className="p-3.5 dark:bg-amber-950/30 bg-amber-50 border border-amber-200 dark:border-amber-800/40 rounded-2xl text-xs space-y-2">
                        <p className="font-black text-amber-700 dark:text-amber-400 text-[10px] uppercase flex items-center gap-1.5">
                          <Award className="w-3.5 h-3.5 text-amber-500" />
                          <span>Status Pengesahan Hasil Juara:</span>
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          {/* JUARA 1 */}
                          <div className="flex items-center gap-2 p-1.5 bg-white dark:bg-slate-900 rounded-xl border border-yellow-400/40">
                            {item.foto_juara1 ? (
                              <img src={item.foto_juara1} alt="Foto Juara 1" className="w-8 h-8 rounded-full object-cover shrink-0 border border-yellow-500" />
                            ) : (
                              <Medal className="w-6 h-6 text-yellow-500 shrink-0" />
                            )}
                            <div className="overflow-hidden">
                              <p className="text-[9px] font-black text-amber-600 uppercase">Juara 1</p>
                              <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{item.juara1 || '—'}</p>
                            </div>
                          </div>

                          {/* JUARA 2 */}
                          <div className="flex items-center gap-2 p-1.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-300/40">
                            {item.foto_juara2 ? (
                              <img src={item.foto_juara2} alt="Foto Juara 2" className="w-8 h-8 rounded-full object-cover shrink-0 border border-slate-400" />
                            ) : (
                              <Medal className="w-6 h-6 text-slate-400 shrink-0" />
                            )}
                            <div className="overflow-hidden">
                              <p className="text-[9px] font-black text-slate-500 uppercase">Juara 2</p>
                              <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{item.juara2 || '—'}</p>
                            </div>
                          </div>

                          {/* JUARA 3 */}
                          <div className="flex items-center gap-2 p-1.5 bg-white dark:bg-slate-900 rounded-xl border border-amber-600/30">
                            {item.foto_juara3 ? (
                              <img src={item.foto_juara3} alt="Foto Juara 3" className="w-8 h-8 rounded-full object-cover shrink-0 border border-amber-600" />
                            ) : (
                              <Medal className="w-6 h-6 text-amber-600 shrink-0" />
                            )}
                            <div className="overflow-hidden">
                              <p className="text-[9px] font-black text-amber-700 uppercase">Juara 3</p>
                              <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{item.juara3 || '—'}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="p-2.5 bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-[11px] font-medium text-slate-500 flex items-center justify-between">
                        <span>Lomba belum dilaksanakan / hasil belum diinput.</span>
                        <span className="text-[10px] font-bold text-amber-500 uppercase">Belum Ada Juara</span>
                      </div>
                    )}

                    {/* BARIS TOMBOL ACTION */}
                    <div className="pt-2 flex flex-wrap items-center gap-2 border-t dark:border-slate-800 border-slate-100">
                      <button
                        type="button"
                        onClick={() => startEditLomba(item)}
                        className="flex-1 py-2.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-black text-xs transition flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                      >
                        <Award className="w-3.5 h-3.5" />
                        <span>Input Juara & Foto / Edit</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleGoToPresensi(item.id)}
                        className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-black text-xs transition flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                      >
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>Presensi ({pCount})</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => onDeleteLomba(item.id)}
                        disabled={deletingLombaId === item.id}
                        className="py-2.5 px-3 rounded-xl bg-rose-600 hover:bg-rose-500 active:scale-95 text-white font-extrabold text-xs transition flex items-center justify-center gap-1.5 shadow-sm cursor-pointer disabled:opacity-50"
                      >
                        {deletingLombaId === item.id ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Trash2 className="w-3.5 h-3.5" />
                        )}
                        <span>Hapus</span>
                      </button>
                    </div>
                  </div>
                );
              })}

              {filteredLombasAdmin.length === 0 && (
                <div className="text-center py-12 dark:bg-slate-900 bg-white border dark:border-slate-800 border-slate-200 rounded-3xl text-slate-500 text-xs font-bold">
                  Belum ada lomba yang ditambahkan. Silakan isi form di sebelah kiri untuk membuat lomba baru.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SISTEM PRESENSI TERISOLASI PER-LOMBA */}
      {activeTab === 'warga' && (
        <div className="space-y-6 animate-in fade-in duration-500">
          
          <div className="dark:bg-slate-900 bg-white border dark:border-slate-800 border-slate-200 p-5 rounded-3xl shadow-md space-y-3">
            <div className="flex justify-between items-center">
              <p className="text-xs font-black uppercase text-slate-800 dark:text-slate-200 tracking-wider flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-500" /> Pilih Perlombaan Yang Akan Dikelola Presensinya:
              </p>
              <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400">
                {lombas.length} Cabang Lomba
              </span>
            </div>

            <div className="flex items-center gap-2.5 overflow-x-auto scrollbar-none py-1">
              <button
                onClick={() => setActiveAbsensiLombaId('all')}
                className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all duration-200 shrink-0 border flex items-center gap-2 active:scale-95 cursor-pointer ${
                  activeAbsensiLombaId === 'all'
                    ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white border-red-500 shadow-md'
                    : 'dark:bg-slate-950 bg-slate-100 border-slate-300 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-red-500'
                }`}
              >
                <span>🌐 Semua Lomba ({pendaftars.length})</span>
              </button>

              {lombas.map((l) => {
                const count = getPendaftarCount(l.id);
                const isSelected = String(activeAbsensiLombaId) === String(l.id);
                return (
                  <button
                    key={l.id}
                    onClick={() => setActiveAbsensiLombaId(l.id)}
                    className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all duration-200 shrink-0 border flex items-center gap-2 active:scale-95 cursor-pointer ${
                      isSelected
                        ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white border-red-500 shadow-md'
                        : 'dark:bg-slate-950 bg-slate-100 border-slate-300 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-red-500'
                    }`}
                  >
                    <span>🏆 {l.judul || l.nama}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] ${isSelected ? 'bg-white text-red-600' : 'bg-red-500/20 text-red-500'}`}>
                      {count} Warga
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="dark:bg-slate-900 bg-white border dark:border-slate-800 border-slate-200 rounded-3xl p-6 sm:p-7 space-y-5 shadow-md">
            
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-b dark:border-slate-800 border-slate-200 pb-5">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-500/30">
                    {selectedLombaObj ? (selectedLombaObj.kategori || 'Umum') : 'Seluruh Wilayah'}
                  </span>
                  <h3 className="text-xl font-black dark:text-white text-slate-900">
                    {selectedLombaObj ? (selectedLombaObj.judul || selectedLombaObj.nama) : 'Daftar Presensi Seluruh Warga'}
                  </h3>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 font-semibold mt-1 flex items-center gap-3">
                  <span>Terdaftar: <strong className="text-slate-900 dark:text-white">{pendaftarsCurrentLomba.length} Warga</strong></span>
                  <span>|</span>
                  <span>Sudah Presensi: <strong className="text-emerald-600 dark:text-emerald-400">{countHadirCurrentLomba} Warga</strong></span>
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <Search className="w-4 h-4 absolute left-3 top-2.5 dark:text-slate-400 text-slate-500" />
                  <input type="text" placeholder="Cari Nama / No WhatsApp..." value={searchWarga} onChange={(e) => setSearchWarga(e.target.value)} className="w-full pl-9 pr-4 py-2 dark:bg-slate-950 bg-slate-50 border dark:border-slate-800 border-slate-300 rounded-xl text-xs dark:text-white text-slate-900 focus:outline-none shadow-sm" />
                </div>

                <button
                  onClick={handlePrintAbsensiLomba}
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-extrabold text-xs rounded-xl flex items-center gap-1.5 shadow-md hover:shadow-emerald-600/20 transition-all duration-200 shrink-0 cursor-pointer"
                >
                  <Printer className="w-4 h-4" /> Cetak Absensi (.pdf)
                </button>
              </div>
            </div>

            {/* TABEL PRESENSI */}
            <div className="overflow-x-auto rounded-xl border dark:border-slate-800 border-slate-200">
              <table className="w-full text-left text-xs dark:text-slate-300 text-slate-700">
                <thead className="dark:bg-slate-950 bg-slate-100 dark:text-slate-400 text-slate-600 uppercase font-bold text-[10px]">
                  <tr>
                    <th className="p-4 text-center">Check-In</th>
                    <th className="p-4">Kode Pass</th>
                    <th className="p-4">Nama Peserta / Tim</th>
                    <th className="p-4">No. WhatsApp</th>
                    <th className="p-4 text-center">Status Kehadiran</th>
                    <th className="p-4 text-center">Kolom Paraf</th>
                    <th className="p-4 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y dark:divide-slate-800 divide-slate-200">
                  {filteredWargas.length === 0 ? (
                    <tr><td colSpan="7" className="p-8 text-center text-slate-500 italic">Belum ada data pendaftar untuk cabang lomba ini.</td></tr>
                  ) : (
                    filteredWargas.map((p) => {
                      const isHadir = attendance[p.id] || p.status === 'hadir';
                      return (
                        <tr key={p.id} className="dark:hover:bg-slate-800/40 hover:bg-slate-50 transition duration-200">
                          <td className="p-4 text-center">
                            <button
                              type="button"
                              onClick={() => toggleAbsensi(p.id)}
                              className="text-amber-500 hover:scale-125 active:scale-90 transition-transform duration-150 cursor-pointer"
                              title="Klik untuk Toggle Centang Presensi"
                            >
                              {isHadir ? <CheckSquare className="w-5 h-5 text-emerald-500" /> : <Square className="w-5 h-5 text-slate-400" />}
                            </button>
                          </td>
                          <td className="p-4 font-mono text-amber-600 dark:text-amber-400 font-extrabold">#GM81-{p.id.toString().substring(0, 5)}</td>
                          <td className="p-4 font-black dark:text-white text-slate-900 text-xs">{p.nama_pendaftar}</td>
                          <td className="p-4 font-mono font-bold text-emerald-600 dark:text-emerald-400">{p.no_hp}</td>
                          <td className="p-4 text-center font-bold">
                            {isHadir ? (
                              <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800 inline-flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" /> ✓ HADIR
                              </span>
                            ) : (
                              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-300 dark:border-slate-700">
                                — BELUM SCAN
                              </span>
                            )}
                          </td>
                          <td className="p-4 text-center text-[10px] font-mono text-slate-400 dark:text-slate-500 italic">
                            [ CETAK UTK TTD ]
                          </td>
                          <td className="p-4 text-center">
                            <button 
                              onClick={() => onDeletePendaftar(p.id)} 
                              disabled={deletingPendaftarId === p.id} 
                              className="p-2 dark:bg-red-950/80 bg-red-50 text-red-600 border dark:border-red-800 border-red-200 rounded-xl hover:bg-red-600 hover:text-white active:scale-90 transition-all duration-150 inline-flex items-center justify-center cursor-pointer disabled:opacity-50"
                            >
                              {deletingPendaftarId === p.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: CMS ADMIN */}
      {activeTab === 'cms' && (
        <div className="space-y-6 animate-in fade-in duration-500">
          <div className="dark:bg-slate-900 bg-white border dark:border-slate-800 border-slate-200 rounded-3xl p-6 sm:p-7 space-y-6 shadow-md">
            <div>
              <h3 className="text-xl font-black dark:text-white text-slate-900 flex items-center gap-2.5">
                <Settings className="w-6 h-6 text-red-500" />
                <span>CMS Admin: Kelola Tampilan Website & Panitia</span>
              </h3>
              <p className="text-xs dark:text-slate-400 text-slate-600 mt-1 font-medium">Atur logo, akun login, link Drive, foto bersama, media sosial, serta susunan panitia secara terpusat.</p>
            </div>

            {/* BLOCK 1: Kredensial Login & Kop Surat */}
            <div className="p-5 dark:bg-slate-950 bg-slate-50 border dark:border-slate-800 border-slate-200 rounded-2xl space-y-4">
              <h4 className="text-xs font-black text-red-600 dark:text-red-500 uppercase tracking-widest flex items-center gap-2 border-b dark:border-slate-800 border-slate-300 pb-2"><Lock className="w-4 h-4" /> Pengaturan Akun Login Admin & Kop Surat</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div><label className="text-[11px] font-bold dark:text-slate-300 text-slate-700 block mb-1 uppercase">Username Admin Baru</label><input type="text" value={cmsData.username || 'admin'} onChange={(e) => setCmsData({ ...cmsData, username: e.target.value })} className="w-full dark:bg-slate-900 bg-white border dark:border-slate-800 border-slate-300 rounded-xl p-2.5 text-xs dark:text-white text-slate-900" /></div>
                <div><label className="text-[11px] font-bold dark:text-slate-300 text-slate-700 block mb-1 uppercase">Password Admin Baru</label><input type="password" value={cmsData.password || 'admin123'} onChange={(e) => setCmsData({ ...cmsData, password: e.target.value })} className="w-full dark:bg-slate-900 bg-white border dark:border-slate-800 border-slate-300 rounded-xl p-2.5 text-xs dark:text-white text-slate-900" /></div>
                <div><label className="text-[11px] font-bold dark:text-slate-300 text-slate-700 block mb-1 uppercase">Nama Organisasi / RT</label><input type="text" value={cmsData.orgName || 'GARDA MUDA RT 06'} onChange={(e) => setCmsData({ ...cmsData, orgName: e.target.value })} className="w-full dark:bg-slate-900 bg-white border dark:border-slate-800 border-slate-300 rounded-xl p-2.5 text-xs dark:text-white text-slate-900" /></div>
                <div><label className="text-[11px] font-bold dark:text-slate-300 text-slate-700 block mb-1 uppercase">RW & Desa</label><input type="text" value={cmsData.rwDesa || 'RW 01 DESA WUNGU'} onChange={(e) => setCmsData({ ...cmsData, rwDesa: e.target.value })} className="w-full dark:bg-slate-900 bg-white border dark:border-slate-800 border-slate-300 rounded-xl p-2.5 text-xs dark:text-white text-slate-900" /></div>
              </div>
            </div>

            {/* BLOCK 2: Branding Logo */}
            <div className="p-5 dark:bg-slate-950 bg-slate-50 border dark:border-slate-800 border-slate-200 rounded-2xl space-y-4">
              <h4 className="text-xs font-black text-amber-600 dark:text-amber-500 uppercase tracking-widest flex items-center gap-2 border-b dark:border-slate-800 border-slate-300 pb-2"><ImageIcon className="w-4 h-4" /> Logo Resmi & Branding</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold dark:text-slate-300 text-slate-700 block uppercase">1. Logo Utama (Garuda)</label>
                  <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, (res) => setCmsData({ ...cmsData, logoGaruda: res }))} className="w-full text-xs text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl p-2 file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-black file:bg-red-600 file:text-white hover:file:bg-red-500 cursor-pointer shadow-inner" />
                  {cmsData.logoGaruda && <div className="mt-2 w-16 h-16 rounded-xl overflow-hidden border border-slate-700 bg-slate-900 relative"><img src={cmsData.logoGaruda} className="w-full h-full object-contain p-1" /><button onClick={() => setCmsData({ ...cmsData, logoGaruda: '' })} className="absolute top-1 right-1 bg-red-600 text-white p-0.5 rounded-full hover:scale-110 active:scale-90 transition cursor-pointer"><X className="w-3 h-3"/></button></div>}
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold dark:text-slate-300 text-slate-700 block uppercase">2. Logo HUT RI 81</label>
                  <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, (res) => setCmsData({ ...cmsData, logoHutRi: res }))} className="w-full text-xs text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl p-2 file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-black file:bg-red-600 file:text-white hover:file:bg-red-500 cursor-pointer shadow-inner" />
                  {cmsData.logoHutRi && <div className="mt-2 w-16 h-16 rounded-xl overflow-hidden border border-slate-700 bg-slate-900 relative"><img src={cmsData.logoHutRi} className="w-full h-full object-contain p-1" /><button onClick={() => setCmsData({ ...cmsData, logoHutRi: '' })} className="absolute top-1 right-1 bg-red-600 text-white p-0.5 rounded-full hover:scale-110 active:scale-90 transition cursor-pointer"><X className="w-3 h-3"/></button></div>}
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold dark:text-slate-300 text-slate-700 block uppercase">3. Logo Garda Muda (Header)</label>
                  <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, (res) => setCmsData({ ...cmsData, logoGardaMuda: res }))} className="w-full text-xs text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl p-2 file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-black file:bg-red-600 file:text-white hover:file:bg-red-500 cursor-pointer shadow-inner" />
                  {cmsData.logoGardaMuda && <div className="mt-2 w-16 h-16 rounded-xl overflow-hidden border border-slate-700 bg-slate-900 relative"><img src={cmsData.logoGardaMuda} className="w-full h-full object-contain p-1" /><button onClick={() => setCmsData({ ...cmsData, logoGardaMuda: '' })} className="absolute top-1 right-1 bg-red-600 text-white p-0.5 rounded-full hover:scale-110 active:scale-90 transition cursor-pointer"><X className="w-3 h-3"/></button></div>}
                </div>
              </div>
            </div>

            {/* BLOCK 3: Drive & Foto Bersama */}
            <div className="p-5 dark:bg-slate-950 bg-slate-50 border dark:border-slate-800 border-slate-200 rounded-2xl space-y-4">
              <h4 className="text-xs font-black text-blue-600 dark:text-blue-500 uppercase tracking-widest flex items-center gap-2 border-b dark:border-slate-800 border-slate-300 pb-2"><FolderGit2 className="w-4 h-4" /> Link Google Drive & Foto Kebersamaan</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                <div>
                  <label className="text-[11px] font-bold dark:text-slate-300 text-slate-700 block mb-1 uppercase">URL Link Google Drive</label>
                  <input type="text" placeholder="https://drive.google.com/..." value={cmsData.driveUrl || ''} onChange={(e) => setCmsData({ ...cmsData, driveUrl: e.target.value })} className="w-full dark:bg-slate-900 bg-white border dark:border-slate-800 border-slate-300 rounded-xl p-2.5 text-xs dark:text-white text-slate-900" />
                </div>
                <div>
                  <label className="text-[11px] font-bold dark:text-slate-300 text-slate-700 block mb-1 uppercase">Upload Foto Bersama Panitia</label>
                  <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, (res) => setCmsData({ ...cmsData, fotoBersama: res }))} className="w-full text-xs text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl p-2 file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-black file:bg-red-600 file:text-white hover:file:bg-red-500 cursor-pointer shadow-inner" />
                  {cmsData.fotoBersama && <div className="mt-2 w-28 h-16 rounded-xl overflow-hidden border border-slate-700 relative"><img src={cmsData.fotoBersama} className="w-full h-full object-cover" /><button onClick={() => setCmsData({ ...cmsData, fotoBersama: '' })} className="absolute top-1 right-1 bg-red-600 text-white p-0.5 rounded-full hover:scale-110 active:scale-90 transition cursor-pointer"><Trash2 className="w-3 h-3"/></button></div>}
                </div>
              </div>
            </div>

            {/* BLOCK 4: Susunan Panitia */}
            <div className="p-5 dark:bg-slate-950 bg-slate-50 border dark:border-slate-800 border-slate-200 rounded-2xl space-y-4">
              <div className="flex justify-between items-center border-b dark:border-slate-800 border-slate-300 pb-2">
                <h4 className="text-xs font-black text-emerald-600 dark:text-emerald-500 uppercase tracking-widest flex items-center gap-2"><Users className="w-4 h-4" /> Susunan Kepanitiaan</h4>
                <span className="text-[10px] font-bold dark:text-slate-400 text-slate-600">{cmsData.members?.length || 0} Anggota</span>
              </div>
              
              <div className="flex flex-col md:flex-row gap-3 items-end">
                <div className="flex-1 w-full"><label className="text-[10px] font-bold dark:text-slate-300 text-slate-700 block mb-1 uppercase">Nama Anggota</label><input type="text" placeholder="Nama Lengkap" value={newPanitia.nama} onChange={(e) => setNewPanitia({ ...newPanitia, nama: e.target.value })} className="w-full dark:bg-slate-900 bg-white border dark:border-slate-800 border-slate-300 rounded-lg p-2 text-xs dark:text-white text-slate-900" /></div>
                <div className="flex-1 w-full"><label className="text-[10px] font-bold dark:text-slate-300 text-slate-700 block mb-1 uppercase">Jabatan</label><input type="text" placeholder="Contoh: Ketua Panitia" value={newPanitia.jabatan} onChange={(e) => setNewPanitia({ ...newPanitia, jabatan: e.target.value })} className="w-full dark:bg-slate-900 bg-white border dark:border-slate-800 border-slate-300 rounded-lg p-2 text-xs dark:text-white text-slate-900" /></div>
                <div className="flex-1 w-full">
                  <label className="text-[10px] font-bold dark:text-slate-300 text-slate-700 block mb-1 uppercase">Foto Profil</label>
                  <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, (res) => setNewPanitia({ ...newPanitia, foto: res }))} className="w-full text-xs text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl p-1.5 file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-xs file:font-black file:bg-red-600 file:text-white hover:file:bg-red-500 cursor-pointer shadow-inner" />
                </div>
                
                <button 
                  onClick={handleSavePanitia} 
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white text-xs font-extrabold rounded-xl w-full md:w-auto shrink-0 shadow-md transition-all duration-200 cursor-pointer flex items-center justify-center gap-1"
                >
                  {editingMemberIdx !== null ? <><Edit2 className="w-3.5 h-3.5"/> Update</> : <><PlusCircle className="w-3.5 h-3.5"/> Tambah</>}
                </button>
              </div>

              {cmsData.members?.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
                  {cmsData.members.map((m, i) => (
                    <div key={i} className="dark:bg-slate-900 bg-white border dark:border-slate-800 border-slate-300 p-2.5 rounded-xl flex items-center justify-between shadow-sm hover:border-emerald-500/40 transition">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-slate-700 overflow-hidden shrink-0 border border-slate-600">{m.foto && <img src={m.foto} className="w-full h-full object-cover" />}</div>
                        <div><p className="text-[10px] font-bold dark:text-white text-slate-900 truncate w-16">{m.nama}</p><p className="text-[9px] text-amber-600 dark:text-amber-400 truncate w-16">{m.jabatan}</p></div>
                      </div>
                      <div className="flex items-center gap-1">
                        <button onClick={() => { setEditingMemberIdx(i); setNewPanitia(m); }} className="text-blue-500 hover:text-blue-400 p-1 active:scale-90 transition cursor-pointer"><Edit2 className="w-3.5 h-3.5" /></button>
                        <button onClick={() => handleDeletePanitia(i)} className="text-red-500 hover:text-red-400 p-1 active:scale-90 transition cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* BLOCK 5: Showcase Kartu 3D */}
            <div className="p-5 dark:bg-slate-950 bg-slate-50 border dark:border-slate-800 border-slate-200 rounded-2xl space-y-4">
              <div className="flex justify-between items-center border-b dark:border-slate-800 border-slate-300 pb-2">
                <h4 className="text-xs font-black text-rose-600 dark:text-rose-500 uppercase tracking-widest flex items-center gap-2"><UploadCloud className="w-4 h-4" /> Upload Kartu 3D (Dokumentasi Foto / Video)</h4>
                <span className="text-[10px] font-bold dark:text-slate-400 text-slate-600">{cmsData.cards3D?.length || 0} Kartu</span>
              </div>
              
              <div className="flex flex-col md:flex-row gap-3 items-end">
                <div className="flex-1 w-full"><label className="text-[10px] font-bold dark:text-slate-300 text-slate-700 block mb-1 uppercase">Judul Momen</label><input type="text" placeholder="Contoh: Keseruan Panjat Pinang" value={newCard.title} onChange={(e) => setNewCard({ ...newCard, title: e.target.value })} className="w-full dark:bg-slate-900 bg-white border dark:border-slate-800 border-slate-300 rounded-lg p-2 text-xs dark:text-white text-slate-900" /></div>
                <div className="w-36"><label className="text-[10px] font-bold dark:text-slate-300 text-slate-700 block mb-1 uppercase">Kategori</label><select value={newCard.category} onChange={(e) => setNewCard({ ...newCard, category: e.target.value })} className="w-full dark:bg-slate-900 bg-white border dark:border-slate-800 border-slate-300 rounded-lg p-2 text-xs dark:text-white text-slate-900"><option value="Foto Juara">🥇 Foto Juara</option><option value="Momen Seru">🔥 Momen Seru</option><option value="Dokumentasi">📸 Dokumentasi</option><option value="Video Dokumen">🎥 Video Dokumen</option></select></div>
                <div className="w-28"><label className="text-[10px] font-bold dark:text-slate-300 text-slate-700 block mb-1 uppercase">Tipe</label><select value={newCard.type} onChange={(e) => setNewCard({ ...newCard, type: e.target.value })} className="w-full dark:bg-slate-900 bg-white border dark:border-slate-800 border-slate-300 rounded-lg p-2 text-xs dark:text-white text-slate-900"><option value="image">Gambar</option><option value="video">Video MP4</option></select></div>
                <div className="flex-1 w-full">
                  <label className="text-[10px] font-bold dark:text-slate-300 text-slate-700 block mb-1 uppercase">Upload File</label>
                  <input type="file" accept="image/*,video/*" onChange={(e) => handleFileUpload(e, (res) => setNewCard({ ...newCard, media: res }))} className="w-full text-xs text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl p-1.5 file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-xs file:font-black file:bg-red-600 file:text-white hover:file:bg-red-500 cursor-pointer shadow-inner" />
                </div>
                
                <button 
                  onClick={handleSaveCard} 
                  className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 active:scale-95 text-white text-xs font-extrabold rounded-xl w-full md:w-auto shrink-0 shadow-md transition-all duration-200 cursor-pointer flex items-center justify-center gap-1"
                >
                  {editingCardIdx !== null ? <><Edit2 className="w-3.5 h-3.5"/> Update</> : <><PlusCircle className="w-3.5 h-3.5"/> Tambah</>}
                </button>
              </div>

              {cmsData.cards3D?.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
                  {cmsData.cards3D.map((c, i) => (
                    <div key={i} className="dark:bg-slate-900 bg-white border dark:border-slate-800 border-slate-300 p-2 rounded-xl relative group shadow-sm hover:border-rose-500/40 transition">
                      <div className="h-16 bg-slate-800 rounded-lg overflow-hidden mb-1.5">
                        {c.media && (c.type === 'video' ? <video src={c.media} className="w-full h-full object-cover" /> : <img src={c.media} className="w-full h-full object-cover" />)}
                      </div>
                      <p className="text-[10px] font-bold dark:text-white text-slate-900 truncate">{c.title}</p>
                      <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => { setEditingCardIdx(i); setNewCard(c); }} className="bg-blue-600 hover:bg-blue-500 p-1 rounded text-white active:scale-90 transition cursor-pointer"><Edit2 className="w-3 h-3" /></button>
                        <button onClick={() => handleDeleteCard(i)} className="bg-red-600 hover:bg-red-500 p-1 rounded text-white active:scale-90 transition cursor-pointer"><Trash2 className="w-3 h-3" /></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* BLOCK 6: Media Sosial */}
            <div className="p-5 dark:bg-slate-950 bg-slate-50 border dark:border-slate-800 border-slate-200 rounded-2xl space-y-4">
              <h4 className="text-xs font-black text-cyan-600 dark:text-cyan-500 uppercase tracking-widest flex items-center gap-2 border-b dark:border-slate-800 border-slate-300 pb-2"><Share2 className="w-4 h-4" /> Media Sosial Organisasi</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div><label className="text-[10px] font-bold dark:text-slate-300 text-slate-700 block mb-1 uppercase flex items-center gap-1"><InstagramIcon className="w-3.5 h-3.5 text-pink-500"/> Instagram Handle/Link</label><input type="text" placeholder="@gardamuda_rt06" value={cmsData.ig || ''} onChange={(e) => setCmsData({ ...cmsData, ig: e.target.value })} className="w-full dark:bg-slate-900 bg-white border dark:border-slate-800 border-slate-300 rounded-xl p-2.5 text-xs dark:text-white text-slate-900" /></div>
                <div><label className="text-[10px] font-bold dark:text-slate-300 text-slate-700 block mb-1 uppercase flex items-center gap-1"><Share2 className="w-3.5 h-3.5 text-cyan-500"/> TikTok Username</label><input type="text" placeholder="@gardamuda.rt06" value={cmsData.tiktok || ''} onChange={(e) => setCmsData({ ...cmsData, tiktok: e.target.value })} className="w-full dark:bg-slate-900 bg-white border dark:border-slate-800 border-slate-300 rounded-xl p-2.5 text-xs dark:text-white text-slate-900" /></div>
                <div><label className="text-[10px] font-bold dark:text-slate-300 text-slate-700 block mb-1 uppercase flex items-center gap-1"><YoutubeIcon className="w-3.5 h-3.5 text-red-500"/> YouTube Channel</label><input type="text" placeholder="Garda Muda RT06 Official" value={cmsData.youtube || ''} onChange={(e) => setCmsData({ ...cmsData, youtube: e.target.value })} className="w-full dark:bg-slate-900 bg-white border dark:border-slate-800 border-slate-300 rounded-xl p-2.5 text-xs dark:text-white text-slate-900" /></div>
                <div><label className="text-[10px] font-bold dark:text-slate-300 text-slate-700 block mb-1 uppercase flex items-center gap-1"><MessageCircle className="w-3.5 h-3.5 text-emerald-500"/> WhatsApp Panitia</label><input type="text" placeholder="081234567890" value={cmsData.waPanitia || ''} onChange={(e) => setCmsData({ ...cmsData, waPanitia: e.target.value })} className="w-full dark:bg-slate-900 bg-white border dark:border-slate-800 border-slate-300 rounded-xl p-2.5 text-xs dark:text-white text-slate-900" /></div>
              </div>
            </div>

            {/* SIMPAN CMS BUTTON */}
            <button 
              onClick={handleSaveAllCms} 
              disabled={isSavingCms}
              className="w-full py-3.5 bg-gradient-to-r from-red-600 via-rose-600 to-amber-500 hover:from-red-500 hover:to-amber-400 active:scale-95 text-white font-black rounded-xl text-xs sm:text-sm uppercase tracking-wider shadow-lg shadow-red-600/30 transition-all duration-200 flex justify-center items-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSavingCms ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin text-white" />
                  <span>Menyimpan Pengaturan...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
                  <span>Simpan Pengaturan CMS & Susunan Panitia</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}