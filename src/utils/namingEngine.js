/**
 * Sanitizes strings for safe filenames across Windows, macOS, and Linux filesystems.
 * Replaces illegal characters: \ / : * ? " < > | with underscores (_) or removes excess spaces.
 */
export function sanitizeFilename(name) {
  if (!name && name !== 0) return 'UNKNOWN';
  
  // Convert to string and trim
  let sanitized = String(name).trim();
  
  // Replace illegal filesystem characters with underscore
  // Windows/Unix illegal: \ / : * ? " < > | + control characters
  sanitized = sanitized.replace(/[\\/:*?"<>|]/g, '_');
  
  // Replace quotes (single quote, backtick, smart quotes) with underscore or remove
  sanitized = sanitized.replace(/['`’‘"“”]/g, '_');
  
  // Replace multiple underscores or whitespace with single underscore
  sanitized = sanitized.replace(/[\s_]+/g, '_');
  
  // Remove leading/trailing underscores and dots (which Windows dislikes)
  sanitized = sanitized.replace(/^[._]+|[._]+$/g, '');
  
  return sanitized || 'UNNAMED';
}

/**
 * Common preset naming templates
 */
export const PRESET_TEMPLATES = [
  { id: 'nisn', label: 'NISN Only', format: '{nisn}' },
  { id: 'nisn_nama', label: 'NISN + Nama', format: '{nisn}_{nama}' },
  { id: 'kelas_nisn', label: 'Kelas + NISN', format: '{kelas}_{nisn}' },
  { id: 'kelas_absen_nama', label: 'Kelas + Absen + Nama', format: '{kelas}_{no_absen}_{nama}' },
  { id: 'nama_only', label: 'Nama Lengkap', format: '{nama}' },
];

/**
 * Formats a student object into a filename based on a template string.
 * Example: template = "{kelas}_{nisn}_{nama}" -> "7A_0012345678_Ahmad_Fauzi"
 */
export function formatStudentFilename(student, template = '{nisn}', extension = 'jpg') {
  if (!student) return `photo.${extension}`;

  let result = template;
  
  // Extract all keys and values from student object
  const studentData = { ...student };
  
  // Auto-fill common aliases if missing
  if (!studentData.nisn && (studentData.NISN || studentData['No Induk'] || studentData.nis)) {
    studentData.nisn = studentData.NISN || studentData['No Induk'] || studentData.nis;
  }
  if (!studentData.nama && (studentData.NAMA || studentData['Nama Siswa'] || studentData['Nama Lengkap'] || studentData.name)) {
    studentData.nama = studentData.NAMA || studentData['Nama Siswa'] || studentData['Nama Lengkap'] || studentData.name;
  }
  if (!studentData.kelas && (studentData.KELAS || studentData['Rombel'] || studentData.class)) {
    studentData.kelas = studentData.KELAS || studentData['Rombel'] || studentData.class;
  }
  if (!studentData.no_absen && (studentData['No Absen'] || studentData['Absen'] || studentData.no)) {
    studentData.no_absen = studentData['No Absen'] || studentData['Absen'] || studentData.no;
  }

  // Replace each {key} in template
  // Support both case-insensitive and exact matching
  const regex = /\{([^}]+)\}/g;
  result = result.replace(regex, (match, tag) => {
    const cleanTag = tag.trim().toLowerCase();
    
    // Find matching key in studentData
    for (const [k, v] of Object.entries(studentData)) {
      const normalizedKey = k.trim().toLowerCase().replace(/[\s_-]+/g, '_');
      if (normalizedKey === cleanTag || k.trim().toLowerCase() === cleanTag) {
        if (v !== undefined && v !== null && String(v).trim() !== '') {
          return sanitizeFilename(String(v));
        }
      }
    }
    
    return 'NULL';
  });

  // Final cleanup of the resulting filename
  const cleanBaseName = sanitizeFilename(result);
  const cleanExt = extension.replace(/^\./, '');
  return `${cleanBaseName}.${cleanExt}`;
}

/**
 * Extract available variable tags from Excel headers or student data keys
 */
export function extractAvailableTags(headers = []) {
  const standardTags = ['nisn', 'nama', 'kelas', 'no_absen', 'tgl_lahir', 'jk'];
  const extracted = new Set(standardTags);

  headers.forEach(h => {
    if (typeof h === 'string' && h.trim()) {
      const tag = h.trim().toLowerCase().replace(/[\s_-]+/g, '_');
      extracted.add(tag);
    }
  });

  return Array.from(extracted);
}
