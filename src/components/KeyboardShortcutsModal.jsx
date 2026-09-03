import React from 'react';
import { X, Keyboard, ShieldCheck } from 'lucide-react';

export default function KeyboardShortcutsModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const shortcuts = [
    {
      desc: 'Pilih / Navigasi foto di Pool atas',
      icon: <span className="flex gap-1"><kbd className="px-2 py-1 bg-slate-100 dark:bg-zinc-800 rounded border border-slate-200 dark:border-zinc-700/80 text-slate-800 dark:text-zinc-200 text-xs shadow-sm">←</kbd><kbd className="px-2 py-1 bg-slate-100 dark:bg-zinc-800 rounded border border-slate-200 dark:border-zinc-700/80 text-slate-800 dark:text-zinc-200 text-xs shadow-sm">→</kbd></span>
    },
    {
      desc: 'Pilih / Navigasi baris siswa di tabel',
      icon: <span className="flex gap-1"><kbd className="px-2 py-1 bg-slate-100 dark:bg-zinc-800 rounded border border-slate-200 dark:border-zinc-700/80 text-slate-800 dark:text-zinc-200 text-xs shadow-sm">↑</kbd><kbd className="px-2 py-1 bg-slate-100 dark:bg-zinc-800 rounded border border-slate-200 dark:border-zinc-700/80 text-slate-800 dark:text-zinc-200 text-xs shadow-sm">↓</kbd></span>
    },
    {
      desc: 'Pasang foto aktif ke siswa aktif & auto-pindah kursor ke baris berikutnya',
      icon: <kbd className="px-2.5 py-1 bg-purple-600 text-white font-semibold rounded border border-purple-500 text-xs shadow-sm">Enter / Space</kbd>
    },
    {
      desc: 'Hapus foto buram / sampah dari Pool atas (Skip & Delete Junk)',
      icon: <kbd className="px-2 py-1 bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 rounded border border-rose-300 dark:border-rose-800 text-xs shadow-sm">Del / Backspace</kbd>
    },
    {
      desc: 'Shift Down / Insert Blank — Mencegah efek domino geser foto',
      icon: <span className="flex gap-1"><kbd className="px-2 py-1 bg-slate-100 dark:bg-zinc-800 rounded border border-slate-200 dark:border-zinc-700/80 text-slate-800 dark:text-zinc-200 text-xs shadow-sm">Shift</kbd>+<kbd className="px-2 py-1 bg-slate-100 dark:bg-zinc-800 rounded border border-slate-200 dark:border-zinc-700/80 text-slate-800 dark:text-zinc-200 text-xs shadow-sm">S</kbd></span>
    },
    {
      desc: 'Lepas foto dari baris siswa aktif (kembalikan ke pool)',
      icon: <span className="flex gap-1"><kbd className="px-2 py-1 bg-slate-100 dark:bg-zinc-800 rounded border border-slate-200 dark:border-zinc-700/80 text-slate-800 dark:text-zinc-200 text-xs shadow-sm">Shift</kbd>+<kbd className="px-2 py-1 bg-slate-100 dark:bg-zinc-800 rounded border border-slate-200 dark:border-zinc-700/80 text-slate-800 dark:text-zinc-200 text-xs shadow-sm">U</kbd></span>
    },
    {
      desc: 'Buka / Tutup panduan shortcut keyboard',
      icon: <kbd className="px-2 py-1 bg-slate-100 dark:bg-zinc-800 rounded border border-slate-200 dark:border-zinc-700/80 text-slate-800 dark:text-zinc-200 text-xs shadow-sm">?</kbd>
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 dark:bg-black/80 backdrop-blur-sm" onClick={onClose}>
      <div
        className="relative w-full max-w-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-2xl shadow-2xl overflow-hidden animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-900/80">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 rounded-lg border border-purple-200 dark:border-purple-800">
              <Keyboard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Pintasan Navigasi Keyboard</h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400">Kerja 5x lebih cepat tanpa pegal menggerakkan mouse</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Shortcuts list */}
        <div className="p-6 space-y-3 max-h-[70vh] overflow-y-auto bg-white dark:bg-zinc-900">
          {shortcuts.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-zinc-900/80 border border-slate-200 dark:border-zinc-700 hover:border-slate-300 dark:hover:border-zinc-700/80 transition-colors shadow-sm">
              <span className="text-sm text-slate-700 dark:text-zinc-300 pr-4">{item.desc}</span>
              <div className="shrink-0">{item.icon}</div>
            </div>
          ))}
          <div className="p-3.5 bg-purple-50 dark:bg-zinc-800 border border-purple-200 dark:border-zinc-700 rounded-xl flex items-start gap-3 mt-4">
            <ShieldCheck className="w-5 h-5 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
            <p className="text-xs text-purple-900 dark:text-zinc-300 leading-relaxed">
              <span className="font-semibold text-purple-700 dark:text-purple-300">Tips:</span> Klik sekali pada pool foto atau tabel siswa untuk mengaktifkan navigasi keyboard. Tekan <strong>Enter</strong> berulang untuk mencocokkan foto secara kilat!
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-900/80 flex justify-end">
          <button onClick={onClose} className="px-5 py-2 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-lg shadow-md shadow-purple-600/20 transition-all">
            Mengerti & Siap Pakai
          </button>
        </div>
      </div>
    </div>
  );
}
