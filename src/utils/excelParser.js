import * as XLSX from 'xlsx';
import { sanitizeFilename } from './namingEngine';

/**
 * Normalizes header string to clean property key
 */
function normalizeHeaderKey(header) {
  if (!header) return '';
  return String(header).trim().toLowerCase().replace(/[\s_-]+/g, '_');
}

/**
 * Parse uploaded Excel or CSV file
 */
export async function parseExcelFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });

        // Get first sheet
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];

        // Parse to JSON with raw values preserved
        const rawRows = XLSX.utils.sheet_to_json(worksheet, { defval: 'NULL' });

        if (!rawRows || rawRows.length === 0) {
          throw new Error('File Excel kosong atau tidak memiliki data.');
        }

        // Detect all header names from first row
        const headers = Object.keys(rawRows[0]);

        // Process rows into standardized student objects
        const students = rawRows.map((row, index) => {
          const student = {
            id: `student_${Date.now()}_${index}_${Math.random().toString(36).substr(2, 5)}`,
            originalIndex: index + 1,
            no_absen: index + 1,
            nisn: 'NULL',
            nama: 'NULL',
            kelas: 'NULL',
            raw: row,
          };

          // Map detected fields intelligently
          headers.forEach((header) => {
            const normalized = normalizeHeaderKey(header);
            const val = row[header];
            const cleanVal = (val !== undefined && val !== null && String(val).trim() !== '') ? String(val).trim() : 'NULL';

            student[normalized] = cleanVal;

            // Common aliases
            if (['nisn', 'nis', 'no_induk', 'nomor_induk', 'nik'].includes(normalized)) {
              if (cleanVal !== 'NULL') student.nisn = cleanVal;
            }
            if (['nama', 'nama_siswa', 'nama_lengkap', 'name', 'student_name'].includes(normalized)) {
              if (cleanVal !== 'NULL') student.nama = cleanVal;
            }
            if (['kelas', 'rombel', 'tingkat', 'class', 'group'].includes(normalized)) {
              if (cleanVal !== 'NULL') student.kelas = cleanVal;
            }
            if (['no', 'no_absen', 'absen', 'nomor', 'nomor_absen'].includes(normalized)) {
              if (cleanVal !== 'NULL') student.no_absen = cleanVal;
            }
            if (['jk', 'jenis_kelamin', 'gender', 'sex', 'l_p'].includes(normalized)) {
              if (cleanVal !== 'NULL') student.jk = cleanVal;
            }
          });

          return student;
        });

        // Extract list of unique classes
        const classSet = new Set();
        students.forEach((s) => {
          if (s.kelas && s.kelas !== 'NULL') {
            classSet.add(s.kelas);
          }
        });
        const classes = Array.from(classSet).sort();

        resolve({
          fileName: file.name,
          headers,
          students,
          classes: classes.length > 0 ? classes : ['Kelas Default'],
        });
      } catch (err) {
        reject(err);
      }
    };

    reader.onerror = (err) => reject(err);
    reader.readAsArrayBuffer(file);
  });
}

/**
 * Generates an Excel (.xlsx) file with student data, matching status, and renamed photo filenames.
 * Empty cells are replaced with "NULL".
 */
export function exportMatchedExcel(students, matchedPairs, namingTemplate, classFilter = 'ALL') {
  const filteredStudents = classFilter === 'ALL'
    ? students
    : students.filter((s) => s.kelas === classFilter);

  // Prepare export rows
  const exportData = filteredStudents.map((student, idx) => {
    const matchedPhoto = matchedPairs[student.id];
    const isMatched = !!matchedPhoto;
    const finalPhotoName = isMatched ? matchedPhoto.assignedFilename : 'NULL';

    const row = {
      'No': student.no_absen || idx + 1,
      'NISN': student.nisn || 'NULL',
      'Nama Siswa': student.nama || 'NULL',
      'Kelas': student.kelas || 'NULL',
      'Status Foto': isMatched ? 'TERPASANG' : 'BELUM',
      'Nama File Foto': finalPhotoName,
      'File Asli': isMatched ? matchedPhoto.originalName : 'NULL',
    };

    // Add any other raw columns from the original import
    if (student.raw) {
      Object.entries(student.raw).forEach(([k, v]) => {
        if (!['No', 'NISN', 'Nama Siswa', 'Kelas', 'Status Foto', 'Nama File Foto', 'File Asli'].includes(k)) {
          row[k] = (v !== undefined && v !== null && String(v).trim() !== '') ? String(v).trim() : 'NULL';
        }
      });
    }

    return row;
  });

  const worksheet = XLSX.utils.json_to_sheet(exportData);

  // Auto-fit column widths
  const colWidths = [
    { wch: 6 },  // No
    { wch: 18 }, // NISN
    { wch: 30 }, // Nama
    { wch: 12 }, // Kelas
    { wch: 14 }, // Status Foto
    { wch: 35 }, // Nama File Foto
    { wch: 30 }, // File Asli
  ];
  worksheet['!cols'] = colWidths;

  const workbook = XLSX.utils.book_new();
  const sheetTitle = classFilter === 'ALL' ? 'Data Siswa & Foto' : `Kelas ${classFilter}`;
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetTitle.substring(0, 31));

  const safeClassName = classFilter === 'ALL' ? 'Semua_Kelas' : sanitizeFilename(classFilter);
  const outFileName = `Data_Siswa_PhotoMatcher_${safeClassName}_${new Date().toISOString().slice(0, 10)}.xlsx`;

  XLSX.writeFile(workbook, outFileName);
}

/**
 * Downloads a starter Excel template for the user to fill with students
 */
export function downloadSampleExcelTemplate() {
  const templateData = [
    { 'No Absen': 1, 'NISN': '0081234501', 'Nama Lengkap': 'Ahmad Fauzi', 'Kelas': '7A', 'Jenis Kelamin': 'L' },
    { 'No Absen': 2, 'NISN': '0081234502', 'Nama Lengkap': 'Aisyah Putri', 'Kelas': '7A', 'Jenis Kelamin': 'P' },
    { 'No Absen': 3, 'NISN': '0081234503', 'Nama Lengkap': 'Budi Santoso', 'Kelas': '7A', 'Jenis Kelamin': 'L' },
    { 'No Absen': 4, 'NISN': '0081234504', 'Nama Lengkap': 'Citra Lestari', 'Kelas': '7A', 'Jenis Kelamin': 'P' },
    { 'No Absen': 5, 'NISN': '0081234505', 'Nama Lengkap': 'Dimas Prasetyo', 'Kelas': '7A', 'Jenis Kelamin': 'L' },
  ];

  const worksheet = XLSX.utils.json_to_sheet(templateData);
  worksheet['!cols'] = [{ wch: 10 }, { wch: 16 }, { wch: 25 }, { wch: 10 }, { wch: 14 }];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Template Siswa');
  XLSX.writeFile(workbook, 'Template_Data_Siswa_PhotoMatcher.xlsx');
}
