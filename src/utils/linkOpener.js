/**
 * Universal External Link Opener
 * Automatically detects Tauri Desktop environment and opens links in the user's
 * default system web browser (Chrome, Edge, Firefox, Safari, etc.)
 * Falls back to window.open for standard web browsers.
 */
export async function openExternalUrl(url, e) {
  if (e) {
    e.preventDefault();
    e.stopPropagation();
  }

  if (!url) return;

  // Tauri Desktop Environment Detection
  if (typeof window !== 'undefined' && window.__TAURI_INTERNALS__) {
    // 1. Try Tauri v2 opener plugin invoke
    try {
      if (window.__TAURI__?.core?.invoke) {
        await window.__TAURI__.core.invoke('plugin:opener|open_url', { url });
        return;
      }
    } catch (err1) {
      console.warn('Tauri opener plugin invoke failed:', err1);
    }

    // 2. Try Tauri v2 shell plugin invoke
    try {
      if (window.__TAURI__?.core?.invoke) {
        await window.__TAURI__.core.invoke('plugin:shell|open', { path: url });
        return;
      }
    } catch (err2) {
      console.warn('Tauri shell plugin invoke failed:', err2);
    }
  }

  // Standard Web Browser Fallback
  try {
    const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
    if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
      window.location.href = url;
    }
  } catch (err) {
    window.location.href = url;
  }
}
