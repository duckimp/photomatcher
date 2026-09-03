import React, { useRef, useEffect } from 'react';
import { Image as ImageIcon, Trash2, Maximize2, Zap, ArrowRight, Check } from 'lucide-react';

export default function PhotoPoolPanel({
  photos = [],
  selectedIndex = 0,
  onSelectPhoto,
  onDeletePhoto,
  onOpenZoom,
  onDragStart,
  onAssignToActiveStudent,
}) {
  const containerRef = useRef(null);
  const activeItemRef = useRef(null);

  // Auto-scroll to selected photo when index changes via keyboard navigation
  useEffect(() => {
    if (activeItemRef.current && containerRef.current) {
      activeItemRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      });
    }
  }, [selectedIndex]);

  return (
    <div className="h-44 bg-slate-50/70 dark:bg-zinc-950 border-b border-slate-200 dark:border-zinc-700 flex flex-col shrink-0 overflow-hidden transition-colors duration-200">
      {/* Top Header of Photo Pool */}
      <div className="px-4 py-2 border-b border-slate-200 dark:border-zinc-700 bg-white/80 dark:bg-zinc-900 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="p-1 bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 rounded-md">
            <ImageIcon className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-bold text-slate-800 dark:text-zinc-200 uppercase tracking-wider">
            Pool Foto Antrean (Belum Terpasang)
          </span>
          <span className="px-2 py-0.5 rounded-full bg-purple-100 dark:bg-zinc-800 border border-purple-200 dark:border-zinc-700/80 text-[11px] font-mono text-purple-700 dark:text-purple-300 font-bold">
            {photos.length} Foto
          </span>
        </div>

        {/* Quick Instructions / Actions */}
        <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-zinc-400">
          <div className="hidden sm:flex items-center gap-1.5 text-[11px]">
            <span className="text-slate-400 dark:text-zinc-500">Pilih:</span>
            <kbd className="px-1.5 py-0.5 bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700/80 rounded text-[10px] font-mono">←</kbd>
            <kbd className="px-1.5 py-0.5 bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700/80 rounded text-[10px] font-mono">→</kbd>
            <span className="text-slate-400 dark:text-zinc-500 ml-1">Pasang:</span>
            <kbd className="px-1.5 py-0.5 bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 rounded text-[10px] font-mono font-semibold">Enter / Space</kbd>
          </div>

          {photos.length > 0 && (
            <button
              onClick={() => onAssignToActiveStudent()}
              className="flex items-center gap-1 px-2.5 py-1 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-semibold shadow-sm shadow-purple-600/20 transition-colors"
              title="Pasang foto aktif ke baris siswa yang sedang dipilih"
            >
              <Zap className="w-3 h-3 text-amber-300" />
              <span>Pasang ke Siswa Aktif</span>
            </button>
          )}
        </div>
      </div>

      {/* Photos Horizontal Scroll / Grid Area */}
      <div
        ref={containerRef}
        className="flex-1 p-2.5 overflow-x-auto overflow-y-hidden flex items-center gap-2.5 select-none"
      >
        {photos.length === 0 ? (
          <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 dark:text-zinc-500 border-2 border-dashed border-slate-200 dark:border-zinc-700 rounded-xl bg-white/40 dark:bg-transparent">
            <ImageIcon className="w-6 h-6 mb-1 text-slate-300 dark:text-zinc-600" />
            <p className="text-xs font-medium text-slate-600 dark:text-zinc-400">Pool foto kosong</p>
            <p className="text-[10px] text-slate-400 dark:text-zinc-500">
              Silakan import folder foto dari panel kiri atau muat demo data
            </p>
          </div>
        ) : (
          photos.map((photo, index) => {
            const isSelected = index === selectedIndex;

            return (
              <div
                key={photo.id}
                ref={isSelected ? activeItemRef : null}
                onClick={() => onSelectPhoto(index)}
                onDoubleClick={() => onAssignToActiveStudent(index)}
                draggable
                onDragStart={(e) => onDragStart(e, photo)}
                className={`relative group shrink-0 w-24 h-32 rounded-xl overflow-hidden cursor-grab active:cursor-grabbing border-2 transition-all duration-150 ${
                  isSelected
                    ? 'border-purple-600 dark:border-purple-500 ring-2 ring-purple-500/50 scale-105 shadow-lg shadow-purple-600/30 z-10'
                    : 'border-slate-200 dark:border-zinc-700 hover:border-slate-300 dark:hover:border-zinc-700/80 bg-white dark:bg-zinc-900 shadow-sm'
                }`}
              >
                {/* Photo Image */}
                <img
                  src={photo.thumbnailUrl}
                  alt={photo.originalName}
                  className="w-full h-full object-cover pointer-events-none"
                  loading="lazy"
                />

                {/* Index Badge */}
                <div className="absolute top-1 left-1 px-1.5 py-0.5 bg-black/80 backdrop-blur-sm rounded text-[9px] font-mono font-bold text-white border border-white/10">
                  #{index + 1}
                </div>

                {/* Active Indicator Icon */}
                {isSelected && (
                  <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-purple-600 flex items-center justify-center text-white shadow-md animate-scale-in">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                )}

                {/* Hover Overlay Controls */}
                <div className="absolute inset-x-0 bottom-0 p-1 bg-gradient-to-t from-black/95 via-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-between">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenZoom(photo);
                    }}
                    className="p-1 bg-zinc-800/90 hover:bg-purple-600 text-zinc-300 hover:text-white rounded transition-colors"
                    title="Perbesar Foto"
                  >
                    <Maximize2 className="w-3 h-3" />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeletePhoto(photo.id);
                    }}
                    className="p-1 bg-zinc-800/90 hover:bg-rose-600 text-zinc-300 hover:text-white rounded transition-colors"
                    title="Hapus / Skip Foto Junk (Del)"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>

                {/* Bottom filename tooltip */}
                <div className="absolute inset-x-0 bottom-0 px-1 py-0.5 bg-black/80 backdrop-blur-sm text-[8px] font-mono text-zinc-200 truncate text-center group-hover:hidden">
                  {photo.originalName}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
