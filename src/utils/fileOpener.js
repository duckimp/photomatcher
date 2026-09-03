/**
 * Helper to open the Downloads folder or reveal downloaded files
 * Works seamlessly in both Tauri v2 Desktop and standard Web/WebView browsers
 */
export async function openDownloadsFolder() {
  // Check if running inside Tauri Desktop environment
  if (typeof window !== 'undefined' && window.__TAURI_INTERNALS__) {
    try {
      if (window.__TAURI__?.core?.invoke) {
        // Tauri v2 native opener command
        await window.__TAURI__.core.invoke('plugin:opener|open_path', { path: '' });
        return true;
      }
    } catch (e) {
      console.warn('Tauri native open_path failed, showing helpful guide:', e);
    }
  }

  // Helpful guide for Web / WebView browsers
  alert('💡 File "Template_Data_Siswa_PhotoMatcher.xlsx" tersimpan di folder Downloads komputermu.\n\nTips Cepat: Tekan tombol shortcut [ Ctrl + J ] pada keyboard browser untuk langsung melihat dan membuka file yang baru saja diunduh!');
  return false;
}
