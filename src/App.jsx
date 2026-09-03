import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Header from './components/Header';
import ExplorerPanel from './components/ExplorerPanel';
import PhotoPoolPanel from './components/PhotoPoolPanel';
import StudentTablePanel from './components/StudentTablePanel';
import ControlToolsPanel from './components/ControlToolsPanel';
import KeyboardShortcutsModal from './components/KeyboardShortcutsModal';
import PhotoZoomModal from './components/PhotoZoomModal';
import ConfirmDeleteModal from './components/ConfirmDeleteModal';
import DonateModal from './components/DonateModal';
import FeedbackModal from './components/FeedbackModal';
import Footer from './components/Footer';
import { extractAvailableTags, formatStudentFilename } from './utils/namingEngine';
import { generateDemoDataset } from './utils/sampleData';
import { saveDraftState, loadDraftState, clearDraftState } from './utils/storage';
import { revokeAllManagedObjectURLs } from './utils/imageCompressor';

export default function App() {
  // Theme state: 'light' | 'dark'
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('photomatcher_theme') || 'light';
  });

  // Main data state
  const [fileName, setFileName] = useState('');
  const [headers, setHeaders] = useState([]);
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [activeClass, setActiveClass] = useState('ALL');
  const [folders, setFolders] = useState([]);
  const [activeFolder, setActiveFolder] = useState('');

  // Photos & Matches state
  const [photoPool, setPhotoPool] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState({}); // studentId -> { photoId, originalFile, originalName, assignedFilename, thumbnailUrl, folderPath }

  // Navigation & Selection state
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const [activeStudentIndex, setActiveStudentIndex] = useState(0);
  const [namingTemplate, setNamingTemplate] = useState('{kelas}_{nisn}_{nama}');

  // Modals & UI state
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [zoomedPhotoState, setZoomedPhotoState] = useState(null); // { photo, student }
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [isDonateOpen, setIsDonateOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [isAutoSaved, setIsAutoSaved] = useState(true);

  // Sync theme with document class and localStorage
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('photomatcher_theme', theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  // Available naming tags extracted from headers
  const availableTags = useMemo(() => extractAvailableTags(headers), [headers]);

  // Filtered students according to active class
  const filteredStudents = useMemo(() => {
    if (activeClass === 'ALL') return students;
    return students.filter((s) => s.kelas === activeClass);
  }, [students, activeClass]);

  // Students count per class map
  const studentsCountByClass = useMemo(() => {
    const counts = {};
    students.forEach((s) => {
      const cls = s.kelas || 'Default';
      counts[cls] = (counts[cls] || 0) + 1;
    });
    return counts;
  }, [students]);

  // Statistics calculation
  const totalStudents = students.length;
  const matchedCount = useMemo(() => {
    return Object.keys(matchedPairs).filter((id) => students.some((s) => s.id === id)).length;
  }, [matchedPairs, students]);

  // Handle Excel Loaded
  const handleExcelLoaded = (excelData) => {
    setFileName(excelData.fileName);
    setHeaders(excelData.headers);
    setStudents(excelData.students);
    setClasses(excelData.classes);
    if (excelData.classes.length > 0) {
      setActiveClass(excelData.classes[0]); // default to first class
    }
    setActiveStudentIndex(0);
  };

  // Handle Photos Loaded (with automatic deduplication)
  const handlePhotosLoaded = (newPhotos) => {
    // Collect unique folder names
    const folderSet = new Set(folders);
    newPhotos.forEach((p) => {
      if (p.folderPath) folderSet.add(p.folderPath);
    });
    setFolders(Array.from(folderSet));

    setPhotoPool((prev) => {
      // Prevent duplicates by comparing filename, size, and folder path against both pool & matched photos
      const existingKeys = new Set([
        ...prev.map((p) => `${p.originalName}_${p.size}_${p.folderPath || ''}`),
        ...Object.values(matchedPairs).map((m) => `${m.originalName}_${m.size}_${m.folderPath || ''}`)
      ]);
      
      const uniqueNewPhotos = newPhotos.filter((p) => {
        const key = `${p.originalName}_${p.size}_${p.folderPath || ''}`;
        if (existingKeys.has(key)) return false;
        existingKeys.add(key);
        return true;
      });

      return [...prev, ...uniqueNewPhotos];
    });
    setSelectedPhotoIndex(0);
  };

  // Assign photo to a specific student
  const assignPhotoToStudent = useCallback((photo, student) => {
    if (!photo || !student) return;

    const ext = photo.originalName ? photo.originalName.split('.').pop() || 'jpg' : 'jpg';
    const assignedFilename = formatStudentFilename(student, namingTemplate, ext);
    const oldMatch = matchedPairs[student.id];

    // 1. Assign to student
    setMatchedPairs((prev) => ({
      ...prev,
      [student.id]: {
        photoId: photo.id,
        originalFile: photo.originalFile,
        originalName: photo.originalName,
        size: photo.size,
        thumbnailUrl: photo.thumbnailUrl,
        folderPath: photo.folderPath,
        assignedFilename,
      },
    }));

    // 2. Remove assigned photo from pool; if replacing an existing photo, return old photo to pool
    setPhotoPool((prevPool) => {
      let nextPool = prevPool.filter((p) => p.id !== photo.id);
      if (oldMatch && oldMatch.photoId !== photo.id) {
        if (!nextPool.some((p) => p.id === oldMatch.photoId)) {
          nextPool = [
            ...nextPool,
            {
              id: oldMatch.photoId,
              originalFile: oldMatch.originalFile,
              originalName: oldMatch.originalName,
              size: oldMatch.size,
              thumbnailUrl: oldMatch.thumbnailUrl,
              folderPath: oldMatch.folderPath,
            },
          ];
        }
      }
      return nextPool;
    });
  }, [namingTemplate, matchedPairs]);

  // Click-to-Assign / Keyboard Enter handler for active photo & student
  const handleAssignActivePhotoToActiveStudent = useCallback((photoIdx = null) => {
    const pIndex = photoIdx !== null ? photoIdx : selectedPhotoIndex;
    const photo = photoPool[pIndex];
    const student = filteredStudents[activeStudentIndex];

    if (!photo || !student) return;

    assignPhotoToStudent(photo, student);

    // Adjust selectedPhotoIndex if we consumed the last item
    if (photoPool.length <= 1) {
      setSelectedPhotoIndex(0);
    } else if (pIndex >= photoPool.length - 1) {
      setSelectedPhotoIndex(photoPool.length - 2);
    }

    // Auto-advance active student cursor down by 1 row
    if (activeStudentIndex < filteredStudents.length - 1) {
      setActiveStudentIndex((prev) => prev + 1);
    }
  }, [selectedPhotoIndex, photoPool, filteredStudents, activeStudentIndex, assignPhotoToStudent]);

  // Quick Delete / Skip junk photo from pool
  const handleDeletePhotoFromPool = useCallback((photoId) => {
    setPhotoPool((prev) => {
      const next = prev.filter((p) => p.id !== photoId);
      if (selectedPhotoIndex >= next.length && next.length > 0) {
        setSelectedPhotoIndex(next.length - 1);
      }
      return next;
    });
  }, [selectedPhotoIndex]);

  // Unlink photo from student and return it back to pool
  const handleUnlinkPhoto = useCallback((studentId) => {
    const match = matchedPairs[studentId];
    if (!match) return;

    // Return to photo pool
    setPhotoPool((prev) => [
      ...prev,
      {
        id: match.photoId,
        originalFile: match.originalFile,
        originalName: match.originalName,
        size: match.size,
        thumbnailUrl: match.thumbnailUrl,
        folderPath: match.folderPath,
      },
    ]);

    // Remove from matched pairs
    setMatchedPairs((prev) => {
      const next = { ...prev };
      delete next[studentId];
      return next;
    });
  }, [matchedPairs]);

  // Shift Down / Insert Blank: Prevents Domino Effect when a student is skipped
  const handleShiftDown = useCallback((fromRowIndex) => {
    if (filteredStudents.length === 0 || fromRowIndex < 0 || fromRowIndex >= filteredStudents.length) return;

    setMatchedPairs((prev) => {
      const next = { ...prev };
      const studentsToShift = filteredStudents.slice(fromRowIndex);

      // Check if the last student had a matched photo to avoid losing it
      const lastStudent = studentsToShift[studentsToShift.length - 1];
      if (next[lastStudent.id]) {
        const displacedPhoto = next[lastStudent.id];
        setPhotoPool((currentPool) => [
          ...currentPool,
          {
            id: displacedPhoto.photoId,
            originalFile: displacedPhoto.originalFile,
            originalName: displacedPhoto.originalName,
            size: displacedPhoto.size,
            thumbnailUrl: displacedPhoto.thumbnailUrl,
            folderPath: displacedPhoto.folderPath,
          },
        ]);
      }

      // Shift matched photos from bottom to top
      for (let i = studentsToShift.length - 1; i > 0; i--) {
        const currentStudent = studentsToShift[i];
        const prevStudent = studentsToShift[i - 1];

        if (next[prevStudent.id]) {
          const match = next[prevStudent.id];
          const ext = match.originalName ? match.originalName.split('.').pop() || 'jpg' : 'jpg';
          next[currentStudent.id] = {
            ...match,
            assignedFilename: formatStudentFilename(currentStudent, namingTemplate, ext),
          };
        } else {
          delete next[currentStudent.id];
        }
      }

      // Empty the target row to create blank spot for the missed photo
      delete next[studentsToShift[0].id];

      return next;
    });
  }, [filteredStudents, namingTemplate]);

  // Auto-fill remaining unmatched students in current class sequentially
  const handleAutoFillRemaining = useCallback(() => {
    if (photoPool.length === 0 || filteredStudents.length === 0) return;

    // Find all unmatched students in filtered list
    const unmatchedStudents = filteredStudents.filter((s) => !matchedPairs[s.id]);
    if (unmatchedStudents.length === 0) {
      alert('Semua siswa pada kelas ini sudah memiliki foto.');
      return;
    }

    const countToFill = Math.min(unmatchedStudents.length, photoPool.length);
    const photosToAssign = photoPool.slice(0, countToFill);
    const remainingPhotos = photoPool.slice(countToFill);

    setMatchedPairs((prev) => {
      const next = { ...prev };
      for (let i = 0; i < countToFill; i++) {
        const student = unmatchedStudents[i];
        const photo = photosToAssign[i];
        const ext = photo.originalName ? photo.originalName.split('.').pop() || 'jpg' : 'jpg';

        next[student.id] = {
          photoId: photo.id,
          originalFile: photo.originalFile,
          originalName: photo.originalName,
          size: photo.size,
          thumbnailUrl: photo.thumbnailUrl,
          folderPath: photo.folderPath,
          assignedFilename: formatStudentFilename(student, namingTemplate, ext),
        };
      }
      return next;
    });

    setPhotoPool(remainingPhotos);
    setSelectedPhotoIndex(0);
  }, [photoPool, filteredStudents, matchedPairs, namingTemplate]);

  // Reset matches for active class
  const handleResetClassMatches = useCallback(() => {
    if (filteredStudents.length === 0) return;

    const returnedPhotos = [];
    setMatchedPairs((prev) => {
      const next = { ...prev };
      filteredStudents.forEach((s) => {
        if (next[s.id]) {
          const match = next[s.id];
          returnedPhotos.push({
            id: match.photoId,
            originalFile: match.originalFile,
            originalName: match.originalName,
            size: match.size,
            thumbnailUrl: match.thumbnailUrl,
            folderPath: match.folderPath,
          });
          delete next[s.id];
        }
      });
      return next;
    });

    if (returnedPhotos.length > 0) {
      setPhotoPool((prev) => [...prev, ...returnedPhotos]);
    }
  }, [filteredStudents]);

  // Handle Drag Start from Photo Pool
  const handleDragStartPhoto = (e, photo) => {
    e.dataTransfer.setData('application/json', JSON.stringify(photo));
  };

  // Handle Drop Photo to a Student Row
  const handleDropPhotoToStudent = (photo, student) => {
    assignPhotoToStudent(photo, student);
  };

  // Load Demo Data Dataset
  const handleLoadDemo = async () => {
    try {
      const demoData = await generateDemoDataset();
      setFileName(demoData.fileName);
      setHeaders(demoData.headers);
      setStudents(demoData.students);
      setClasses(demoData.classes);
      setActiveClass('7A');
      setFolders(demoData.folders);
      setPhotoPool(demoData.photos);
      setMatchedPairs({});
      setSelectedPhotoIndex(0);
      setActiveStudentIndex(0);
    } catch (err) {
      alert(`Gagal memuat demo data: ${err.message}`);
    }
  };

  // Open reset confirmation modal
  const handleResetAll = () => {
    setIsConfirmDeleteOpen(true);
  };

  // Execute actual reset after typed confirmation
  const handleConfirmReset = useCallback(() => {
    revokeAllManagedObjectURLs();
    setFileName('');
    setHeaders([]);
    setStudents([]);
    setClasses([]);
    setActiveClass('ALL');
    setFolders([]);
    setPhotoPool([]);
    setMatchedPairs({});
    setActiveStudentIndex(0);
    setSelectedPhotoIndex(0);
    clearDraftState();
  }, []);

  // Global Keyboard Navigation Listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignore if user is currently typing in an input or select
      const activeTag = document.activeElement?.tagName?.toLowerCase();
      if (activeTag === 'input' || activeTag === 'textarea' || activeTag === 'select') {
        return;
      }

      // Help Modal toggle
      if (e.key === '?' || (e.shiftKey && e.key === '/')) {
        e.preventDefault();
        setIsShortcutsOpen((prev) => !prev);
        return;
      }

      // Close modal on Escape
      if (e.key === 'Escape') {
        setIsShortcutsOpen(false);
        setZoomedPhotoState(null);
        return;
      }

      // If modal is open, prevent other shortcuts
      if (isShortcutsOpen || zoomedPhotoState) return;

      // Navigate Photo Pool (ArrowLeft / ArrowRight)
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setSelectedPhotoIndex((prev) => Math.max(0, prev - 1));
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        setSelectedPhotoIndex((prev) => Math.min(Math.max(0, photoPool.length - 1), prev + 1));
      }

      // Navigate Student Table (ArrowUp / ArrowDown)
      else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveStudentIndex((prev) => Math.max(0, prev - 1));
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveStudentIndex((prev) => Math.min(Math.max(0, filteredStudents.length - 1), prev + 1));
      }

      // Assign Active Photo to Active Student (Enter / Space)
      else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleAssignActivePhotoToActiveStudent();
      }

      // Delete / Skip junk photo (Delete / Backspace)
      else if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault();
        if (photoPool.length > 0 && selectedPhotoIndex < photoPool.length) {
          const targetPhoto = photoPool[selectedPhotoIndex];
          handleDeletePhotoFromPool(targetPhoto.id);
        }
      }

      // Shift Down / Insert Blank on Active Student (Shift + S)
      else if (e.shiftKey && (e.key === 'S' || e.key === 's')) {
        e.preventDefault();
        handleShiftDown(activeStudentIndex);
      }

      // Unlink Active Student Photo (Shift + U)
      else if (e.shiftKey && (e.key === 'U' || e.key === 'u')) {
        e.preventDefault();
        const activeStudent = filteredStudents[activeStudentIndex];
        if (activeStudent && matchedPairs[activeStudent.id]) {
          handleUnlinkPhoto(activeStudent.id);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    photoPool,
    filteredStudents,
    selectedPhotoIndex,
    activeStudentIndex,
    isShortcutsOpen,
    zoomedPhotoState,
    matchedPairs,
    handleAssignActivePhotoToActiveStudent,
    handleDeletePhotoFromPool,
    handleShiftDown,
    handleUnlinkPhoto,
  ]);

  // Update assigned filenames whenever namingTemplate changes
  useEffect(() => {
    setMatchedPairs((prev) => {
      const updated = { ...prev };
      let changed = false;

      students.forEach((student) => {
        if (updated[student.id]) {
          const match = updated[student.id];
          const ext = match.originalName ? match.originalName.split('.').pop() || 'jpg' : 'jpg';
          const newName = formatStudentFilename(student, namingTemplate, ext);
          if (newName !== match.assignedFilename) {
            updated[student.id] = {
              ...match,
              assignedFilename: newName,
            };
            changed = true;
          }
        }
      });

      return changed ? updated : prev;
    });
  }, [namingTemplate, students]);

  // Auto-Save Draft to IndexedDB on state changes
  useEffect(() => {
    if (students.length > 0) {
      setIsAutoSaved(false);
      const timer = setTimeout(() => {
        saveDraftState({
          fileName,
          headers,
          students,
          classes,
          activeClass,
          namingTemplate,
          matchedPairs,
        });
        setIsAutoSaved(true);
      }, 800);

      return () => clearTimeout(timer);
    }
  }, [fileName, headers, students, classes, activeClass, namingTemplate, matchedPairs]);

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-50 dark:bg-zinc-950 text-slate-800 dark:text-zinc-100 font-sans select-none transition-colors duration-200">
      {/* Top Header */}
      <Header
        totalStudents={totalStudents}
        matchedCount={matchedCount}
        poolCount={photoPool.length}
        onLoadDemo={handleLoadDemo}
        onResetAll={handleResetAll}
        onOpenShortcuts={() => setIsShortcutsOpen(true)}
        onOpenDonate={() => setIsDonateOpen(true)}
        isAutoSaved={isAutoSaved}
        fileName={fileName}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      {/* Main Workspace (4-Zone Dashboard Layout) */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Zone 1: Left Panel (Explorer / Folder Drop) */}
        <ExplorerPanel
          onExcelLoaded={handleExcelLoaded}
          onPhotosLoaded={handlePhotosLoaded}
          folders={folders}
          activeFolder={activeFolder}
          onSelectFolder={setActiveFolder}
          classes={classes}
          activeClass={activeClass}
          onSelectClass={setActiveClass}
          studentsCountByClass={studentsCountByClass}
        />

        {/* Zone 2 & Zone 3: Center Split Area (Top: Photo Pool, Bottom: Student Table) */}
        <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden bg-slate-100/50 dark:bg-zinc-950">
          {/* Zone 2: Top Panel (Photo Pool Grid - 15-20% height) */}
          <PhotoPoolPanel
            photos={photoPool}
            selectedIndex={selectedPhotoIndex}
            onSelectPhoto={setSelectedPhotoIndex}
            onDeletePhoto={handleDeletePhotoFromPool}
            onOpenZoom={(photo) => setZoomedPhotoState({ photo, student: null })}
            onDragStart={handleDragStartPhoto}
            onAssignToActiveStudent={handleAssignActivePhotoToActiveStudent}
          />

          {/* Zone 3: Center Panel (Student Table & Interactive Matches) */}
          <StudentTablePanel
            students={filteredStudents}
            matchedPairs={matchedPairs}
            activeStudentIndex={activeStudentIndex}
            onSelectStudent={setActiveStudentIndex}
            onUnlinkPhoto={handleUnlinkPhoto}
            onShiftDown={handleShiftDown}
            onOpenZoom={(photo, student) => setZoomedPhotoState({ photo, student })}
            onDropPhotoToStudent={handleDropPhotoToStudent}
            activeClass={activeClass}
            namingTemplate={namingTemplate}
          />
        </div>

        {/* Zone 4: Right Panel (Control Tools, Naming Template Engine, Auto-Fill, Export) */}
        <ControlToolsPanel
          classes={classes}
          activeClass={activeClass}
          onSelectClass={setActiveClass}
          students={students}
          photoPool={photoPool}
          matchedPairs={matchedPairs}
          namingTemplate={namingTemplate}
          onChangeNamingTemplate={setNamingTemplate}
          availableTags={availableTags}
          onAutoFillRemaining={handleAutoFillRemaining}
          onResetClassMatches={handleResetClassMatches}
          onExportSuccess={() => setIsDonateOpen(true)}
        />
      </div>

      {/* Footer by AM-Lab */}
      <Footer
        onOpenDonate={() => setIsDonateOpen(true)}
        onOpenFeedback={() => setIsFeedbackOpen(true)}
      />

      {/* Keyboard Shortcuts Modal */}
      <KeyboardShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />

      {/* Photo Full Zoom Modal */}
      <PhotoZoomModal
        photo={zoomedPhotoState?.photo}
        student={zoomedPhotoState?.student}
        onClose={() => setZoomedPhotoState(null)}
      />

      {/* Confirm Delete / Reset Modal */}
      <ConfirmDeleteModal
        isOpen={isConfirmDeleteOpen}
        onClose={() => setIsConfirmDeleteOpen(false)}
        onConfirm={handleConfirmReset}
        stats={{
          students: totalStudents,
          photos: photoPool.length,
          matched: matchedCount,
        }}
      />

      {/* Donate / Traktir Kopi Modal (Saweria AM-Lab) */}
      <DonateModal
        isOpen={isDonateOpen}
        onClose={() => setIsDonateOpen(false)}
      />

      {/* Feedback / Kritik & Saran Modal */}
      <FeedbackModal
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
      />
    </div>
  );
}
