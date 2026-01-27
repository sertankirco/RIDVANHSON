
import React, { useState } from 'react';
import { Play, AlertCircle, Loader2 } from 'lucide-react';
import { getYoutubeId, getYoutubeThumbnail } from '../utils/video';

interface VideoPlayerProps {
  url: string;
  title: string;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ url, title }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const videoId = getYoutubeId(url);

  // Video ID geçersizse hata göster
  if (!videoId) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 text-slate-500 gap-3 min-h-[200px]">
        <AlertCircle className="w-8 h-8 opacity-50" />
        <span className="text-sm font-medium">Video Bağlantısı Hatalı</span>
        <span className="text-xs opacity-50 px-4 text-center break-all">{url}</span>
      </div>
    );
  }

  const handlePlay = () => {
    setIsLoading(true);
    setIsPlaying(true);
  };

  if (isPlaying) {
    return (
      <div className="relative w-full h-full bg-black">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center z-10 bg-black">
            <Loader2 className="w-8 h-8 text-white animate-spin" />
          </div>
        )}
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&showinfo=0&origin=${window.location.origin}`}
          title={title}
          className="w-full h-full absolute inset-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          onLoad={() => setIsLoading(false)}
          referrerPolicy="strict-origin-when-cross-origin"
        ></iframe>
      </div>
    );
  }

  // Henüz oynatılmıyorsa (Kapak Resmi Modu)
  return (
    <div 
      className="relative w-full h-full group cursor-pointer overflow-hidden bg-slate-900"
      onClick={handlePlay}
    >
      {/* Thumbnail */}
      <img 
        src={getYoutubeThumbnail(url)} 
        alt={title}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100"
        loading="lazy"
      />
      
      {/* Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent transition-opacity group-hover:opacity-80"></div>

      {/* Play Button */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <div className="relative">
           {/* Pulse Effect */}
           <div className="absolute inset-0 bg-red-600 rounded-full animate-ping opacity-20 group-hover:opacity-40"></div>
           
           {/* Button Circle */}
           <div className="relative w-16 h-16 sm:w-20 sm:h-20 bg-red-600 rounded-full flex items-center justify-center shadow-xl transition-all duration-300 group-hover:scale-110 group-hover:bg-red-500">
              <Play className="w-6 h-6 sm:w-8 sm:h-8 text-white ml-1 fill-white" />
           </div>
        </div>
      </div>
      
      {/* Click Hint */}
      <div className="absolute bottom-4 left-0 right-0 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
         <span className="text-white text-xs font-semibold tracking-wider uppercase bg-black/50 px-3 py-1 rounded-full backdrop-blur-sm">
           Videoyu İzle
         </span>
      </div>
    </div>
  );
};
