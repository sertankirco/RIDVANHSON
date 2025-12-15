
export const getYoutubeId = (url: string): string | null => {
  if (!url) return null;

  try {
    // Eğer url http/https ile başlamıyorsa ekle
    const safeUrl = url.startsWith('http') ? url : `https://${url}`;
    const urlObj = new URL(safeUrl);

    // youtube.com (masaüstü/tarayıcı) linkleri
    if (urlObj.hostname.includes('youtube.com') || urlObj.hostname.includes('www.youtube.com')) {
      // Embed linki ise (örn: youtube.com/embed/ID)
      if (urlObj.pathname.startsWith('/embed/')) {
        return urlObj.pathname.split('/')[2];
      }
      // Standart watch linki ise (örn: youtube.com/watch?v=ID)
      return urlObj.searchParams.get('v');
    }

    // youtu.be (kısa/mobil) linkleri
    if (urlObj.hostname.includes('youtu.be')) {
      return urlObj.pathname.slice(1);
    }
    
    return null;
  } catch (e) {
    // URL parse edilemezse (örn: geçersiz format) eski regex yöntemini dene
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  }
};

export const getYoutubeThumbnail = (url: string): string => {
  const id = getYoutubeId(url);
  if (!id) return 'https://via.placeholder.com/640x360?text=Video+Bulunamadi';
  return `https://img.youtube.com/vi/${id}/mqdefault.jpg`;
};
