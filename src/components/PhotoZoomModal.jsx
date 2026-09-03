import React from 'react';
import { X, User, Image } from 'lucide-react';

export default function PhotoZoomModal({ photo, student, onClose }) {
  if (!photo) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 dark:bg-black/90 backdrop-blur-md" onClick={onClose}>
      <div
        className="relative max-w-lg w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-2xl shadow-2xl overflow-hidden animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-900/80">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-white">
            <Image className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span className="truncate max-w-xs">{photo.originalName}</span>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Image Preview */}
        <div className="p-4 flex items-center justify-center bg-slate-100 dark:bg-zinc-950 min-h-[320px] max-h-[480px]">
          <img
            src={photo.thumbnailUrl}
            alt={photo.originalName}
            className="max-h-[440px] max-w-full rounded-xl object-contain shadow-lg border border-slate-200 dark:border-zinc-800"
          />
        </div>

        {/* Footer Info */}
        <div className="p-4 border-t border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-900/80 space-y-2">
          {student && (
            <div className="p-2.5 bg-purple-50 dark:bg-zinc-800 border border-purple-200 dark:border-zinc-700 rounded-xl flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-2 text-xs">
                <User className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span className="text-slate-600 dark:text-zinc-300">Terpasang ke:</span>
                <span className="font-semibold text-slate-900 dark:text-white">{student.nama}</span>
              </div>
              <span className="px-2 py-0.5 bg-purple-600 text-white rounded text-[10px] font-mono font-bold">{student.kelas}</span>
            </div>
          )}
          <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-500 dark:text-zinc-500 font-mono">
            <div>Nama File: <span className="text-slate-800 dark:text-zinc-200 font-medium">{photo.originalName}</span></div>
            <div>Ukuran: <span className="text-slate-800 dark:text-zinc-200 font-medium">{(photo.size / 1024).toFixed(1)} KB</span></div>
            <div>Folder Asal: <span className="text-slate-800 dark:text-zinc-200 font-medium">{photo.folderPath || 'Default'}</span></div>
            {student && <div>NISN: <span className="text-purple-700 dark:text-purple-400 font-bold">{student.nisn}</span></div>}
          </div>
        </div>
      </div>
    </div>
  );
}
