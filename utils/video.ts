
export const getYoutubeId = (url: string): string | null => {
  if (!url || typeof url !== 'string') return null;

  try {
    // Uzman Regex Deseni:
    // 1. youtube.com/watch?v=ID
    // 2. youtu.be/ID
    // 3. youtube.com/embed/ID
    // 4. youtube.com/shorts/ID
    // 5. Query parametrelerini (?si=, &feature=) yoksayar.
    const pattern = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(pattern);

    return match ? match[1] : null;
  } catch (e) {
    console.error("Youtube ID parse error", e);
    return null;
  }
};

export const getYoutubeThumbnail = (url: string): string => {
  const id = getYoutubeId(url);
  // Yüksek çözünürlüklü thumbnail (hqdefault) veya standart (mqdefault)
  if (!id) return 'https://via.placeholder.com/640x360?text=Video+Yuklenemedi';
  return `https://img.youtube.com/vi/${id}/mqdefault.jpg`;
};
