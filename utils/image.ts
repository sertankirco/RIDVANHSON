export const getValidImageUrl = (url: string | undefined): string => {
  if (!url) return '';
  
  // Google Drive ve Docs linklerini işle
  // drive.google.com veya docs.google.com veya genel googleusercontent
  if (url.includes('google.com') && (url.includes('drive') || url.includes('docs'))) {
    try {
        // ID Yakalama Stratejisi:
        // 1. /d/ veya id= veya open?id= sonrasında gelen 20+ karakterlik kodu yakala.
        const idMatch = url.match(/(?:\/d\/|id=|open\?id=)([a-zA-Z0-9_-]{20,})/);
        
        if (idMatch && idMatch[1]) {
            const id = idMatch[1];
            // Yüksek kalite thumbnail
            return `https://drive.google.com/thumbnail?id=${id}&sz=w1920`;
        }
    } catch (e) {
        console.error("Drive URL parse error", e);
    }
  }
  
  return url;
};