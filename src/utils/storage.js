const DB_NAME = 'PhotoMatcherDB';
const DB_VERSION = 1;
const STORE_NAME = 'app_state';

/**
 * Open or create IndexedDB instance
 */
function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'key' });
      }
    };

    request.onsuccess = (e) => resolve(e.target.result);
    request.onerror = (e) => reject(e.target.error);
  });
}

/**
 * Save draft session state to IndexedDB
 */
export async function saveDraftState(state) {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);

    // Save lightweight state (serialize photos and students)
    const payload = {
      key: 'current_session',
      timestamp: Date.now(),
      fileName: state.fileName,
      headers: state.headers,
      students: state.students,
      classes: state.classes,
      activeClass: state.activeClass,
      namingTemplate: state.namingTemplate,
      // Store matched pairs metadata
      matchedPairsMeta: Object.entries(state.matchedPairs || {}).reduce((acc, [studentId, match]) => {
        acc[studentId] = {
          photoId: match.photoId,
          originalName: match.originalName,
          assignedFilename: match.assignedFilename,
          folderPath: match.folderPath,
        };
        return acc;
      }, {}),
    };

    store.put(payload);
  } catch (err) {
    console.warn('Auto-save IndexedDB failed:', err);
  }
}

/**
 * Load draft session state from IndexedDB
 */
export async function loadDraftState() {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);

    return new Promise((resolve) => {
      const request = store.get('current_session');
      request.onsuccess = (e) => resolve(e.target.result || null);
      request.onerror = () => resolve(null);
    });
  } catch (err) {
    console.warn('Load draft IndexedDB failed:', err);
    return null;
  }
}

/**
 * Clear draft session from IndexedDB
 */
export async function clearDraftState() {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.delete('current_session');
  } catch (err) {
    console.warn('Clear draft failed:', err);
  }
}
