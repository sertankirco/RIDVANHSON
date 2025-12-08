import React from 'react';
import { BlogPost } from '../types';
import { Calendar, User, ArrowRight, Tag } from 'lucide-react';
import { getValidImageUrl } from '../utils/image';

interface BlogCardProps {
  post: BlogPost;
  onClick: (post: BlogPost) => void;
}

export const BlogCard: React.FC<BlogCardProps> = ({ post, onClick }) => {
  return (
    <div 
      className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full group cursor-pointer"
      onClick={() => onClick(post)}
    >
      <div className="relative h-48 overflow-hidden">
        <img 
          src={getValidImageUrl(post.imageUrl)} 
          alt={post.title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-4 left-4 flex gap-2 flex-wrap">
          {post.tags.slice(0, 2).map((tag, idx) => (
             <span key={idx} className="px-2 py-1 bg-white/90 backdrop-blur-sm text-blue-700 text-xs font-bold rounded-full shadow-sm flex items-center">
               <Tag className="w-3 h-3 mr-1" /> {tag}
             </span>
          ))}
        </div>
      </div>
      
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-center text-xs text-gray-500 mb-3 space-x-4">
          <div className="flex items-center">
            <User className="w-3 h-3 mr-1" />
            {post.author}
          </div>
          <div className="flex items-center">
            <Calendar className="w-3 h-3 mr-1" />
            {post.date}
          </div>
        </div>
        
        <h3 className="text-xl font-bold text-gray-900 mb-2 leading-tight group-hover:text-blue-600 transition-colors">
          {post.title}
        </h3>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-grow">
          {post.summary}
        </p>
        
        <div className="pt-4 mt-auto border-t border-gray-50 flex justify-between items-center text-blue-600 font-semibold text-sm group-hover:translate-x-1 transition-transform">
          <span>Devamını Oku</span>
          <ArrowRight className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
};