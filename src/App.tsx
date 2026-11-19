/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Compass, 
  ExternalLink, 
  Search, 
  Bookmark, 
  BookmarkCheck, 
  Sun, 
  Moon, 
  Download, 
  Bell, 
  ShieldCheck, 
  Users, 
  FileText, 
  Calendar, 
  BookOpen, 
  CheckCircle2, 
  Smartphone, 
  Sparkles, 
  Menu, 
  X, 
  ChevronRight, 
  Info,
  Clock,
  ArrowUpRight,
  HelpCircle,
  Laptop
} from 'lucide-react';

interface ResourceItem {
  id: string;
  title: string;
  description: string;
  url: string;
  category: 'utama' | 'kurikulum' | 'kepegawaian' | 'layanan';
  iconName: string;
  badge?: string;
  isExternal: boolean;
  status: 'online' | 'maintenance' | 'normal';
}

const INITIAL_RESOURCES: ResourceItem[] = [
  {
    id: 'sibogo',
    title: 'Sistem Informasi Bogota',
    description: 'Portal pusat data akademik, pengelolaan nilai siswa, rapor, dan administrasi sekolah terpadu.',
    url: 'https://sibogo.vercel.app',
    category: 'utama',
    iconName: 'Laptop',
    badge: 'Utama',
    isExternal: true,
    status: 'online'
  },
  {
    id: 'prebogo',
    title: 'Presensi Guru & Pegawai',
    description: 'Sistem pencatatan kehadiran harian, pengajuan izin, cuti, dan rekapitulasi presensi guru & staf.',
    url: 'https://prebogo.vercel.app',
    category: 'utama',
    iconName: 'Users',
    badge: 'Absensi',
    isExternal: true,
    status: 'online'
  },
  {
    id: 'rkt-gen',
    title: 'RKT - RKS Gen',
    description: 'Aplikasi generator Rencana Kerja Tahunannya (RKT) & Rencana Kegiatan Sekolah (RKS) otomatis dan terstandar.',
    url: 'https://rkt-generator.vercel.app',
    category: 'utama',
    iconName: 'FileText',
    badge: 'Perencanaan',
    isExternal: true,
    status: 'online'
  },
  {
    id: 'soalator',
    title: 'Soal Generator',
    description: 'Alat bantu guru dalam merancang kisi-kisi, bank soal, dan lembar ujian berkualitas berbasis kurikulum.',
    url: 'https://soalator.vercel.app',
    category: 'utama',
    iconName: 'Sparkles',
    badge: 'AI / Guru',
    isExternal: true,
    status: 'online'
  },
  {
    id: 'kurikulum-merdeka',
    title: 'Pusat Kurikulum & Modul Ajar',
    description: 'Kumpulan dokumen Capaian Pembelajaran (CP), Alur Tujuan Pembelajaran (ATP), dan contoh modul ajar.',
    url: '#kurikulum',
    category: 'kurikulum',
    iconName: 'BookOpen',
    badge: 'Dokumen',
    isExternal: false,
    status: 'online'
  },
  {
    id: 'kalender-pendidikan',
    title: 'Kalender Akademik 2026/2027',
    description: 'Jadwal lengkap kegiatan pembelajaran, minggu efektif, libur semester, dan agenda ujian sekolah.',
    url: '#kalender',
    category: 'layanan',
    iconName: 'Calendar',
    badge: 'Agenda',
    isExternal: false,
    status: 'online'
  },
  {
    id: 'ekinerja',
    title: 'E-Kinerja & SKP Pegawai',
    description: 'Pengelolaan Sasaran Kinerja Pegawai (SKP), portofolio pengembangan, dan penilaian kinerja berkala.',
    url: '#kepegawaian',
    category: 'kepegawaian',
    iconName: 'ShieldCheck',
    badge: 'Kepegawaian',
    isExternal: false,
    status: 'online'
  }
];

const ANNOUNCEMENTS = [
  {
    id: 1,
    date: '18 Nov 2026',
    title: 'Pembaruan Akses Sistem Informasi Bogota (Sibogo)',
    content: 'Versi terbaru Sibogo kini telah terintegrasi dengan modul pelaporan rapor semester ganjil. Silakan gunakan tautan utama.'
  },
  {
    id: 2,
    date: '15 Nov 2026',
    title: 'Panduan Penggunaan Soal Generator',
    content: 'Fitur baru pada Soal Generator memungkinkan ekspor langsung ke format Word dan PDF dengan format penilaian KKM.'
  }
];

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [bookmarks, setBookmarks] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('bogota_bookmarks');
      return saved ? JSON.parse(saved) : ['sibogo', 'prebogo', 'rkt-gen', 'soalator'];
    } catch {
      return ['sibogo', 'prebogo', 'rkt-gen', 'soalator'];
    }
  });
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'home' | 'resources' | 'bookmarks' | 'announcements'>('home');
  const [selectedLinkModal, setSelectedLinkModal] = useState<ResourceItem | null>(null);

  // Save bookmarks
  useEffect(() => {
    try {
      localStorage.setItem('bogota_bookmarks', JSON.stringify(bookmarks));
    } catch (e) {
      console.error(e);
    }
  }, [bookmarks]);

  // Toggle dark mode class on document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleBookmark = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setBookmarks(prev => 
      prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id]
    );
  };

  const filteredResources = INITIAL_RESOURCES.filter(res => {
    const matchesSearch = res.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          res.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = activeCategory === 'all' || 
                       (activeCategory === 'bookmarks' ? bookmarks.includes(res.id) : res.category === activeCategory);
    return matchesSearch && matchesCat;
  });

  const handleCardClick = (res: ResourceItem) => {
    if (res.isExternal) {
      setSelectedLinkModal(res);
    } else {
      alert(`Membuka menu internal: ${res.title}`);
    }
  };

  const getIcon = (name: string) => {
    switch(name) {
      case 'Laptop': return <Laptop className="w-6 h-6 text-blue-600 dark:text-blue-400" />;
      case 'Users': return <Users className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />;
      case 'FileText': return <FileText className="w-6 h-6 text-violet-600 dark:text-violet-400" />;
      case 'Sparkles': return <Sparkles className="w-6 h-6 text-amber-600 dark:text-amber-400" />;
      case 'BookOpen': return <BookOpen className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />;
      case 'Calendar': return <Calendar className="w-6 h-6 text-rose-600 dark:text-rose-400" />;
      case 'ShieldCheck': return <ShieldCheck className="w-6 h-6 text-teal-600 dark:text-teal-400" />;
      default: return <Compass className="w-6 h-6 text-blue-600 dark:text-blue-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-200 pb-20 md:pb-0">
      
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent whitespace-nowrap">
                Bogota Academic Center
              </span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-none hidden sm:block mt-0.5">
                Portal Sumber Daya & Layanan Terpadu
              </p>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
            <button 
              onClick={() => { setActiveTab('home'); setActiveCategory('all'); }}
              className={`hover:text-blue-600 dark:hover:text-blue-400 transition-colors whitespace-nowrap ${activeTab === 'home' && activeCategory === 'all' ? 'text-blue-600 dark:text-blue-400 font-semibold' : ''}`}
            >
              Beranda
            </button>
            <button 
              onClick={() => { setActiveTab('resources'); setActiveCategory('utama'); }}
              className={`hover:text-blue-600 dark:hover:text-blue-400 transition-colors whitespace-nowrap ${activeCategory === 'utama' ? 'text-blue-600 dark:text-blue-400 font-semibold' : ''}`}
            >
              Layanan Utama
            </button>
            <button 
              onClick={() => { setActiveTab('announcements'); }}
              className={`hover:text-blue-600 dark:hover:text-blue-400 transition-colors whitespace-nowrap ${activeTab === 'announcements' ? 'text-blue-600 dark:text-blue-400 font-semibold' : ''}`}
            >
              Pengumuman
            </button>
            <button 
              onClick={() => { setActiveTab('bookmarks'); setActiveCategory('bookmarks'); }}
              className={`hover:text-blue-600 dark:hover:text-blue-400 transition-colors whitespace-nowrap flex items-center gap-1.5 ${activeCategory === 'bookmarks' ? 'text-blue-600 dark:text-blue-400 font-semibold' : ''}`}
            >
              <Bookmark className="w-4 h-4" />
              Favorit ({bookmarks.length})
            </button>
          </nav>

          {/* Action Tools */}
          <div className="flex items-center gap-2.5">
            {/* Theme Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              aria-label="Toggle Theme"
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
            </button>

            {/* PWA Install Button Helper */}
            <div className="hidden sm:block">
              <PWAInstallHeaderBtn />
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </header>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 py-4 space-y-3 z-30 shadow-lg animate-fadeIn">
          <button
            onClick={() => { setActiveTab('home'); setActiveCategory('all'); setMobileMenuOpen(false); }}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between"
          >
            <span>Beranda Utama</span>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>
          <button
            onClick={() => { setActiveCategory('utama'); setMobileMenuOpen(false); }}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between"
          >
            <span>Layanan Utama (4 Link Wajib)</span>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>
          <button
            onClick={() => { setActiveCategory('kurikulum'); setMobileMenuOpen(false); }}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between"
          >
            <span>Kurikulum & Pembelajaran</span>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>
          <button
            onClick={() => { setActiveCategory('kepegawaian'); setMobileMenuOpen(false); }}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between"
          >
            <span>Kepegawaian & Administrasi</span>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>
          <button
            onClick={() => { setActiveCategory('bookmarks'); setMobileMenuOpen(false); }}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between text-blue-600 dark:text-blue-400"
          >
            <span>Favorit Tersimpan ({bookmarks.length})</span>
            <Bookmark className="w-4 h-4" />
          </button>
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex justify-center">
            <PWAInstallHeaderBtn />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Hero Banner */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-8 sm:p-12 shadow-xl">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.25),transparent_50%)]" />
          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs font-semibold tracking-wide">
              <Sparkles className="w-3.5 h-3.5" />
              Portal Akademik & Layanan Guru / Pegawai
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Bogota Academic Center
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Pusat akses terintegrasi untuk sistem informasi sekolah, presensi guru & pegawai, generator RKT/RKS, serta asisten pembuatan soal ujian otomatis.
            </p>
            
            {/* Search Input Bar */}
            <div className="pt-2">
              <div className="relative max-w-xl">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari sistem, presensi, RKT, atau soal generator..."
                  className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Highlight Banner for 4 Required Links */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse"></span>
              Sistem Utama & Tautan Penting
            </h2>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Akses Cepat Harian
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {INITIAL_RESOURCES.filter(r => r.category === 'utama').map(res => {
              const isBookmarked = bookmarks.includes(res.id);
              return (
                <div
                  key={res.id}
                  onClick={() => handleCardClick(res)}
                  className="group relative bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/85 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-blue-500/50 dark:hover:border-blue-500/50 transition-all duration-200 cursor-pointer flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/50 group-hover:scale-105 transition-transform">
                        {getIcon(res.iconName)}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={(e) => toggleBookmark(res.id, e)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-amber-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                          title="Simpan ke Favorit"
                        >
                          {isBookmarked ? <BookmarkCheck className="w-4 h-4 text-amber-500 fill-amber-500" /> : <Bookmark className="w-4 h-4" />}
                        </button>
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                          {res.badge}
                        </span>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors flex items-center gap-1.5">
                        {res.title}
                        <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-blue-500" />
                      </h3>
                      <p className="mt-1.5 text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                        {res.description}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-semibold text-blue-600 dark:text-blue-400">
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      Aktif & Online
                    </span>
                    <span className="group-hover:translate-x-1 transition-transform inline-flex items-center gap-0.5">
                      Buka Link <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Category Filter Tabs & All Resources Grid */}
        <div className="space-y-6 pt-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Semua Sumber Daya & Dokumen
            </h2>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0 scrollbar-none bg-slate-200/70 dark:bg-slate-900 p-1.5 rounded-xl border border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setActiveCategory('all')}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition ${activeCategory === 'all' ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'}`}
              >
                Semua
              </button>
              <button
                onClick={() => setActiveCategory('utama')}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition ${activeCategory === 'utama' ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'}`}
              >
                Layanan Utama
              </button>
              <button
                onClick={() => setActiveCategory('kurikulum')}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition ${activeCategory === 'kurikulum' ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'}`}
              >
                Kurikulum
              </button>
              <button
                onClick={() => setActiveCategory('kepegawaian')}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition ${activeCategory === 'kepegawaian' ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'}`}
              >
                Kepegawaian
              </button>
              <button
                onClick={() => setActiveCategory('bookmarks')}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition flex items-center gap-1 ${activeCategory === 'bookmarks' ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'}`}
              >
                <Bookmark className="w-3.5 h-3.5" /> Favorit
              </button>
            </div>
          </div>

          {/* Resources Grid */}
          {filteredResources.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8">
              <HelpCircle className="w-12 h-12 text-slate-400 mx-auto mb-3" />
              <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">Tidak ada sumber daya ditemukan</h3>
              <p className="text-xs text-slate-500 mt-1">Coba gunakan kata kunci pencarian yang berbeda atau ubah kategori filter.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredResources.map(res => {
                const isBookmarked = bookmarks.includes(res.id);
                return (
                  <div
                    key={res.id}
                    onClick={() => handleCardClick(res)}
                    className="group bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/85 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-blue-500/50 dark:hover:border-blue-500/50 transition-all duration-200 cursor-pointer flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 group-hover:scale-105 transition-transform">
                          {getIcon(res.iconName)}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={(e) => toggleBookmark(res.id, e)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-amber-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                            title="Simpan ke Favorit"
                          >
                            {isBookmarked ? <BookmarkCheck className="w-4 h-4 text-amber-500 fill-amber-500" /> : <Bookmark className="w-4 h-4" />}
                          </button>
                          {res.badge && (
                            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                              {res.badge}
                            </span>
                          )}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors flex items-center gap-1.5">
                          {res.title}
                          {res.isExternal && <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-blue-500 transition-colors" />}
                        </h3>
                        <p className="mt-1.5 text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                          {res.description}
                        </p>
                      </div>
                    </div>

                    <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                      <span>{res.isExternal ? 'Tautan Eksternal' : 'Dokumen Internal'}</span>
                      <span className="font-medium text-blue-600 dark:text-blue-400 group-hover:underline flex items-center gap-1">
                        Akses <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Announcements & Info Section */}
        <section className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Bell className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              Pengumuman & Informasi Terbaru
            </h2>
            <span className="text-xs text-slate-500 dark:text-slate-400">Pusat Informasi Akademik</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ANNOUNCEMENTS.map(item => (
              <div key={item.id} className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span className="font-semibold text-blue-600 dark:text-blue-400">Pengumuman Resmi</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> {item.date}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {item.content}
                </p>
              </div>
            ))}
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="mt-auto bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-8 px-4 sm:px-6 lg:px-8 text-center text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800 dark:text-slate-200">Bogota Academic Center</span>
            <span>— Portal Layanan Terpadu & Sumber Daya Pendidikan</span>
          </div>
          <p>© {new Date().getFullYear()} Bogota Academic Center. Hak Cipta Dilindungi.</p>
        </div>
      </footer>

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-6 py-2 flex items-center justify-around shadow-lg">
        <button
          onClick={() => { setActiveTab('home'); setActiveCategory('all'); }}
          className={`flex flex-col items-center gap-1 text-[11px] font-medium transition ${activeTab === 'home' && activeCategory === 'all' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400'}`}
        >
          <Compass className="w-5 h-5" />
          Beranda
        </button>
        <button
          onClick={() => { setActiveTab('resources'); setActiveCategory('utama'); }}
          className={`flex flex-col items-center gap-1 text-[11px] font-medium transition ${activeCategory === 'utama' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400'}`}
        >
          <Laptop className="w-5 h-5" />
          Utama
        </button>
        <button
          onClick={() => { setActiveTab('announcements'); }}
          className={`flex flex-col items-center gap-1 text-[11px] font-medium transition ${activeTab === 'announcements' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400'}`}
        >
          <Bell className="w-5 h-5" />
          Info
        </button>
        <button
          onClick={() => { setActiveTab('bookmarks'); setActiveCategory('bookmarks'); }}
          className={`flex flex-col items-center gap-1 text-[11px] font-medium transition ${activeCategory === 'bookmarks' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400'}`}
        >
          <Bookmark className="w-5 h-5" />
          Favorit
        </button>
      </div>

      {/* External Link Redirect Modal */}
      {selectedLinkModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200 dark:border-slate-800 space-y-6">
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
                <ExternalLink className="w-6 h-6" />
              </div>
              <button
                onClick={() => setSelectedLinkModal(null)}
                className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Buka Tautan Eksternal?
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Anda akan diarahkan ke <span className="font-semibold text-blue-600 dark:text-blue-400">{selectedLinkModal.title}</span> di alamat:
              </p>
              <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-mono text-slate-700 dark:text-slate-200 break-all border border-slate-200 dark:border-slate-700">
                {selectedLinkModal.url}
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setSelectedLinkModal(null)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                Batal
              </button>
              <a
                href={selectedLinkModal.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setSelectedLinkModal(null)}
                className="flex-1 px-4 py-2.5 rounded-xl bg-blue-600 text-sm font-semibold text-white hover:bg-blue-700 transition flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25"
              >
                Lanjutkan <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

// PWA Install Button Component for Header
function PWAInstallHeaderBtn() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSModal, setShowIOSModal] = useState(false);

  useEffect(() => {
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;
    setIsInstalled(isStandalone);

    const isIOSDevice = /iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase());
    setIsIOS(isIOSDevice);

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  if (isInstalled) return null;

  if (deferredPrompt) {
    return (
      <button
        onClick={async () => {
          if (!deferredPrompt) return;
          deferredPrompt.prompt();
          const { outcome } = await deferredPrompt.userChoice;
          if (outcome === 'accepted') {
            setIsInstalled(true);
            setDeferredPrompt(null);
          }
        }}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition"
      >
        <Download className="w-3.5 h-3.5" />
        Install App
      </button>
    );
  }

  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSModal(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          <Smartphone className="w-3.5 h-3.5" />
          Install iOS
        </button>

        {showIOSModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-xl border border-slate-200 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Install di iPhone / iPad</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                1. Ketuk tombol <strong>Share</strong> (ikon panah keluar) di Safari.<br />
                2. Pilih <strong>Add to Home Screen</strong> (Tambah ke Layar Utama).
              </p>
              <button
                onClick={() => setShowIOSModal(false)}
                className="w-full py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700"
              >
                Tutup
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
}
