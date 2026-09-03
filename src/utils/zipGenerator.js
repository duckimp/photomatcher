import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { formatStudentFilename, sanitizeFilename } from './namingEngine';

/**
 * Downloads a ZIP file containing the matched photos renamed according to the naming template.
 *
 * @param {Array} students - Array of student objects
 * @param {Object} matchedPairs - Map of studentId -> { photoFile, originalName, assignedFilename, etc. }
 * @param {string} namingTemplate - Filename template string (e.g. "{kelas}_{nisn}_{nama}")
 * @param {string} classFilter - 'ALL' or specific class name like '7A'
 * @param {Function} onProgress - Callback (percent: number, currentFileName: string)
 */
export async function generateAndDownloadZip(students, matchedPairs, namingTemplate, classFilter = 'ALL', onProgress = () => {}) {
  const zip = new JSZip();

  // Filter students based on selection
  const targetStudents = classFilter === 'ALL'
    ? students
    : students.filter((s) => s.kelas === classFilter);

  // Find all matched pairs in this selection
  const matchEntries = [];
  targetStudents.forEach((student) => {
    const match = matchedPairs[student.id];
    if (match && match.originalFile) {
      matchEntries.push({
        student,
        match,
      });
    }
  });

  if (matchEntries.length === 0) {
    throw new Error('Belum ada foto yang terpasang pada siswa terpilih untuk di-download.');
  }

  const total = matchEntries.length;
  let processed = 0;

  for (let i = 0; i < total; i++) {
    const { student, match } = matchEntries[i];
    
    // Determine extension
    const ext = match.originalName ? match.originalName.split('.').pop() || 'jpg' : 'jpg';
    
    // Generate clean filename
    const finalFilename = formatStudentFilename(student, namingTemplate, ext);

    // If exporting all classes, organize into subfolders per class
    let zipPath = finalFilename;
    if (classFilter === 'ALL' && student.kelas && student.kelas !== 'NULL') {
      const folderName = `Kelas_${sanitizeFilename(student.kelas)}`;
      zipPath = `${folderName}/${finalFilename}`;
    }

    // Add file blob to zip
    zip.file(zipPath, match.originalFile);

    processed++;
    const percent = Math.round((processed / total) * 90);
    onProgress(percent, finalFilename);
  }

  onProgress(95, 'Mengompresi file ZIP...');

  // Generate ZIP blob with progress
  const zipBlob = await zip.generateAsync({
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 },
  }, (metadata) => {
    const zipPercent = 90 + Math.round((metadata.percent / 100) * 10);
    onProgress(zipPercent, 'Finalisasi ZIP...');
  });

  // Construct ZIP file name
  const safeClassName = classFilter === 'ALL' ? 'Semua_Kelas' : sanitizeFilename(classFilter);
  const zipFileName = `Foto_Siswa_${safeClassName}_${new Date().toISOString().slice(0, 10)}.zip`;

  // Trigger download in browser
  saveAs(zipBlob, zipFileName);
  onProgress(100, 'Download selesai!');

  return {
    totalFiles: total,
    fileName: zipFileName,
  };
}
