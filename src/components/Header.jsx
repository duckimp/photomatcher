import React from 'react';
import { Camera, CheckCircle2, Image as ImageIcon, Sparkles, HelpCircle, RotateCcw, FileSpreadsheet, Sun, Moon } from 'lucide-react';

export default function Header({
  totalStudents,
  matchedCount,
  poolCount,
  onLoadDemo,
  onResetAll,
  onOpenShortcuts,
  onOpenDonate,
  isAutoSaved,
  fileName,
  theme,
  onToggleTheme,
}) {
  const matchPercentage = totalStudents > 0 ? Math.round((matchedCount / totalStudents) * 100) : 0;

  return (
    <header className="h-14 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border-b border-slate-200 dark:border-zinc-700 px-4 flex items-center justify-between shrink-0 z-30 transition-colors duration-200">
      {/* Brand & File Badge */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center shadow-md shadow-purple-600/20">
            <Camera className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
                PhotoMatcher<span className="text-purple-600 dark:text-purple-400 font-mono text-xs font-semibold">.id</span>
              </h1>
              <span className="px-1.5 py-0.5 rounded bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 text-[10px] text-purple-700 dark:text-purple-300 font-medium font-mono">
                v1.0 Pro
              </span>
            </div>
            {fileName ? (
              <p className="text-[11px] text-slate-500 dark:text-zinc-400 truncate max-w-[200px] flex items-center gap-1">
                <FileSpreadsheet className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                <span className="text-emerald-700 dark:text-emerald-400 font-medium">{fileName}</span>
              </p>
            ) : (
              <p className="text-[10px] text-slate-500 dark:text-zinc-500 font-mono">Pencocokan Foto & Excel Siswa</p>
            )}
          </div>
        </div>

        {/* Auto-save badge */}
        <div className="hidden md:flex items-center gap-1.5 pl-3 border-l border-slate-200 dark:border-zinc-700 text-[11px] text-slate-500 dark:text-zinc-400">
          <span className={`w-2 h-2 rounded-full ${isAutoSaved ? 'bg-emerald-500 animate-pulse-subtle' : 'bg-amber-500'}`} />
          <span className="font-mono text-[10px]">{isAutoSaved ? 'Auto-saved' : 'Menyimpan...'}</span>
        </div>
      </div>

      {/* Center Stats Badges */}
      <div className="hidden lg:flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-1 bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span className="text-xs text-slate-600 dark:text-zinc-300">Terpasang:</span>
          <span className="text-xs font-bold font-mono text-emerald-700 dark:text-emerald-400">
            {matchedCount} / {totalStudents}
          </span>
          <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-200 dark:border-emerald-800/50">
            {matchPercentage}%
          </span>
        </div>

        <div className="flex items-center gap-2 px-3 py-1 bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg">
          <ImageIcon className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
          <span className="text-xs text-slate-600 dark:text-zinc-300">Pool Foto:</span>
          <span className="text-xs font-bold font-mono text-purple-600 dark:text-purple-400">{poolCount} foto</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        {/* Donate / Traktir Kopi Button */}
        <button
          onClick={onOpenDonate}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-amber-900 dark:text-amber-300 bg-gradient-to-r from-amber-100 to-amber-200 dark:from-amber-950/60 dark:to-amber-900/60 border border-amber-300 dark:border-amber-700 hover:from-amber-200 hover:to-amber-300 dark:hover:from-amber-900/80 dark:hover:to-amber-850/80 transition-all shadow-sm shadow-amber-500/10 group"
          title="Traktir Kopi Pengembang (Saweria AM-Lab)"
        >
          <span className="text-sm group-hover:scale-125 transition-transform">☕</span>
          <span className="hidden sm:inline font-semibold">Traktir Kopi</span>
        </button>

        {/* Theme Switcher Toggle (Light / Dark) */}
        <button
          onClick={onToggleTheme}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-700 dark:text-zinc-200 bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 border border-slate-200 dark:border-zinc-700 transition-colors shadow-sm"
          title={theme === 'dark' ? 'Ganti ke Mode Terang (Light Mode)' : 'Ganti ke Mode Gelap (Dark Mode)'}
        >
          {theme === 'dark' ? (
            <>
              <Sun className="w-4 h-4 text-amber-400 transition-transform rotate-0 hover:rotate-45" />
              <span className="hidden sm:inline text-[11px] font-medium">Light</span>
            </>
          ) : (
            <>
              <Moon className="w-4 h-4 text-purple-600 transition-transform -rotate-12 hover:rotate-0" />
              <span className="hidden sm:inline text-[11px] font-medium">Dark</span>
            </>
          )}
        </button>

        {/* Load Demo Button */}
        <button
          onClick={onLoadDemo}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-amber-900 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700/50 hover:bg-amber-100 dark:hover:bg-amber-900/50 transition-all shadow-sm"
          title="Muat data contoh siswa dan avatar foto untuk uji coba instan"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 animate-pulse" />
          <span className="hidden sm:inline">Muat Demo Data</span>
          <span className="sm:hidden">Demo</span>
        </button>

        {/* Keyboard Shortcuts Trigger */}
        <button
          onClick={onOpenShortcuts}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-700 dark:text-zinc-300 bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 border border-slate-200 dark:border-zinc-700 transition-colors"
          title="Panduan Pintasan Keyboard (?)"
        >
          <HelpCircle className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
          <span className="hidden sm:inline font-mono">Shortcut</span>
          <kbd className="hidden md:inline px-1 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded text-[10px] font-mono">?</kbd>
        </button>

        {/* Reset Workspace */}
        {totalStudents > 0 && (
          <button
            onClick={onResetAll}
            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:text-zinc-400 dark:hover:text-rose-400 dark:hover:bg-rose-950/40 border border-transparent hover:border-rose-200 dark:hover:border-rose-900/50 transition-colors"
            title="Reset Seluruh Data & Foto"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        )}
      </div>
    </header>
  );
}
