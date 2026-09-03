import React, { useState } from 'react';
import { X, MessageSquare, Mail, Globe, Send, Copy, Check, ExternalLink, Heart, Coffee } from 'lucide-react';
import qrSaweriaImg from '../assets/QRsaweria.png';
import { openExternalUrl } from '../utils/linkOpener';

function GithubIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

function TikTokIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 003 15.68a6.34 6.34 0 0010.86 4.45 6.27 6.27 0 001.88-4.47V8.62a8.28 8.28 0 004.85 1.56V6.69z" />
    </svg>
  );
}

export default function FeedbackModal({ isOpen, onClose }) {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const email = 'imprator1881@gmail.com';
  const githubUrl = 'https://github.com/duckimp';
  const tiktokUrl = 'https://www.tiktok.com/@frc1803';
  const portfolioUrl = 'https://duckimp.vercel.app';
  const saweriaUrl = 'https://saweria.co/amlab';

  if (!isOpen) return null;

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleSendEmail = async (e) => {
    e.preventDefault();
    const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject || 'Kritik & Saran PhotoMatcher.id')}&body=${encodeURIComponent(message)}`;
    await openExternalUrl(mailtoLink);
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
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-850">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 rounded-2xl border border-purple-200 dark:border-purple-800">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Kritik, Saran & Donasi</h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400">AM-Lab — @duckimp</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Saweria QR & Traktir Kopi Section */}
          <div className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-zinc-850 dark:to-zinc-800 border border-amber-200 dark:border-zinc-700 rounded-2xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
              {/* Left: Button Kopi Santai */}
              <div className="flex flex-col justify-between h-full gap-2">
                <div>
                  <div className="flex items-center gap-1.5 text-amber-800 dark:text-amber-300 font-bold text-xs mb-1">
                    <Coffee className="w-4 h-4" />
                    <span>Dukung Pengembang</span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-zinc-400 leading-tight">
                    Suka dengan PhotoMatcher? Traktir secangkir kopi untuk penyemangat ngoding!
                  </p>
                </div>

                <button
                  onClick={(e) => openExternalUrl(saweriaUrl, e)}
                  className="flex items-center gap-2 p-2.5 w-full bg-white dark:bg-zinc-900 hover:bg-amber-100 dark:hover:bg-zinc-800 border border-amber-300 dark:border-zinc-600 rounded-xl transition-all group shadow-sm text-left"
                >
                  <div className="p-1.5 bg-amber-500 text-white rounded-lg group-hover:scale-110 transition-transform">
                    <Coffee className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 dark:text-white">☕ Kopi Santai</p>
                    <p className="text-[11px] font-mono font-semibold text-amber-600 dark:text-amber-400">Rp 10.000</p>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400 ml-auto opacity-70 group-hover:opacity-100" />
                </button>
              </div>

              {/* Right: QR Code with White Background */}
              <div className="flex flex-col items-center justify-center p-2.5 bg-white rounded-xl border border-amber-200 shadow-sm">
                <div className="w-28 h-28 flex items-center justify-center overflow-hidden rounded-lg bg-white">
                  <img
                    src={qrSaweriaImg}
                    alt="QR Saweria"
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/QRsaweria.jpeg';
                    }}
                  />
                </div>
                <span className="text-[9px] font-mono text-slate-500 font-medium mt-1">Scan QRIS Saweria</span>
              </div>
            </div>
          </div>

          {/* Social Profiles Grid */}
          <div>
            <p className="text-[11px] font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider mb-2.5">
              Hubungi / Ikuti Kami di Media Sosial:
            </p>
            <div className="grid grid-cols-2 gap-2.5">
              {/* GitHub */}
              <button
                onClick={(e) => openExternalUrl(githubUrl, e)}
                className="flex items-center gap-2.5 p-3 rounded-2xl bg-slate-50 dark:bg-zinc-800 hover:bg-slate-100 dark:hover:bg-zinc-700/80 border border-slate-200 dark:border-zinc-700 transition-all group shadow-sm w-full text-left"
              >
                <div className="p-2 bg-slate-900 text-white rounded-xl">
                  <GithubIcon className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-800 dark:text-zinc-200">GitHub</p>
                  <p className="text-[10px] text-slate-500 dark:text-zinc-400 truncate">@duckimp</p>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>

              {/* TikTok */}
              <button
                onClick={(e) => openExternalUrl(tiktokUrl, e)}
                className="flex items-center gap-2.5 p-3 rounded-2xl bg-slate-50 dark:bg-zinc-800 hover:bg-slate-100 dark:hover:bg-zinc-700/80 border border-slate-200 dark:border-zinc-700 transition-all group shadow-sm w-full text-left"
              >
                <div className="p-2 bg-pink-600 text-white rounded-xl">
                  <TikTokIcon className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-800 dark:text-zinc-200">TikTok</p>
                  <p className="text-[10px] text-slate-500 dark:text-zinc-400 truncate">@frc1803</p>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>

              {/* Portfolio */}
              <button
                onClick={(e) => openExternalUrl(portfolioUrl, e)}
                className="flex items-center gap-2.5 p-3 rounded-2xl bg-slate-50 dark:bg-zinc-800 hover:bg-slate-100 dark:hover:bg-zinc-700/80 border border-slate-200 dark:border-zinc-700 transition-all group shadow-sm w-full text-left"
              >
                <div className="p-2 bg-purple-600 text-white rounded-xl">
                  <Globe className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-800 dark:text-zinc-200">Portofolio</p>
                  <p className="text-[10px] text-slate-500 dark:text-zinc-400 truncate">duckimp.vercel.app</p>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>

              {/* Email Direct */}
              <button
                type="button"
                onClick={handleCopyEmail}
                className="flex items-center gap-2.5 p-3 rounded-2xl bg-slate-50 dark:bg-zinc-800 hover:bg-slate-100 dark:hover:bg-zinc-700/80 border border-slate-200 dark:border-zinc-700 transition-all text-left shadow-sm group"
              >
                <div className="p-2 bg-emerald-600 text-white rounded-xl">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-800 dark:text-zinc-200">Email</p>
                  <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono truncate">
                    {copiedEmail ? 'Tersalin! ✓' : email}
                  </p>
                </div>
              </button>
            </div>
          </div>

          {/* Quick Feedback Form */}
          <form onSubmit={handleSendEmail} className="space-y-3 pt-2 border-t border-slate-200 dark:border-zinc-800">
            <p className="text-[11px] font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">
              Kirim Pesan Cepat via Email:
            </p>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Topik / Subjek Masukan (Opsional)"
              className="w-full py-2 px-3 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl text-xs text-slate-800 dark:text-zinc-200 focus:outline-none focus:border-purple-500 shadow-sm"
            />
            <textarea
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tuliskan kritik, bug, saran fitur baru, atau pertanyaanmu di sini..."
              className="w-full py-2 px-3 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl text-xs text-slate-800 dark:text-zinc-200 focus:outline-none focus:border-purple-500 shadow-sm resize-none"
            />
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-purple-600/20 transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Buka Email Client & Kirim</span>
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-850 flex items-center justify-between text-[11px] text-slate-500 dark:text-zinc-400">
          <span className="flex items-center gap-1">
            Dibuat dengan <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> oleh <strong>AM-Lab</strong>
          </span>
          <button onClick={onClose} className="hover:text-slate-900 dark:hover:text-white font-medium">
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
