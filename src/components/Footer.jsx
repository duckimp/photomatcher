import React from 'react';
import { Heart, Coffee, MessageSquare, Globe } from 'lucide-react';
import { openExternalUrl } from '../utils/linkOpener';

function GithubIcon({ className = 'w-3.5 h-3.5' }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

function TikTokIcon({ className = 'w-3.5 h-3.5' }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 003 15.68a6.34 6.34 0 0010.86 4.45 6.27 6.27 0 001.88-4.47V8.62a8.28 8.28 0 004.85 1.56V6.69z" />
    </svg>
  );
}

export default function Footer({ onOpenDonate, onOpenFeedback }) {
  const githubUrl = 'https://github.com/duckimp';
  const tiktokUrl = 'https://www.tiktok.com/@frc1803';
  const portfolioUrl = 'https://duckimp.vercel.app';

  return (
    <footer className="h-8 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border-t border-slate-200 dark:border-zinc-800 px-4 flex items-center justify-between text-xs shrink-0 select-none z-20 transition-colors duration-200">
      {/* Left Branding */}
      <div className="flex items-center gap-2 text-slate-500 dark:text-zinc-400 text-[11px]">
        <span>PhotoMatcher.id</span>
        <span className="text-slate-300 dark:text-zinc-700">•</span>
        <span className="flex items-center gap-1">
          Developed by{' '}
          <button
            onClick={(e) => openExternalUrl(portfolioUrl, e)}
            className="font-bold text-slate-800 dark:text-zinc-200 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
          >
            AM-Lab
          </button>
        </span>
        <span className="text-slate-300 dark:text-zinc-700 hidden sm:inline">•</span>
        <span className="hidden sm:inline text-slate-400 dark:text-zinc-500 font-mono text-[10px]">
          100% Client-Side Safe
        </span>
      </div>

      {/* Center Action Chips (Donate & Feedback) */}
      <div className="flex items-center gap-2">
        <button
          onClick={onOpenDonate}
          className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/50 hover:bg-amber-100 dark:hover:bg-amber-900/60 border border-amber-300 dark:border-amber-700/60 text-amber-800 dark:text-amber-300 font-semibold text-[11px] transition-all shadow-sm group"
        >
          <Coffee className="w-3 h-3 text-amber-600 dark:text-amber-400 group-hover:rotate-12 transition-transform" />
          <span>Traktir Kopi ☕</span>
        </button>

        <button
          onClick={onOpenFeedback}
          className="hidden md:flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 dark:bg-zinc-800 hover:bg-purple-50 dark:hover:bg-purple-950/50 border border-slate-200 dark:border-zinc-700 hover:border-purple-300 text-slate-600 dark:text-zinc-300 hover:text-purple-600 dark:hover:text-purple-300 text-[11px] transition-colors"
        >
          <MessageSquare className="w-3 h-3" />
          <span>Kritik &amp; Saran</span>
        </button>
      </div>

      {/* Right Social Links */}
      <div className="flex items-center gap-3 text-slate-400 dark:text-zinc-500">
        <button
          onClick={(e) => openExternalUrl(githubUrl, e)}
          className="hover:text-slate-900 dark:hover:text-white transition-colors"
          title="GitHub @duckimp"
        >
          <GithubIcon className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={(e) => openExternalUrl(tiktokUrl, e)}
          className="hover:text-pink-500 dark:hover:text-pink-400 transition-colors"
          title="TikTok @frc1803"
        >
          <TikTokIcon className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={(e) => openExternalUrl(portfolioUrl, e)}
          className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
          title="Portofolio duckimp.vercel.app"
        >
          <Globe className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={onOpenFeedback}
          className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors text-[11px] font-medium"
          title="Kirim Email Kritik & Saran"
        >
          ✉️
        </button>
      </div>
    </footer>
  );
}
