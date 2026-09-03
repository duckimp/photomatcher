import React, { useRef, useState } from 'react';
import { Folder, FolderOpen, Upload, FileSpreadsheet, FileDown, Plus, CheckCircle2, ChevronRight, Layers, Sparkles, Loader2, Check } from 'lucide-react';
import { parseExcelFile, downloadSampleExcelTemplate } from '../utils/excelParser';
import { parseDroppedItems, parseInputFiles } from '../utils/folderReader';
import { openDownloadsFolder } from '../utils/fileOpener';

export default function ExplorerPanel({
  onExcelLoaded,
  onPhotosLoaded,
  folders = [],
  activeFolder,
  onSelectFolder,
  classes = [],
  activeClass,
  onSelectClass,
  studentsCountByClass = {},
  onShowToast,
}) {
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [loadingText, setLoadingText] = useState('');
  const [downloadTemplateStatus, setDownloadTemplateStatus] = useState('idle'); // 'idle' | 'downloading' | 'success'
  const excelInputRef = useRef(null);
  const folderInputRef = useRef(null);
  const photoInputRef = useRef(null);

  // Handle Download Sample Excel Template with In-App Toast & Open Folder action
  const handleDownloadSampleTemplate = async () => {
    if (downloadTemplateStatus !== 'idle') return; // Prevent spam click duplicate downloads

    try {
      setDownloadTemplateStatus('downloading');
      downloadSampleExcelTemplate();

      // Trigger In-App Toast notification
      if (onShowToast) {
        onShowToast({
          type: 'excel',
          title: 'Template Excel Berhasil Diunduh!',
          message: 'File "Template_Data_Siswa_PhotoMatcher.xlsx" telah tersimpan di folder Downloads perangkatmu.',
          actionLabel: 'Buka Folder Download',
          onAction: openDownloadsFolder,
          duration: 6000,
        });
      }

      setDownloadTemplateStatus('success');
      setTimeout(() => {
        setDownloadTemplateStatus('idle');
      }, 2500);
    } catch (err) {
      alert(`Gagal mengunduh template: ${err.message}`);
      setDownloadTemplateStatus('idle');
    }
  };

  // Handle Excel Upload
  const handleExcelChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setLoadingText('Membaca file Excel...');
      const result = await parseExcelFile(file);
      onExcelLoaded(result);
      setLoadingText('');
    } catch (err) {
      alert(`Gagal membaca file Excel: ${err.message}`);
      setLoadingText('');
    }
  };

  // Handle Folder Upload via <input webkitdirectory>
  const handleFolderChange = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setLoadingText('Memproses folder foto...');
      const photos = await parseInputFiles(files, (msg) => setLoadingText(msg));
      onPhotosLoaded(photos);
      setLoadingText('');
    } catch (err) {
      alert(`Gagal memuat foto: ${err.message}`);
      setLoadingText('');
    }
  };

  // Handle Individual / Multiple Photo Files Upload
  const handlePhotoFilesChange = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setLoadingText('Membuat thumbnail foto...');
      const photos = await parseInputFiles(files, (msg) => setLoadingText(msg));
      onPhotosLoaded(photos);
      setLoadingText('');
    } catch (err) {
      alert(`Gagal memuat foto: ${err.message}`);
      setLoadingText('');
    }
  };

  // Handle Drag & Drop of Folders / Files
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);

    const items = e.dataTransfer.items;
    const files = e.dataTransfer.files;

    if (items && items.length > 0) {
      // Check if dropped file is an Excel file
      if (files.length === 1 && (files[0].name.endsWith('.xlsx') || files[0].name.endsWith('.xls') || files[0].name.endsWith('.csv'))) {
        try {
          setLoadingText('Membaca file Excel...');
          const result = await parseExcelFile(files[0]);
          onExcelLoaded(result);
          setLoadingText('');
          return;
        } catch (err) {
          alert(`Gagal membaca Excel: ${err.message}`);
          setLoadingText('');
          return;
        }
      }

      // Otherwise parse as photos / folder
      try {
        setLoadingText('Memindai folder foto...');
        const photos = await parseDroppedItems(items, (msg) => setLoadingText(msg));
        if (photos.length > 0) {
          onPhotosLoaded(photos);
        } else {
          alert('Tidak ditemukan file gambar yang valid dalam folder yang di-drop.');
        }
        setLoadingText('');
      } catch (err) {
        alert(`Gagal membaca item: ${err.message}`);
        setLoadingText('');
      }
    }
  };

  return (
    <aside className="w-64 bg-slate-50/80 dark:bg-zinc-900 border-r border-slate-200 dark:border-zinc-700 flex flex-col shrink-0 h-full overflow-hidden select-none transition-colors duration-200">
      {/* Hidden inputs */}
      <input
        type="file"
        ref={excelInputRef}
        onChange={handleExcelChange}
        accept=".xlsx,.xls,.csv"
        className="hidden"
      />
      <input
        type="file"
        ref={folderInputRef}
        onChange={handleFolderChange}
        webkitdirectory="true"
        directory="true"
        multiple
        className="hidden"
      />
      <input
        type="file"
        ref={photoInputRef}
        onChange={handlePhotoFilesChange}
        multiple
        accept="image/*"
        className="hidden"
      />

      {/* Explorer Header */}
      <div className="p-3 border-b border-slate-200 dark:border-zinc-700 flex items-center justify-between bg-white/70 dark:bg-zinc-900/80">
        <div className="flex items-center gap-2">
          <FolderOpen className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          <span className="text-xs font-bold text-slate-800 dark:text-zinc-200 tracking-wide uppercase">Source Explorer</span>
        </div>
        <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-mono">Panel Kiri</span>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-3 space-y-4 overflow-y-auto">
        {/* Step 1: Import Excel Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-600 dark:text-zinc-400">
            <span className="flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center text-[10px] font-bold">1</span>
              Import Data Siswa
            </span>
          </div>

          <button
            onClick={() => excelInputRef.current?.click()}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-3 bg-white dark:bg-zinc-800 hover:bg-purple-50 dark:hover:bg-zinc-700 text-purple-700 dark:text-purple-300 hover:text-purple-800 dark:hover:text-white border border-purple-200 dark:border-zinc-700/80 hover:border-purple-300 dark:hover:border-purple-500/60 rounded-xl text-xs font-semibold transition-all shadow-sm group"
          >
            <FileSpreadsheet className="w-4 h-4 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform" />
            <span>Pilih File Excel (.xlsx)</span>
          </button>

          <button
            onClick={handleDownloadSampleTemplate}
            disabled={downloadTemplateStatus !== 'idle'}
            className={`w-full flex items-center justify-center gap-1.5 py-1 px-2 text-[10px] rounded-lg transition-all ${
              downloadTemplateStatus === 'success'
                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-semibold border border-emerald-200 dark:border-emerald-800'
                : downloadTemplateStatus === 'downloading'
                ? 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/40 cursor-wait'
                : 'text-slate-500 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800'
            }`}
          >
            {downloadTemplateStatus === 'downloading' ? (
              <>
                <Loader2 className="w-3 h-3 animate-spin text-purple-600 dark:text-purple-400" />
                <span>Mengunduh Template...</span>
              </>
            ) : downloadTemplateStatus === 'success' ? (
              <>
                <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                <span>Format Terunduh! ✓</span>
              </>
            ) : (
              <>
                <FileDown className="w-3 h-3 text-slate-400 dark:text-zinc-500" />
                <span>Unduh Contoh Format Excel</span>
              </>
            )}
          </button>
        </div>

        {/* Step 2: Dropzone & Import Photos */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-600 dark:text-zinc-400">
            <span className="flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center text-[10px] font-bold">2</span>
              Import Folder / File Foto
            </span>
          </div>

          {/* Drag and Drop Zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`p-3.5 border-2 border-dashed rounded-xl flex flex-col items-center justify-center text-center transition-all ${
              isDraggingOver
                ? 'border-purple-500 bg-purple-50 dark:bg-purple-950/30 scale-[0.99]'
                : 'border-slate-200 dark:border-zinc-700 bg-white/60 dark:bg-zinc-900/60 hover:border-slate-300 dark:hover:border-zinc-700/80 hover:bg-white dark:hover:bg-zinc-900 shadow-sm'
            }`}
          >
            <Folder className={`w-8 h-8 mb-1.5 transition-colors ${isDraggingOver ? 'text-purple-600 dark:text-purple-400 animate-bounce' : 'text-slate-400 dark:text-zinc-500'}`} />
            <p className="text-xs font-semibold text-slate-700 dark:text-zinc-300">Drag & Drop Folder Disini</p>
            <p className="text-[10px] text-slate-500 dark:text-zinc-500 mt-0.5">atau gunakan tombol di bawah</p>

            <div className="grid grid-cols-2 gap-1.5 w-full mt-3">
              <button
                onClick={() => folderInputRef.current?.click()}
                className="py-1.5 px-2 bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 border border-slate-200 dark:border-zinc-700/80 rounded-lg text-[11px] font-medium text-slate-700 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white transition-colors flex items-center justify-center gap-1 shadow-sm"
                title="Pilih seluruh folder foto lokal"
              >
                <Folder className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                <span>Pilih Folder</span>
              </button>
              <button
                onClick={() => photoInputRef.current?.click()}
                className="py-1.5 px-2 bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 border border-slate-200 dark:border-zinc-700/80 rounded-lg text-[11px] font-medium text-slate-700 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white transition-colors flex items-center justify-center gap-1 shadow-sm"
                title="Pilih beberapa file foto langsung"
              >
                <Upload className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                <span>Pilih File</span>
              </button>
            </div>
          </div>
        </div>

        {/* Loading Indicator */}
        {loadingText && (
          <div className="p-2.5 bg-purple-50 dark:bg-zinc-800 border border-purple-200 dark:border-zinc-700/80 rounded-xl flex items-center gap-2 animate-pulse">
            <div className="w-3 h-3 rounded-full border-2 border-purple-600 dark:border-purple-400 border-t-transparent animate-spin" />
            <span className="text-[11px] text-purple-700 dark:text-purple-200 truncate">{loadingText}</span>
          </div>
        )}

        {/* Classes Explorer List */}
        {classes.length > 0 && (
          <div className="space-y-1.5 pt-2 border-t border-slate-200 dark:border-zinc-700">
            <div className="flex items-center justify-between text-[11px] font-semibold text-slate-600 dark:text-zinc-400 px-1">
              <span className="flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                Daftar Rombel / Kelas
              </span>
              <span className="text-[10px] font-mono text-slate-400 dark:text-zinc-500">{classes.length} Kelas</span>
            </div>

            {/* "Semua Kelas" Option */}
            <button
              onClick={() => onSelectClass('ALL')}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                activeClass === 'ALL'
                  ? 'bg-purple-600 text-white font-semibold shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2 truncate">
                <Layers className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">Semua Kelas</span>
              </div>
              <span className="text-[10px] font-mono opacity-80">
                {Object.values(studentsCountByClass).reduce((a, b) => a + b, 0)}
              </span>
            </button>

            {/* Individual Classes */}
            <div className="space-y-0.5 max-h-48 overflow-y-auto pr-1">
              {classes.map((cls) => {
                const count = studentsCountByClass[cls] || 0;
                const isSelected = activeClass === cls;

                return (
                  <button
                    key={cls}
                    onClick={() => onSelectClass(cls)}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                      isSelected
                        ? 'bg-purple-600 text-white font-semibold shadow-sm'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <ChevronRight className={`w-3 h-3 shrink-0 ${isSelected ? 'text-white' : 'text-slate-400 dark:text-zinc-600'}`} />
                      <span className="truncate">Kelas {cls}</span>
                    </div>
                    <span className="text-[10px] font-mono opacity-75">{count} siswa</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Explorer Footer info */}
      <div className="p-2.5 border-t border-slate-200 dark:border-zinc-700 bg-white/60 dark:bg-zinc-900/80 text-[10px] text-slate-500 dark:text-zinc-500 text-center font-mono">
        Drop folder foto kelas & siap eksekusi
      </div>
    </aside>
  );
}
