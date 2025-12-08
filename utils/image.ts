export const getValidImageUrl = (url: string | undefined): string => {
  if (!url) return '';
  
  // Google Drive 'view' linklerini (share links) doğrudan indirilebilir resim linkine çevirir
  // Örnek: https://drive.google.com/file/d/FILE_ID/view -> https://drive.google.com/uc?export=view&id=FILE_ID
  if (url.includes('drive.google.com') && url.includes('/file/d/')) {
    try {
        const parts = url.split('/file/d/');
        if (parts.length > 1) {
            const id = parts[1].split('/')[0];
            return `https://drive.google.com/uc?export=view&id=${id}`;
        }
    } catch (e) {
        console.error("Drive URL ayrıştırma hatası", e);
    }
  }
  
  return url;
};