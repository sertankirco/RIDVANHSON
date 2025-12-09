
export const getYoutubeId = (url: string): string | null => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

export const getYoutubeThumbnail = (url: string): string => {
  const id = getYoutubeId(url);
  if (!id) return 'https://via.placeholder.com/640x360?text=Video+Bulunamadi';
  return `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;
};
