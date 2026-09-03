import React, { useState } from 'react';
import { X, Coffee, Heart, ExternalLink, Copy, Check, Sparkles, QrCode } from 'lucide-react';
import qrSaweriaImg from '../assets/QRsaweria.png';
import { openExternalUrl } from '../utils/linkOpener';

export default function DonateModal({ isOpen, onClose }) {
  const [copied, setCopied] = useState(false);
  const saweriaUrl = 'https://saweria.co/amlab';

  if (!isOpen) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(saweriaUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl shadow-2xl overflow-hidden animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Banner with Warm Gradient */}
        <div className="relative p-5 bg-gradient-to-br from-amber-500 via-orange-500 to-rose-500 text-white overflow-hidden">
          <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none" />
          <div className="absolute top-2 right-2 flex items-center gap-1">
            <button
              onClick={onClose}
              className="p-1.5 text-white/80 hover:text-white rounded-full hover:bg-white/20 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/20 backdrop-blur-md rounded-2xl shadow-inner border border-white/30 text-white">
              <Coffee className="w-6 h-6 animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold tracking-tight">Traktir Kopi Pengembang</h3>
                <span className="px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-semibold tracking-wide">
                  AM-Lab
                </span>
              </div>
              <p className="text-xs text-white/90">Dukung kelangsungan & pengembangan PhotoMatcher.id</p>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4">
          {/* Heartfelt Quote */}
          <div className="p-3.5 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 rounded-2xl flex items-start gap-3">
            <Heart className="w-4 h-4 text-rose-500 shrink-0 mt-0.5 fill-rose-500" />
            <p className="text-xs text-slate-700 dark:text-zinc-300 leading-relaxed font-medium">
              <strong className="text-amber-800 dark:text-amber-300">PhotoMatcher.id 100% gratis!</strong> Jika aplikasi ini berhasil menghemat waktu kerjamu berjam-jam hari ini, kamu bisa menyisihkan sedikit rezeki untuk mentraktir secangkir kopi bagi pengembangnya.
            </p>
          </div>

          {/* Section: Left (Button Kopi Santai) & Right (QR Code Saweria White BG) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
            {/* Left Column: Button Kopi Santai + Direct Link */}
            <div className="flex flex-col gap-2.5 h-full justify-between">
              <button
                onClick={(e) => openExternalUrl(saweriaUrl, e)}
                className="p-3.5 bg-amber-50/80 hover:bg-amber-100 dark:bg-zinc-800/80 dark:hover:bg-amber-950/40 border border-amber-200 dark:border-zinc-700 hover:border-amber-400 dark:hover:border-amber-600 rounded-2xl transition-all group shadow-sm flex flex-col justify-center h-full w-full text-left"
              >
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-amber-500 text-white rounded-xl shadow-sm group-hover:scale-110 transition-transform">
                    <Coffee className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400">
                      ☕ Kopi Santai
                    </p>
                    <p className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400">
                      Rp 10.000
                    </p>
                  </div>
                </div>
                <p className="text-[10px] text-slate-500 dark:text-zinc-400 mt-2 leading-relaxed">
                  Penambah fokus &amp; booster ngoding fitur-fitur baru!
                </p>
              </button>

              {/* Supported Payment badges */}
              <div className="p-2 bg-slate-50 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700 rounded-xl">
                <p className="text-[9px] font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider mb-1">
                  Metode Pembayaran:
                </p>
                <p className="text-[10px] font-medium text-slate-700 dark:text-zinc-300">
                  QRIS, GoPay, OVO, DANA, ShopeePay
                </p>
              </div>
            </div>

            {/* Right Column: QR Code Image with Clean White Background */}
            <div className="flex flex-col items-center justify-center p-3 bg-white rounded-2xl border-2 border-amber-200 shadow-md">
              <div className="w-36 h-36 flex items-center justify-center overflow-hidden rounded-xl bg-white">
                <img
                  src={qrSaweriaImg}
                  alt="QR Saweria AM-Lab"
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/QRsaweria.jpeg';
                  }}
                />
              </div>
              <p className="text-[10px] font-mono text-slate-600 font-semibold mt-1.5 flex items-center gap-1">
                <span>📷</span> Scan QRIS Saweria
              </p>
            </div>
          </div>

          {/* Direct Link Box with Copy Button */}
          <div className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl text-xs font-mono">
            <span className="text-slate-600 dark:text-zinc-400 truncate max-w-[260px]">
              {saweriaUrl}
            </span>
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-1 px-2.5 py-1 bg-white dark:bg-zinc-700 hover:bg-slate-100 dark:hover:bg-zinc-600 border border-slate-200 dark:border-zinc-600 rounded-lg text-slate-700 dark:text-zinc-200 font-sans text-xs transition-colors shadow-sm shrink-0"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
              <span>{copied ? 'Tersalin!' : 'Salin Link'}</span>
            </button>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="px-5 py-3.5 border-t border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900/80 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-3.5 py-2 text-xs font-semibold text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            Mungkin Nanti
          </button>
          <button
            onClick={(e) => openExternalUrl(saweriaUrl, e)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-amber-500/25 transition-all transform hover:scale-[1.02]"
          >
            <Coffee className="w-4 h-4" />
            <span>Buka Saweria AM-Lab</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-80" />
          </button>
        </div>
      </div>
    </div>
  );
}
