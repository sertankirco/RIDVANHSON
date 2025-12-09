export const getValidImageUrl = (url: string | undefined): string => {
  if (!url) return '';
  
  // Google Drive linklerini doğrudan resim kaynağına dönüştür
  if (url.includes('drive.google.com')) {
    try {
        // Format 1: /file/d/ID/view
        if (url.includes('/file/d/')) {
            const parts = url.split('/file/d/');
            if (parts.length > 1) {
                const id = parts[1].split('/')[0];
                return `https://drive.google.com/uc?export=view&id=${id}`;
            }
        }
        // Format 2: open?id=ID
        else if (url.includes('id=')) {
            const idParam = url.split('id=')[1];
            if (idParam) {
                const id = idParam.split('&')[0];
                return `https://drive.google.com/uc?export=view&id=${id}`;
            }
        }
    } catch (e) {
        console.error("Drive URL ayrıştırma hatası", e);
    }
  }
  
  return url;
};