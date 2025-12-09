
import React, { useEffect } from 'react';
import { X, User } from 'lucide-react';

interface BioModalProps {
  content: string;
  name: string;
  isOpen: boolean;
  onClose: () => void;
}

export const BioModal: React.FC<BioModalProps> = ({ content, name, isOpen, onClose }) => {
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      ></div>
      
      <div className="relative bg-white rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden shadow-2xl flex flex-col animate-fadeIn">
        
        <div className="flex justify-between items-center p-5 bg-white border-b border-gray-100 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="bg-blue-50 p-2 rounded-full text-blue-600">
               <User className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-gray-900">Biyografi Detayı</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 sm:p-8 overflow-y-auto custom-scrollbar">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">{name}</h1>
          <div className="prose prose-lg prose-blue max-w-none text-gray-700 leading-relaxed whitespace-pre-line">
            {content}
          </div>
        </div>
        
        <div className="p-4 bg-gray-50 border-t border-gray-100 text-center text-sm text-gray-500">
          Mundoimex Global Lojistik ve Dış Ticaret A.Ş.
        </div>
      </div>
    </div>
  );
};
