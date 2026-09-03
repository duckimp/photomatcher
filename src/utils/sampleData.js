import { createThumbnail } from './imageCompressor';

// Color palettes for avatar photo generation
const AVATAR_BG_COLORS = [
  '#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6',
  '#ec4899', '#06b6d4', '#14b8a6', '#6366f1', '#f97316'
];

/**
 * Generates an SVG-based avatar blob for quick testing
 */
function createSyntheticPhotoBlob(studentName, index, className) {
  const canvas = document.createElement('canvas');
  canvas.width = 400;
  canvas.height = 500;
  const ctx = canvas.getContext('2d');

  const bgColor = AVATAR_BG_COLORS[index % AVATAR_BG_COLORS.length];

  // Studio background gradient
  const grad = ctx.createLinearGradient(0, 0, 400, 500);
  grad.addColorStop(0, bgColor);
  grad.addColorStop(1, '#0f172a');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 400, 500);

  // Soft spotlight circle in background
  ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
  ctx.beginPath();
  ctx.arc(200, 200, 140, 0, Math.PI * 2);
  ctx.fill();

  // Draw silhouette head
  ctx.fillStyle = '#fde047';
  ctx.beginPath();
  ctx.arc(200, 180, 70, 0, Math.PI * 2);
  ctx.fill();

  // Hair style
  ctx.fillStyle = '#1e293b';
  ctx.beginPath();
  ctx.arc(200, 160, 75, Math.PI, 0, false);
  ctx.fill();

  // Face features (Eyes, Smile)
  ctx.fillStyle = '#1e293b';
  ctx.beginPath();
  ctx.arc(175, 175, 7, 0, Math.PI * 2);
  ctx.arc(225, 175, 7, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.lineWidth = 4;
  ctx.strokeStyle = '#1e293b';
  ctx.arc(200, 195, 22, 0.2 * Math.PI, 0.8 * Math.PI, false);
  ctx.stroke();

  // School Uniform (White & Blue/Red collar)
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.ellipse(200, 390, 120, 130, 0, 0, Math.PI * 2);
  ctx.fill();

  // Tie / Badge
  ctx.fillStyle = '#2563eb';
  ctx.beginPath();
  ctx.moveTo(190, 290);
  ctx.lineTo(210, 290);
  ctx.lineTo(205, 380);
  ctx.lineTo(200, 395);
  ctx.lineTo(195, 380);
  ctx.closePath();
  ctx.fill();

  // Watermark text box at bottom
  ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
  ctx.fillRect(10, 420, 380, 70);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.lineWidth = 1;
  ctx.strokeRect(10, 420, 380, 70);

  // Student Info Text
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 20px Inter, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(studentName, 200, 450);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '14px JetBrains Mono, monospace';
  ctx.fillText(`FOTO #${String(index + 1).padStart(3, '0')} • ${className}`, 200, 475);

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      const file = new File([blob], `DSC_${String(1000 + index + 1)}.jpg`, { type: 'image/jpeg' });
      resolve(file);
    }, 'image/jpeg', 0.9);
  });
}

export const SAMPLE_STUDENTS_DATA = [
  // Kelas 7A
  { no_absen: 1, nisn: '0081234501', nama: "Ahmad Syafi'i", kelas: '7A', jk: 'L', tgl_lahir: '2010-04-12' },
  { no_absen: 2, nisn: '0081234502', nama: 'Aisyah Putri Rahmawati', kelas: '7A', jk: 'P', tgl_lahir: '2010-06-25' },
  { no_absen: 3, nisn: '0081234503', nama: 'Budi Santoso', kelas: '7A', jk: 'L', tgl_lahir: '2010-01-18' },
  { no_absen: 4, nisn: '0081234504', nama: 'Citra Dewi Lestari', kelas: '7A', jk: 'P', tgl_lahir: '2010-09-03' },
  { no_absen: 5, nisn: '0081234505', nama: 'Dimas Anggara Prasetyo', kelas: '7A', jk: 'L', tgl_lahir: '2010-03-14' },
  { no_absen: 6, nisn: '0081234506', nama: 'Erina Nur Aini', kelas: '7A', jk: 'P', tgl_lahir: '2010-11-20' },
  { no_absen: 7, nisn: '0081234507', nama: 'Fajar Kurniawan', kelas: '7A', jk: 'L', tgl_lahir: '2010-07-08' },
  { no_absen: 8, nisn: '0081234508', nama: 'Gita Permata Sari', kelas: '7A', jk: 'P', tgl_lahir: '2010-05-30' },
  { no_absen: 9, nisn: '0081234509', nama: 'Hafiz Maulana', kelas: '7A', jk: 'L', tgl_lahir: '2010-08-19' },
  { no_absen: 10, nisn: '0081234510', nama: 'Indah Kusuma Wardani', kelas: '7A', jk: 'P', tgl_lahir: '2010-02-14' },
  { no_absen: 11, nisn: '0081234511', nama: 'Joko Prabowo', kelas: '7A', jk: 'L', tgl_lahir: '2010-10-05' },
  { no_absen: 12, nisn: '0081234512', nama: 'Karin Anindita', kelas: '7A', jk: 'P', tgl_lahir: '2010-12-01' },

  // Kelas 7B
  { no_absen: 1, nisn: '0081234601', nama: 'Lukman Hakim', kelas: '7B', jk: 'L', tgl_lahir: '2010-03-10' },
  { no_absen: 2, nisn: '0081234602', nama: 'Maya Safitri', kelas: '7B', jk: 'P', tgl_lahir: '2010-07-15' },
  { no_absen: 3, nisn: '0081234603', nama: 'Nanda Pratama', kelas: '7B', jk: 'L', tgl_lahir: '2010-05-22' },
  { no_absen: 4, nisn: '0081234604', nama: 'Olivia Zahrani', kelas: '7B', jk: 'P', tgl_lahir: '2010-08-11' },
  { no_absen: 5, nisn: '0081234605', nama: 'Panji Gumilang', kelas: '7B', jk: 'L', tgl_lahir: '2010-11-29' },
  { no_absen: 6, nisn: '0081234606', nama: 'Qonita Az-Zahra', kelas: '7B', jk: 'P', tgl_lahir: '2010-04-04' },
  { no_absen: 7, nisn: '0081234607', nama: 'Rian Hidayat', kelas: '7B', jk: 'L', tgl_lahir: '2010-09-17' },
  { no_absen: 8, nisn: '0081234608', nama: 'Siti Nurhaliza', kelas: '7B', jk: 'P', tgl_lahir: '2010-01-23' },

  // Kelas 8A
  { no_absen: 1, nisn: '0071234701', nama: 'Tegar Wicaksono', kelas: '8A', jk: 'L', tgl_lahir: '2009-02-11' },
  { no_absen: 2, nisn: '0071234702', nama: 'Utami Rahayu', kelas: '8A', jk: 'P', tgl_lahir: '2009-06-19' },
  { no_absen: 3, nisn: '0071234703', nama: 'Vino Bastian', kelas: '8A', jk: 'L', tgl_lahir: '2009-10-31' },
  { no_absen: 4, nisn: '0071234704', nama: 'Wulan Guritno', kelas: '8A', jk: 'P', tgl_lahir: '2009-04-14' },
];

/**
 * Generates sample demo state with students and synthetic photos for test drive
 */
export async function generateDemoDataset() {
  const students = SAMPLE_STUDENTS_DATA.map((s, index) => ({
    id: `demo_student_${index + 1}`,
    originalIndex: index + 1,
    no_absen: s.no_absen,
    nisn: s.nisn,
    nama: s.nama,
    kelas: s.kelas,
    jk: s.jk,
    tgl_lahir: s.tgl_lahir,
    raw: { ...s },
  }));

  const classes = ['7A', '7B', '8A'];
  const headers = ['no_absen', 'nisn', 'nama', 'kelas', 'jk', 'tgl_lahir'];

  // Generate photos for Kelas 7A (12 photos) + 2 extra/unmatched photos
  const class7AStudents = students.filter(s => s.kelas === '7A');
  const photos = [];

  for (let i = 0; i < class7AStudents.length; i++) {
    const student = class7AStudents[i];
    const file = await createSyntheticPhotoBlob(student.nama, i, student.kelas);
    const thumb = await createThumbnail(file);

    photos.push({
      id: `photo_${Date.now()}_${i}_${Math.random().toString(36).substr(2, 4)}`,
      originalFile: file,
      originalName: file.name,
      size: file.size,
      thumbnailUrl: thumb.thumbnailUrl,
      folderPath: 'Foto_Kelas_7A',
    });
  }

  // Add 2 extra photos (junk / buram / cadangan) to test "Skip" and "Delete Junk"
  const extraFile1 = await createSyntheticPhotoBlob('(Buram / Salah Jepret)', 98, '7A');
  const extraThumb1 = await createThumbnail(extraFile1);
  photos.push({
    id: `photo_extra_1`,
    originalFile: extraFile1,
    originalName: 'DSC_9998_BLUR.jpg',
    size: extraFile1.size,
    thumbnailUrl: extraThumb1.thumbnailUrl,
    folderPath: 'Foto_Kelas_7A',
  });

  return {
    fileName: 'Data_Siswa_Demo_SMPN1.xlsx',
    headers,
    students,
    classes,
    photos,
    folders: ['Foto_Kelas_7A', 'Foto_Kelas_7B', 'Foto_Kelas_8A'],
  };
}
