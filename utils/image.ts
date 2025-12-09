export const getValidImageUrl = (url: string | undefined): string => {
  if (!url) return '';
  
  // Google Drive linklerini doğrudan resim kaynağına dönüştür
  if (url.includes('drive.google.com') || url.includes('docs.google.com')) {
    try {
        // Regex ile ID'yi yakala (25 karakterden uzun alfanümerik diziler genelde ID'dir)
        const idMatch = url.match(/[-\w]{25,}/);
        
        if (idMatch) {
            const id = idMatch[0];
            // 'thumbnail' endpoint'i 'uc?export=view' endpoint'ine göre daha hızlıdır ve daha az kota sorunu yaşatır.
            // sz=w1920 parametresi görseli yüksek kalitede (1920px genişlik) çeker.
            return `https://drive.google.com/thumbnail?id=${id}&sz=w1920`;
        }
    } catch (e) {
        console.error("Drive URL ayrıştırma hatası", e);
    }
  }
  
  return url;
};