import React, { useRef, useEffect, useState } from 'react';
import { User, CheckCircle2, XCircle, ArrowDown, Unlink, Eye } from 'lucide-react';

export default function StudentTablePanel({
  students = [],
  matchedPairs = {},
  activeStudentIndex = 0,
  onSelectStudent,
  onUnlinkPhoto,
  onShiftDown,
  onOpenZoom,
  onDropPhotoToStudent,
  activeClass,
  namingTemplate,
}) {
  const tableContainerRef = useRef(null);
  const activeRowRef = useRef(null);
  const [dragOverRowId, setDragOverRowId] = useState(null);

  useEffect(() => {
    if (activeRowRef.current && tableContainerRef.current) {
      activeRowRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [activeStudentIndex]);

  const handleDragOver = (e, studentId) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOverRowId(studentId);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOverRowId(null);
  };

  const handleDrop = (e, student) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOverRowId(null);
    try {
      const photoDataStr = e.dataTransfer.getData('application/json');
      if (photoDataStr) {
        const photo = JSON.parse(photoDataStr);
        onDropPhotoToStudent(photo, student);
      }
    } catch (err) {
      console.warn('Drop photo failed:', err);
    }
  };

  if (students.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-white/40 dark:bg-zinc-950 transition-colors duration-200">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 flex items-center justify-center mb-3 shadow-sm">
          <User className="w-8 h-8 text-slate-400 dark:text-zinc-600" />
        </div>
        <h3 className="text-base font-semibold text-slate-800 dark:text-zinc-300">Belum Ada Data Siswa</h3>
        <p className="text-xs text-slate-500 dark:text-zinc-500 max-w-sm mt-1">
          Import file Excel (.xlsx) melalui panel kiri atau klik tombol "Muat Demo Data" di atas untuk mencoba langsung.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-white/60 dark:bg-zinc-950 transition-colors duration-200">
      {/* Table Subheader */}
      <div className="px-4 py-2 bg-slate-50/90 dark:bg-zinc-900 border-b border-slate-200 dark:border-zinc-700 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-700 dark:text-zinc-300">Tabel Siswa:</span>
          <span className="px-2 py-0.5 rounded bg-purple-50 dark:bg-zinc-800 border border-purple-200 dark:border-zinc-700/80 text-purple-700 dark:text-purple-300 text-xs font-bold font-mono">
            {activeClass === 'ALL' ? 'Semua Kelas' : `Kelas ${activeClass}`}
          </span>
          <span className="text-xs text-slate-500 dark:text-zinc-500">({students.length} siswa)</span>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-zinc-400">
          <span className="hidden md:inline text-slate-400 dark:text-zinc-500">Navigasi Siswa:</span>
          <kbd className="px-1.5 py-0.5 bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded text-[10px] font-mono">↑</kbd>
          <kbd className="px-1.5 py-0.5 bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded text-[10px] font-mono">↓</kbd>
        </div>
      </div>

      {/* Table Viewport */}
      <div ref={tableContainerRef} className="flex-1 overflow-y-auto overflow-x-auto select-none">
        <table className="w-full text-left border-collapse text-xs">
          {/* Sticky Table Header */}
          <thead className="sticky top-0 z-20 bg-slate-100/95 dark:bg-zinc-900 backdrop-blur-sm border-b border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-400 text-[11px] uppercase tracking-wider font-semibold">
            <tr>
              <th className="py-2.5 px-3 w-12 text-center">No</th>
              <th className="py-2.5 px-3 w-28">NISN</th>
              <th className="py-2.5 px-3 min-w-[160px]">Nama Siswa</th>
              <th className="py-2.5 px-3 w-16 text-center">Kelas</th>
              <th className="py-2.5 px-3 w-40">Preview Foto</th>
              <th className="py-2.5 px-3 w-24 text-center">Status</th>
              <th className="py-2.5 px-3 w-36 text-center">Aksi / Koreksi</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 dark:divide-zinc-800 bg-white dark:bg-transparent">
            {students.map((student, index) => {
              const isActiveRow = index === activeStudentIndex;
              const matchedPhoto = matchedPairs[student.id];
              const isMatched = !!matchedPhoto;
              const isDraggedOver = dragOverRowId === student.id;

              return (
                <tr
                  key={student.id}
                  ref={isActiveRow ? activeRowRef : null}
                  onClick={() => onSelectStudent(index)}
                  onDragOver={(e) => handleDragOver(e, student.id)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, student)}
                  className={`transition-colors cursor-pointer group ${
                    isActiveRow
                      ? 'bg-purple-50/90 dark:bg-purple-950/20 font-medium'
                      : isMatched
                      ? 'bg-emerald-50/20 dark:bg-zinc-900/30 hover:bg-slate-50 dark:hover:bg-zinc-900'
                      : 'hover:bg-slate-50/80 dark:hover:bg-zinc-900/60'
                  } ${isDraggedOver ? 'bg-purple-100/80 dark:bg-purple-950/30 outline outline-2 outline-purple-500' : ''}`}
                >
                  {/* No */}
                  <td className="py-2.5 px-3 text-center font-mono text-slate-500 dark:text-zinc-500">
                    {isActiveRow ? (
                      <span className="inline-flex items-center justify-center w-5 h-5 rounded bg-purple-600 text-white font-bold text-[10px] shadow-sm">
                        {student.no_absen || index + 1}
                      </span>
                    ) : (
                      <span>{student.no_absen || index + 1}</span>
                    )}
                  </td>

                  {/* NISN */}
                  <td className="py-2.5 px-3 font-mono font-medium">
                    {student.nisn !== 'NULL' ? (
                      <span className="text-purple-700 dark:text-purple-400">{student.nisn}</span>
                    ) : (
                      <span className="text-slate-400 dark:text-zinc-600 italic">NULL</span>
                    )}
                  </td>

                  {/* Nama */}
                  <td className="py-2.5 px-3">
                    <div className="font-semibold text-slate-800 dark:text-zinc-100 flex items-center gap-1.5">
                      <span>{student.nama}</span>
                      {student.jk && (
                        <span className={`px-1 rounded text-[9px] font-mono font-semibold ${
                          student.jk === 'L'
                            ? 'bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800'
                            : 'bg-pink-100 dark:bg-pink-950/60 text-pink-700 dark:text-pink-400 border border-pink-200 dark:border-pink-800'
                        }`}>
                          {student.jk}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Kelas */}
                  <td className="py-2.5 px-3 text-center">
                    <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-zinc-300 font-mono font-medium text-[11px]">
                      {student.kelas}
                    </span>
                  </td>

                  {/* Preview Foto */}
                  <td className="py-2 px-3">
                    {isMatched ? (
                      <div className="flex items-center gap-2">
                        <div
                          className="relative w-10 h-12 rounded-lg overflow-hidden border border-emerald-500/70 shadow-sm shrink-0 group/thumb cursor-pointer"
                          onClick={(e) => { e.stopPropagation(); onOpenZoom(matchedPhoto, student); }}
                        >
                          <img src={matchedPhoto.thumbnailUrl} alt={matchedPhoto.originalName} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/thumb:opacity-100 flex items-center justify-center text-white transition-opacity">
                            <Eye className="w-3.5 h-3.5" />
                          </div>
                        </div>
                        <div className="truncate text-[10px]">
                          <p className="font-mono text-emerald-700 dark:text-emerald-400 font-semibold truncate max-w-[120px]">{matchedPhoto.assignedFilename}</p>
                          <p className="text-slate-400 dark:text-zinc-500 truncate max-w-[120px]">{matchedPhoto.originalName}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-12 rounded-lg border border-dashed border-slate-300 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-900 flex items-center justify-center shrink-0">
                          <User className="w-4 h-4 text-slate-400 dark:text-zinc-600" />
                        </div>
                        <span className="text-[10px] text-slate-400 dark:text-zinc-500 italic">Drag foto ke sini</span>
                      </div>
                    )}
                  </td>

                  {/* Status */}
                  <td className="py-2.5 px-3 text-center">
                    {isMatched ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-400 text-[10px] font-semibold">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Sesuai</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-500 dark:text-zinc-500 text-[10px]">
                        <XCircle className="w-3 h-3" />
                        <span>Kosong</span>
                      </span>
                    )}
                  </td>

                  {/* Aksi */}
                  <td className="py-2.5 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => onShiftDown(index)}
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-purple-600 text-slate-600 hover:text-white dark:bg-zinc-800 dark:hover:bg-purple-600 dark:text-zinc-300 border border-slate-200 dark:border-zinc-700 transition-colors shadow-sm"
                        title="Shift Down: Insert blank row (fix efek domino)"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                      {isMatched && (
                        <button
                          onClick={() => onUnlinkPhoto(student.id)}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-rose-600 text-slate-600 hover:text-white dark:bg-zinc-800 dark:hover:bg-rose-600 dark:text-zinc-300 border border-slate-200 dark:border-zinc-700 transition-colors shadow-sm"
                          title="Lepas foto dan kembalikan ke pool"
                        >
                          <Unlink className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
