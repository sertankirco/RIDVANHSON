import React, { useEffect } from 'react';
import { BlogPost } from '../types';
import { X, Calendar, User, Tag } from 'lucide-react';
import { getValidImageUrl } from '../utils/image';

interface PostModalProps {
  post: BlogPost | null;
  isOpen: boolean;
  onClose: () => void;
}

export const PostModal: React.FC<PostModalProps> = ({ post, isOpen, onClose }) => {
  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !post) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      ></div>
      
      <div className="relative bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col animate-fadeIn">
        
        <div className="sticky top-0 z-10 flex justify-between items-center p-4 bg-white/95 backdrop-blur border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Blog Detayı</h2>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="relative h-64 sm:h-80 w-full shrink-0">
          <img 
            src={getValidImageUrl(post.imageUrl)} 
            alt={post.title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
            <h1 className="text-3xl sm:text-4xl font-bold text-white shadow-sm leading-tight">
              {post.title}
            </h1>
          </div>
        </div>

        <div className="p-6 sm:p-10">
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-8 pb-6 border-b border-gray-100">
            <div className="flex items-center bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
              <User className="w-4 h-4 mr-2" />
              <span className="font-medium">{post.author}</span>
            </div>
            <div className="flex items-center bg-gray-100 px-3 py-1 rounded-full">
              <Calendar className="w-4 h-4 mr-2" />
              <span>{post.date}</span>
            </div>
            <div className="flex flex-wrap gap-2 ml-auto">
              {post.tags.map((tag, idx) => (
                <span key={idx} className="text-xs font-semibold text-gray-500 flex items-center">
                  <Tag className="w-3 h-3 mr-1" /> {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="prose prose-lg prose-blue max-w-none text-gray-700 leading-relaxed whitespace-pre-line">
            {post.content}
          </div>
        </div>
        
        <div className="p-6 bg-gray-50 border-t border-gray-100 text-center">
           <p className="text-gray-500 text-sm">Bu içeriği beğendiniz mi? Arkadaşlarınızla paylaşın.</p>
        </div>
      </div>
    </div>
  );
};