import React, { useState, useEffect, useRef } from 'react';
import { X, Trash2, AlertTriangle } from 'lucide-react';

export default function ConfirmDeleteModal({ isOpen, onClose, onConfirm, stats }) {
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef(null);
  const isConfirmable = inputValue.trim().toLowerCase() === 'delete';

  // Reset input when modal opens / closes
  useEffect(() => {
    if (isOpen) {
      setInputValue('');
      // Auto-focus input after brief animation delay
      setTimeout(() => inputRef.current?.focus(), 80);
    }
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  const handleConfirm = () => {
    if (!isConfirmable) return;
    onConfirm();
    onClose();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && isConfirmable) {
      handleConfirm();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-zinc-800 bg-rose-50 dark:bg-rose-950/30">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-400 rounded-xl border border-rose-200 dark:border-rose-800">
              <Trash2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Reset Seluruh Data</h3>
              <p className="text-xs text-rose-600 dark:text-rose-400 font-medium">Tindakan ini tidak dapat dibatalkan</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg hover:bg-rose-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          {/* Warning box */}
          <div className="flex items-start gap-3 p-3.5 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 rounded-xl">
            <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-800 dark:text-amber-200 leading-relaxed">
              Semua data siswa, foto yang telah di-upload, dan hasil pencocokan akan dihapus permanen dari sesi ini.
            </p>
          </div>

          {/* Stats of what will be deleted */}
          {stats && (
            <div className="grid grid-cols-3 gap-2">
              <div className="p-2.5 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl text-center">
                <p className="text-lg font-bold text-rose-600 dark:text-rose-400 font-mono">{stats.students}</p>
                <p className="text-[10px] text-slate-500 dark:text-zinc-400 font-medium">Siswa</p>
              </div>
              <div className="p-2.5 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl text-center">
                <p className="text-lg font-bold text-rose-600 dark:text-rose-400 font-mono">{stats.photos}</p>
                <p className="text-[10px] text-slate-500 dark:text-zinc-400 font-medium">Foto Pool</p>
              </div>
              <div className="p-2.5 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl text-center">
                <p className="text-lg font-bold text-rose-600 dark:text-rose-400 font-mono">{stats.matched}</p>
                <p className="text-[10px] text-slate-500 dark:text-zinc-400 font-medium">Terpasang</p>
              </div>
            </div>
          )}

          {/* Confirmation Input */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300 block">
              Ketik{' '}
              <code className="px-1.5 py-0.5 bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 rounded font-mono font-bold border border-rose-200 dark:border-rose-800 text-[11px]">
                delete
              </code>{' '}
              untuk mengkonfirmasi penghapusan:
            </label>
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ketik: delete"
              autoComplete="off"
              spellCheck={false}
              className={`w-full py-2.5 px-3.5 rounded-xl text-sm font-mono font-semibold border-2 focus:outline-none transition-all ${
                inputValue === ''
                  ? 'bg-slate-50 dark:bg-zinc-800 border-slate-200 dark:border-zinc-700 text-slate-800 dark:text-zinc-200 focus:border-slate-400 dark:focus:border-zinc-600'
                  : isConfirmable
                  ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-500 dark:border-rose-600 text-rose-700 dark:text-rose-300 ring-2 ring-rose-500/30'
                  : 'bg-slate-50 dark:bg-zinc-800 border-slate-300 dark:border-zinc-600 text-slate-800 dark:text-zinc-200 focus:border-slate-400'
              }`}
            />
            {inputValue.length > 0 && !isConfirmable && (
              <p className="text-[11px] text-slate-400 dark:text-zinc-500 font-mono pl-1">
                {inputValue.length}/6 karakter — harus persis <strong>"delete"</strong>
              </p>
            )}
            {isConfirmable && (
              <p className="text-[11px] text-rose-600 dark:text-rose-400 font-semibold pl-1 flex items-center gap-1">
                <span>✓</span> Konfirmasi valid — tekan tombol di bawah atau Enter
              </p>
            )}
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="px-5 py-4 border-t border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900/80 flex items-center justify-end gap-2.5">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-zinc-300 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 hover:bg-slate-100 dark:hover:bg-zinc-700 rounded-lg transition-colors shadow-sm"
          >
            Batal
          </button>
          <button
            onClick={handleConfirm}
            disabled={!isConfirmable}
            className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg shadow-md shadow-rose-600/20 transition-all flex items-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Ya, Hapus Semua Data</span>
          </button>
        </div>
      </div>
    </div>
  );
}
