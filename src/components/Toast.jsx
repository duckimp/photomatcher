import React, { useEffect, useState } from 'react';
import { CheckCircle2, FileSpreadsheet, FolderOpen, X, ExternalLink, Info, AlertTriangle } from 'lucide-react';

export default function Toast({ toast, onClose }) {
  if (!toast) return null;

  const {
    id,
    type = 'success', // 'success' | 'info' | 'warning'
    title = 'Notifikasi',
    message = '',
    actionLabel = 'Buka Folder Download',
    onAction = null,
    duration = 5000,
  } = toast;

  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(remaining);
      if (remaining <= 0) {
        clearInterval(interval);
        onClose();
      }
    }, 50);

    return () => clearInterval(interval);
  }, [duration, onClose, id]);

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />,
    excel: <FileSpreadsheet className="w-5 h-5 text-emerald-500 shrink-0" />,
    info: <Info className="w-5 h-5 text-purple-500 shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />,
  };

  return (
    <div className="fixed bottom-12 right-6 z-[80] max-w-sm w-full animate-slide-up select-none">
      <div className="relative bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-2xl shadow-2xl p-4 overflow-hidden backdrop-blur-md">
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-slate-100 dark:bg-zinc-800">
          <div
            className="h-full bg-emerald-500 transition-all duration-75"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Content */}
        <div className="flex items-start gap-3 mt-0.5">
          <div className="p-2 bg-emerald-50 dark:bg-emerald-950/50 rounded-xl border border-emerald-200 dark:border-emerald-800/60">
            {icons[type] || icons.success}
          </div>

          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
              {title}
            </h4>
            {message && (
              <p className="text-[11px] text-slate-600 dark:text-zinc-400 mt-1 leading-snug break-words">
                {message}
              </p>
            )}

            {/* Action Button (Buka Folder) */}
            {onAction && (
              <div className="mt-2.5 flex items-center gap-2">
                <button
                  onClick={() => {
                    onAction();
                    onClose();
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-all transform hover:scale-[1.02]"
                >
                  <FolderOpen className="w-3.5 h-3.5" />
                  <span>{actionLabel}</span>
                </button>
              </div>
            )}
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
