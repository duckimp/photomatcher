import React, { useState } from 'react';
import { Sliders, Play, RotateCcw, FileSpreadsheet, Archive, Tag } from 'lucide-react';
import { PRESET_TEMPLATES, formatStudentFilename } from '../utils/namingEngine';
import { generateAndDownloadZip } from '../utils/zipGenerator';
import { exportMatchedExcel } from '../utils/excelParser';
import confetti from 'canvas-confetti';

export default function ControlToolsPanel({
  classes = [],
  activeClass,
  onSelectClass,
  students = [],
  photoPool = [],
  matchedPairs = {},
  namingTemplate,
  onChangeNamingTemplate,
  availableTags = [],
  onAutoFillRemaining,
  onResetClassMatches,
  onExportSuccess,
}) {
  const [isExportingZip, setIsExportingZip] = useState(false);
  const [zipProgress, setZipProgress] = useState(0);
  const [zipStatusText, setZipStatusText] = useState('');

  const classStudents = activeClass === 'ALL' ? students : students.filter(s => s.kelas === activeClass);
  const totalInClass = classStudents.length;
  const matchedInClass = classStudents.filter(s => matchedPairs[s.id]).length;
  const progressPercent = totalInClass > 0 ? Math.round((matchedInClass / totalInClass) * 100) : 0;

  const sampleStudent = classStudents[0] || students[0] || {
    nisn: '0081234501',
    nama: "Ahmad Syafi'i/2026",
    kelas: activeClass !== 'ALL' ? activeClass : '7A',
    no_absen: '01',
    tgl_lahir: '2010-04-12'
  };

  const livePreviewFilename = formatStudentFilename(sampleStudent, namingTemplate, 'jpg');

  const handleInsertTag = (tag) => {
    const tagString = `{${tag}}`;
    if (!namingTemplate.includes(tagString)) {
      onChangeNamingTemplate(namingTemplate ? `${namingTemplate}_${tagString}` : tagString);
    }
  };

  const handleDownloadClassZip = async () => {
    if (matchedInClass === 0) {
      alert('Belum ada foto yang terpasang pada kelas ini.');
      return;
    }
    try {
      setIsExportingZip(true);
      setZipProgress(5);
      setZipStatusText('Menyiapkan file...');
      await generateAndDownloadZip(students, matchedPairs, namingTemplate, activeClass, (percent, status) => {
        setZipProgress(percent);
        setZipStatusText(status);
      });
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.7 } });
      setTimeout(() => {
        setIsExportingZip(false);
        setZipProgress(0);
        setZipStatusText('');
        if (onExportSuccess) {
          setTimeout(onExportSuccess, 800);
        }
      }, 1200);
    } catch (err) {
      alert(`Gagal mengunduh ZIP: ${err.message}`);
      setIsExportingZip(false);
    }
  };

  const handleExportExcel = () => {
    if (students.length === 0) { alert('Belum ada data siswa untuk di-export.'); return; }
    exportMatchedExcel(students, matchedPairs, namingTemplate, activeClass);
  };

  return (
    <aside className="w-80 bg-slate-50/80 dark:bg-zinc-900 border-l border-slate-200 dark:border-zinc-700 flex flex-col shrink-0 h-full overflow-hidden select-none transition-colors duration-200">
      {/* Panel Header */}
      <div className="p-3 border-b border-slate-200 dark:border-zinc-700 flex items-center justify-between bg-white/70 dark:bg-zinc-900/80">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          <span className="text-xs font-bold text-slate-800 dark:text-zinc-200 uppercase tracking-wide">Control & Export</span>
        </div>
        <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-mono">Panel Kanan</span>
      </div>

      <div className="flex-1 p-3.5 space-y-4 overflow-y-auto">
        {/* Class & Progress */}
        <div className="p-3 bg-white dark:bg-zinc-900/80 border border-slate-200 dark:border-zinc-700 rounded-xl space-y-2.5 shadow-sm">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300">Target Rombel / Kelas</label>
            <span className="text-[10px] font-mono text-purple-600 dark:text-purple-400 font-bold">{matchedInClass}/{totalInClass} Selesai</span>
          </div>
          <select
            value={activeClass}
            onChange={(e) => onSelectClass(e.target.value)}
            className="w-full py-1.5 px-2.5 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-lg text-xs text-slate-800 dark:text-zinc-200 font-medium focus:outline-none focus:border-purple-500 shadow-sm"
          >
            <option value="ALL">📁 Semua Kelas ({students.length} Siswa)</option>
            {classes.map((cls) => (
              <option key={cls} value={cls}>Kelas {cls} ({students.filter(s => s.kelas === cls).length} Siswa)</option>
            ))}
          </select>
          <div className="space-y-1">
            <div className="w-full bg-slate-100 dark:bg-zinc-800 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-purple-500 to-emerald-500 h-full transition-all duration-300 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-slate-500 dark:text-zinc-500 font-mono">
              <span>Kelengkapan Foto</span>
              <span className={progressPercent === 100 ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-slate-700 dark:text-zinc-300'}>
                {progressPercent}%
              </span>
            </div>
          </div>
        </div>

        {/* Naming Template Engine */}
        <div className="p-3 bg-white dark:bg-zinc-900/80 border border-slate-200 dark:border-zinc-700 rounded-xl space-y-3 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
              <label className="text-xs font-semibold text-slate-800 dark:text-zinc-200">Format Nama File</label>
            </div>
            <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-mono">Auto Sanitasi</span>
          </div>

          <input
            type="text"
            value={namingTemplate}
            onChange={(e) => onChangeNamingTemplate(e.target.value)}
            placeholder="{kelas}_{nisn}_{nama}"
            className="w-full py-2 px-3 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-lg text-xs font-mono text-purple-700 dark:text-purple-300 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/40"
          />

          {/* Tag Chips */}
          <div className="space-y-1.5">
            <p className="text-[10px] text-slate-500 dark:text-zinc-500 font-medium">Klik tag untuk menambahkan ke format:</p>
            <div className="flex flex-wrap gap-1">
              {availableTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => handleInsertTag(tag)}
                  className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-zinc-800 hover:bg-purple-600 hover:text-white dark:hover:bg-purple-600 dark:hover:text-white border border-slate-200 dark:border-zinc-700/80 text-slate-700 dark:text-zinc-300 text-[10px] font-mono transition-colors shadow-sm"
                >
                  +{tag}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Presets */}
          <div className="space-y-1.5 pt-1 border-t border-slate-100 dark:border-zinc-800">
            <p className="text-[10px] text-slate-500 dark:text-zinc-500 font-medium">Preset Cepat:</p>
            <div className="grid grid-cols-2 gap-1">
              {PRESET_TEMPLATES.slice(0, 4).map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => onChangeNamingTemplate(preset.format)}
                  className={`py-1 px-1.5 rounded text-[10px] font-medium border text-left truncate transition-colors shadow-sm ${
                    namingTemplate === preset.format
                      ? 'bg-purple-600 text-white border-purple-500'
                      : 'bg-slate-50 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 border-slate-200 dark:border-zinc-700 hover:bg-slate-100 dark:hover:bg-zinc-700'
                  }`}
                  title={preset.format}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Live Preview */}
          <div className="p-2.5 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-lg space-y-1">
            <span className="text-[10px] font-semibold text-slate-500 dark:text-zinc-500 uppercase tracking-wider block">Live Preview:</span>
            <p className="font-mono text-xs text-emerald-700 dark:text-emerald-400 font-semibold truncate bg-white dark:bg-zinc-950 p-1.5 rounded border border-emerald-200 dark:border-emerald-900/40 shadow-sm">
              {livePreviewFilename}
            </p>
            <p className="text-[9px] text-slate-400 dark:text-zinc-600">*Karakter ilegal otomatis diganti (_)</p>
          </div>
        </div>

        {/* Batch Actions */}
        <div className="space-y-2">
          <span className="text-[11px] font-semibold text-slate-600 dark:text-zinc-400 uppercase tracking-wider block px-1">Aksi Otomatisasi</span>
          <button
            onClick={onAutoFillRemaining}
            disabled={photoPool.length === 0 || totalInClass === 0}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-3 bg-purple-600 hover:bg-purple-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl text-xs font-semibold shadow-md shadow-purple-600/20 transition-all"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Auto-Fill Sisanya ({activeClass === 'ALL' ? 'Semua' : `Kelas ${activeClass}`})</span>
          </button>
          <button
            onClick={onResetClassMatches}
            disabled={matchedInClass === 0}
            className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 bg-white hover:bg-slate-100 dark:bg-zinc-800 dark:hover:bg-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed text-slate-700 dark:text-zinc-300 border border-slate-200 dark:border-zinc-700 rounded-lg text-xs font-medium transition-colors shadow-sm"
          >
            <RotateCcw className="w-3 h-3 text-slate-400 dark:text-zinc-500" />
            <span>Lepas Semua Foto Kelas Ini</span>
          </button>
        </div>

        {/* Export Center */}
        <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-zinc-700">
          <span className="text-[11px] font-semibold text-slate-600 dark:text-zinc-400 uppercase tracking-wider block px-1">Pusat Ekspor & Download</span>

          {isExportingZip && (
            <div className="p-3 bg-purple-50 dark:bg-zinc-800 border border-purple-200 dark:border-zinc-700/80 rounded-xl space-y-2 animate-pulse">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-purple-700 dark:text-purple-300">Membuat ZIP...</span>
                <span className="font-mono text-purple-700 dark:text-purple-400 font-bold">{zipProgress}%</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-zinc-700 rounded-full h-1.5 overflow-hidden">
                <div className="bg-purple-600 h-full transition-all duration-200" style={{ width: `${zipProgress}%` }} />
              </div>
              <p className="text-[10px] text-slate-600 dark:text-zinc-400 truncate font-mono">{zipStatusText}</p>
            </div>
          )}

          <button
            onClick={handleDownloadClassZip}
            disabled={isExportingZip || matchedInClass === 0}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl text-xs font-semibold shadow-md shadow-emerald-600/20 transition-all group"
          >
            <Archive className="w-4 h-4 group-hover:scale-110 transition-transform" />
            <span>Download ZIP Foto ({activeClass === 'ALL' ? 'Semua Kelas' : `Kelas ${activeClass}`})</span>
          </button>

          <button
            onClick={handleExportExcel}
            disabled={students.length === 0}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-white hover:bg-slate-100 dark:bg-zinc-800 dark:hover:bg-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed text-slate-700 dark:text-zinc-200 border border-slate-200 dark:border-zinc-700 rounded-xl text-xs font-medium transition-colors shadow-sm"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Export Excel Lengkap (.xlsx)</span>
          </button>
        </div>
      </div>

      <div className="p-2.5 border-t border-slate-200 dark:border-zinc-700 bg-white/60 dark:bg-zinc-900/80 text-[10px] text-slate-400 dark:text-zinc-600 text-center font-mono">
        Format nama otomatis tervalidasi OS
      </div>
    </aside>
  );
}
