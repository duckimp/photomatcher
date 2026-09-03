import { createThumbnail } from './imageCompressor';

/**
 * Checks if a file is an image based on extension or mime type
 */
function isImageFile(file) {
  if (file.type && file.type.startsWith('image/')) return true;
  const ext = file.name.split('.').pop().toLowerCase();
  return ['jpg', 'jpeg', 'png', 'webp', 'bmp', 'tiff'].includes(ext);
}

/**
 * Recursively scans directory entry using webkitGetAsEntry
 */
async function scanFileEntry(entry, folderPath = '') {
  return new Promise((resolve) => {
    if (entry.isFile) {
      entry.file((file) => {
        if (isImageFile(file)) {
          resolve([{ file, folderPath: folderPath || 'Root Folder' }]);
        } else {
          resolve([]);
        }
      }, () => resolve([]));
    } else if (entry.isDirectory) {
      const dirReader = entry.createReader();
      const currentDir = folderPath ? `${folderPath}/${entry.name}` : entry.name;
      const entries = [];

      const readEntries = () => {
        dirReader.readEntries(async (results) => {
          if (!results.length) {
            const nestedFiles = (await Promise.all(entries.map(e => scanFileEntry(e, currentDir)))).flat();
            resolve(nestedFiles);
          } else {
            entries.push(...results);
            readEntries();
          }
        }, () => resolve([]));
      };

      readEntries();
    } else {
      resolve([]);
    }
  });
}

/**
 * Parses files from Drag & Drop DataTransfer items (supporting folders & subfolders)
 */
export async function parseDroppedItems(dataTransferItems, onProgress = () => {}) {
  const entries = [];
  for (let i = 0; i < dataTransferItems.length; i++) {
    const item = dataTransferItems[i];
    if (item.webkitGetAsEntry) {
      const entry = item.webkitGetAsEntry();
      if (entry) entries.push(entry);
    } else if (item.kind === 'file') {
      const file = item.getAsFile();
      if (file && isImageFile(file)) {
        entries.push({ isFile: true, file: (cb) => cb(file) });
      }
    }
  }

  onProgress('Memindai struktur folder...');
  const scanned = (await Promise.all(entries.map(e => scanFileEntry(e)))).flat();

  // Natural sort by filename (e.g. DSC_1, DSC_2, DSC_10)
  scanned.sort((a, b) => a.file.name.localeCompare(b.file.name, undefined, { numeric: true, sensitivity: 'base' }));

  const total = scanned.length;
  const processedPhotos = [];

  for (let i = 0; i < total; i++) {
    const { file, folderPath } = scanned[i];
    onProgress(`Membuat preview foto (${i + 1}/${total}): ${file.name}`);
    const thumb = await createThumbnail(file);

    processedPhotos.push({
      id: `photo_${Date.now()}_${i}_${Math.random().toString(36).substr(2, 5)}`,
      originalFile: file,
      originalName: file.name,
      size: file.size,
      folderPath,
      thumbnailUrl: thumb.thumbnailUrl,
      lastModified: file.lastModified,
    });
  }

  return processedPhotos;
}

/**
 * Parses files from standard <input type="file" multiple webkitdirectory>
 */
export async function parseInputFiles(fileList, onProgress = () => {}) {
  const filesArray = Array.from(fileList).filter(isImageFile);

  // Natural sort
  filesArray.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' }));

  const total = filesArray.length;
  const processedPhotos = [];

  for (let i = 0; i < total; i++) {
    const file = filesArray[i];
    const pathParts = file.webkitRelativePath ? file.webkitRelativePath.split('/') : [];
    const folderPath = pathParts.length > 1 ? pathParts.slice(0, -1).join('/') : 'Daftar Foto';

    onProgress(`Memproses thumbnail (${i + 1}/${total}): ${file.name}`);
    const thumb = await createThumbnail(file);

    processedPhotos.push({
      id: `photo_${Date.now()}_${i}_${Math.random().toString(36).substr(2, 5)}`,
      originalFile: file,
      originalName: file.name,
      size: file.size,
      folderPath,
      thumbnailUrl: thumb.thumbnailUrl,
      lastModified: file.lastModified,
    });
  }

  return processedPhotos;
}
